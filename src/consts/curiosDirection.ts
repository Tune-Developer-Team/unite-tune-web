export type CuriosDirectionType = {
    kind: number;
    label: string;
};

const CURIOS_DIRECTION: readonly CuriosDirectionType[] = Object.freeze([
    {
        kind: 0,
        label: "手動"
    },
    {
        kind: 1,
        label: "高"
    },
    {
        kind: 2,
        label: "中"
    },
    {
        kind: 3,
        label: "低"
    }
]);

export default CURIOS_DIRECTION;
