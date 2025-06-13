document.addEventListener("DOMContentLoaded", () => {
  carregarLivros();
  carregarEmprestimos();
});

async function carregarLivros() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/livros", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const livros = await res.json();
  const lista = document.getElementById("lista-livros");
  lista.innerHTML = "";

  livros.forEach(livro => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${livro.titulo}</h4>
      <p>Autor: ${livro.autor}</p>
      <p>Ano: ${livro.ano_publicacao || '---'}</p>
      <p>Disponíveis: ${livro.quantidade_disponivel}</p>
      <button onclick="solicitarEmprestimo(${livro.id})">Emprestar</button>
      <hr>
    `;
    lista.appendChild(div);
  });
}

async function solicitarEmprestimo(livro_id) {
  const token = localStorage.getItem("token");
  const data = prompt("Data prevista para devolução (AAAA-MM-DD):");
  if (!data) return;

  const res = await fetch("/api/emprestimos", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ livro_id, data_devolucao_prevista: data })
  });

  const json = await res.json();
  alert(json.mensagem);
  carregarLivros(); // Atualiza lista de livros após empréstimo
  carregarEmprestimos(); // Atualiza lista de empréstimos
}

async function carregarEmprestimos() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/leitor/meus", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const emprestimos = await res.json();
  const lista = document.getElementById("lista-emprestimos");
  lista.innerHTML = "";

  emprestimos.forEach(emp => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${emp.titulo}</h4>
      <p>Data Empréstimo: ${new Date(emp.data_emprestimo).toLocaleDateString()}</p>
      <p>Prevista: ${new Date(emp.data_devolucao_prevista).toLocaleDateString()}</p>
      <p>Devolução Real: ${emp.data_devolucao_real ? new Date(emp.data_devolucao_real).toLocaleDateString() : '---'}</p>
      <p>Status: ${emp.status}</p>
      <hr>
    `;
    lista.appendChild(div);
  });
}
