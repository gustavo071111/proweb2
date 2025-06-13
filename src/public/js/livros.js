const token = localStorage.getItem('token');

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
};

async function listarLivros() {
  const res = await fetch('/api/livros', { headers });
  const livros = await res.json();

  const container = document.getElementById('lista-livros');
  container.innerHTML = '';

  livros.forEach((livro) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>${livro.titulo}</strong> - ${livro.autor} (${livro.ano_publicacao || 'Ano desconhecido'}) - Quantidade: ${livro.quantidade_disponivel}</p>
      <button onclick="editarLivro(${livro.id}, '${livro.titulo}', '${livro.autor}', ${livro.ano_publicacao || 0}, ${livro.quantidade_disponivel})">Editar</button>
      <button onclick="removerLivro(${livro.id})">Remover</button>
      <hr />
    `;
    container.appendChild(div);
  });
}

document.getElementById('livroForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('livroId').value;
  const titulo = document.getElementById('titulo').value;
  const autor = document.getElementById('autor').value;
  const ano_publicacao = parseInt(document.getElementById('ano_publicacao').value) || null;
  const quantidade_disponivel = parseInt(document.getElementById('quantidade_disponivel').value);

  const livro = { titulo, autor, ano_publicacao, quantidade_disponivel };

  if (id) {
    // Atualizar
    await fetch(`/api/livros/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(livro),
    });
  } else {
    // Adicionar
    await fetch('/api/livros', {
      method: 'POST',
      headers,
      body: JSON.stringify(livro),
    });
  }

  document.getElementById('livroForm').reset();
  document.getElementById('livroId').value = '';
  listarLivros();
});

function editarLivro(id, titulo, autor, ano, quantidade) {
  document.getElementById('livroId').value = id;
  document.getElementById('titulo').value = titulo;
  document.getElementById('autor').value = autor;
  document.getElementById('ano_publicacao').value = ano;
  document.getElementById('quantidade_disponivel').value = quantidade;
}

async function removerLivro(id) {
  if (confirm('Deseja realmente remover este livro?')) {
    await fetch(`/api/livros/${id}`, {
      method: 'DELETE',
      headers,
    });
    listarLivros();
  }
}

// Carrega lista ao iniciar a página
document.addEventListener('DOMContentLoaded', listarLivros);
