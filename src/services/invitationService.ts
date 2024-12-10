import { invitationRepository } from '../repositories/invitationRepository';
import { eventRepository } from '../repositories/eventRepository';
import { userRepository } from '../repositories/userRepository';
import { Invitation } from '../models/invitation';
import { createError } from '../utilis/createError';
import { emailService } from './emailService';

export const invitationService = {
  async createInvitation(invitation: Omit<Invitation, 'id'>): Promise<Invitation> {
    try {
      const createdInvitation = await invitationRepository.create(invitation)
      if(!createdInvitation) throw createError('Failed to create invitation, repository returned null or undefined', 500);

      const event = await eventRepository.findById(createdInvitation.event_id);
      const user = await userRepository.findById(createdInvitation.user_id);

      if (!event || !user) {
        throw new Error('Event or user not found.');
      }

      await emailService.sendInvitationEmail(user.email, event.title, createdInvitation.id);
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

  async acceptInvitation(id: number): Promise<Invitation> {
    try {
      const invitation = await invitationRepository.findById(id);
      console.log("Invitation id: ", id)
      console.log("Invitation: ", invitation)
      if (!invitation) {
        throw createError('Invitation not found', 404);
      }

      if (invitation.status !== 'pending') {
        throw createError('Invitation already responded to', 400);
      }

      const updatedInvitation = await invitationRepository.update(id, { status: 'accepted' });

      if(!updatedInvitation){
        throw createError('Failed to update invitation', 500);
      }

      return updatedInvitation;
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      throw createError(`Failed to accept invitation: ${error.message}`, error.statusCode || 500);
    }
  },

  async declineInvitation(id: number): Promise<Invitation> {
    try {
      const invitation = await invitationRepository.findById(id);

      if (!invitation) {
        throw createError('Invitation not found', 404);
      }

      if (invitation.status !== 'pending') {
        throw createError('Invitation already responded to', 400);
      }

      const updatedInvitation = await invitationRepository.update(id, { status: 'declined' });

      if(!updatedInvitation){
        throw createError('Failed to update invitation', 500);
      }

      return updatedInvitation;
    } catch (error: any) {
      console.error('Error declining invitation:', error);
      throw createError(`Failed to decline invitation: ${error.message}`, error.statusCode || 500);
    }
  },

};
