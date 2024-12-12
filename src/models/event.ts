export type Event = {
    id: number,
    title: string,
    description: string,
    date_time: Date,
    location: string,
    type: string,
    creator_id: number,
    active: boolean;
    notifications_sent: Record<string, boolean>;
}