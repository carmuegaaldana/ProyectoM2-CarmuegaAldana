const request = require("supertest");

jest.mock("../src/services/postsService", () => ({
  getAllPosts: jest.fn(),
  getPostById: jest.fn(),
  getPostsByAuthorId: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
}));

const {
  createPost,
  deletePost,
} = require("../src/services/postsService");

const app = require("../src/app");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /posts", () => {
  test("debe responder 201 y crear un post", async () => {
    const postData = {
      author_id: 1,
      title: "Post de prueba",
      content: "Contenido de prueba",
      published: false,
    };

    const createdPost = {
      id: 4,
      ...postData,
      created_at: "2026-09-08T12:00:00.000Z",
    };

    createPost.mockResolvedValue(createdPost);

    const response = await request(app)
      .post("/posts")
      .send(postData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdPost);
    expect(createPost).toHaveBeenCalledWith(postData);
  });
});

describe("DELETE /posts/:id", () => {
  test("debe responder 404 si el post no existe", async () => {
    deletePost.mockResolvedValue(undefined);

    const response = await request(app).delete("/posts/9999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Post no encontrado",
    });
  });
});