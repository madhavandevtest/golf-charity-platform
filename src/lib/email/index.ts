import { Resend } from "resend";

import { env } from "@/lib/env";

let resend: Resend | null = null;

function getResend() {
  if (!env.RESEND_API_KEY) {
    return null;
  }

  if (!resend) {
    resend = new Resend(env.RESEND_API_KEY);
  }

  return resend;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const client = getResend();

  if (!client || !env.EMAIL_FROM) {
    console.info("Email skipped", { to, subject });
    return;
  }

  await client.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export function renderEmailShell(title: string, body: string) {
  return `
    <div style="font-family: Arial, sans-serif; background: #f4efe7; padding: 24px;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 18px; padding: 32px;">
        <p style="letter-spacing: 0.16em; text-transform: uppercase; color: #0d5f52; font-size: 12px;">DriveChange</p>
        <h1 style="margin: 0 0 12px; font-size: 28px; color: #10221d;">${title}</h1>
        <div style="color: #3f4d49; line-height: 1.7;">${body}</div>
      </div>
    </div>
  `;
}
