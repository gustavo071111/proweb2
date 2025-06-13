document.addEventListener("DOMContentLoaded", carregarLivros);

async function carregarLivros() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/livros", {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const livros = await res.json();
  const lista = document.getElementById("lista-livros");
  lista.innerHTML = "";

  livros.forEach(livro => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${livro.titulo}</h3>
      <p>Autor: ${livro.autor}</p>
      <p>Ano: ${livro.ano_publicacao || '---'}</p>
      <p>Disponíveis: ${livro.quantidade_disponivel}</p>
      <button onclick="emprestarLivro(${livro.id})">Emprestar</button>
      <hr>
    `;
    lista.appendChild(div);
  });
}

async function emprestarLivro(livro_id) {
  const token = localStorage.getItem("token");
  const data = prompt("Data prevista para devolução (AAAA-MM-DD):");
  if (!data) return;

  const res = await fetch("/api/emprestimos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ livro_id, data_devolucao_prevista: data })
  });

  const json = await res.json();
  alert(json.mensagem);
}
