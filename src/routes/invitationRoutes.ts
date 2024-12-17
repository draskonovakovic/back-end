import { Router } from 'express';
import { invitationController } from '../controllers/invitationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/accept', invitationController.acceptInvitation);
router.get('/decline', invitationController.declineInvitation);

router.route('/')
  .post(authenticateToken, invitationController.createInvitation)
  .get(authenticateToken, invitationController.getAllInvitations);

router.route('/:id')
  .get(authenticateToken, invitationController.getInvitationById)
  .put(authenticateToken, invitationController.updateInvitation)
  .delete(authenticateToken, invitationController.deleteInvitation);

export default router;
