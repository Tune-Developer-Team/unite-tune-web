import axios from "axios";
import {endPoint} from "../../consts/api";
import {TuneCard} from "../../models/TuneCard/TuneCard";

export class TuneCardViewModel {
    /**
     * 取得
     * @param cardSerial
     */
    async getTuneCard(cardSerial: string): Promise<TuneCard> {
        const api = axios.create({
            headers: {}
        });
        const response = await api.get(`${endPoint.TUNE_CARD}/${cardSerial}`);
        return TuneCard.creatTuneInstance({
            uid: response.data.data.Uid,
            isActivated: response.data.data.IsActivated,
            serial: response.data.data.Serial,
            qrLink: response.data.data.QRLink,
            updateAt: response.data.data.UpdateAt,
            createdAt: response.data.data.CreatedAt,
            deletedAt: response.data.data.DeletedAt
        });
    }
}