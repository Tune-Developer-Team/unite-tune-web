import React, {useEffect, useState} from 'react';
import { TextField, Box, Chip } from '@mui/material';

interface CuriosTagInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
}

const CuriosTagInput: React.FC<CuriosTagInputProps> = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState<string | null>(null);
    // タグの追加処理
    const handleTagAddition = (tagValue: string) => {
        // タグが空白や重複しないか確認
        if (!tagValue || tags.includes(tagValue)) {
            return;
        }

        setTags([...tags, tagValue]);
        setInputValue('');
    };

    // テキストフィールドの変更処理
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        // スペースやカンマが入力された場合にのみタグを追加
        if (value.endsWith(' ') || value.endsWith(',')) {
            const trimmedValue = value.slice(0, -1).trim(); // スペースまたはカンマを削除
            if (trimmedValue.length === 0) {
                return;
            }

            // `#` で始まらないタグには `#` を付加
            const formattedTag = trimmedValue.startsWith('#') ? trimmedValue : `#${trimmedValue}`;

            // タグのフォーマットが正しいか確認
            // \p{L} は全ての言語の文字、\p{N} は数字を表す
            if (/^#[\p{L}\p{N}_]+$/u.test(formattedTag)) {
                handleTagAddition(formattedTag);
                setError(null);
            } else {
                setError('無効なタグです.');
            }
        }
    };

    // タグの削除処理
    const handleTagDelete = (tagToDelete: string) => {
        setTags(tags.filter((tag) => tag !== tagToDelete));
    };

    return (
        <Box>
            <TextField
                fullWidth
                variant="standard"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="タグを入力 (スペースまたはカンマで区切る)"
                error={!!error}
                helperText={error}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputValue.trim()) {
                        e.preventDefault();
                    }
                }}
            />
            <Box mt={2}>
                {tags.map((tag, index) => (
                    <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleTagDelete(tag)}
                        sx={{ margin: '4px' }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default CuriosTagInput;
