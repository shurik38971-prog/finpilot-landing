export function getGptunnelConfig():
  | { ok: true; apiKey: string; baseUrl: string; model: string }
  | { ok: false; error: string } {
  const apiKey = process.env.GPTUNNEL_API_KEY;
  const baseUrl = process.env.GPTUNNEL_BASE_URL;
  const model = process.env.GPTUNNEL_MODEL;

  if (!apiKey) {
    return { ok: false, error: "GPTUNNEL_API_KEY не настроен" };
  }
  if (!baseUrl) {
    return { ok: false, error: "GPTUNNEL_BASE_URL не настроен" };
  }
  if (!model) {
    return { ok: false, error: "GPTUNNEL_MODEL не настроен" };
  }

  return {
    ok: true,
    apiKey,
    baseUrl: baseUrl.replace(/\/$/, ""),
    model,
  };
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function gptunnelChat(
  messages: ChatMessage[],
  temperature = 0.3
): Promise<
  | { ok: true; content: string; model: string }
  | { ok: false; error: string; status?: number; details?: string }
> {
  const config = getGptunnelConfig();
  if (!config.ok) {
    return { ok: false, error: config.error };
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    return {
      ok: false,
      error: "Ошибка GPTunnel API",
      status: response.status,
      details,
    };
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    return { ok: false, error: "Пустой ответ от ИИ" };
  }

  return { ok: true, content, model: config.model };
}
