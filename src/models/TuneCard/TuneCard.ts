export interface TuneCardInputIF {
    serial: string
    uid: string
    isActivated: boolean
    qrLink: string
    updateAt: string
    createdAt: string
    deletedAt: string
}

/**
 * Seedモデル
 */
export class TuneCard {
    /**
     * コンストラクタ
     * @param serial
     * @param uid
     * @param isActivated
     * @param qrLink
     * @param updateAt
     * @param createdAt
     * @param deletedAt
     */
    private constructor(
        readonly serial: string,
        readonly uid: string,
        readonly isActivated: boolean,
        readonly qrLink: string,
        readonly updateAt: string,
        readonly createdAt: string,
        readonly deletedAt: string
    ) {
    }

    /**
     * ファクトリメソッド
     */
    static creatTuneInstance(argument: TuneCardInputIF
    ): TuneCard {
        return new TuneCard(
            argument.serial,
            argument.uid,
            argument.isActivated,
            argument.qrLink,
            argument.updateAt,
            argument.createdAt,
            argument.deletedAt
        );
    }
}