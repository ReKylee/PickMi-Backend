import { ResultAsync } from 'neverthrow';
import { IUserRepository } from '../../Domain/Users/IUserRepository.js';
import { Email } from '../../Domain/ValueObjects/Email.js';
import { EmailService } from '../../Infrastructure/Services/EmailService.js';
import { randomBytes } from 'crypto';
import {
    DomainError,
    UnexpectedError,
    ValidationError,
} from '../../Shared/Errors.js';
import { User } from '../../Domain/Users/User.js';

export class ForgottenPasswordHandler {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly emailService: EmailService,
        private readonly appBaseUrl: string,
    ) {}
    public handle(email: string): ResultAsync<void, DomainError> {
        return Email.create(email)
            .mapErr((e) => new ValidationError(e))
            .asyncAndThen((emailVO) =>
                this.userRepository
                    .findByEmail(emailVO)
                    .andThen((user) => this.issueResetToken(user)),
            );
    }
    private issueResetToken(user: User): ResultAsync<void, DomainError> {
        const resetToken = this.generateToken();
        const expiresAt = this.expiryOneHourFromNow();
        const resetUrl = this.buildResetUrl(resetToken);
        const html = this.buildResetEmail(resetUrl);

        return this.userRepository
            .setPasswordResetToken(user.id, resetToken, expiresAt)
            .andThen(() =>
                ResultAsync.fromPromise(
                    this.emailService.sendMail({
                        to: user.email.value,
                        subject: 'Reset your PickMi password',
                        html,
                    }),
                    (err) => new UnexpectedError(err),
                ),
            );
    }

    private generateToken(): string {
        return randomBytes(48).toString('hex');
    }

    private expiryOneHourFromNow(): Date {
        return new Date(Date.now() + 1000 * 60 * 60);
    }

    private buildResetUrl(token: string): string {
        return `${this.appBaseUrl}/reset-password?token=${encodeURIComponent(token)}`;
    }

    private buildResetEmail(resetUrl: string): string {
        return `
        <h2>Password Reset Requested</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. If you did not request this, you can ignore this email.</p>
        <p>To reset your password, click the link below. This link is valid for 1 hour.</p>
        <p><a href="${resetUrl}" style="background: #0e76a8; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none;">Reset Password</a></p>
        <p>If the button above does not work, paste this URL into your browser:</p>
        <p><code>${resetUrl}</code></p>
        <p>Thank you,<br/>The PickMi Team</p>
    `;
    }
}
