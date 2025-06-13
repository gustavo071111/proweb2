const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const livroRoutes = require('./src/routes/livroRoutes');
const emprestimoRoutes = require('./src/routes/emprestimoRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'src', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'public', 'login.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/livros', livroRoutes);
app.use('/api/emprestimos', emprestimoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
