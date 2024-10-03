import {endPoint} from "../../consts/api";
import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import axios from "axios";
import {TuneCard} from "../../models/TuneCard/TuneCard";

export interface RegisterResponseIF {
    userRegister: {
        uid: string
        email: string
        accessToken: string
        nickName: string
        iconImagePath: string
    }
}
export interface SignUpInputIF {
    code: string,
    tuneCard: TuneCard,
}

export class RegisterViewModel {
    protected authState: Authentication = Authentication.initAuthentication();

    setUp(argument: { authentication: AuthenticationArgumentIF }): void {
        console.log('====================TimeLineViewModel_setup====================');
        this.authState.setAuthentication(argument.authentication);
        console.log('====================TimeLineViewModel_setup_end====================');
    }

    async signUp(argument: SignUpInputIF): Promise<RegisterResponseIF> {
        const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;

        const params = {
            code: argument.code,
            clientId: clientId,
        };

        const axiosInstance = axios.create({
            headers: {
                'Authorization': 'sign-in-unite-web-app',
            }
        });

        try {
            const registerResponse = await axiosInstance.post(endPoint.REGISTER, params);

            // registerSerialAndUidの呼び出しと結果に基づく処理
            await this.registerSerialAndUid({
                uid: registerResponse.data.data.uid,
                serial: argument.tuneCard.serial,
                accessToken: registerResponse.data.data.access_token,
            });

            // 成功時にRegisterResponseIFを返す
            return {
                userRegister: {
                    uid: registerResponse.data.data.uid,
                    email: registerResponse.data.data.email,
                    accessToken: registerResponse.data.data.access_token,
                    nickName: registerResponse.data.data.email,
                    iconImagePath: "profile/default/iconImage.png",
                }
            };

        } catch (error) {
            // 失敗時のエラーハンドリングとRegisterResponseIFのデフォルト値を返す
            console.log(error);

            return {
                userRegister: {
                    uid: "",
                    email: "",
                    accessToken: "",
                    nickName: "",
                    iconImagePath: "",
                }
            };
        }
    }

    private async registerSerialAndUid(input: { serial: string, uid: string, accessToken: string }): Promise<void> {

        // if (input.uid !== "") {
        //     throw new Error("uid is null");
        // }

        console.log("access_token");
        console.log(input.accessToken);
        const cardTuneAPI = axios.create({
            headers: {
                'Authorization': input.accessToken,
            }
        });

        const params = {
            uid: input.uid,
            isActivated: true,
        };

        const cardTuneRegisterEndPoint = `${endPoint.TUNE_CARD}/${input.serial}`;

        try {
            const cardTuneResponse = await cardTuneAPI.put(cardTuneRegisterEndPoint, params);
            console.log(cardTuneResponse);
        } catch (err) {
            console.log(err);
        }
    }
}
