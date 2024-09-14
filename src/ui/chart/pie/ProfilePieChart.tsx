import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function ProfilePieChart() {
    const needsByLanguage = [
        { id: 0, value: 15, label: 'PHP' },
        { id: 1, value: 5, label: 'TypeScript' },
        { id: 2, value: 20, label: 'Java' },
        { id: 3, value: 10, label: 'C#' },
    ];
    return (
        <PieChart
            series={[
                {
                    data: needsByLanguage,
                },
            ]}
            width={400}
            height={200}
        />
    );
}