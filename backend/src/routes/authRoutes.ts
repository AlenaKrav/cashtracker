import { Router } from "express";
import { body, param, ExpressValidator } from "express-validator";
import { AuthController } from "../controllers/AuthControllers";
import { handleInputErrors } from "../middleware/validation";
import { limiter } from "../config/rateLimiter";
import { autenticateUser } from "../middleware/auth";

const router = Router();

//para limitar las peticiones solo en ese router (solo las peticiones auth)
router.use(limiter)

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("Debes introducir el nombre de usuario"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener mínimo 8 caracteres"),
  body("email").isEmail().withMessage("E-mail no válido"),
  handleInputErrors,
  AuthController.createAccount,
);

router.post(
  "/confirm-account",
   //limiter solo ponemos limite en este endpoint concreto
  body("token")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Token no válido"),
  handleInputErrors,
  AuthController.confirmAccount,
);


router.post("/login",
    body("email").isEmail().withMessage("E-mail no válido"),
    body("password")
    .notEmpty().withMessage("El password es obligatorio"),
    handleInputErrors,
    AuthController.login
)

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("E-mail no válido"),
  AuthController.forgotPassword,
  handleInputErrors,
);


router.post(
  "/validate-token",
  body("token")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Token no válido"),
    AuthController.validateToken,
  handleInputErrors,
);


router.post(
  "/reset-password/:token",
  param("token").isLength({ min: 6, max: 6 }).withMessage("Token no válido"),
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener mínimo 8 caracteres"),
  handleInputErrors,
  AuthController.resetPasswordWithToken,
);


router.get("/user",
  autenticateUser,
  AuthController.getUserInfo
)

export default router;
