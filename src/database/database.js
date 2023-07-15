const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/admin';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family:4,
    });
    console.log('Conexão com o MongoDB estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
};

module.exports = connectDB;
