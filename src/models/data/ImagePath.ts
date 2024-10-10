export interface ImagePathIF {
    readonly alt: string
    readonly path: string
}

export default class ImagePath {
    private constructor(
        public alt: string,
        public path: string
    ) {
    }

    public static create(argument: ImagePathIF): ImagePath {
        return new ImagePath(argument.alt, argument.path);
    }

    public getGCSObjectName(): string {
        const path = this.path;
        const regex = /[^/]+$/;

        const matchResult = path.match(regex);
        if (matchResult) {
            return matchResult[0]; // マッチした結果を返す
        } else {
            throw new Error("The path format is invalid, no file name found."); // マッチしなかった場合のエラーハンドリング
        }
    }
}