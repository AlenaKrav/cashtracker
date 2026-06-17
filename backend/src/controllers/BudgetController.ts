import type { Request, Response } from "express";
import Budget from "../models/Budget";

export class BudgetController {
  static getAllBudgets = async (req: Request, res: Response) => {
    console.log("Desde BudgetController getAll");
  };

  static createBudget = async (req: Request, res: Response) => {
    try {
        //creamos un modelo en memoria
        const budget = new Budget(req.body);
        //almacenamos el modelo en memoria en la BD
        await budget.save();

        res.status(201).json({message: 'Presupuesto creado correctamente'})

    } catch (error) {
        res.status(500).json({error: 'Ha ocurrido un error'})
    }
  };

  static getBudgetById = async (req: Request, res: Response) => {
    console.log("Desde BudgetController getByID");
  };

static updateBudgetById = async (req: Request, res: Response) => {
    console.log("Desde BudgetController editBudget");
  };

  static deleteBudget = async (req: Request, res: Response) => {
    console.log("Desde BudgetController deleteBudget");
  };

}
