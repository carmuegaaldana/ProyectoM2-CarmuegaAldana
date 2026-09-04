INSERT INTO authors (name, email, bio)
VALUES
  ('Ana Pérez', 'ana@example.com', 'Autora interesada en tecnología.'),
  ('Juan Gómez', 'juan@example.com', 'Autor y desarrollador web.');

INSERT INTO posts (author_id, title, content, published)
VALUES
  (1, 'Mi primer post', 'Este es el contenido de mi primer post.', TRUE),
  (1, 'Aprendiendo PostgreSQL', 'Estoy aprendiendo a trabajar con bases de datos.', FALSE),
  (2, 'Introducción a Node.js', 'En este post hablamos sobre Node.js.', TRUE);