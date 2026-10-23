
const BASEURL = 'https://api.telegram.org';

const BOT_TOKEN = process.env.TELEGRAM_BOT_API;

interface TelegramApiResponse {
    ok: boolean,
    description?: string,
    result?: unknown,
}

export async function sendTelegramMessage(chatId: string, text:string) {
    if (!BOT_TOKEN) throw new Error('TELEGRAM_BOT_API is not configured in environment');

    const response = await fetch(`${BASEURL}/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chatId: chatId,
            text,
            parse_mode: "HTML",
            disable_web_page_preview: true,
        }),
    });

    const data = (await response.json()) as TelegramApiResponse;

    if (!response.ok || !data.ok) {
        throw new Error(`Telegram API Error: ${response.status}: ${data.description}`);
    }
}

export async function resolveChatId(): Promise<string | any> {
    if (!BOT_TOKEN) throw new Error('TELEGRAM_BOT_API is not configured in environment');
    
    const response = await fetch(`${BASEURL}/bot${BOT_TOKEN}/getUpdates`);
    const data = (await response.json() as TelegramApiResponse);

    if (!data.ok) {
        throw new Error(`Telegram API error: ${data.description ?? "Failed to get updates"}`);
    }

    const updates = data.result as Array<{ message?: { chat?: { id: number; type?: string } } }>;

    const firstChat = updates.find(u => u.message?.chat?.type === 'private')?.message?.chat;
    return firstChat ? String(firstChat.id) : null
}

export function formatUptimeDownMessage(params: {
  websiteName: string;
  url: string;
  reason: string;
  responseTimeMs: number;
}): string {
  return [
    "<b>WEBSITE DOWN</b>",
    "",
    `<b>${params.websiteName}</b>`,
    `URL: ${params.url}`,
    `Reason: ${params.reason}`,
    `Response time: ${params.responseTimeMs}ms`,
    "",
    "OceanUptime monitoring detected that the service is not responding.",
  ].join("\n");
}

export function formatUptimeRecoveredMessage(params: {
  websiteName: string;
  url: string;
  downtimeSeconds: number;
}): string {
  const minutes = Math.round(params.downtimeSeconds / 60);
  const durationText =
    minutes > 0
      ? `±${minutes} minute${minutes === 1 ? "" : "s"}`
      : `${params.downtimeSeconds} second${params.downtimeSeconds === 1 ? "" : "s"}`;

  return [
    "<b>WEBSITE RECOVERED</b>",
    "",
    `<b>${params.websiteName}</b>`,
    `URL: ${params.url}`,
    `Downtime: ${durationText}`,
    "",
    "The service is back to normal.",
  ].join("\n");
}