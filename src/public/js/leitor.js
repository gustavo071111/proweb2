document.addEventListener("DOMContentLoaded", () => {
  carregarLivros();
  carregarEmprestimos();
});

async function carregarLivros() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa fazer login.");
    return;
  }

  const res = await fetch("/api/livros", {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const erro = await res.json();
    alert(`Erro ao carregar livros: ${erro.mensagem}`);
    return;
  }

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
  if (!token) {
    alert("Você precisa fazer login para solicitar empréstimos.");
    return;
  }

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

  if (res.ok) {
    carregarLivros();
    carregarEmprestimos();
  }
}

async function carregarEmprestimos() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa fazer login para ver seus empréstimos.");
    return;
  }

  const res = await fetch("/api/emprestimos/meus", {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const erro = await res.json();
    alert(`Erro ao carregar seus empréstimos: ${erro.mensagem}`);
    return;
  }

  const emprestimos = await res.json();
  const painel = document.getElementById("lista-emprestimos");
  painel.innerHTML = "";

  emprestimos.forEach(emp => {
    const div = document.createElement("div");
    div.classList.add("emprestimo-item");

    // Conteúdo do empréstimo
    div.innerHTML = `
      <h4>${emp.titulo}</h4>
      <p><strong>Data Empréstimo:</strong> ${new Date(emp.data_emprestimo).toLocaleDateString()}</p>
      <p><strong>Prevista:</strong> ${new Date(emp.data_devolucao_prevista).toLocaleDateString()}</p>
      <p><strong>Devolução Real:</strong> ${emp.data_devolucao_real ? new Date(emp.data_devolucao_real).toLocaleDateString() : '---'}</p>
      <p><strong>Status:</strong> ${emp.status}</p>
    `;

    // Botão "Devolver" se ainda estiver ativo
    if (emp.status === "ativo") {
      const btnDevolver = document.createElement("button");
      btnDevolver.textContent = "📤 Devolver";
      btnDevolver.onclick = () => devolverEmprestimo(emp.id);
      btnDevolver.classList.add("btn-devolver");
      div.appendChild(btnDevolver);
    }

    // Separador visual
    const hr = document.createElement("hr");
    div.appendChild(hr);

    painel.appendChild(div);
  });
  
}

async function marcarDevolucao(emprestimo_id) {
  if (!emprestimo_id) {
    console.error("ID do empréstimo não informado");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado.");
    return;
  }

  const confirmar = confirm("Deseja realmente devolver este livro?");
  if (!confirmar) return;

  try {
    const res = await fetch(`/api/emprestimos/${emprestimo_id}/devolver`, {
      method: "PUT", // mais comum usar PUT para atualizar
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      const erroJson = await res.json();
      alert(erroJson.mensagem || "Erro ao marcar devolução");
      return;
    }

    const json = await res.json();
    alert(json.mensagem);
    carregarEmprestimos();
  } catch (err) {
    alert("Erro na devolução.");
    console.error(err);
  }
}
