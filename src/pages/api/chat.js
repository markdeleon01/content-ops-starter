/**
 * Chat API: proxies to a configurable backend (e.g. LLM, NLU) for Ara chatbot replies.
 *
 * POST body: { message: string, history?: Array<{ role: 'user'|'assistant', content: string }> }
 * Response:  { reply: string } or { error: string }
 *
 * Set CHATBOT_BACKEND_URL to your backend endpoint. Backend should accept the same JSON body
 * and return JSON with a "reply" (string) field.
 * If CHATBOT_BACKEND_URL is not set, returns a fallback reply so the UI still works.
 */

const FALLBACK_REPLY =
    "Thanks for your message. A team member will get back to you soon. In the meantime, you can explore our Solutions/Services page or contact us directly.";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    let body;
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
    }

    const { message, history = [] } = body;
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid "message" (string)' });
    }

    const backendUrl = process.env.CHATBOT_BACKEND_URL;
    if (backendUrl) {
        try {
            const backendRes = await fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message.trim(), history })
            });

            const data = await backendRes.json().catch(() => ({}));
            const reply = data.reply ?? data.message ?? data.text;

            if (!backendRes.ok) {
                const errMsg = data.error ?? data.message ?? `Backend returned ${backendRes.status}`;
                return res.status(backendRes.status >= 400 ? backendRes.status : 502).json({ error: String(errMsg) });
            }

            if (reply != null && typeof reply !== 'string') {
                return res.status(502).json({ error: 'Backend must return "reply" (string)' });
            }

            return res.status(200).json({ reply: typeof reply === 'string' ? reply : FALLBACK_REPLY });
        } catch (err) {
            console.error('[chat] Backend request failed:', err);
            return res.status(502).json({
                error: 'Chat backend is temporarily unavailable. Please try again later.'
            });
        }
    }

    return res.status(200).json({ reply: FALLBACK_REPLY });
}
