import type { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Budget from "../models/Budget";

type BudgetParams = {
  budgetId: string;
};

declare global {
  namespace Express {
    interface Request {
      budget?: Budget;
    }
  }
}

//al llevar express validator fuera del router hay que hacerla async await porque sino entra directamente en el controller
export const validateBudgetId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await param("budgetId")
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

//NO ESTOY MUY DE ACUERDO QUE ESTO DEBERIA APARECER COMO MIDDLEWARE
export const validateBudgetExists = async (
  req: Request<BudgetParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { budgetId } = req.params;
    const budget = await Budget.findByPk(budgetId);

    if (!budget) {
      return res
        .status(404)
        .json({ error: "No existe presupuesto con este ID" });
    }
    //para pasar el mismo budget encontrado o no al controlador
    req.budget = budget;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ha ocurrido un error al recuperar el presupuesto" });
  }
};

export const validateBudgetInput = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await body("name")
    .notEmpty()
    .withMessage("El nombre no puede ir vacío")
    .run(req);

  await body("amount")
    .notEmpty()
    .withMessage("La cantidad no puede ir vacía")
    .isNumeric()
    .withMessage("La cantidad debe ser un valor numérico")
    //evaluamos el valor de ese campo, el callback debe evaluarse en FALSE para ejecutarse
    .custom((value) => value > 0)
    .withMessage("El valor numérico debe ser positivo")
    .run(req);
  next();
};
