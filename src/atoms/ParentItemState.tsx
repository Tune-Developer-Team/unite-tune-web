// src/atoms/ParentItemState.ts
import {atom} from 'recoil';
import React from 'react';

export interface ParentItem {
    label: string;
    icon: React.ReactNode;
    linkPath: string;
    children: Array<{ label: string; linkPath: string }>;
    isActive: boolean
}

export const parentItemsState = atom<ParentItem[]>({
    key: 'parentItemsState',
    default: []
});
