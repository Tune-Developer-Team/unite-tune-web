import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import {BarChart} from "@mui/x-charts";

export default function ProfileBarChart() {
    return (
        <BarChart
            xAxis={[{ scaleType: 'band', data: ['PHP', 'TypeScript', 'Java'] }]}
            series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
            width={500}
            height={300}
        />
    );
}