import { Router } from 'express';
import { eventController } from '../controllers/eventController';
import { authenticateToken } from '../middleware/authMiddleware';
import { eventValidationMiddleware } from '../middleware/eventValidationMiddleware';

const router = Router();

router.route('/')
  .post(eventValidationMiddleware, authenticateToken, eventController.createEvent)
  .get(authenticateToken, eventController.getAllEvents);

router.route('/filter').get(eventController.getFilteredEvents)

router.route('/:id')
  .get(authenticateToken, eventController.getEventById)
  .put(eventValidationMiddleware, authenticateToken, eventController.updateEvent)
  .delete(authenticateToken, eventController.deleteEvent);

router.route('/cancel/:id').put(authenticateToken, eventController.cancelEvent)
router.route('/check/:id').get(authenticateToken, eventController.isUsersEvent)

export default router;
