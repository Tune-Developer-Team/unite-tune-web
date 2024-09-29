// SeedTileBanner.tsx
import React from 'react';
import { SeedListItem } from '../../scene/home/HomeViewModelIF';
import SeedTile from './SeedTile';
import ScrollContainer from "../container/ScrollContainer";

interface SeedTileBannerProps {
    seedList: SeedListItem[]; // 親コンポーネントから渡されるシードリスト
}

const SeedTileBanner: React.FC<SeedTileBannerProps> = ({ seedList }) => {

    return (
        <ScrollContainer>
            {seedList.map((item, index) => (
                <SeedTile key={index} item={item} />
            ))}
        </ScrollContainer>
    );
};

export default SeedTileBanner;
