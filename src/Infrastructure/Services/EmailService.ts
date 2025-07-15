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
        this.transporter = nodemailer.createTransport(smtpConfig);
    }

    async sendMail(options: SendMailOptions): Promise<void> {
        await this.transporter.sendMail({
            from: options.from ?? this.defaultFrom,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
    }
}
