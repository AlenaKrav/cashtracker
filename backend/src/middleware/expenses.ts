import type { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Expense from "../models/Expense";

export type ExpenseParams = {
  expenseId: string;
};

declare global {
  namespace Express {
    interface Request {
      expense?: Expense;
    }
  }
}

export const validateExpensetInput = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await body("name")
    .notEmpty()
    .withMessage("El nombre de gasto no puede ir vacío")
    .run(req);

  await body("amount")
    .notEmpty()
    .withMessage("La cantidad de gasto no puede ir vacía")
    .isNumeric()
    .withMessage("La cantidad de gasto debe ser un valor numérico")
    //evaluamos el valor de ese campo, el callback debe evaluarse en FALSE para ejecutarse
    .custom((value) => value > 0)
    .withMessage("El valor numérico de gasto debe ser positivo")
    .run(req);
  next();
};

export const validateExpenseId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await param("expenseId")
    .isInt()
    .withMessage("ID no válido")
    .custom((value) => value > 0)
    .withMessage("ID no válido")
    .run(req);

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateExpenseExists = async (
  req: Request<ExpenseParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      return res
        .status(404)
        .json({ error: "No existe gasto con este ID" });
    }
    //para pasar el mismo budget encontrado o no al controlador
    req.expense = expense;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ha ocurrido un error al recuperar el gasto" });
  }
};
