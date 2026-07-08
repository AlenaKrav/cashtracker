import type { Request } from "express";
import { createRequest, createResponse } from "node-mocks-http";
import { validateExpenseExists } from "../../../middleware/expenses";
import type { ExpenseParams } from "../../../middleware/expenses";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/expenses";
import { budgets } from "../../mocks/budgets";
import { validateBudgetOwner } from "../../../middleware/budget";

jest.mock("../../../models/Expense", () => ({
  findByPk: jest.fn(),
}));

describe("expense - validateExpenseExists", () => {
  beforeEach(() => {
    (Expense.findByPk as jest.Mock).mockImplementation((id) => {
      const expense = expenses.filter((exp) => exp.id === id)[0] ?? null;
      return Promise.resolve(expense);
    });
  });

  it("should handle non-exisiting expense", async () => {
    const request = createRequest({
      params: { expenseId: 120 },
    }) as Request<ExpenseParams>;

    const response = createResponse();
    const next = jest.fn();
    await validateExpenseExists(request, response, next);

    const data = response._getJSONData();
    expect(response.statusCode).toBe(404);
    expect(data).toEqual({ error: "No existe gasto con este ID" });
    expect(next).not.toHaveBeenCalled();
    expect(Expense.findByPk).toHaveBeenCalledWith(120);
  });

  it("should call next function if the expense exists", async () => {
    const request = createRequest({
      params: { expenseId: 1 },
    }) as Request<ExpenseParams>;

    const response = createResponse();
    const next = jest.fn();

    await validateExpenseExists(request, response, next);
    expect(Expense.findByPk).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(request.expense).toEqual(expenses[0])
  });

  it("should handle errors when validate the expense", async () => {
    (Expense.findByPk as jest.Mock).mockRejectedValue(new Error());

    const request = createRequest({
      params: { expenseId: 1 },
    }) as Request<ExpenseParams>;

    const response = createResponse();
    const next = jest.fn();

    await validateExpenseExists(request, response, next);

    const data = response._getJSONData();
    expect(response.statusCode).toBe(500);
    expect(data).toEqual({
      error: "Ha ocurrido un error al recuperar el gasto",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should prevent unauthorized user from creating an expense', async()=> {
    const request = createRequest({
      method: 'POST',
      url: "/api/budgets/:budgetId/expenses",
      budget: budgets[0],
      user: { id: 20 },
      body: { name: "Gasto de prueba", amount: 100 },
    })

    const response = createResponse();
    const next = jest.fn();

    validateBudgetOwner(request, response, next);
    const data = response._getJSONData();
    expect(response.statusCode).toBe(401);
    expect(data).toEqual({
      error: "No tienes permisos para ver este presupuesto",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
