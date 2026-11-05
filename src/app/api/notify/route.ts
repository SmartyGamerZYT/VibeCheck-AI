import { NextResponse } from 'next/server';
import { sendWorkflowNotification } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, heading, message, actionUrl, actionLabel } = body;

    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Missing required email fields (to, subject, message)' }, { status: 400 });
    }

    const res = await sendWorkflowNotification({
      to,
      subject,
      heading: heading || subject,
      message,
      actionUrl,
      actionLabel,
    });

    return NextResponse.json({ ...res });
  } catch (err: any) {
    console.error('API /notify error:', err);
    return NextResponse.json({ error: err.message || 'Notification error' }, { status: 500 });
  }
}
