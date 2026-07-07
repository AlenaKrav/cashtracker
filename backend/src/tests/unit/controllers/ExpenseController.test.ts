import { createRequest, createResponse } from "node-mocks-http";
import { ExpensesController } from "../../../controllers/ExpensesController";
import { expenses } from "../../mocks/expenses";
import Expense from "../../../models/Expense";

jest.mock("../../../models/Expense", () => ({
  create: jest.fn(),
}));

describe("ExpensesController.create", () => {
  it("should create a new expense", async () => {
    const mockExpense = {
      save: jest.fn().mockResolvedValue(true),
    };

    (Expense.create as jest.Mock).mockResolvedValue(mockExpense);

    const request = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses",
      body: { name: "Gasto de prueba", amount: 100 },
      budget: { id: 1 },
    });

    const response = createResponse();
    await ExpensesController.createExpense(request, response);
    const data = response._getJSONData();
    expect(response.statusCode).toBe(201);
    expect(data).toEqual({ message: "Gasto creado correctamente" });
    expect(mockExpense.save).toHaveBeenCalled();
    expect(mockExpense.save).toHaveBeenCalledTimes(1);
    expect(Expense.create).toHaveBeenNthCalledWith(1, request.body);
  });

  it("should handle errores when creating a new expense", async () => {
    const mockExpense = {
      save: jest.fn(),
    };

    (Expense.create as jest.Mock).mockRejectedValue(new Error());

    const request = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses",
      body: { name: "Gasto de prueba", amount: 100 },
      budget: { id: 1 },
    });

    const response = createResponse();

    await ExpensesController.createExpense(request, response);

    const data = response._getJSONData();
    expect(response.statusCode).toBe(500);
    expect(data).toEqual({ error: "Ha ocurrido un error al crear el gasto" });
    expect(mockExpense.save).not.toHaveBeenCalled();
    expect(Expense.create).toHaveBeenNthCalledWith(1, request.body);
  });
});

describe("ExpensesController.getExpenseById", () => {
  it("should return the expense with ID 1", async () => {
    const request = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expenses[0],
    });

    const response = createResponse();

    await ExpensesController.getExpenseById(request, response);
    const data = response._getJSONData();
    expect(response.statusCode).toBe(200);
    expect(data).toEqual(expenses[0]);
  });
});


describe("ExpensesController.updateExpenseById", () => {
    const mockExpense = {
    ...expenses[0],
      update: jest.fn().mockResolvedValue(true),
    };

  it("should update the expense", async () => {
    const request = createRequest({
      method: "PUT",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: mockExpense,
      body: {name: "Nuevo gasto", amount: 200}
    });

    const response = createResponse();

    await ExpensesController.updateExpenseById(request, response);
    const data = response._getJSONData();
    expect(response.statusCode).toBe(200);
    expect(data).toEqual({ message: "Gasto actualizado correctamente" });
    expect(mockExpense.update).toHaveBeenCalled();
    expect(mockExpense.update).toHaveBeenCalledWith(request.body);
    expect(mockExpense.update).toHaveBeenCalledTimes(1);
  });
});


describe("ExpensesController.deleteExpenseById", () => {
    const mockExpense = {
    ...expenses[0],
      destroy: jest.fn().mockResolvedValue(true),
    };

  it("should delete the expense", async () => {
    const request = createRequest({
      method: "DELETE",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: mockExpense,
    });

    const response = createResponse();

    await ExpensesController.deleteExpenseById(request, response);
    const data = response._getJSONData();
    expect(response.statusCode).toBe(200);
    expect(data).toEqual({ message: "Gasto borrado correctamente" });
    expect(mockExpense.destroy).toHaveBeenCalled();
    expect(mockExpense.destroy).toHaveBeenCalledTimes(1);
  });
});
