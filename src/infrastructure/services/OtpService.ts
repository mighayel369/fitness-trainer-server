
import { IOtpService } from "domain/services/IOtpService"
import { OtpModel } from "infrastructure/database/models/OtpModel"
import { OtpEntity } from "domain/entities/OtpEntity";
import nodemailer from "nodemailer"
import { injectable } from 'inversify';
import config from "config";
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
@injectable()
export class OtpService implements IOtpService {
  async sendOtp(email: string,role:string): Promise<boolean> {
    try {
      const otp = generateOtp();
      console.log(config)

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.MAIL_USER,
          pass: config.MAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: config.MAIL_USER,
        to: email,
        subject: "Fitconnect Otp",
        text: `Your OTP is ${otp}`,
      };

      await transporter.sendMail(mailOptions);

      await OtpModel.create({ email, otp,role });
      return true;
    } catch (err) {
      console.error("OTP Send Error:", err);
      return false;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<OtpEntity|null> {
    try {
      const record = await OtpModel.findOne({ email, otp });
      if (!record) return null;
      console.log(record)
      await OtpModel.deleteOne({ _id: record._id })
      return this.toOtpEntity(record)
    } catch (error) {
      console.log(error)
      return null
    }
  }

async sendResetEmail(to: string, link: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Support Team" <${config.MAIL_USER}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <p><a href="${link}" target="_blank" style="color: #1a73e8;">Reset Your Password</a></p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}


async sendEmail(to: string, message: string, messageType: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASSWORD,
    },
  });

  const subject =
    messageType === 'success'
      ? 'Trainer Verification Approved'
      : 'Trainer Verification Declined';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>${subject}</h2>
      <p>${message}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: config.MAIL_USER,
      to,
      subject,
      html: htmlContent,
    });

    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error('Email sending failed');
  }
}
private toOtpEntity(document: any): OtpEntity {
    return new OtpEntity(
      document.email,
      document.otp,
      document.role
    );
  }
}
