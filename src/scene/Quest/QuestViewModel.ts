import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";

import axios from "axios";
import {endPoint} from "../../consts/api";
import {TabItem} from "../../ui/layout/CustomTabs";
import {QuestDetail, QuestDetailApiResponseIF} from "../../models/Quest/Quest";
import ImagePath from "../../models/data/ImagePath";
import {hashTagString} from "../../models/data/types";
import {AddSeedInputParamIF} from "../seedEdit/SeedEditViewModelIF";
import {AxiosResponse} from "axios/index";
import {Api} from "../../models/Api/Api";

export interface SaveQuestParamIF {
    questId: string;
    imagePathList: string;
    termsFrom: number;
    termsTo: number;
    hashTagStringList: string;
    isPublished: boolean;
    description: string;
    relationQuestIdList: string;
    title: string;
    mentionList: string;
    benefit: string;
    ownerUserUid: string
}

export interface QuestViewModelIF {
    /**
     * データのフェッチやモデルのインスタンス化などを行う
     */
    setUp(argument: { authentication: AuthenticationArgumentIF }): void

    /**
     * インスタンスの明示的な破棄や、状態の保存や確認を行う
     */
    cleanUp(): void
}

export class QuestViewModel implements QuestViewModelIF {
    public authState:Authentication = Authentication.initAuthentication();
    public questDetail: QuestDetail = QuestDetail.initQuestDetail();
    public coverImage: ImagePath = ImagePath.create({path: '', alt: ''});

    /**
     * セットアップ処理
     * @param argument
     */
     setUp(argument: { authentication: AuthenticationArgumentIF, uid: string }): QuestViewModel {
        this.authState.setAuthentication(argument.authentication);
        return this
    }

    /**
     * 取得
     */
    async fetchQuest(questId: string): Promise<void> {
        console.log("fetchUserQuest");
        this.questDetail = await this.questDetail.fetchModel(questId, this.authState);
        this.coverImage = this.questDetail.imagePathList[0];
    }

    getQuestDetail():QuestDetail {
        return this.questDetail
    }

    /**
     * 新規作成・更新する
     */
    async saveQuest(saveQuestParam: SaveQuestParamIF): Promise<AxiosResponse> {
        const api = new Api(this.authState);
        return await api.post({endPoint: `${endPoint.SEED}/${saveQuestParam.questId}`, body: saveQuestParam})
    }

    /**
     * クリーンアップ処理
     */
    cleanUp():void {
        console.log('cleanUp');
    }
}