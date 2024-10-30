// src/utils/markdownUtils.ts
export const sanitizeMarkdown = (markdown: string): string => {
    // Markdown文字列の事前処理（例：不正な文字を除去するなど）
    return markdown.trim(); // 不要な空白を除去するなど
};