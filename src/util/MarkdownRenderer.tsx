// src/components/MarkdownRenderer.tsx
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // クリップボードアイコン

interface MarkdownRendererProps {
    content: string; // Markdown形式の文字列
}

// Markdown独自の記法が含まれているかを判定する関数
const containsMarkdownSyntax = (content: string): boolean => {
    const markdownRegex = /[#*[\]-]|!\[.*\]\(.*\)|\d+\.|`{1,3}/; // 基本的なMarkdown記法とバッククォートチェック
    return markdownRegex.test(content);
};

// クリップボードにテキストをコピーする関数
const copyToClipboard = (text: string) => {
    return navigator.clipboard.writeText(text).then(() => {
        console.log('コピー成功:', text);
    }).catch(err => {
        console.error('コピー失敗:', err);
    });
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const isMarkdown = containsMarkdownSyntax(content);
    const [copyMessage, setCopyMessage] = useState<string | null>(null);

    const handleCopy = (event: React.MouseEvent, codeString: string) => {
        event.stopPropagation(); // イベントの伝播を停止
        copyToClipboard(codeString);
        setCopyMessage('クリップボードにコピーしました'); // メッセージをセット
        setTimeout(() => {
            setCopyMessage(null); // 一定時間後にメッセージを消す
        }, 2000); // 2秒後に消える
    };

    return (
        isMarkdown ? (
            <Box sx={{ position: 'relative', overflow: 'auto' }}> {/* 相対位置を設定 */}
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ node, inline, className = '', children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className);
                            const codeString = String(children).replace(/\n$/, '');

                            return !inline && match ? (
                                <div style={{ position: 'relative' }}>
                                    <IconButton
                                        onClick={(event) => handleCopy(event, codeString)} // コピー処理
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            zIndex: 1,
                                            backgroundColor: 'rgba(52,52,52,0.7)', // 半透明背景
                                            borderRadius: '4px',
                                            '&:hover': {
                                                backgroundColor: 'rgb(26,26,26)', // ホバー時の背景色
                                            },
                                        }}
                                    >
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{
                                            padding: '1em',
                                            borderRadius: '5px',
                                            backgroundColor: '#313131', // 背景色
                                            color: '#000', // 文字色
                                        }}
                                        {...props}
                                    >
                                        {codeString}
                                    </SyntaxHighlighter>
                                    {copyMessage && ( // メッセージの表示
                                        <Typography
                                            variant="caption"
                                            color="success.main" // 成功メッセージの色
                                            sx={{
                                                position: 'absolute',
                                                top: -20,
                                                right: 10, // ボタンの隣に配置
                                                zIndex: 1,
                                                backgroundColor: 'rgba(0,0,0,0.7)', // 背景を白に
                                                borderRadius: '4px',
                                                padding: '2px 4px',
                                                transition: 'opacity 0.5s',
                                            }}
                                        >
                                            {copyMessage}
                                        </Typography>
                                    )}
                                </div>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                    }}
                >
                    {content}
                </ReactMarkdown>
            </Box>
        ) : (
            <Typography
                variant="body1"
                color="text.primary"
                textAlign="start"
                dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
            />
        )
    );
};

export default MarkdownRenderer;
