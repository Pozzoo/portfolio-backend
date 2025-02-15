export type ContentType = {
    id: number,
    parent_id: number | null,
    title: string,
    type: string,
    icon: string,
    can_open: boolean,
    tags?: number[],
    langs?: number[],
    status?: number[],
    text?: string,
    options_bar?: boolean,
    functions_bar?: boolean,
}