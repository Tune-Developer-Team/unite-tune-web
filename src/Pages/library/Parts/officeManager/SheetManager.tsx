import { styled } from "@mui/system";
import Avatar from "@mui/material/Avatar";
import { Grid, Box, Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GridOfficeMapEntry, StatusItem } from "./OfficeManager";  // StatusItemのインポート
import OfficeMap from "./OfficeLayoutPC.svg";

const IconFrame = styled(Box)({
    width: 50, // Fixed width for square tiles
    height: 50, // Fixed height for square tiles
    flexShrink: 0,
    color: "#232323",
    top: 0,
    position: "relative",  // 子要素の絶対位置を指定可能に
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
        transform: "scale(1.05)",
    },
    padding: 0,
    zIndex: 0,
});

// スタイル付き Avatar コンポーネント
const AvatarIcon = styled(Avatar)({
    top: 6,
    left: -3,
    margin: 0,
    zIndex: 1,
    transition: "transform 0.2s ease-in-out",
    pointerEvents: "auto",
    transform: "scale(1.5)",
    "&:hover": {
        transform: "scale(1.8)",
    },
});

// 各グリッドの名前や描画するコンポーネントを管理する連想配列
interface GridItem {
    name: string;
    component: React.ReactNode | null; // 初期状態ではnull
}

interface StatusTileProps {
    items: StatusItem[]; // ユーザーリスト
    gridNames: GridOfficeMapEntry[];
}

const SheetManager: React.FC<StatusTileProps> = ({ items, gridNames }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [gridItems, setGridItems] = useState<GridItem[][]>(
        gridNames.map((row) =>
            Object.keys(row).map((key) => ({
                name: key,
                component: null, // 初期状態としてnull
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
                        // セルに設定
                        newGridItems[rowIndex][colIndex].component = (
                            <IconFrame>
                                <AvatarIcon
                                    alt="userIcon"
                                    src={userItem.iconImage.path}
                                    onClick={() => navigate(userItem.uid)}
                                />
                            </IconFrame>
                        );
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

    useEffect(() => {
        // 初回レンダリング時のみshowUserInGridを実行する
        if (items.length > 0) {
            showUserInGrid();
            setIsLoading(false); // ユーザー情報を反映後に読み込み完了
        }
    }, [items, gridNames]); // itemsとgridNamesが変わった時にも再実行されるように

    return (
        <Box>
            {/* ShowUserボタンを追加 */}
            <Box sx={{ marginTop: 2 }}>
                <Button
                    variant="outlined"
                    sx={{ margin: 1 }}
                    onClick={showUserInGrid} // ボタンがクリックされたらshowUserInGridを実行
                >
                    fetchData
                </Button>
            </Box>

            {isLoading && <CircularProgress />}

            {/* OfficeMap SVG画像をバックグラウンドに設定し、上にコンテンツを重ねる */}
            <Box
                display={isLoading ? "none" : "block"}
                id="office-map"
                sx={{
                    position: 'relative', // コンポーネントを重ねるためにpositionをrelativeに設定
                    height: '600px', // 高さを固定
                    width: '1000px', // 幅を固定
                    overflow: 'hidden', // 画像の外側にコンテンツがはみ出さないように設定
                    margin: '0 auto', // 中央に配置
                }}
            >
                <img
                    src={OfficeMap}
                    alt="office-map"
                    style={{
                        width: '100%',
                        height: '100%', // 画像の高さを親要素に合わせる
                        objectFit: 'cover', // 画像をカバーするように表示
                        position: 'absolute', // 背景画像として表示
                        top: 0,
                        left: 0,
                        zIndex: -1, // 他のコンポーネントが画像の上に表示されるように設定
                    }}
                />
                {/* グリッドコンテナの高さを自動に変更し、アイテムを均等に配置 */}
                <Grid container spacing={0} sx={{
                    position: 'absolute', // グリッドを画像の上に重ねる
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1, // 画像の上に配置
                }}>
                    {gridItems.map((row, rowIndex) =>
                        row.map((gridItem, colIndex) => (
                            <Grid
                                item
                                key={`${rowIndex}-${colIndex}`}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '60px', // 固定幅に設定（調整可能）
                                    height: '60px', // 固定高さに設定（調整可能）
                                    padding: 0, // パディングをゼロに設定
                                    margin: 0,  // マージンをゼロに設定
                                }}
                            >
                                <Box
                                    sx={{
                                        color: "black",
                                        // border: '1px solid #ccc',
                                        width: "100%",
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center', // セル内のコンテンツを垂直中央に配置
                                        justifyContent: 'center', // セル内のコンテンツを水平方向に中央に配置
                                        padding: 0, // 内側のパディングをゼロに設定
                                    }}
                                >
                                    {/* コンポーネントを中央に配置 */}
                                    {/*{gridItem.name}*/}
                                    {renderComponent(gridItem)} {/* 初期状態で描画しない */}
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
