import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetExists, validateBudgetId, validateBudgetInput } from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpensesController";
import { validateExpenseExists, validateExpenseId, validateExpensetInput } from "../middleware/expenses";

const router = Router();
/** Budget Routes */
//indicamos que cada vez nos viene un parametro id se jecuten estos dos middlewares
router.param('budgetId', validateBudgetId);
router.param('budgetId', validateBudgetExists);


router.param('expenseId', validateExpenseId)
router.param('expenseId', validateExpenseExists)

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

/** Expenses Routes */
// getAllExpenses esto ya se hace al cosnultar un budget especifico

router.post('/:budgetId/expenses',
    validateExpensetInput,
    handleInputErrors,
    ExpensesController.createExpense)

router.get('/:budgetId/expenses/:expenseId', ExpensesController.getExpenseById)
router.put('/:budgetId/expenses/:expenseId', ExpensesController.updateExpenseById)
router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteExpenseById)

export default router;