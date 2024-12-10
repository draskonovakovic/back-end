import { baseRepository } from './baseRepository';
import { Invitation } from '../models/invitation';

export const invitationRepository = {
  ...baseRepository<Invitation>('invitations'),
};
