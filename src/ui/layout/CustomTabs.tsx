import React, {useState} from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ButtonFrame from './button-frame.svg';
import Typography from "@mui/material/Typography";

interface TabItem {
    label: string;
    linkPath: string; // Only linkPath needed, content is removed
}

interface CustomTabsProps {
    items: TabItem[];
}

const CustomTabs: React.FC<CustomTabsProps> = ({ items }) => {
    const [activeTab, setActiveTab] = useState<TabItem>({label: '', linkPath: ''});

    const handleTabClick = (item: TabItem) => {
        setActiveTab(item);
    }

    return (
        <Box
            width={"80%"}
            sx={{
                position: 'fixed',
                top: 0,
                marginTop: 2,
                zIndex:1000,
                display: 'flex',
                overflowX: 'auto',
                scrollbarWidth: 'none', // Firefox用
                '&::-webkit-scrollbar': {
                    display: 'none', // Chrome, Safari用
                },
            }}
        >
            {items.map((item: TabItem) => (
                <Box
                    key={item.label}
                    onClick={() => handleTabClick(item)}
                    sx={{
                        position: 'relative',
                        cursor: 'pointer',
                        margin: '0 8px',
                        padding: '0', // paddingを削除して背景をフレームに合わせる
                        display: 'flex', // フレックスボックスを使用
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: item.label == activeTab.label ? '#000000' : 'transparent', // 選択時に暗い色
                        borderRadius: '8px', // 全体に角丸を適用
                        transition: 'background-color 0.3s', // 背景色のアニメーション
                        '&:hover': {
                            backgroundColor: item.label == activeTab.label ? '#030303' : '#256525', // ホバー時に色を変更
                        },
                    }}
                >
                    {/* ボタンフレーム */}
                    <img
                        src={ButtonFrame}
                        alt="Button Frame"
                        style={{
                            height: 'auto',
                            display: 'block',
                        }}
                    />

                    {/* ラベルを上に重ねる */}
                    <Typography
                        variant="body1"
                        sx={{
                            position: 'absolute', // 絶対位置に設定
                            top: '50%', // 上から50%の位置に配置（中央揃え）
                            left: '50%', // 左から50%の位置に配置（中央揃え）
                            transform: 'translate(-50%, -50%)', // 中央に正確に配置するための変換
                            color: item.label == activeTab.label ? '#4ccc4c' : '#d3d3d3', // 選択時は文字色を白に変更
                            transition: 'color 0.3s',
                            pointerEvents: 'none', // クリックイベントを無効化
                        }}
                    >
                        {item.label}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default CustomTabs;
