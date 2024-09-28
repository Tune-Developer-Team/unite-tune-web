import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {SeedListViewModelIF} from "./SeedListViewModelIF";
import {Api} from "../../models/Api/Api";
import {endPoint} from "../../consts/api";
import ImagePath from "../../models/data/ImagePath";
import {SeedListApiResponseItemIF, SeedListItem} from "../home/HomeViewModelIF";

export class SeedListViewModel implements SeedListViewModelIF {
    protected authState:Authentication = Authentication.initAuthentication();
    public seedList: SeedListItem[] = [];
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
    async fetchSeedList(authentication: Authentication): Promise<{ message: string, seedList: SeedListItem[] }> {
        // console.log(authentication.accessToken)
        const api = new Api(authentication);
        const result = await api.get(endPoint.SEED);

        const apiResponse = result.data.data;

        this.seedList = apiResponse.map((item: SeedListApiResponseItemIF) => {

            // SPEC: 1枚目の画像をメイン画像にする
            const imagePathJson = JSON.parse(item.ImagePathList)
            const imagePath: ImagePath = ImagePath.create({alt: imagePathJson[0].alt, path: imagePathJson[0].path});

            const seedListItem: SeedListItem = {
                seedId: item.SeedId,
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

            return seedListItem
        })

        console.log(this.seedList[0].title)

        return {
            message: result.data.message,
            seedList: this.seedList
        };
    }
}