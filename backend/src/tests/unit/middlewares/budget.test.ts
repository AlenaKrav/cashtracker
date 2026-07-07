import type { Request } from "express";
import { createRequest, createResponse } from "node-mocks-http";
import {
  validateBudgetExists,
  validateBudgetOwner,
} from "../../../middleware/budget";
import type { BudgetParams } from "../../../middleware/budget";
import Budget from "../../../models/Budget";
import { budgets } from "../../mocks/budgets";

jest.mock("../../../models/Budget", () => ({
  findByPk: jest.fn(),
}));

describe("budget - validateBudgetExists", () => {
  it("should handle non-exisiting budget", async () => {
    (Budget.findByPk as jest.Mock).mockResolvedValue(null);

    const request = createRequest({
      params: {
        budgetId: "1",
      },
    }) as Request<BudgetParams>; // tenemos que tiparlo aqui ya que en el middleware estan tipados los params
    const response = createResponse();
    const next = jest.fn();

    await validateBudgetExists(request, response, next);
    const data = response._getJSONData();
    expect(response.statusCode).toBe(404);
    expect(data).toEqual({ error: "No existe presupuesto con este ID" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should proceed to the next function if the budget exists", async () => {
    (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0]);

    const request = createRequest({
      params: {
        budgetId: "1",
      },
    }) as Request<BudgetParams>;
    const response = createResponse();
    const next = jest.fn();

    await validateBudgetExists(request, response, next);
    expect(next).toHaveBeenCalled();
    expect(request.budget).toEqual(budgets[0]);
  });

  it("should handle errors when validating existing budget", async () => {
    (Budget.findByPk as jest.Mock).mockRejectedValue(new Error());

    const request = createRequest({
      params: {
        budgetId: "1",
      },
    }) as Request<BudgetParams>;

    const response = createResponse();
    const next = jest.fn();

    await validateBudgetExists(request, response, next);

    const data = response._getJSONData();
    expect(response.statusCode).toBe(500);
    expect(data).toEqual({
      error: "Ha ocurrido un error al recuperar el presupuesto",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("budget - validateBudgetOwner", () => {
  it("should handle when the user is not the owner of a source", () => {
    const request = createRequest({
      budget: budgets[0],
      user: { id: 2 },
    });

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

  it("should call next function when the user is owner of a source", () => {
    const request = createRequest({
      budget: budgets[0],
      user: { id: 1 },
    });

    const response = createResponse();
    const next = jest.fn();

    validateBudgetOwner(request, response, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
