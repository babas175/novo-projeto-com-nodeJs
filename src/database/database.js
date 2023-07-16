// src/database/database.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
    });
    console.log('Conexão com o MongoDB estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar com o MongoDB:', error);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('Conexão com o MongoDB encerrada com sucesso.');
  } catch (error) {
    console.error('Erro ao encerrar a conexão com o MongoDB:', error);
  }
};

module.exports = { connectDB, disconnectDB };
