CREATE DATABASE biblioteca;
USE biblioteca;

drop DATABASE biblioteca;
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  perfil ENUM('bibliotecario', 'leitor') NOT NULL
);

CREATE TABLE livros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  autor VARCHAR(255) NOT NULL,
  ano_publicacao INT,
  quantidade_disponivel INT NOT NULL
);

CREATE TABLE emprestimos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  livro_id INT NOT NULL,
  leitor_id INT NOT NULL,
  data_emprestimo DATE NOT NULL,
  data_devolucao_prevista DATE NOT NULL,
  data_devolucao_real DATE,
  status ENUM('ativo', 'devolvido', 'atrasado') NOT NULL DEFAULT 'ativo',
  FOREIGN KEY (livro_id) REFERENCES livros(id),
  FOREIGN KEY (leitor_id) REFERENCES usuarios(id)
);
