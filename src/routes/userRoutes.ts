import { Router } from 'express';
import { userController } from '../controllers/userController';
import { userValidationMiddleware } from '../middleware/validationMiddleware';

const router = Router();

router.route('/')
  .post(userValidationMiddleware, userController.createUser)
  .get(userController.getAllUsers);

router.route('/:id')
  .get(userController.getUserById)
  .put(userValidationMiddleware, userController.updateUser)
  .delete(userController.deleteUser);

export default router;
