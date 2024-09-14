import axios from "axios";
import {endPoint} from "../../consts/api";

export class TuneCardViewModel {
    /**
     * Seedを取得
     * @param cardSerial
     */
    async getUIdByCardSerial(cardSerial: string): Promise<{ uid: string, isActivated: boolean, message: string }> {
        console.log("===fetchSeedList=====");

        const api = axios.create({
            headers: {
                'Authorization': 'allow',
            }
        });
        const response = await api.post(endPoint.CARD_SERIAL_TO_UID, {serial: cardSerial});
        return {
            uid: response.data.uid,
            isActivated: response.data.isActivated,
            message: response.data.message
        };
    }
}