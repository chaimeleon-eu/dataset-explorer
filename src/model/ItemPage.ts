
export default interface ItemPage<T_ITEM> {
    total: number;
    returned: number;
    skipped: number;
    limit: number;
    list: T_ITEM[];
}