import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthControllers";
import User from "../../../models/User";
import { hashPassword } from "../../../utils/auth";
import { generateToken } from "../../../utils/token";
import { AuthEmail } from "../../../emails/AuthEmail";

jest.mock("../../../models/User", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../../../utils/auth"); //al no poner que funciones moqueamos lo hace de todas en automatico
jest.mock("../../../utils/token");

describe("AuthController.createAccount", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return 409 status an error message if user already exists", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(true);
    const request = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        email: "test@test.com",
        password: "12345678",
      },
    });

    const response = createResponse();

    await AuthController.createAccount(request, response);
    const data = response._getJSONData();
    expect(response.statusCode).toBe(409);
    expect(data).toHaveProperty("error", "Este usuario ya está registrado");
    expect(User.findOne).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledTimes(1);
  });

  it("should register a new user and return 201 status and success message", async () => {

    const token = "token";
    const hashedPassword = "hashedpassword";


    const request = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        email: "test@test.com",
        password: "12345678",
        name: "Test user",
      },
    });

    const mockUser = {
      ...request.body,
      save: jest.fn().mockResolvedValue(true),
    };

    (User.create as jest.Mock).mockResolvedValue(mockUser); //es una funcion asincrona por ello se usa mockresolvedValue
    (hashPassword as jest.Mock).mockResolvedValue(hashedPassword); //es una funcion asincrona por ello se usa mockresolvedValue
    (generateToken as jest.Mock).mockReturnValue(token); //es una funcion sincrona y no hay que esperar por ello se usa mockReturnValue

    jest
      .spyOn(AuthEmail, "sendConfirmationEmail")
      .mockImplementation(() => Promise.resolve());

    const response = createResponse();

    await AuthController.createAccount(request, response);
    const data = response._getJSONData();


    expect(User.create).toHaveBeenCalledWith(request.body);
    expect(User.create).toHaveBeenCalledTimes(1);
    
    expect(response.statusCode).toBe(201);
    expect(data).toHaveProperty("message", "Usuario creado correctamente");

    expect(mockUser.save).toHaveBeenCalled();
    expect(mockUser.password).toBe(hashedPassword);
    expect(mockUser.token).toBe(token);
    expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
      name: request.body.name,
      email: request.body.email,
      token: token
    })

    expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
  });
});
