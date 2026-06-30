import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../mocks/budgets";
//Importan el controlador que vas a probar y el modelo que vas a simular
import { BudgetController } from "../../controllers/BudgetController";
import Budget from "../../models/Budget";

//"no uses el modelo real de Budget, usa un fake"
jest.mock("../../models/Budget", () => ({
  //crea una función simulada, porque no queremos que el test acceda a la BD real. Quieres controlar exactamente qué devuelve
  //ESTA ES UN FUNCION DE MODELO
  findAll: jest.fn(),
}));

describe("BudgetController.getAll", () => {
  //funcion que se va a ejecutar antes de CADA UNO DE LOS TESTSA
  beforeEach(() => {
    //reiniciamos el mock antes de que se inicie cada una de las pruebas, ya que lo mocks son persistentes
    (Budget.findAll as jest.Mock).mockReset();
    //mockeamos la implementacion de la funcion controlador
    (Budget.findAll as jest.Mock).mockImplementation((options) => {
        const updatedBudgets = budgets.filter(
          (budget) => budget.userId === options.where.userId,
        );
        return Promise.resolve(updatedBudgets);
      });
  });

  it("Should retrieve 2 budgets for user with ID 1", async () => {
    const request = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 1 },
    });
    const response = createResponse();

    //simulamos el filtro where
    // const updatedBudgets = budgets.filter(
    //   (budget) => budget.userId === request.user.id,
    // );

    /** as jest.Mock
      TypeScript ve Budget.findAll como un método cualquiera.
      El as jest.Mock le dice al compilador “trátalo como una función mock de Jest”.
      Sin eso, mockResolvedValue no compilaría porque TS no sabe que findAll es un mock.
    */
    //le dice al mock de Budget.findAll que cuando sea llamado, resuelva la promesa con los presupuestos filtrados. Así reemplazas la llamada real a la base de datos.
    // (Budget.findAll as jest.Mock).mockResolvedValue(updatedBudgets);

    //ejecuta la funcion real del controlador
    await BudgetController.getAllBudgets(request, response); //cuando alguien haga await Budget.findAll(...), el resultado será updatedBudgets

    const data = response._getJSONData(); //data aqui es un objeto, pero letngth solo se aplica a arrays por eso en vez de data se usa data.budget
    expect(data.budgets).toHaveLength(2);
    expect(response.statusCode).toBe(200);
    expect(response.statusCode).not.toBe(404);
  });

  it("Should retrieve 1 budgets for user with ID 2", async () => {
    const request = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 2 },
    });
    const response = createResponse();
    await BudgetController.getAllBudgets(request, response);
    const data = response._getJSONData();
    expect(data.budgets).toHaveLength(1);
    expect(response.statusCode).toBe(200);
    expect(response.statusCode).not.toBe(404);
  });

  //Aqui testeamos la parte del catch del controlador
  it("Should handle errors when fetching budgets", async () => {
    const request = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 100 },
    });
    const response = createResponse();
    //fuerza el error, al ejecuta el controlador se va directo al catch
    (Budget.findAll as jest.Mock).mockRejectedValue(new Error)
    await BudgetController.getAllBudgets(request, response);
    expect(response.statusCode).toBe(500);
    expect(response._getJSONData()).toEqual({ error: "Ha ocurrido un error al obtener los presupuestos" })

  });
});
