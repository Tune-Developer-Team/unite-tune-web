import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

// Props interface for EllipticalButton
interface EllipticalButtonProps {
    onClick: () => void; // onClick handler prop
    children: React.ReactNode; // Button text or elements inside the button
}

const EllipticalButton = styled(Button)(({ theme }) => ({
    borderRadius: '2em', // 楕円形の角丸スタイル、フォントサイズに応じて変化
    padding: '0.2em 2.0em', // 縦横の内側の余白をem単位で指定 (10px -> 0.625em, 30px -> 1.875em)
    textTransform: 'none', // テキストを大文字にしない
    fontSize: '0.9rem', // テキストサイズ、ルートフォントサイズに基づいて変化
    backgroundColor: 'transparent', // 背景を透明に
    color: theme.palette.text.secondary, // テキスト色
    border: '0.125em solid gray', // グレーの枠線、2px -> 0.125em
    position: 'relative',
    overflow: 'hidden', // アニメーションのためにoverflowをhiddenに
    transition: 'color 0.3s ease', // テキスト色のトランジション
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        border: '0.125em solid transparent', // 初期は透明の枠線、2px -> 0.125em
        boxSizing: 'border-box',
        transition: 'border-color 0.3s ease', // 枠線の色のトランジション
    },
    '&:hover': {
        color: theme.palette.text.primary, // ホバー時のテキスト色を変更
    },
}));

const RoundedButton: React.FC<EllipticalButtonProps> = ({ onClick, children }) => {
    return (
        <EllipticalButton onClick={onClick}>
            {children}
        </EllipticalButton>
    );
};

export default RoundedButton;