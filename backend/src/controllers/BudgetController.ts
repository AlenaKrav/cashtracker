import type { Request, Response } from "express";
import Budget from "../models/Budget";

type BudgetParams = {
  id: string;
};

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

  static getBudgetById = async (req: Request<BudgetParams>, res: Response) => {
    try {
      const { id } = req.params;
      const budget = await Budget.findByPk(id);

      if (!budget) {
        res.status(404).json({ error: "No existe presupuesto con este ID" });
      }
      res.status(200).json({ budget });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Ha ocurrido un error al recuperar el presupuesto" });
    }
  };

  static updateBudgetById = async (
    req: Request<BudgetParams>,
    res: Response,
  ) => {
    try {
      const { id } = req.params;
      const budget = await Budget.findByPk(id);
      if (!budget) {
        res.status(404).json({ error: "No existe presupuesto con este ID" });
      }
      await budget.update(req.body);
      res.status(201).json({message: 'Regsitro actualizado correctamente'})
    } catch (error) {
      res
        .status(500)
        .json({ error: "Ha ocurrido un error al actualizar el presupuesto" });
    }
  };

  static deleteBudget = async (req: Request<BudgetParams>, res: Response) => {
    try {
    const { id } = req.params;
      const budget = await Budget.findByPk(id);

      if (!budget) {
        res.status(404).json({ error: "No existe presupuesto con este ID" });
      }
      await budget.destroy();
      res.status(201).json({message: 'Regsitro borrado correctamente'})

    } catch (error) {
        res
        .status(500)
        .json({ error: "Ha ocurrido un error al borrar el presupuesto" });
    }
  };
}
