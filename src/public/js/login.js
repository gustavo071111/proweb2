async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, senha })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);

    // Redireciona com base no tipo de usuário
    if (data.perfil === "bibliotecario") {
      window.location.href = "painel.html";
    } else {
      window.location.href = "livros.html";
    }
  } else {
    alert("Erro: " + data.mensagem);
  }
}
