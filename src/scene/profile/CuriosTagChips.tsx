import React from 'react';
import { Chip, Box } from '@mui/material';

// 使用可能な色のリスト
const availableColors = [
    '#ff6f61', '#6b5b95', '#88b04b', '#f7cac9', '#92a8d1',
    '#955251', '#b565a7', '#009688', '#e0e0e0', '#ffd700'
];

// 背景色に対して適切な文字色（黒または白）を返す関数
const getContrastTextColor = (backgroundColor: string) => {
    // HEXカラーコードをRGBに変換
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // 色の明るさを計算 (0から255の範囲)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // 明るさが128以上なら文字色は黒、それ未満なら白
    return brightness > 128 ? '#000' : '#fff';
};

// タグを配列として生成する関数
const generateCuriosTagChips = (tags: string[]) => {
    // シャッフルしてランダムに色を割り当てるための関数
    const shuffleColors = (colors: string[]) => {
        let currentIndex = colors.length, randomIndex;

        // Fisher-Yatesアルゴリズムで色をシャッフル
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // 色を交換
            [colors[currentIndex], colors[randomIndex]] = [
                colors[randomIndex], colors[currentIndex]
            ];
        }
        return colors;
    };

    // 色リストをシャッフルして配列を準備
    const shuffledColors = shuffleColors([...availableColors]);

    // `Chip` コンポーネントの配列に変換
    return tags.map((tag, index) => {
        const backgroundColor = shuffledColors[index % shuffledColors.length];
        const textColor = getContrastTextColor(backgroundColor);

        return (
            <Chip
                key={index}
                label={tag}
                sx={{ margin: 0.4, backgroundColor, color: textColor, fontSize: 10, padding: 0}}
            />
        );
    });
};

export default generateCuriosTagChips;
