async function registrar() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const perfil = document.getElementById("perfil").value;

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome, email, senha, perfil })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Usuário registrado com sucesso!");
    window.location.href = "login.html";
  } else {
    alert("Erro: " + data.mensagem);
  }
}
