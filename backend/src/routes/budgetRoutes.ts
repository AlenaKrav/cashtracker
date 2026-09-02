import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetExists, validateBudgetId, validateBudgetInput, validateBudgetOwner } from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpensesController";
import { expenseBelongsToBudget, validateExpenseExists, validateExpenseId, validateExpensetInput } from "../middleware/expenses";
import { autenticateUser } from "../middleware/auth";

const router = Router();
router.use(autenticateUser) //1. Autentica el user y genera req.user
/** Budget Routes */
//indicamos que cada vez nos viene un parametro id se jecuten estos dos middlewares
//OJO CON EL ORDEN
router.param('budgetId', validateBudgetId); //2. validación del param del request
router.param('budgetId', validateBudgetExists); // 3. verifica si existe el presupuesto con el id y genera req.budget
router.param('budgetId', validateBudgetOwner); // 4. Aqui necesitaremos tanto el req.user como el req.budget



router.param('expenseId', validateExpenseId)
router.param('expenseId', validateExpenseExists)
router.param('expenseId', expenseBelongsToBudget)

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