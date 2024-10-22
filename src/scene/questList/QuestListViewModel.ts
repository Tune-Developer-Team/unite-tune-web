import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {Api} from "../../models/Api/Api";
import {endPoint} from "../../consts/api";
import ImagePath from "../../models/data/ImagePath";
import {QuestTileApiResponseItemIF, QuestListItem} from "../home/HomeViewModelIF";

interface QuestListViewModelIF {
    /**
     * データのフェッチやモデルのインスタンス化などを行う
     */
    setUp(argument: { authentication: AuthenticationArgumentIF }): void

    /**
     * インスタンスの明示的な破棄や、状態の保存や確認を行う
     */
    cleanUp(): void
}

export class QuestListViewModel implements QuestListViewModelIF {
    protected authState:Authentication = Authentication.initAuthentication();
    public questList: QuestListItem[] = [];
    constructor(
    ) {
        console.log('====================SignInViewModel_called====================');
    }

    /**
     * セットアップ処理
     * @param argument
     */
    setUp(argument: { authentication: AuthenticationArgumentIF }): void {
        console.log('====================TimeLineViewModel_setup====================');
        this.authState.setAuthentication(argument.authentication);
    }

    /**
     * クリーンアップ処理
     */
    cleanUp():void {
        console.log('cleanUp');
    }

    /**
     * Questを取得
     * @param authentication
     */
    async fetchQuestList(authentication: Authentication): Promise<{ message: string, questList: QuestListItem[] }> {
        const api = new Api(authentication);
        const result = await api.get(endPoint.SEED_TILE);

        const apiResponse = result.data.data;

        this.questList = apiResponse.map((item: QuestTileApiResponseItemIF) => {

            // SPEC: 1枚目の画像をメイン画像にする
            const imagePathJson = JSON.parse(item.ImagePathList)
            const imagePath: ImagePath = imagePathJson.length > 0 ? ImagePath.create({
                alt: imagePathJson[0].alt,
                path: imagePathJson[0].path
            }) : ImagePath.create({alt: "タイトル", path: ""});

            // オーナーユーザーのアイコン
            let ownerUserIconImagePath = ImagePath.create({path: "", alt: ""});
            if (item.IconImage !== "") {
                const ownerUserIconJson = JSON.parse(item.IconImage)
                ownerUserIconImagePath.alt = ownerUserIconJson.alt;
                ownerUserIconImagePath.path = ownerUserIconJson.path;
            }

            const questListItem: QuestListItem = {
                questId: item.QuestId,
                title: item.Title,
                description: item.Description,
                ownerUserName: item.NickName,
                ownerUserUid: item.OwnerUserUid,
                hashTagStringList: ['#tag1', '#tag2', '#tag3'], // TODO: JSONを配列に変換
                imagePath: imagePath,
                updatedAt: item.UpdatedAt,
                userIconImagePath: ownerUserIconImagePath,
                favoriteCount: 0// TODO: バックエンドが未実装
            }

            return questListItem
        })

        return {
            message: result.data.message,
            questList: this.questList
        };
    }
}