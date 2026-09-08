jest.mock("../src/db/pool", () => ({
  query: jest.fn(),
}));

const pool = require("../src/db/pool");
const {
  getAuthorById,
  createAuthor,
} = require("../src/services/authorsService");
const {
  getPostsByAuthorId,
  createPost,
} = require("../src/services/postsService");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("authorsService", () => {
  test("getAuthorById utiliza una consulta parametrizada", async () => {
    const author = { id: 1, name: "Ana", email: "ana@example.com" };
    pool.query.mockResolvedValue({ rows: [author] });

    await expect(getAuthorById(1)).resolves.toEqual(author);
    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("WHERE id = $1"), [1]);
  });

  test("createAuthor envía los datos separados del texto SQL", async () => {
    const author = { id: 3, name: "Laura", email: "laura@example.com", bio: null };
    pool.query.mockResolvedValue({ rows: [author] });

    await expect(
      createAuthor({ name: "Laura", email: "laura@example.com", bio: null })
    ).resolves.toEqual(author);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("VALUES ($1, $2, $3)"),
      ["Laura", "laura@example.com", null]
    );
  });
});

describe("postsService", () => {
  test("getPostsByAuthorId filtra con un parámetro y relaciona autores", async () => {
    const posts = [{ id: 1, author_id: 1, author_name: "Ana" }];
    pool.query.mockResolvedValue({ rows: posts });

    await expect(getPostsByAuthorId(1)).resolves.toEqual(posts);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("JOIN authors AS a"),
      [1]
    );
  });

  test("createPost aplica false como valor predeterminado", async () => {
    const post = { id: 1, author_id: 1, title: "Título", content: "Contenido", published: false };
    pool.query.mockResolvedValue({ rows: [post] });

    await expect(
      createPost({ author_id: 1, title: "Título", content: "Contenido" })
    ).resolves.toEqual(post);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("VALUES ($1, $2, $3, $4)"),
      [1, "Título", "Contenido", false]
    );
  });
});
