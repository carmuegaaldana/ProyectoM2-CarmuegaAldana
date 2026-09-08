const request = require("supertest");

jest.mock("../src/services/authorsService", () => ({
  getAllAuthors: jest.fn(),
  getAuthorById: jest.fn(),
  createAuthor: jest.fn(),
  updateAuthor: jest.fn(),
  deleteAuthor: jest.fn(),
}));

const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
} = require("../src/services/authorsService");

const app = require("../src/app");
beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /authors", () => {
  test("debe responder 200 y devolver los autores", async () => {
    const fakeAuthors = [
      {
        id: 1,
        name: "Ana Pérez",
        email: "ana@example.com",
        bio: "Autora de prueba",
      },
    ];

    getAllAuthors.mockResolvedValue(fakeAuthors);

    const response = await request(app).get("/authors");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeAuthors);
  });
});

describe("GET /authors/:id", () => {
  test("debe responder 200 cuando el autor existe", async () => {
    const fakeAuthor = {
      id: 1,
      name: "Ana Pérez",
      email: "ana@example.com",
      bio: "Autora de prueba",
    };

    getAuthorById.mockResolvedValue(fakeAuthor);

    const response = await request(app).get("/authors/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeAuthor);
  });

  test("debe responder 404 cuando el autor no existe", async () => {
    getAuthorById.mockResolvedValue(undefined);

    const response = await request(app).get("/authors/9999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Autor no encontrado",
    });
  });
});

describe("POST /authors", () => {
  test("debe responder 201 y crear un autor", async () => {
    const authorData = {
      name: "Laura Díaz",
      email: "laura@example.com",
      bio: "Autora de prueba",
    };

    const createdAuthor = {
      id: 3,
      ...authorData,
      created_at: "2026-09-08T12:00:00.000Z",
    };

    createAuthor.mockResolvedValue(createdAuthor);

    const response = await request(app)
      .post("/authors")
      .send(authorData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdAuthor);
    expect(createAuthor).toHaveBeenCalledWith(authorData);
  });

  test("debe responder 400 si faltan campos obligatorios", async () => {
    const response = await request(app)
      .post("/authors")
      .send({
        name: "",
        email: "",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Name y email son obligatorios",
    });
    expect(createAuthor).not.toHaveBeenCalled();
  });
});