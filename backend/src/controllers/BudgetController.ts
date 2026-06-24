import type { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

export class BudgetController {
  static getAllBudgets = async (req: Request, res: Response) => {
    const userId = req.user.id
    try {
      //aqui budget es la tabla entera solo la consultamos
      const budgets = await Budget.findAll(
        { where: {
            userId
      },
        order: [["createdAt", "DESC"]],
      });
      res.json({ budgets });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Ha ocurrido un error al obtener los presupuestos" });
    }
  };

  static createBudget = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id
      //creamos un modelo en memoria, un objeto = fila, es como preparar el INSERT antes de lanzar la quert
      const budget = new Budget(req.body);
      budget.userId = userId;
      // console.log(budget);
      //almacenamos el modelo en memoria en la BD
      await budget.save();

      res.status(201).json({ message: "Presupuesto creado correctamente" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Ha ocurrido un error al crear el presupuesto" });
    }
  };

  static getBudgetById = async (req: Request, res: Response) => {
    const budget = await Budget.findByPk(req.budget.id, {
      include: [
        Expense
      ]
    })
    res.status(200).json(budget);
  };

  static updateBudgetById = async (req: Request, res: Response) => {
    await req.budget.update(req.body);
    res
      .status(201)
      .json({ message: "Regsitro actualizado correctamente" });
  };

  static deleteBudget = async (req: Request, res: Response) => {
    await req.budget.destroy();
    res.status(200).json({ message: "Regsitro borrado correctamente" });
  };
}
