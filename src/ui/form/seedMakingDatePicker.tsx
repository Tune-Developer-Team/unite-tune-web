import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {useState} from "react";


/**
 * TODO: 余裕でたら作る
 * @constructor
 */
export default function SeedMakingDatePicker() {
    const [date, setDate] = useState<any | null>(null);
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                onChange={
                    (date) => setDate(date)
                }
            />
        </LocalizationProvider>
    );
}