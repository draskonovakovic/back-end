import { Event } from "./event"

export type EventStats = {
    event: Event,
    aceptedInvitationsNum: number,
    declinedInvitationsNum: number,
    pendingInvitationsNum: number
}