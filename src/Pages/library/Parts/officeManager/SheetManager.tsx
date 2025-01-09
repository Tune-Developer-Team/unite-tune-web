import { styled } from "@mui/system";
import Avatar from "@mui/material/Avatar";
import { Grid, Box, Typography, Button } from '@mui/material';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusItem } from "./OfficeManager";  // StatusItemのインポート

// スタイル付き Avatar コンポーネント
const AvatarIcon = styled(Avatar)({
    position: "relative",
    top: 39,
    right: 35,
    margin: 0,
    zIndex: 1,
    transition: "transform 0.2s ease-in-out",
    pointerEvents: "auto",
    "&:hover": {
        transform: "scale(1.5)",
    },
});

// 各グリッドの名前や描画するコンポーネントを管理する連想配列
interface GridItem {
    name: string;
    component: React.ReactNode | null; // 初期状態ではnull
}

interface StatusTileProps {
    items: StatusItem[]; // ユーザーリスト
}

const SheetManager: React.FC<StatusTileProps> = ({ items }) => {
    const navigate = useNavigate();

    // gridNamesをuidで定義
    const gridNames = [
        { 'Grid 1': '6923e6b6-bd0f-42cb-97b7-bc539669b080' }, { 'Grid 2': '' }, { 'Grid 3': '' }, { 'Grid 4': '' },
        { 'Grid 5': '' }, { 'Grid 6': '' }, { 'Grid 7': '' }, { 'Grid 8': 'de0b9e38-5eec-45cb-976e-98aacc8887f9' }, { 'Grid 9': '' },
        { 'Grid 10': '7e04187c-6835-4ab1-a58c-9f95fc34f269' }, { 'Grid 11': '' }, { 'Grid 12': '' }, { 'Grid 13': '' }, { 'Grid 14': '' },
        { 'Grid 15': '' },
    ];

    // 初期状態ではcomponentをnullにして描画しない
    const defaultComponent: React.ReactNode | null = null;

    // 各グリッドの状態を保持
    const [gridItems, setGridItems] = useState<GridItem[][]>(
        gridNames.map((row) =>
            Object.keys(row).map((key) => ({
                name: key,
                component: defaultComponent, // 各グリッドには初期状態としてnullが設定されている
            }))
        )
    );

    // "ShowUser" ボタンがクリックされた時にユーザーをグリッドに設定
    const showUserInGrid = () => {
        const newGridItems = [...gridItems];

        // items 配列を使って、ユーザー情報をグリッドに設定
        gridNames.forEach((row, rowIndex) => {
            Object.entries(row).forEach(([gridName, userUid], colIndex) => {
                if (userUid && !newGridItems[rowIndex][colIndex].component) {
                    // userUidが存在し、コンポーネントがまだ設定されていない場合
                    const userItem = items.find(item => item.uid === userUid); // uidで検索
                    if (userItem) {
                        const userComponent = (
                            <AvatarIcon
                                alt="userIcon"
                                src={userItem.iconImage.path}
                                onClick={() => navigate(userItem.uid)}
                            />
                        );
                        newGridItems[rowIndex][colIndex].component = userComponent; // セルに設定
                    }
                }
            });
        });

        setGridItems(newGridItems); // 状態更新
    };

    // renderComponent関数を定義し、gridItem.nameに基づいて描画するコンポーネントを決定
    const renderComponent = (gridItem: GridItem) => {
        if (gridItem.component === null) {
            return null; // 初期状態では何も表示しない
        }

        return gridItem.component; // userAccountから選ばれたコンポーネントをそのまま表示
    };

    return (
        <Box>
            {/* ShowUserボタンを追加 */}
            <Box sx={{ marginTop: 2 }}>
                <Button
                    variant="outlined"
                    sx={{ margin: 1 }}
                    onClick={showUserInGrid} // ボタンがクリックされたらshowUserInGridを実行
                >
                    ShowUser
                </Button>
            </Box>
            <Box sx={{ width: '100%', height: '50vh' }}>
                <Grid container spacing={2} sx={{ height: '100%' }}>
                    {gridItems.map((row, rowIndex) =>
                        row.map((gridItem, colIndex) => (
                            <Grid item xs={2.4} key={`${rowIndex}-${colIndex}`} sx={{ height: '100%' }}>
                                <Box
                                    sx={{
                                        border: '1px solid #ccc',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 2,
                                    }}
                                >
                                    <Typography variant="h6">{gridItem.name}</Typography>
                                    <Box>{renderComponent(gridItem)}</Box> {/* 初期状態で描画しない */}
                                </Box>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default SheetManager;
