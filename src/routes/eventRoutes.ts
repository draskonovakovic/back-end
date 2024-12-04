import { Router } from 'express';
import { eventController } from '../controllers/eventController';
import { authenticateToken } from '../middleware/authMiddleware';
import { eventValidationMiddleware } from '../middleware/eventValidationMiddleware';

const router = Router();

router.route('/')
  .post(eventValidationMiddleware, authenticateToken, eventController.createEvent)
  .get(eventController.getAllEvents);

router.route('/:id')
  .get(eventController.getEventById)
  .put(eventValidationMiddleware, eventController.updateEvent)
  .delete(eventController.deleteEvent);

router.route('/cancel/:id').put(eventController.cancelEvent)

export default router;
