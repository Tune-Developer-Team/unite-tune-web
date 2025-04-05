import Grid from "@mui/material/Grid";
import {useEffect, useState} from "react";
import {Box, CircularProgress, useMediaQuery} from "@mui/material";
import {endPoint} from "../../../../consts/api";
import {loaderState} from "../../../../atoms/LoaderState";
import Authentication from "../../../../models/Authentication/Authentication";
import ImagePath from "../../../../models/data/ImagePath";
import {authenticationState} from "../../../../atoms/AuthenticationState";
import {useRecoilState} from "recoil";
import {Api} from "../../../../models/Api/Api";
import SheetManager from "./SheetManager"; // MUIのGridコンポーネントをインポート

export interface StatusItem {
    uid: string;
    iconImage: ImagePath;
    title: string;
    link: string;
    description: string;
}

export interface ProfilesResponseData {
    NickName: string
    IconImage: string
    Uid: string
    Description: string
}

export interface SheetItem {
    date: string // 例： "2025/10/10"
    sheet: string
    gmail: string
    name: string
}

const OfficeManager: React.FC = () => {
    const [authState] = useRecoilState(authenticationState);
    const [feedItems, setFeedItems] = useState<StatusItem[]>([]);
    const [sheetFeedItems, setSheetFeedItems] = useState<SheetItem[]>([]);
    const [loading, setLoading] = useRecoilState(loaderState);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        // const fetchSheet = async () => {
            // try {
            //     setLoading({ isLoading: true });
            //
            //     // 環境変数のAPI URLを取得
            //     // const gasSheetAPI = process.env.REACT_APP_GAS_SHEET_MANAGER as string;
            //     const gasSheetAPI = "https://script.google.com/macros/s/AKfycbx8NTpUivd92cUbmqH2tyMl-KeY2RZkXX67ODk6pgU5/dev"
            //
            //     // 現在の日付を取得し、yyyy-mm-dd形式に変換
            //     const today = new Date();
            //     const formattedDate = today.toISOString().split('T')[0];  // "2025/10/10" 形式にする
            //
            //     let records: SheetItem[] = [];
            //     const api = new Api(Authentication.fromState(authState));
            //
            //     // API リクエストを送信
            //     const response = await api.get(`${gasSheetAPI}?date=2025/10/10`);
            //
            //     if (response.data) {
            //         // データが取得できた場合、状態を更新
            //         setFeedItems(response.data);
            //     } else {
            //         console.log("Error: No data found.");
            //         setFeedItems([]);
            //     }
            // } catch (error) {
            //     console.error("Error fetching cards:", error);
            //     setFeedItems([]);
            // } finally {
            //     setLoading(false);
            // }
        // };

        const fetchStatus = async () => {
            try {
                setLoading({ isLoading: true });
                let items: StatusItem[] = [];
                const api = new Api(Authentication.fromState(authState));
                const response = await api.get(endPoint.PROFILE);
                console.log(response.data)
                if (response.data) {
                    items = response.data.data.map((data: ProfilesResponseData) => {
                        const image = JSON.parse(data.IconImage);
                        return {
                            uid: data.Uid,
                            iconImage: ImagePath.create({ path: image.path, alt: image.alt }),
                            title: data.NickName,
                            link: `/user/${data.Uid}`,
                            description: data.Description,
                        };
                    });
                }
                setFeedItems(items);
            } catch (error) {
                console.error("Error fetching cards:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        // fetchSheet()
    }, [authState]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div id="sheet-manager" className="SheetManager">
            {isMobile ? "" : <SheetManager items={feedItems} gridNames={GridOfficeMap}/>}
        </div>
    );
};

export default OfficeManager;

export interface GridOfficeMapEntry {
    [key: string]: string;
}

// A1:116,A2:100,A3:84,A4:68
// B1:119,B2:103,B3:87,B4:71
// C3:89,C4:73
// D3:92,D4:76
// CR01:94,CR02:46
// F1:05, F2:22, F3:37, F4:20
export const GridOfficeMap:GridOfficeMapEntry[] = [
    { '01': '' }, { '02': '' }, { '03': '' }, { '04': '' }, { '05': '' },
    { '06': '' }, { '07': '' }, { '08': '' }, { '09': '' }, { '10': '' },
    { '11': '' }, { '12': '' }, { '13': '' }, { '14': '' }, { '15': '' },
    { '16': '' }, { '17': '' }, { '18': '' }, { '19': '' }, { '20': '' },
    { '21': '' }, { '22': '' }, { '23': '' }, { '24': '' }, { '25': '' },
    { '26': '' }, { '27': '' }, { '28': '' }, { '29': '' }, { '30': '' },
    { '31': '' }, { '32': '' }, { '33': '' }, { '34': '' }, { '35': '' },
    { '36': '' }, { '37': '' }, { '38': '' }, { '39': '' }, { '40': '' },
    { '41': '' }, { '42': '' }, { '43': '' }, { '44': '' }, { '45': '' },
    { '46': '' }, { '47': '' }, { '48': '' }, { '49': '' }, { '50': '' },
    { '51': '' }, { '52': '' }, { '53': '' }, { '54': '' }, { '55': '' },
    { '56': '' }, { '57': '' }, { '58': '' }, { '59': '' }, { '60': '' },
    { '61': '' }, { '62': '' }, { '63': '' }, { '64': '' }, { '65': '' },
    { '66': '' }, { '67': '' }, { '68': '' }, { '69': '' }, { '70': '' },
    { '71': 'fe301434-3adc-4c54-ba42-d7301264a1cf' }, { '72': '' }, { '73': 'b21f0f72-1de0-460d-8582-ea78c5121687' }, { '74': '' }, { '75': '' },
    { '76': '44f7ace4-3878-4643-bfe4-eea871016f1e' }, { '77': '' }, { '78': '' }, { '79': '' }, { '80': '' },
    { '81': '' }, { '82': '' }, { '83': '' }, { '84': '' }, { '85': '' },
    { '86': '' }, { '87': '' }, { '88': '' }, { '89': '' }, { '90': '' },
    { '91': '' }, { '92': '72ba350b-cbee-44d9-8de9-ffc8dc30ad57' }, { '93': '' }, { '94': '' }, { '95': '' },
    { '96': '' }, { '97': '' }, { '98': '' }, { '99': '' }, { '100': '' },
    { '101': '' }, { '102': '' }, { '103': '' }, { '104': '' }, { '105': '' },
    { '106': '' }, { '107': '' }, { '108': '' }, { '109': '' }, { '110': '' },
    { '111': '' }, { '112': '' }, { '113': '' }, { '114': '' }, { '115': '' },
    { '116': '5c5715b2-9b6d-4f6b-9ae9-d3c7e83aa58e' }, { '117': '' }, { '118': '' }, { '119': '' }, { '120': '' },
    { '121': '' }, { '122': '' }, { '123': '' }, { '124': '' }, { '125': '' },
    { '126': '' }, { '127': '' }, { '128': '' }, { '129': '' }, { '130': '' },
    { '131': '' }, { '132': '' }, { '133': '' }, { '134': '' }, { '135': '' },
    { '136': '' }, { '137': '' }, { '138': '' }, { '139': '' }, { '140': '' },
    { '141': '' }, { '142': '' }, { '143': '' }, { '144': '' }, { '145': '' },
    { '146': '' }, { '147': '' }, { '148': '' }, { '149': '' }, { '150': '' },
    { '151': '' }, { '152': '' }, { '153': '' }, { '154': '' }, { '155': '' },
    { '156': '' }, { '157': '' }, { '158': '' }, { '159': '' }, { '160': '' },
    { '161': '' }, { '162': '' }, { '163': '' }, { '164': '' }, { '165': '' },
    { '166': '' }, { '167': '' }, { '168': '' }, { '169': '' }, { '170': '' },
    { '171': '' }, { '172': '' }, { '173': '' }, { '174': '' }, { '175': '' },
    { '176': '' }, { '177': '' }, { '178': '' }, { '179': '' }, { '180': '' },
    { '181': '' }, { '182': '' }, { '183': '' }, { '184': '' }, { '185': '' },
    { '186': '' }, { '187': '' }, { '188': '' }, { '189': '' }, { '190': '' },
    { '191': '' }, { '192': '' }, { '193': '' }, { '194': '' }, { '195': '' },
    { '196': '' }, { '197': '' }, { '198': '' }, { '199': '' }, { '200': '' }
];