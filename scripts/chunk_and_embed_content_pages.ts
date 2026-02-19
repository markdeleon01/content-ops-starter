import OpenAI from 'openai';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import dotenv from 'dotenv';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


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
    const markdownText = fs.readFileSync(filePath, 'utf8');
    const title = filePath.split('/').pop()?.replace('.md', '') || 'Untitled';
    const url = `/${filePath.replace('./scripts/content/', '').replace('.md', '')}`;
    return { url, title, markdownText };
}

async function chunkContent(markdownText: string, chunkSize = 1000) {
    // 1. Load the Markdown content
    const chunks = [];

    // 2. Initialize the splitter with Markdown-specific separators
    // This approach uses a predefined list of separators optimized for Markdown structure
    const splitter = new RecursiveCharacterTextSplitter(
        {
            chunkSize: 1000, // Maximum size of each chunk
            chunkOverlap: 200, // Number of characters to overlap between chunks to preserve context
            separators: [
                "\n## ", // H2 headers
                "\n###", // H3 headers
                "\n####", // H4 headers
                "\n#####", // H5 headers
                "\n\n", // Double newlines (paragraph breaks)
                "\n", // Single newlines
                " ", // Spaces
                "" // Characters 
            ],
            keepSeparator: true, // Keep the separator in the chunks to maintain context
        }
    );

    // 3. Split the text into Document objects
    // Use splitText to get an array of strings, or createDocuments to get an array of LangChain Document objects
    const splitText = await splitter.splitText(markdownText);

    // 4. Add the split text to the chunks array
    chunks.push(...splitText);

    // Output the resulting chunks
    //console.log(chunks);

    return chunks;
}

function processData(data: { url: string; title: string; markdownText: string; }[]) {
    console.log('++++++++++++++++++');
    console.log('Data loaded, processing...');

    // Log each page's URL, title, and markdownText length to verify the data is correct
    let totalTextLength = 0;
    data.forEach(page => {
        console.log(`URL: ${page.url}, Title: ${page.title}, Text Length: ${page.markdownText.length}`);
        totalTextLength += page.markdownText.length;
    });
    console.log(`Total text length: ${totalTextLength}`);

    // Embed and store the data in Neon
    embedAndStore(data).then(() => {
        console.log('Embedding complete and stored in Neon');
    }).catch(err => {
        console.error('Error embedding and storing:', err);
    });
}

async function embedAndStore(data: { url: string; title: string; markdownText: string; }[]) {

    let totalChunks = 0;
    for (const page of data) {
        // Log the current page being processed to monitor progress
        console.log(`++++++++++++++++++\nProcessing page: ${page.url}, Title: ${page.title}, Text Length: ${page.markdownText.length}`);

        const parts = await chunkContent(page.markdownText);
        console.log(`Chunked into ${parts.length} parts for page: ${page.url}`);
        totalChunks += parts.length;
 
        let partIndex = 1;
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
    const markdownFiles = findMarkdownFiles('./scripts/content');
    processData(markdownFiles.map(processMarkdownFile));

}).catch(err => {
    console.error('Error processing data:', err);
});
