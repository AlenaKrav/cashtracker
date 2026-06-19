import { Request, Response } from "express";
import Expense from "../models/Expense";

export class ExpensesController {

  static createExpense = async (req: Request, res: Response) => {
    const budgetId = req.budget.id //viene de la bd, ya ha pasado por el validateBudgetExists

    console.log(req.budget.id) // viene de la bd, ya ha pasado por el validateBudgetExists
    console.log(budgetId) // viene de la url, sin pasar por el validador

    try {
      const expense = new Expense(req.body);
      expense.budgetId = budgetId; //asociamos el gasto (su budgetId) al que ya vareficamos
      await expense.save();
      res.status(201).json({ message: "Gasto creado correctamente" });
    } catch (error) {
        res
        .status(500)
        .json({ error: "Ha ocurrido un error al crear el gasto" });
    }
  };

  static getExpenseById = async (req: Request, res: Response) => {
    const expense = req.expense;
    res.status(200).json(expense);
  };

  static updateExpenseById = async (req: Request, res: Response) => {
    await req.expense.update(req.body);
    return res
      .status(201)
      .json({ message: "Gasto actualizado correctamente" });
  };

  static deleteExpenseById = async (req: Request, res: Response) => {
    await req.expense.destroy();
    res.status(201).json({ message: "Gasto borrado correctamente" });
  };
}
