import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {QuestListViewModelIF} from "./QuestListViewModelIF";
import {Api} from "../../models/Api/Api";
import {endPoint} from "../../consts/api";
import ImagePath from "../../models/data/ImagePath";
import {QuestTileApiResponseItemIF, QuestListItem} from "../home/HomeViewModelIF";

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
     * Seedを取得
     * @param authentication
     */
    async fetchQuestList(authentication: Authentication): Promise<{ message: string, questList: QuestListItem[] }> {
        // console.log(authentication.accessToken)
        const api = new Api(authentication);
        const result = await api.get(endPoint.SEED);

        const apiResponse = result.data.data;

        this.questList = apiResponse.map((item: QuestTileApiResponseItemIF) => {

            // SPEC: 1枚目の画像をメイン画像にする
            const imagePathJson = JSON.parse(item.ImagePathList)
            const imagePath: ImagePath = ImagePath.create({alt: imagePathJson[0].alt, path: imagePathJson[0].path});

            const questListItem: QuestListItem = {
                questId: item.QuestId,
                title: item.Title,
                description: item.Description,
                ownerUserName: '', // TODO: バックエンドが未実装
                ownerUserUid: item.OwnerUserUid,
                hashTagStringList: ['#tag1','#tag2','#tag3'], // TODO: JSONを配列に変換
                imagePath: imagePath,
                updatedAt: item.UpdatedAt,
                userIconImagePath: ImagePath.create({alt: '', path: ''}), // TODO: バックエンドが未実装
                favoriteCount: 0// TODO: バックエンドが未実装
            }

            return questListItem
        })

        console.log(this.questList[0].title)

        return {
            message: result.data.message,
            questList: this.questList
        };
    }
}