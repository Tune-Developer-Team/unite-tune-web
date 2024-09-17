import {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {SeedDetail} from "../../models/Seed/SeedDetail/seedDetail";

export interface SeedDetailViewModelIF {
    /**
     * データのフェッチやモデルのインスタンス化などを行う
     */
    setUp(argument: { authentication: AuthenticationArgumentIF }, seedId: string): Promise<void>

    /**
     * インスタンスの明示的な破棄や、状態の保存や確認を行う
     */
    cleanUp(): void

    /**
     * シード詳細のエンティティを取得する
     */
    fetchSeedDetail(seedId: string): Promise<void>
}