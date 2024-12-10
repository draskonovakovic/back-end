import { invitationRepository } from '../repositories/invitationRepository';
import { Invitation } from '../models/invitation';
import { createError } from '../utilis/createError';

export const invitationService = {
  async createInvitation(invitation: Omit<Invitation, 'id'>): Promise<Invitation> {
    try {
      const createdInvitation = await invitationRepository.create(invitation)
      if(!createdInvitation) throw createError('Failed to create invitation, repository returned null or undefined', 500);
      return createdInvitation;
    } catch (error: any) {
      console.error('Error creating invite:', error);
      throw createError(`Failed to create invite: ${error}`, error.statusCode || 500);
    }
  },

  async getInvitationById(id: number): Promise<Invitation> {
    try {
      const invitation = await invitationRepository.findById(id);
      if (!invitation) {
        throw createError('Invitation not found', 404);
      }
      return invitation;
    } catch (error: any) {
      console.error('Error fetching invitation by ID:', error);
      throw createError(`Failed to retrieve invitation: ${error}`, error.statusCode || 500);
    }
  },

  async getAllInvitations(): Promise<Invitation[]> {
    try {
      return await invitationRepository.findAll();
    } catch (error: any) {
      console.error('Error fetching all invitations:', error);
      throw createError(`Failed to retrieve invitations: ${error}`, error.statusCode || 500);
    }
  },

  async updateInvitation(id: number, invitation: Partial<Invitation>): Promise<Invitation> {
    try {
      const updatedInvite = await invitationRepository.update(id, invitation);

      if (!updatedInvite) {
        throw createError('Failed to update invitation', 500);
      }

      return updatedInvite;
    } catch (error: any) {
      console.error('Error updating invitation:', error);
      throw createError(`Failed to update invitation: ${error}`, error.statusCode || 500);
    }
  },

  async deleteInvitation(id: number): Promise<number> {
    try {
      const deletedInvitaionId = await invitationRepository.delete(id);
      if (!deletedInvitaionId) {
        throw createError('Invitation not found', 404);
      }

      return deletedInvitaionId;
    } catch (error: any) {
      console.error('Error deleting invite:', error);
      throw createError(`Failed to delete invite: ${error}`, error.statusCode || 500);
    }
  },
};
