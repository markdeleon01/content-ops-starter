import fs from 'node:fs';
import path from 'node:path';
import fm from 'front-matter';
import { globSync } from 'glob';
import { describe, expect, it } from 'vitest';

type FrontMatter = Record<string, unknown>;

function isNonEmptyString(v: unknown): v is string {
    return typeof v === 'string' && v.trim().length > 0;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
    return !!v && typeof v === 'object' && !Array.isArray(v);
}

function repoRoot(...parts: string[]) {
    return path.resolve(__dirname, '..', ...parts);
}

function readMarkdownFile(filePath: string) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = fm<FrontMatter>(raw);
    const attributes = parsed.attributes ?? {};
    const body = (parsed.body ?? '').trim();
    return { raw, attributes, body };
}

function normalizeSlug(slug: string) {
    if (slug === '/') return '/';
    // Ensure a leading slash and no trailing slash.
    const withLeading = slug.startsWith('/') ? slug : `/${slug}`;
    return withLeading.replace(/\/+$/, '');
}

describe('content/pages markdown files', () => {
    const contentPagesGlob = repoRoot('content/pages/**/*.md');
    const mdFiles = globSync(contentPagesGlob, { nodir: true }).sort();

    it('has at least one markdown page', () => {
        expect(mdFiles.length).toBeGreaterThan(0);
    });

    it('each markdown file parses and has required top-level fields', () => {
        for (const filePath of mdFiles) {
            const { attributes } = readMarkdownFile(filePath);

            expect(isPlainObject(attributes)).toBe(true);
            expect(isNonEmptyString(attributes.title)).toBe(true);
            expect(isNonEmptyString(attributes.slug)).toBe(true);
            expect(isNonEmptyString(attributes.type)).toBe(true);
        }
    });

    it('slugs are unique (after normalization) across content/pages/**/*.md', () => {
        const seen = new Map<string, string>();

        for (const filePath of mdFiles) {
            const { attributes } = readMarkdownFile(filePath);
            const slugRaw = attributes.slug;
            expect(isNonEmptyString(slugRaw)).toBe(true);

            const slug = normalizeSlug(String(slugRaw));
            const prev = seen.get(slug);
            if (prev) {
                throw new Error(`Duplicate slug '${slug}' in:\n- ${prev}\n- ${filePath}`);
            }
            seen.set(slug, filePath);
        }
    });

    it('PageLayout pages have sections[]; PostLayout pages have required post fields', () => {
        for (const filePath of mdFiles) {
            const { attributes, body } = readMarkdownFile(filePath);

            const type = String(attributes.type);
            const slug = normalizeSlug(String(attributes.slug));

            // Basic slug sanity
            expect(slug.startsWith('/')).toBe(true);
            expect(slug === '/' || !slug.endsWith('/')).toBe(true);

            if (type === 'PageLayout') {
                expect(Array.isArray(attributes.sections)).toBe(true);
                expect((attributes.sections as unknown[]).length).toBeGreaterThan(0);
            } else if (type === 'PostLayout') {
                expect(isNonEmptyString(attributes.date)).toBe(true);
                expect(isNonEmptyString(attributes.excerpt)).toBe(true);

                const featuredImage = attributes.featuredImage;
                expect(isPlainObject(featuredImage)).toBe(true);
                if (isPlainObject(featuredImage)) {
                    expect(isNonEmptyString(featuredImage.url)).toBe(true);
                }

                // Posts should have a markdown body.
                expect(body.length).toBeGreaterThan(0);
            } else {
                throw new Error(`Unexpected content type '${type}' in ${filePath}`);
            }
        }
    });
});

