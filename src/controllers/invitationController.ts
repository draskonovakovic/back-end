import { Request, Response } from 'express';
import { wrapAsync } from '../utilis/wrapAsync.';
import { invitationService } from '../services/invitationService';

export const invitationController = {
    createInvitation: wrapAsync(async (req: Request , res: Response) => {
        const invitation = await invitationService.createInvitation(req.body);
        res.status(201).json({ success: true, message: 'Invitation created successfully', data: invitation });
    }),

    getInvitationById: wrapAsync(async (req: Request, res: Response) => {
        const invitationId = Number(req.params.id);
    
        if (!invitationId || isNaN(invitationId)) {
            return res.status(400).json({ success: false, message: 'Invalid invitation ID' });
        }
    
        const invitation = await invitationService.getInvitationById(invitationId);
        res.status(200).json({ success: true, data: invitation });
    }),
    

    getAllInvitations: wrapAsync(async (req: Request, res: Response) => {
        const invitations = await invitationService.getAllInvitations();
        res.status(200).json({ success: true, data: invitations });
    }),

    updateInvitation: wrapAsync(async (req: Request, res: Response) => {
        const invitationId = Number(req.params.id);
    
        if (!invitationId || isNaN(invitationId)) {
            return res.status(400).json({ success: false, message: 'Invalid invitation ID' });
        }
    
        const invitation = await invitationService.updateInvitation(invitationId, req.body);
        res.status(200).json({ success: true, data: invitation });
    }),
    
    deleteInvitation: wrapAsync(async (req: Request, res: Response) => {
        const invitationId = Number(req.params.id);
    
        if (!invitationId || isNaN(invitationId)) {
            return res.status(400).json({ success: false, message: 'Invalid invitation ID' });
        }
    
        await invitationService.deleteInvitation(invitationId);
        res.status(204).send();
    }),

    acceptInvitation: wrapAsync(async (req: Request, res: Response) => {
        const invitationId = Number(req.params.id);
    
        if (!invitationId || isNaN(invitationId)) {
          return res.status(400).json({ success: false, message: 'Invalid invitation ID' });
        }
    
        const invitation = await invitationService.acceptInvitation(invitationId);
        res.status(200).json({ success: true, message: 'Invitation accepted', data: invitation });
    }),
    
    declineInvitation: wrapAsync(async (req: Request, res: Response) => {
        const invitationId = Number(req.params.id);
    
        if (!invitationId || isNaN(invitationId)) {
          return res.status(400).json({ success: false, message: 'Invalid invitation ID' });
        }
    
        const invitation = await invitationService.declineInvitation(invitationId);
        res.status(200).json({ success: true, message: 'Invitation declined', data: invitation });
    }),
};