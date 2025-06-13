window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastroForm');

  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const perfilSelect = document.getElementById('perfil');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value;
    const perfil = perfilSelect.value;

    if (!nome || !email || !senha || !perfil) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Email inválido.');
      return;
    }

    if (!['leitor', 'bibliotecario'].includes(perfil)) {
      alert('Perfil inválido.');
      return;
    }

    const dadosCadastro = { nome, email, senha, perfil };

    try {
      const resposta = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosCadastro),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Usuário registrado com sucesso!');
        form.reset();
        window.location.href = 'login.html';
      } else {
        alert('Erro: ' + (dados.mensagem || 'Não foi possível registrar.'));
        console.error('Erro no servidor:', dados);
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
  });
});
