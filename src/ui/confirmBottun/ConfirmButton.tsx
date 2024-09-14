import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';

// カスタムボタンのスタイルを定義
const EllipseButton = styled(Button)(({ theme }) => ({
    borderRadius: '50px',
    padding: '10px 30px',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
    },
}));
type Props = {
    // onClick?: ()=>void
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    label: string
}

const ConfirmButton = ({label,onClick}:Props) => {
    return (
        <EllipseButton onClick={onClick}>
            {label}
        </EllipseButton>
    );
};

export default ConfirmButton;