import { Router } from "express";
import { body, ExpressValidator } from "express-validator";
import { AuthController } from "../controllers/AuthControllers";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post('/create-account',
    body('name')
    .notEmpty().withMessage('Debes introducir el nombre de usuario'),
    body('password')
    .isLength({min: 8}).withMessage('La contraseña debe tener mínimo 8 caracteres'),
    body('email')
    .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    AuthController.createAccount);
export default router;