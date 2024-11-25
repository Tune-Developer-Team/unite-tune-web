// AddContent.tsx
import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface AddThinkButtonProps {
    onClick: () => void;
}

const AddThinkButton: React.FC<AddThinkButtonProps> = ({ onClick }) => {
    return (
        <Fab
            sx={{ position: "fixed", bottom: 100, right: 40 }}
            color="primary"
            aria-label="add"
            onClick={onClick}
        >
            <AddIcon />
        </Fab>
    );
};

export default AddThinkButton;
