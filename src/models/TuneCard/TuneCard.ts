export interface TuneCardInputIF {
    serial: string,
    uid: string
}

/**
 * Seedモデル
 */
export class TuneCard {
    /**
     * コンストラクタ
     * @param serial
     * @param uid
     */
    private constructor(
        readonly serial: string,
        readonly uid: string
    ) {
    }

    /**
     * ファクトリメソッド
     */
    static creatTuneInstance(argument: TuneCardInputIF
    ): TuneCard {
        return new TuneCard(argument.serial, argument.uid);
    }
}