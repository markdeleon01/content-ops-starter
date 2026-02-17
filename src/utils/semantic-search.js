// generates embedding for given question, queries neon database for similar content pages, and returns the results
import OpenAI from 'openai';
import { neon } from "@neondatabase/serverless";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function semanticSearch(query) {
    try {
        // Generate embedding for the query
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: query
        });

        // The result is accessed differently in v4 as it's a Pydantic object, not just a raw dictionary
        const queryEmbedding = response.data[0].embedding;
        //console.log('Generated query embedding:', queryEmbedding);

        // Query the database for similar content pages
        const sql = neon(process.env.NETLIFY_DATABASE_URL);

        // Alternative approach using vector similarity search if supported by the database:
        const results = await sql`
            SELECT content, url
            FROM website_chunks
            ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}
            LIMIT 5
        `;

       return results;
    } catch (error) {
        console.error("Error in semantic search:", error);
        throw error;
    }
}
