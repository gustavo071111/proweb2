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
  console.log("Resposta da API:", data);

  if (res.ok) {
    localStorage.setItem("token", data.token);

    if (data.perfil === "bibliotecario") {
      window.location.href = "bibliotecario.html";
    } else {
      window.location.href = "leitor.html";
    }
  } else {
    alert("Erro: " + data.mensagem);
  }
}
