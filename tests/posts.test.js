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
  getAllPosts,
  getPostById,
  getPostsByAuthorId,
  createPost,
  updatePost,
  deletePost,
} = require("../src/services/postsService");

const app = require("../src/app");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /posts", () => {
  test("debe responder 200 y devolver los posts", async () => {
    const fakePosts = [{ id: 1, author_id: 1, title: "Post", content: "Texto", published: true }];
    getAllPosts.mockResolvedValue(fakePosts);

    const response = await request(app).get("/posts");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakePosts);
  });
});

describe("GET /posts/:id", () => {
  test("debe responder 200 cuando el post existe", async () => {
    const fakePost = { id: 1, author_id: 1, title: "Post", content: "Texto", published: true };
    getPostById.mockResolvedValue(fakePost);

    const response = await request(app).get("/posts/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakePost);
  });
});

describe("GET /posts/author/:authorId", () => {
  test("debe responder 200 y devolver los posts del autor", async () => {
    const fakePosts = [{ id: 1, author_id: 1, title: "Post", content: "Texto", published: true }];
    getPostsByAuthorId.mockResolvedValue(fakePosts);

    const response = await request(app).get("/posts/author/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakePosts);
    expect(getPostsByAuthorId).toHaveBeenCalledWith(1);
  });

  test("debe responder 400 ante un ID de autor inválido", async () => {
    const response = await request(app).get("/posts/author/abc");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "ID de autor inválido" });
    expect(getPostsByAuthorId).not.toHaveBeenCalled();
  });
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
  test("debe responder 204 y eliminar un post", async () => {
    deletePost.mockResolvedValue({ id: 1 });

    const response = await request(app).delete("/posts/1");

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
    expect(deletePost).toHaveBeenCalledWith("1");
  });

  test("debe responder 404 si el post no existe", async () => {
    deletePost.mockResolvedValue(undefined);

    const response = await request(app).delete("/posts/9999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Post no encontrado",
    });
  });
});

describe("PUT /posts/:id", () => {
  test("debe responder 200 y actualizar un post", async () => {
    const postData = {
      author_id: 1,
      title: "Post actualizado",
      content: "Contenido actualizado",
      published: true,
    };
    const updatedPost = { id: 1, ...postData };
    updatePost.mockResolvedValue(updatedPost);

    const response = await request(app).put("/posts/1").send(postData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedPost);
    expect(updatePost).toHaveBeenCalledWith("1", postData);
  });
});
