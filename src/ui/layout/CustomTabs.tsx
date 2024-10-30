import React, {useEffect, useState} from 'react';
import { Box, Typography } from '@mui/material';
import ButtonFrame from './button-frame.svg';
import {useRecoilState} from "recoil";
import Profile from "../../models/Profile/Profile";
import {SelectedTabIF, selectedTabState} from "../../atoms/SelectedTabState";

// タブアイテムの型を定義
export interface TabItem {
    label: string;
}

interface CustomTabsProps {
    tabItems: TabItem[];
    bottomTab: string
}

const CustomTabs: React.FC<CustomTabsProps> = ({tabItems, bottomTab}) => {
    const [topTab, setTopTab] = useRecoilState(selectedTabState);

    const [bottom, setBottomTab] = useState<string>("Home");
    const [activeTab, setActiveTab] = useState<TabItem>({label: ""});

    const handleTabClick = (label: string) => {
        let newSelectedTab:SelectedTabIF = {
            Home: {
                selected:{
                    label: topTab.Home.selected.label,
                }
            },
            ThinkTank: {
                selected:{
                    label: topTab.ThinkTank.selected.label,
                }
            },
            AIS: {
                selected:{
                    label: topTab.AIS.selected.label,
                }
            },
            Profile: {
                selected:{
                    label: topTab.Profile.selected.label,
                }
            }
        };

        switch (bottomTab) {
            case 'Home':
                newSelectedTab.Home.selected.label = label;
                break;
            case 'ThinkTank' :
                newSelectedTab.ThinkTank.selected.label = label;
                break;
            case 'AIS' :
                newSelectedTab.AIS.selected.label = label;
                console.log(newSelectedTab.AIS.selected.label)
                break;
            case 'Profile' :
                newSelectedTab.Profile.selected.label = label;
                break;
            default:
                break;
        }

        console.log(topTab)
        console.log("更新")
        setTopTab(newSelectedTab);
    };

    useEffect(() => {
        setBottomTab(bottomTab);

        switch (bottomTab) {
            case 'Home':
                setActiveTab(topTab.Home.selected);
                break;
            case 'ThinkTank' :
                setActiveTab(topTab.ThinkTank.selected);
                break;
            case 'AIS' :
                setActiveTab(topTab.AIS.selected);
                break;
            case 'Profile' :
                setActiveTab(topTab.Profile.selected);
                break;
            default:
                break;
        }

    }, [activeTab]);

    let isNotSelectedTab = true;

    tabItems.map((item) => {
        if (item.label == activeTab.label) {
            isNotSelectedTab = false;
        }
        return item
    });

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
            {tabItems.map((item: TabItem) => (
                <Box
                    key={item.label}
                    onClick={() => handleTabClick(item.label)}
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
