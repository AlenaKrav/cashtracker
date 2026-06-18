import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body, param } from 'express-validator'
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetExists, validateBudgetId, validateBudgetInput } from "../middleware/budget";

const router = Router();
//indicamos que cada vez nos viene un parametro id se jecuten estos dos middlewares
router.param('budgetId', validateBudgetId);
router.param('budgetId', validateBudgetExists);

router.get('/', BudgetController.getAllBudgets)

router.post('/', 
    validateBudgetInput,
    handleInputErrors,
    BudgetController.createBudget)


router.get('/:budgetId',
    BudgetController.getBudgetById)

router.put('/:budgetId', 
    validateBudgetInput,
    handleInputErrors,
    BudgetController.updateBudgetById)


router.delete('/:budgetId', 
    BudgetController.deleteBudget)

export default router;