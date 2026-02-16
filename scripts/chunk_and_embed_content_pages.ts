import OpenAI from 'openai';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import dotenv from 'dotenv';


async function deleteExistingData() {
    return await sql`
    DELETE FROM website_chunks
    `;
}

function findMarkdownFiles(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = `${dir}/${file}`;
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findMarkdownFiles(filePath));
        } else if (file.endsWith('.md')) {
            results.push(filePath);
        }
    });
    return results;
}

function processMarkdownFile(filePath: string) {
    console.log(`Reading file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    const title = filePath.split('/').pop()?.replace('.md', '') || 'Untitled';
    const url = `/${filePath.replace('./content/pages/', '').replace('.md', '')}`;
    return { url, title, text: content };
}

function chunkContent(content: string, chunkSize = 500) {
    const chunks = [];
    for (let i = 0; i < content.length; i += chunkSize) {
        chunks.push(content.slice(i, i + chunkSize));
    }
    return chunks;
}

async function embedAndStore(data: { url: string; title: string; text: string; }[]) {

    let totalChunks = 0;
    for (const page of data) {
        // Log the current page being processed to monitor progress
        console.log(`++++++++++++++++++\nProcessing page: ${page.url}, Title: ${page.title}, Text Length: ${page.text.length}`);

        const parts = chunkContent(page.text);
        console.log(`Chunked into ${parts.length} parts for page: ${page.url}`);
        totalChunks += parts.length;

        let partIndex = 0;
        for (const part of parts) {
            console.log(`+++++++++\nPart ${partIndex}: \n${part}`);

            const emb = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: part,
                encoding_format: "float",
            });

            //console.log(`Embedding: ${JSON.stringify(emb)}`);

            await sql`
                INSERT INTO website_chunks
                (url, title, content, embedding)
                VALUES (
                    ${page.url},
                    ${page.title},
                    ${part},
                    ${JSON.stringify(emb.data[0].embedding)}
                )
                `;

            partIndex++;
        }
    }
    console.log(`Total chunks processed: ${totalChunks}`);
}


dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const sql = neon(process.env.NETLIFY_DATABASE_URL);


// First, delete existing data to avoid duplicates
deleteExistingData().then(() => {

    // Load and process markdown files from the content directory
    const markdownFiles = findMarkdownFiles('./content/pages');
    const data = markdownFiles.map(processMarkdownFile);

    console.log('Data loaded, processing...');
    console.log(`Total pages: ${data.length}`);

    // Log each page's URL, title, and text length to verify the data is correct
    let totalTextLength = 0;
    data.forEach(page => {
        console.log(`URL: ${page.url}, Title: ${page.title}, Text Length: ${page.text.length}`);
        totalTextLength += page.text.length;
    });
    console.log(`Total text length: ${totalTextLength}`);

    // Embed and store the data in Neon
    embedAndStore(data).then(() => {
        console.log('Embedding complete and stored in Neon');
    }).catch(err => {
        console.error('Error embedding and storing:', err);
    });

}).catch(err => {
    console.error('Error processing data:', err);
});
