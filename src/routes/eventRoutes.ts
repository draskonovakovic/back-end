import { Router } from 'express';
import { eventController } from '../controllers/eventController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/',authenticateToken, eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

export default router;
