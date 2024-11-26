import { Router } from 'express';
import { userController } from '../controllers/userController';
import { userValidationMiddleware } from '../middleware/validationMiddleware';

const router = Router();

router.post('/',userValidationMiddleware, userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id',userValidationMiddleware, userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
