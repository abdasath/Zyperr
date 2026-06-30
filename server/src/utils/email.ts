import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email: string, name: string, otp: string): Promise<void> {
  await resend.emails.send({
    from: "ZYPERR+ <onboarding@resend.dev>",
    to: email,
    subject: "Your ZYPERR+ Verification Code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background:#060606;font-family:'Inter',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#060606;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#1a0000,#3a0000);padding:32px 40px;text-align:center;">
                      <h1 style="margin:0;color:#e50914;font-size:28px;font-weight:900;letter-spacing:-0.03em;">ZYPERR+</h1>
                      <p style="margin:8px 0 0;color:rgba(255,255,255,0.5);font-size:13px;">Verify your email address</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <p style="margin:0 0 8px;color:rgba(255,255,255,0.6);font-size:14px;">Hey ${name},</p>
                      <p style="margin:0 0 32px;color:#ffffff;font-size:16px;line-height:1.6;">
                        Welcome to ZYPERR+! Use the verification code below to complete your sign-up.
                      </p>

                      <!-- OTP Box -->
                      <div style="background:#1a1a1a;border:1px solid rgba(229,9,20,0.3);border-radius:12px;padding:28px;text-align:center;margin-bottom:32px;">
                        <p style="margin:0 0 8px;color:rgba(255,255,255,0.4);font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">Your verification code</p>
                        <p style="margin:0;color:#e50914;font-size:42px;font-weight:900;letter-spacing:0.15em;">${otp}</p>
                        <p style="margin:12px 0 0;color:rgba(255,255,255,0.3);font-size:12px;">Expires in <strong style="color:rgba(255,255,255,0.5);">10 minutes</strong></p>
                      </div>

                      <p style="margin:0;color:rgba(255,255,255,0.4);font-size:13px;line-height:1.6;">
                        If you didn't create an account on ZYPERR+, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
                      <p style="margin:0;color:rgba(255,255,255,0.2);font-size:12px;">© 2026 ZYPERR+. All rights reserved.</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
