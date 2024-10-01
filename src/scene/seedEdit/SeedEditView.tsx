import React, {useState} from 'react';
import Box from "@mui/material/Box";
import {SeedEditViewModel} from "./SeedEditViewModel";
import SeedEditTabPanel from "../../ui/tabPanel/SeedEditTabPanel";
import SeedEditUI from "./SeedEditUI";
import SeedPreviewUI from "./SeedPrevireUI";

const seedEditViewModel = new SeedEditViewModel();

const SeedEditView: () => JSX.Element = () => {
    const [viewModel] = useState<SeedEditViewModel>(seedEditViewModel);

    const tabItems = [
        {index: 0, label: "Edit", children: <SeedEditUI viewModel={viewModel}/>},
        {index: 1, label: "Preview", children: <SeedPreviewUI viewModel={viewModel}/>}
    ];

    return (
        <Box>
            <SeedEditTabPanel tabItems={tabItems}/>
        </Box>
    );
}

export default SeedEditView;