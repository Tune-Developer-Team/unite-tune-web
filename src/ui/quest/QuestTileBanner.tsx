// QuestTileBanner.tsx
import React from 'react';
import { QuestListItem } from '../../scene/home/HomeViewModelIF';
import QuestTile from './QuestTile';
import ScrollContainer from "../container/ScrollContainer";

interface SeedTileBannerProps {
    questList: QuestListItem[]; // 親コンポーネントから渡されるシードリスト
}

const QuestTileBanner: React.FC<SeedTileBannerProps> = ({ questList }) => {

    return (
        <ScrollContainer>
            {questList.map((item, index) => (
                <QuestTile key={index} item={item} />
            ))}
        </ScrollContainer>
    );
};

export default QuestTileBanner;
