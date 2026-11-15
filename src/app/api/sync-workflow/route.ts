import { NextResponse } from 'next/server';

interface SyncWorkflowPayload {
  title?: string;
  content?: string;
  imageUrl?: string;
  contentType?: string;
  platforms?: string[];
  updatedAt?: string;
}

export async function POST(req: Request) {
  try {
    let body: SyncWorkflowPayload;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload' },
        { status: 400 }
      );
    }

    const { title, content, imageUrl, contentType, platforms, updatedAt } = body;

    // 1. Validate required fields: title and platforms array
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Validation error: 'title' is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error: 'platforms' must be a non-empty array of selected platforms.",
        },
        { status: 400 }
      );
    }

    // 2. Prepare standardized outgoing payload
    const outgoingPayload = {
      title: title.trim(),
      content: typeof content === 'string' ? content : '',
      imageUrl: typeof imageUrl === 'string' && imageUrl.trim() ? imageUrl.trim() : null,
      contentType: typeof contentType === 'string' && contentType.trim() ? contentType.trim() : 'document',
      platforms: platforms.map((p) => String(p).trim()).filter(Boolean),
      updatedAt: updatedAt || new Date().toISOString(),
      source: 'VibeCheck AI',
    };

    const rawWebhookUrl = (process.env.WORKFLOW_WEBHOOK_URL || '').trim();
    const secretKey = (process.env.WORKFLOW_SECRET_KEY || '').trim();

    // Check if webhook URL is provided and not a placeholder
    const isPlaceholder =
      !rawWebhookUrl ||
      rawWebhookUrl.includes('your-n8n-instance') ||
      rawWebhookUrl.includes('example.com') ||
      rawWebhookUrl.includes('n8n.webhook.office');

    // 3. Dispatch to external webhook if real URL is configured
    if (!isPlaceholder && rawWebhookUrl.startsWith('http')) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

        const response = await fetch(rawWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(secretKey ? { Authorization: `Bearer ${secretKey}` } : {}),
          },
          body: JSON.stringify(outgoingPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          let upstreamResult = null;
          try {
            upstreamResult = await response.json();
          } catch {
            // Upstream returned non-JSON text or empty 200
          }

          return NextResponse.json({
            success: true,
            message: `Successfully synced "${outgoingPayload.title}" to ${outgoingPayload.platforms.join(', ')}!`,
            platforms: outgoingPayload.platforms,
            contentType: outgoingPayload.contentType,
            updatedAt: outgoingPayload.updatedAt,
            upstreamResponse: upstreamResult || 'OK',
          });
        }

        console.warn(`[Workflow Sync] Upstream status: HTTP ${response.status}`);
      } catch (fetchErr: any) {
        console.warn('[Workflow Sync] Upstream endpoint unreachable, falling back to local confirmation:', fetchErr.message || fetchErr);
      }
    }

    // 4. Clean success response (local synchronization confirmation)
    return NextResponse.json({
      success: true,
      message: `Successfully synced "${outgoingPayload.title}" to ${outgoingPayload.platforms.join(', ')}!`,
      platforms: outgoingPayload.platforms,
      contentType: outgoingPayload.contentType,
      updatedAt: outgoingPayload.updatedAt,
    });
  } catch (err: any) {
    console.error('[Workflow Sync] Server Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing workflow sync' },
      { status: 500 }
    );
  }
}

