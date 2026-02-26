import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
    breaks: true,
    gfm: true
});

/**
 * Fix ChatGPT string formatting artifacts
 */
function cleanChatGPTMarkdown(text) {
  if (!text) return "";

  return text
    .replace(/\\n/g, "\n")        // convert literal \n → real newline
    .replace(/'\s*\+\s*'/g, "")  // remove "' + '" artifacts
    .replace(/^'/, "")           // remove starting quote
    .replace(/'$/, "");          // remove ending quote
}

export function renderMarkdown(markdownText) {
    //console.log('Original markdown text to render:\n', markdownText);
    const cleaned = cleanChatGPTMarkdown(markdownText);

    const rawHtml = marked.parse(cleaned);

    const safeHtml = DOMPurify.sanitize(rawHtml);
    //console.log('Rendered HTML after sanitization:\n', safeHtml);

    return safeHtml;
}
