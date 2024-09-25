import {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";

export interface SeedListViewModelIF {
    /**
     * データのフェッチやモデルのインスタンス化などを行う
     */
    setUp(argument: { authentication: AuthenticationArgumentIF }): void

    /**
     * インスタンスの明示的な破棄や、状態の保存や確認を行う
     */
    cleanUp(): void
}