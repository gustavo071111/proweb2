document.addEventListener("DOMContentLoaded", () => {
  listarLivros();
  document.getElementById("btn-buscar").addEventListener("click", carregarEmprestimos);

  const form = document.getElementById("livroForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("livroId").value;
    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const ano_publicacao = document.getElementById("ano_publicacao").value.trim() || null;
    const quantidade_disponivel = document.getElementById("quantidade_disponivel").value.trim();

    if (!titulo || !autor || quantidade_disponivel === "") {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const url = id ? `/api/livros/${id}` : "/api/livros";
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo, autor, ano_publicacao, quantidade_disponivel }),
      });

      if (!res.ok) throw new Error("Erro ao salvar livro");

      alert("Livro salvo com sucesso!");
      form.reset();
      document.getElementById("livroId").value = "";
      listarLivros();
    } catch (err) {
      alert(err.message);
    }
  });
});

async function listarLivros() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("/api/livros", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erro ao carregar livros");
    const livros = await res.json();

    const container = document.getElementById("lista-livros");
    container.innerHTML = "";

    livros.forEach((livro) => {
      const div = document.createElement("div");
      div.classList.add("livro-card");
      div.innerHTML = `
        <h4>${livro.titulo}</h4>
        <p><strong>Autor:</strong> ${livro.autor}</p>
        <p><strong>Ano:</strong> ${livro.ano_publicacao || "N/A"}</p>
        <p><strong>Disponíveis:</strong> ${livro.quantidade_disponivel}</p>
        <button onclick="editarLivro(${livro.id})">Editar</button>
        <button onclick="removerLivro(${livro.id})">Remover</button>
        <hr>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    document.getElementById("lista-livros").innerText = "Erro ao carregar livros.";
  }
}

async function editarLivro(id) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`/api/livros/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Livro não encontrado");
    const livro = await res.json();

    document.getElementById("livroId").value = livro.id;
    document.getElementById("titulo").value = livro.titulo;
    document.getElementById("autor").value = livro.autor;
    document.getElementById("ano_publicacao").value = livro.ano_publicacao || "";
    document.getElementById("quantidade_disponivel").value = livro.quantidade_disponivel;
  } catch (err) {
    alert(err.message);
  }
}

async function removerLivro(id) {
  const token = localStorage.getItem("token");
  if (!confirm("Confirma remover este livro?")) return;

  try {
    const res = await fetch(`/api/livros/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erro ao remover livro");

    alert("Livro removido com sucesso");
    listarLivros();
  } catch (err) {
    alert(err.message);
  }
}

// Suas funções existentes para empréstimos, mantidas conforme seu código original:
async function carregarEmprestimos() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("/api/emprestimos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Erro ao carregar empréstimos");

    const emprestimos = await res.json();
    const painel = document.getElementById("painel-emprestimos");
    painel.innerHTML = "";

    emprestimos.forEach((emp) => {
      const div = document.createElement("div");
      div.classList.add("emprestimo-card");
      div.innerHTML = `
        <h4>${emp.titulo} - ${emp.leitor}</h4>
        <p><strong>Data Empréstimo:</strong> ${new Date(emp.data_emprestimo).toLocaleDateString()}</p>
        <p><strong>Devolução Prevista:</strong> ${new Date(emp.data_devolucao_prevista).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${emp.status}</p>
        ${
          emp.status === "ativo" || emp.status === "atrasado"
            ? `<button onclick="marcarDevolucao(${emp.id})">Marcar como devolvido</button>`
            : ""
        }
        <hr>
      `;
      painel.appendChild(div);
    });
  } catch (erro) {
    console.error("Erro ao buscar empréstimos:", erro);
    document.getElementById("painel-emprestimos").innerText = "Erro ao carregar dados.";
  }
}

async function marcarDevolucao(id) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`/api/emprestimos/${id}/devolver`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Erro ao marcar devolução");

    carregarEmprestimos();
  } catch (err) {
    alert("Erro ao marcar devolução.");
    console.error(err);
  }
}
