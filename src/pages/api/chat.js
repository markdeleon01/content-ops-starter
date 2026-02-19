import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { semanticSearch } from '../../utils/semantic-search.js';

const FALLBACK_REPLY =
    'Thanks for your message. A team member will get back to you soon. In the meantime, you can explore our Solutions/Services page or contact us directly.';

const openai = createOpenAI({
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
        let startTime = new Date().getTime();

        const results = await semanticSearch(message);
        console.log('semanticSearch::elapsedTime->' + (new Date().getTime() - startTime) + 'ms');
        //console.log('++++++++++\nSemantic search results:', results.length, results);
        if (!results || results.length === 0) {
            console.log('No relevant context found for the question. Returning fallback reply.');
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.write(`data: ${JSON.stringify({ type: 'text', content: FALLBACK_REPLY })}\n\n`);
            res.write(`data: ${JSON.stringify({ type: 'end' })}\n\n`);
            res.end();
            return;
        }

        // Format the context from the chunks retrieved from the database in a way that can be included in the prompt to ChatGPT.
        const context = results
            .map((r) => `<document>\n<title>${r.title}</title>\n<source>${r.url}</source>\n<content>${r.content}</content>\n</document>`)
            .join('\n');

        // Ask ChatGPT:  create an augmented prompt with the retrieved context and the user question, and get a reply
        const systemPrompt = `Your name is ARA, and you are a helpful AI assistant for the SMYLSYNC company website. You can answer questions based on the provided context documents. Please follow these guidelines:
        - Answer the question using primarily the information from the provided context.
        - Provide the answer in a concise and clear manner that even a seven-year-old child can understand, suitable for a website chatbot.
        - Whenever you cite content pages with source URLs in your answer, prefix them with "https://www.smylsync.com" to ensure they are complete and clickable.
        - Do not offer any information that is not supported by the context. If you don't know the answer, say you don't know.  If answer is not found, say:  "I'm sorry, but I cannot find the answer based on current information on our website."
        - Do not offer to help with anything other than answering the user's question based on the context. For example, do not offer to help with unrelated tasks or provide information about unrelated topics.
        `;

        const ragPrompt = `Context:\n${context}\n\nUser question: ${message}\n\nAnswer:`;

        //console.log('++++++++++\nConstructed prompt for ChatGPT:\n\n', ragPrompt);

        startTime = new Date().getTime();

        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');

        const { textStream } = await streamText({
            model: openai('gpt-5-mini'),
            system: systemPrompt,
            prompt: ragPrompt
        });

        for await (const chunk of textStream) {
            res.write(`data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`);
            if (res.flush) res.flush();
        }

        console.log('ChatGPT streamText::elapsedTime->' + (new Date().getTime() - startTime) + 'ms');
        res.write(`data: ${JSON.stringify({ type: 'end' })}\n\n`);
        res.end();
    } catch (err) {
        console.error('Chat backend error:', err);
        res.write(`data: ${JSON.stringify({ type: 'error', content: 'Chat backend encountered an error. Please try again later.' })}\n\n`);
        res.end();
    }
}
