import { Request, Response } from 'express';
import { wrapAsync } from '../utilis/wrapAsync.';
import { invitationService } from '../services/invitationService';
import { jwtUtils } from '../utilis/jwtUtilis';

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
        const token = req.query.token as string;
        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is required' });
        }
    
        let decodedToken;
        try {
            decodedToken = jwtUtils.verifyInvitationToken(token);
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }
    
        const invitation = await invitationService.acceptInvitation(decodedToken.invitationId);
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}?invitationAccepted=true&eventId=${invitation.event_id}`);
    }),
    
    declineInvitation: wrapAsync(async (req: Request, res: Response) => {
        const token = req.query.token as string;
        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is required' });
        }
    
        let decodedToken;
        try {
            decodedToken = jwtUtils.verifyInvitationToken(token);
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }
    
        const invitation = await invitationService.declineInvitation(decodedToken.invitationId);
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}?invitationDeclined=true&eventId=${invitation.event_id}`);
    }),
};
