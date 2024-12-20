export type Invitation = {
    id: number,
    event_id: number,
    user_id: number,
    status: 'pending' | 'accepted' | 'declined';
}