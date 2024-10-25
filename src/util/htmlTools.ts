export function convertTextToLinks(text: string): string {
    // 正規表現でURLを検出
    const urlPattern = /(https?:\/\/[^\s]+)/g;

    // マッチしたURL部分を<a>タグ付きに変換
    return text.replace(urlPattern, (url: string) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
}

export function convertNewlinesToBreaks(text: string): string {
    return text.replace(/(\r\n|\n|\r)/g, '<br />');
}