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

import OpenAI from 'openai';
import { semanticSearch } from "../../utils/semantic-search.js";

const FALLBACK_REPLY =
    "Thanks for your message. A team member will get back to you soon. In the meantime, you can explore our Solutions/Services page or contact us directly.";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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

    console.log('Received message:', message);
    try {
        const results = await semanticSearch(message);
        console.log('++++++++++\nSemantic search results:', results.length, results);

        const context = results.map((r) => `<document>\n<title>${r.title}</title>\n<source>${r.url}</source>\n<content>${r.content}</content>\n</document>`).join('\n');
        
        // Ask ChatGPT:  create an augmented prompt with the retrieved context and the user question, and get a reply
        const ragPrompt = `You are a helpful AI assistant for the SMYLSYNC company website. You can answer questions based on the provided context documents. Please follow these guidelines:
        1. Answer the question using primarily the information from the provided context documents.
        2. If the context does not contain enough information to fully answer the question, clearly state what information is missing and answer as best as you can with the available context.
        3. Be specific and cite which documents you are referencing when possible; you can use the <source> field as a relative path to the company website to reference the document URL.  Create links in markdown format like this: [link text](url) when referencing the source documents.
        4. If the context is contradictory or unclear, acknowledge the ambiguity in your answer.
        5. Keep your answer concise but comprehensive, and avoid making up information that is not supported by the context.
        6. Use plain markdown formatting for better readability, including bullet points, bolding, and italics where appropriate.  Do not escape the markdown formatting in your answer; it should be rendered properly when displayed on the website.
        7. Always separate sentences with two line breaks for better readability when rendered on the website.
        \n\nContext:\n${context}\n\nQuestion: ${message}\n\nAnswer:`;

        console.log('++++++++++\nConstructed prompt for ChatGPT:\n\n', ragPrompt);

        const completion = await openai.chat.completions.create({
            model: 'gpt-5-mini',
            messages: [
            {
                role: "system",
                content: ragPrompt
            },
            {
                role: "system",
                content: context
            },
            {
                role: "user",
                content: message
            }
            ]
        });

        console.log('ChatGPT response:', completion.choices[0].message);
        const reply = completion.choices[0].message.content.trim();
        if (reply) {
            return res.status(200).json({ reply });
        } else {
            return res.status(200).json({ reply: FALLBACK_REPLY });
        }

    } catch (err) {
        console.error('Semantic search error:', err);
        return res.status(502).json({
            error: 'Chat backend encountered an error. Please try again later.'
        });
    }
    /*
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
    */
}
