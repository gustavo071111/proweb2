document.addEventListener("DOMContentLoaded", carregarEmprestimos);

async function carregarEmprestimos() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/emprestimos", {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const emprestimos = await res.json();
  const painel = document.getElementById("painel-emprestimos");
  painel.innerHTML = "";

  emprestimos.forEach(emp => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${emp.titulo} - ${emp.leitor}</h4>
      <p>Data Empréstimo: ${new Date(emp.data_emprestimo).toLocaleDateString()}</p>
      <p>Prevista: ${new Date(emp.data_devolucao_prevista).toLocaleDateString()}</p>
      <p>Status: ${emp.status}</p>
      ${emp.status === 'ativo' || emp.status === 'atrasado' ? `<button onclick="marcarDevolucao(${emp.id})">Marcar como devolvido</button>` : ''}
      <hr>
    `;
    painel.appendChild(div);
  });
}

async function marcarDevolucao(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`/api/emprestimos/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` }
  });

  const json = await res.json();
  alert(json.mensagem || 'Erro ao marcar devolução');
  carregarEmprestimos();
}
