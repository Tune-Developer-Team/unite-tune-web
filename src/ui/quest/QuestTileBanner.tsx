// QuestTileBanner.tsx
import React from 'react';
import { QuestListItem } from '../../scene/home/HomeViewModelIF';
import QuestTile from './QuestTile';
import ScrollContainer from "../container/ScrollContainer";

interface SeedTileBannerProps {
    seedList: QuestListItem[]; // 親コンポーネントから渡されるシードリスト
}

const QuestTileBanner: React.FC<SeedTileBannerProps> = ({ seedList }) => {

    return (
        <ScrollContainer>
            {seedList.map((item, index) => (
                <QuestTile key={index} item={item} />
            ))}
        </ScrollContainer>
    );
};

export default QuestTileBanner;
