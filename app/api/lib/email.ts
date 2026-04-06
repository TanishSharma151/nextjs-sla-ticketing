import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      text,
    });
  } catch (err) {
    console.error("Email error:", err);
  }
}