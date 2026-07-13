import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthControllers";
import User from "../../../models/User";
import { hashPassword, verifyPassword } from "../../../utils/auth";
import { generateToken } from "../../../utils/token";
import { AuthEmail } from "../../../emails/AuthEmail";
import { generateJWT } from "../../../utils/jwt";

jest.mock("../../../models/User", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../../../utils/auth"); //al no poner que funciones moqueamos lo hace de todas en automatico
jest.mock("../../../utils/token");
jest.mock("../../../utils/jwt");

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
    // expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
    //   name: request.body.name,
    //   email: request.body.email,
    //   token: token
    // })

    // expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
  });
});


describe("AuthController.login", () => {

  it("should return 404 when user doesn't exist", async () => {
  (User.findOne as jest.Mock).mockResolvedValue(null);
    
  const request = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "test@test.com",
        password: "12345678",
      },
    });

    const response = createResponse();

    await AuthController.login(request, response);
    const data = response._getJSONData();
    expect(response.statusCode).toBe(404);
    expect(data).toHaveProperty("error", "Usuario no encontrado"); //muy parecido a equalto
  });

  it("should return 403 when user's account has not been confirmed", async () => {
    const mockUser = {
      id: 1,
      email: "test@tes.com",
      password: "11233455",
      confirmed: false,
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const request = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "test@test.com",
        password: "12345678",
      },
    });

    const response = createResponse();

    await AuthController.login(request, response);
    const data = response._getJSONData();
    expect(response.statusCode).toBe(403);
    expect(data).toHaveProperty("error", "La cuenta no ha sido confirmada");
  });

  it("should return 401 when user's password doesn't match", async() => {
    const mockUser = {
      id: 1,
      email: "test@tes.com",
      password: "11233455",
      confirmed: true,
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (verifyPassword as jest.Mock).mockResolvedValue(false);
    

    const request = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "test@test.com",
        password: "12345678",
      },
    });

    const response = createResponse();

    await AuthController.login(request, response);
    const data = response._getJSONData();
    expect(response.statusCode).toBe(401);
    expect(data).toHaveProperty("error", "Password incorrecto");
    expect(verifyPassword).toHaveBeenCalledWith(request.body.password, mockUser.password);
    expect(verifyPassword).toHaveBeenCalledTimes(1);
  });


  it("should return 200 when user successfully logged in", async() => {
    const mockUser = {
      id: 1,
      email: "test@tes.com",
      password: "password",
      confirmed: true,
    };

    const request = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "test@test.com",
        password: "password",
      },
    });

    const response = createResponse();
    const jwt = 'fakejasonwebtoken';

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (verifyPassword as jest.Mock).mockResolvedValue(true);
    (generateJWT as jest.Mock).mockReturnValue(jwt);

    await AuthController.login(request, response);
    
    const data = response._getJSONData();

expect(response.statusCode).toBe(200);
expect(data).toEqual({
  message: "Logueado correctamente",
  token: jwt,
});
expect(generateJWT).toHaveBeenCalledWith(mockUser.id);
expect(data).toHaveProperty("message", "Logueado correctamente");
expect(data).toHaveProperty("token", jwt);
  });
});
