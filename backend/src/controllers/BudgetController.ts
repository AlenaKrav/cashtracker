import type { Request, Response } from "express";

export class BudgetController {
  static getAllBudgets = async (req: Request, res: Response) => {
    console.log("Desde BudgetController getAll");
  };

  static createBudget = async (req: Request, res: Response) => {
    console.log("Desde BudgetController create");
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
