import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {HomeViewModelIF, QuestTileApiResponseItemIF, QuestListItem} from "./HomeViewModelIF";
import {Api} from "../../models/Api/Api";
import {endPoint} from "../../consts/api";
import ImagePath from "../../models/data/ImagePath";

export class HomeViewModel implements HomeViewModelIF {
    protected authState: Authentication = Authentication.initAuthentication();
    public questList: QuestListItem[] = [];

    constructor() {
        console.log('====================SignInViewModel_called====================');
    }

    /**
     * セットアップ処理
     * @param argument
     */
    async setUp(argument: { authentication: AuthenticationArgumentIF }): Promise<void> {
        console.log('====================TimeLineViewModel_setup====================');
        this.authState.setAuthentication(argument.authentication);
        await this.fetchQuestList(this.authState)
    }

    /**
     * クリーンアップ処理
     */
    cleanUp(): void {
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
                questId: item.SeedId,
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


    /**
     * ホットシードを取得
     * TODO: API未実装
     */
    async fetchHotQuestList(): Promise<{ message: string, questList: QuestListItem[] }> {
        const api = new Api(this.authState);
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
                questId: item.SeedId,
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


    /**
     * ピックアップを取得
     * TODO: API未実装
     */
    async fetchPickUp(): Promise<{ message: string, seed: QuestListItem }> {
        const api = new Api(this.authState);
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
                questId: item.SeedId,
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
            seed: this.questList[0]
        };
    }
}