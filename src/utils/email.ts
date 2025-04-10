import * as SibApiV3Sdk from '@getbrevo/brevo';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

if (!process.env.BREVO_API_KEY) {
  throw new Error('BREVO_API_KEY is not set in environment variables');
}

apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

interface EmailProps {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailProps) {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is not set in environment variables');
  }

  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = { name: 'TripMate AI', email: 'davidkarik5@gmail.com' };
    sendSmtpEmail.to = [{ email: to }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export function generateOTPEmailTemplate(otp: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your TripMate AI Verification Code</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">TripMate AI</h1>
            <p style="color: #6b7280; font-size: 16px;">Email Verification</p>
          </div>
          
          <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email</h2>
            <p style="color: #4b5563;">Hello,</p>
            <p style="color: #4b5563;">Your verification code for TripMate AI is:</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${otp}</span>
            </div>
            
            <p style="color: #4b5563;">This code will expire in 10 minutes for security purposes.</p>
            <p style="color: #4b5563;">If you didn't request this code, please ignore this email.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
