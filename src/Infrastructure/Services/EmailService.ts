import nodemailer, { Transporter } from 'nodemailer';

export interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export class EmailService {
    private transporter: Transporter;

    constructor(
        smtpConfig: {
            host: string;
            port: number;
            secure: boolean;
            auth: { user: string; pass: string };
        },
        private readonly defaultFrom: string = 'PickMi <no-reply@pickmi.com>',
    ) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: smtpConfig.auth.user,
                pass: smtpConfig.auth.pass,
            },
            // Gmail-specific settings for better compatibility
            tls: {
                rejectUnauthorized: false,
            },
        });

        this.verifyConnection();
    }

    private async verifyConnection(): Promise<void> {
        try {
            await this.transporter.verify();
            console.log('Gmail SMTP connection verified successfully');
        } catch (error) {
            console.error('Gmail SMTP connection failed:', error);
            console.error(
                'Please check your Gmail credentials and app password',
            );
        }
    }

    async sendMail(options: SendMailOptions): Promise<void> {
        try {
            const info = await this.transporter.sendMail({
                from: options.from ?? this.defaultFrom,
                to: options.to,
                subject: options.subject,
                html: options.html,
            });

            console.log(`Email sent successfully to ${options.to}`);
            console.log(`Message ID: ${info.messageId}`);
        } catch (error) {
            console.error(`Failed to send email to ${options.to}:`, error);
            throw error;
        }
    }
}
