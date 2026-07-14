import request from "supertest";
import server, { connectDB } from "../../server";
import { AuthController } from "../../controllers/AuthControllers";
import { body } from "express-validator";
import User from "../../models/User";
import * as authUtils from "../../utils/auth";
import * as jwtUtils from "../../utils/jwt";

describe("Athentication - Create Account", () => {
  beforeAll(async () => {
    await connectDB();
  });

  it("should display validation errors when form is empty", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({});

    const createAccountMock = jest.spyOn(AuthController, "createAccount"); //es parecido al haber hecho mock de la funcion

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(3);
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  it("should return 404 and validation errors when the email is invalid", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "Helen",
        password: "12345678",
        email: "not_valid_email",
      });

    const createAccountMock = jest.spyOn(AuthController, "createAccount");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toEqual("E-mail no válido");
    expect(response.status).not.toBe(201);
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  it("should display validation error when the password is less than 8 characters", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "Helen",
        password: "1234567",
        email: "test@test.com",
      });

    const createAccountMock = jest.spyOn(AuthController, "createAccount");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toEqual(
      "La contraseña debe tener mínimo 8 caracteres",
    );
    expect(response.body.errors).toHaveLength(1);
    expect(response.status).not.toBe(201);
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  it("should return 201 when the user successfully created an account", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "Cristina",
        password: "12345678",
        email: "Cristina@gmail.com",
      });

    expect(response.status).toBe(201);
    expect(response.body).not.toHaveProperty("errors");
    expect(response.body.message).toEqual("Usuario creado correctamente");
    expect(response.status).not.toBe(400);
  });

  it("should return 409 when the user already exists", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "Cristina",
        password: "12345678",
        email: "Cristina@gmail.com",
      });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty(
      "error",
      "Este usuario ya está registrado",
    );
    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(401);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("Authentication - Account Confirmation with a token", () => {
  it("should display an error if token is empty or it is not valid", async () => {
    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({
        token: "not_valid_token",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Token no válido");
  });

  it("should display an error if token is not valid", async () => {
    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({
        token: "123456",
      });

    expect(response.status).toBe(401);
    expect(response.status).not.toBe(200);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Token no válido");
  });

  it("should display an error if token is not valid", async () => {
    const token = globalThis.cashTrackerConfirmationToken;
    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({ token });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Cuenta confirmada correctamente");
  });
});

describe("Authentication - Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should display validation errors when the login is empty", async () => {
    const response = await request(server).post("/api/auth/login").send({});

    const loginMock = jest.spyOn(AuthController, "login");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);
    expect(response.body.errors).not.toHaveLength(1);
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("should display validation errors when the login is empty", async () => {
    const response = await request(server).post("/api/auth/login").send({});

    const loginMock = jest.spyOn(AuthController, "login");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);
    expect(response.body.errors).not.toHaveLength(1);
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("should display validation errors when the email is not valid", async () => {
    const response = await request(server).post("/api/auth/login").send({
      email: "not_valid_email",
      password: "12345678",
    });

    const loginMock = jest.spyOn(AuthController, "login");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("E-mail no válido");
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("should return validation errors when the email is not valid", async () => {
    const response = await request(server).post("/api/auth/login").send({
      email: "Cristina2@gmail.com",
      password: "12345678",
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Usuario no encontrado");
  });

  it("should return 403 error when a user account is not confirmed", async () => {
    (jest.spyOn(User, "findOne") as jest.Mock).mockResolvedValue({
      id: 1,
      confirmed: false,
      password: "hashedPassword",
      email: "user_not_confirmed@test.com",
    });

    const response = await request(server).post("/api/auth/login").send({
      email: "user_not_confirmed@test.com",
      password: "password",
    });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      "error",
      "La cuenta no ha sido confirmada",
    );
    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(200);
  });

  //LA 2º VERSIÓN DEL TEST AB
  it("should return error when a user account is not confirmed", async () => {
    const userData = {
      name: "Test",
      email: "user_not_confirmed@test.com",
      password: "password",
    };

    //1. Registramos al user
    await request(server).post("/api/auth/create-account").send({
      userData,
    });
    //2. Nos logueamos con el mismo user
    const response = await request(server).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      "error",
      "La cuenta no ha sido confirmada",
    );
    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(200);
  });

  it("should 401 when user's password is not correct", async () => {
    const mockedFindOne = (
      jest.spyOn(User, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: 1,
      confirmed: true,
      password: "hashedPassword",
    });

    const mockedVeryPassword = jest
      .spyOn(authUtils, "verifyPassword")
      .mockResolvedValue(false);

    const response = await request(server).post("/api/auth/login").send({
      email: "Cristina@gmail.com",
      password: "wrong_password",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Password incorrecto");
    expect(mockedFindOne).toHaveBeenCalledTimes(1);
    expect(mockedVeryPassword).toHaveBeenCalledTimes(1);
  });

  it("should return 200 and generate jwr when user successfully logged in", async () => {
    const mockedFindOne = (
      jest.spyOn(User, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: 1,
      confirmed: true,
      password: "hashedPassword",
    });

    const mockedVeryPassword = jest
      .spyOn(authUtils, "verifyPassword")
      .mockResolvedValue(true);
    const generateJWT = jest
      .spyOn(jwtUtils, "generateJWT")
      .mockReturnValue("jwt_token");

    const response = await request(server).post("/api/auth/login").send({
      email: "Cristina@gmail.com",
      password: "correctPassword",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Logueado correctamente");
    expect(response.body).toHaveProperty("token", "jwt_token");
    expect(mockedFindOne).toHaveBeenCalledTimes(1);
    expect(mockedVeryPassword).toHaveBeenCalledTimes(1);
    expect(mockedVeryPassword).toHaveBeenCalledWith(
      "correctPassword",
      "hashedPassword",
    );
    expect(generateJWT).toHaveBeenCalledWith(1); //el id del user con el que llamamos la función
  });
});

//declaramos la variable global para que esté diusponible en diferentes suits de pruebas
let jwt: string;
async function authenticateUser() {
  //simulamos el logueo
  const response = await request(server).post("/api/auth/login").send({
    email: "Cristina@gmail.com",
    password: "12345678",
  });

  //obtenemos el jwt tras un logue exitoso
  jwt = response.body.token;
  expect(response.status).toBe(200);
}

describe("GET /api/budgets", () => {
  beforeAll(() => {
    jest.restoreAllMocks(); //restaura las funciones del los hest.spy a su implementacion original
  });

  beforeAll(async () => {
    await authenticateUser();
  });

  it("should return an error and reject unauthenticated user request", async () => {
    const response = await request(server).get("/api/budgets");

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual("Acceso no autorizado");
  });

  it("should return 200 when user has jwt when accessing budgets", async () => {
    const response = await request(server)
      .get("/api/budgets")
      .auth(jwt, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("budgets");
    expect(response.status).not.toBe(401);
    expect(response.body.error).not.toEqual("Acceso no autorizado");
  });

  it("should return 500 when user jwt is not valid", async () => {
    const response = await request(server)
      .get("/api/budgets")
      .auth("not_valid_jwt", { type: "bearer" });

    expect(response.status).toBe(500);
    expect(response.body.error).not.toEqual("invalid token");
  });
});

describe("POST /api/budgets", () => {
  beforeAll(async () => {
    await authenticateUser();
  });

  it("should return an error and reject unauthenticated user request to create a budget", async () => {
    const response = await request(server).post("/api/budgets");

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual("Acceso no autorizado");
  });

  it("should return validation error when the form is empty", async () => {
    const response = await request(server)
      .post("/api/budgets")
      .auth(jwt, { type: "bearer" })
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(4);
  });

  it("should return validation error when the amount is negative number", async () => {
    const response = await request(server)
      .post("/api/budgets")
      .auth(jwt, { type: "bearer" })
      .send({
        name: "Regalo de aniversario",
        amount: -1,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toEqual(
      "El valor numérico de presupuesto debe ser positivo",
    );
  });

  it("should return 200 and creat a budget", async () => {
    const response = await request(server)
      .post("/api/budgets")
      .auth(jwt, { type: "bearer" })
      .send({
        name: "Budget test",
        amount: 3000,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Presupuesto creado correctamente",
    );
  });
});

describe("GET /api/budgets/:id", () => {
  beforeAll(async () => {
    await authenticateUser();
  });

  it("should return an error and reject unauthenticated user request for bugetId", async () => {
    const response = await request(server).get("/api/budgets/1");

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual("Acceso no autorizado");
  });

  it("should return validation errors when bugetId is invalid", async () => {
    const response = await request(server)
      .get("/api/budgets/not_valid")
      .auth(jwt, { type: "bearer" });

    expect(response.status).toBe(400);
    expect(response.status).not.toBe(401);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toBeTruthy();
  });

  it("should return 404 when budget doesn't exist", async () => {
    const response = await request(server)
      .get("/api/budgets/22")
      .auth(jwt, { type: "bearer" });

    expect(response.status).toBe(404);
    expect(response.status).not.toBe(400);

    expect(response.body).toHaveProperty(
      "error",
      "No existe presupuesto con este ID",
    );
  });

  it("should return a single budget by its id", async () => {
    const response = await request(server)
      .get("/api/budgets/1")
      .auth(jwt, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
  });
});

describe("PUT /api/budgets/:id", () => {
  beforeAll(async () => {
    await authenticateUser();
  });

  it("should return validation error when the budget update form is empty", async () => {
    const response = await request(server)
      .put("/api/budgets/1")
      .auth(jwt, { type: "bearer" })
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(4);
  });

  it("should update a single budget by its id", async () => {
    const response = await request(server)
      .put("/api/budgets/1")
      .send({ name: "Vacaciones de verano - Chipiona", amount: 500 })
      .auth(jwt, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Regsitro actualizado correctamente",
    );
  });
});

describe("DELETE /api/budgets/:id", () => {
  beforeAll(async () => {
    await authenticateUser();
  });

  it("should return an error and reject unauthenticated user request when deleting a budget", async () => {
    const response = await request(server).delete("/api/budgets/1");

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual("Acceso no autorizado");
  });

  it("should return validation errors when bugetId is invalid", async () => {
    const response = await request(server)
      .delete("/api/budgets/not_valid")
      .auth(jwt, { type: "bearer" });

    expect(response.status).toBe(400);
    expect(response.status).not.toBe(401);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toBeTruthy();
  });

  it("should return 404 when budget doesn't exist", async () => {
    const response = await request(server)
      .delete("/api/budgets/22")
      .auth(jwt, { type: "bearer" });

    expect(response.status).toBe(404);
    expect(response.status).not.toBe(400);

    expect(response.body).toHaveProperty(
      "error",
      "No existe presupuesto con este ID",
    );
  });

  it("should delete a single budget by its id", async () => {
    const response = await request(server)
      .delete("/api/budgets/1")
      .auth(jwt, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Regsitro borrado correctamente",
    );
  });
});
