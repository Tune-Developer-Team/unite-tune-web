// atoms/thinkTimelineState.ts
import { atom } from 'recoil';
import {Think} from "../models/ThinkTank/Think";

export const thinkListState = atom<Think[]>({
    key: 'thinkListState',
    default: [],
});

export const offsetState = atom<number>({
    key: 'offsetState',
    default: 0,
});

export const scrollPositionState = atom<number>({
    key: 'scrollPositionState',
    default: 0,
});

export const refreshTimelineState = atom<boolean>({
    key: 'refreshTimelineState',
    default: false,
});