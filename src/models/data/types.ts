
/**
 * SPEC:ハッシュタグは"#hoge"の形式のstringである
 */
export type hashTagString = `#${string}`;

/**
 * ハッシュタグの型かどうかチェックする
 * @param input
 */
export function isHashTag(input: any): boolean {
    const hashTagRegex = /^#[\w]+$/;
    return hashTagRegex.test(input);
}

/**
 * 例：2024-07-18-15:34
 */
export type dateTimeString = `${number}${number}${number}${number}-${number}${number}-${number}${number}-${number}${number}:${number}${number}`;
