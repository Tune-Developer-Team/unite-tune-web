import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function HomeGrid() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid xs={12} className={"new-arrival-post"}>
                    <Item>new arrival</Item>
                </Grid>
                <Grid xs={4}  className={"new-arrival-tile-1"}>
                    <Item>new arrival 1</Item>
                </Grid>
                <Grid xs={4}  className={"new-arrival-tile-2"}>
                    <Item>new arrival 2</Item>
                </Grid>
                <Grid xs={4}  className={"new-arrival-tile-3"}>
                    <Item>new arrival 3</Item>
                </Grid>
            </Grid>
        </Box>
    );
}