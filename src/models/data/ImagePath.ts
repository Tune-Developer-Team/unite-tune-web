export interface ImagePathIF {
    readonly alt: string
    readonly path: string
}

export default class ImagePath {
    private constructor(
        public readonly alt: string,
        public readonly path: string
    ) {
    }

    public static create(argument: ImagePathIF): ImagePath {
        return new ImagePath(argument.alt, argument.path);
    }
}