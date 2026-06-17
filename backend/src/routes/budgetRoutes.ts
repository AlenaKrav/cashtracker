import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body } from 'express-validator'
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.get('/', BudgetController.getAllBudgets)
router.post('/', 
    body('name')
    .notEmpty().withMessage('El nombre no puede ir vacío'),
    body('amount')
    .notEmpty().withMessage('La cantidad no puede ir vacía')
    .isNumeric().withMessage('La cantidad debe ser un valor numérico')
    //evaluamos el valor de ese campo, el callback debe evaluarse en FALSE para ejecutarse
    .custom((value) => value > 0).withMessage('El valor numérico debe ser positivo'),
    handleInputErrors,
    BudgetController.createBudget)


router.get('/:id', BudgetController.getBudgetById)
router.put('/:id', BudgetController.updateBudgetById)
router.delete('/:id', BudgetController.deleteBudget)

export default router;