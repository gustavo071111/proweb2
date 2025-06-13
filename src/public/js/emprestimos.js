document.addEventListener("DOMContentLoaded", carregarEmprestimos);

async function carregarEmprestimos() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/emprestimos/meus", {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const emprestimos = await res.json();
  const lista = document.getElementById("lista-emprestimos");
  lista.innerHTML = "";

  emprestimos.forEach(emp => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${emp.titulo}</h4>
      <p>Data Empréstimo: ${new Date(emp.data_emprestimo).toLocaleDateString()}</p>
      <p>Devolução Prevista: ${new Date(emp.data_devolucao_prevista).toLocaleDateString()}</p>
      <p>Devolução Real: ${emp.data_devolucao_real ? new Date(emp.data_devolucao_real).toLocaleDateString() : '---'}</p>
      <p>Status: ${emp.status}</p>
      <hr>
    `;
    lista.appendChild(div);
  });
}
