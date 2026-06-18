import type { Request, Response } from "express";
import Budget from "../models/Budget";


export class BudgetController {
  static getAllBudgets = async (req: Request, res: Response) => {
    try {
      //aqui budget es la tabla entera solo la consultamos
      const budgets = await Budget.findAll({
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
      //creamos un modelo en memoria, un objeto = fila, es como preparar el INSERT antes de lanzar la quert
      const budget = new Budget(req.body);
      console.log(budget);
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
    res.status(200).json(req.budget);
  };

  static updateBudgetById = async (req: Request, res: Response) => {
    await req.budget.update(req.body);
    return res
      .status(201)
      .json({ message: "Regsitro actualizado correctamente" });
  };

  static deleteBudget = async (req: Request, res: Response) => {
    await req.budget.destroy();
    res.status(201).json({ message: "Regsitro borrado correctamente" });
  };
}
