import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{paddingLeft: 3}}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `seededit-tab-${index}`,
        'aria-controls': `seededit-tabpanel-${index}`,
    };
}

interface TabItemIF {
    index: number;
    label: string;
    children: React.ReactNode;
}

interface SeedEditTabPanelProps {
    tabItems: TabItemIF[];  // 親から受け取るitemsの型定義
}

export default function SeedEditTabPanel({ tabItems }: SeedEditTabPanelProps) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%'}} paddingLeft={5}>
            <Box className={"seedEditTabMenu"} sx={{
                backgroundColor: "#000000",
                position: 'sticky', // ここでstickyを指定
                top: 0, // 上部からの固定位置を指定
                zIndex: 5,
                borderBottom: 1,
                borderColor: 'divider'
            }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {tabItems.map((item) => (
                        <Tab sx={{width: '50%'}} key={item.index}
                             label={item.label} {...a11yProps(item.index)} />
                    ))}
                </Tabs>
            </Box>

            {tabItems.map((item) => (
                <CustomTabPanel key={item.index} value={value} index={item.index}>
                    {item.children}
                </CustomTabPanel>
            ))}
        </Box>
    );
}
