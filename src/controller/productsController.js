const Product = require('../models/productModel');
const os = require('os');
const CronJob  = require('./cronJob');
const mongoose = require('mongoose');

const getAPIDetails = async (req, res) => {
  try {
    const isConnected = await mongoose.connection.readyState === 1;
    const dbStatus = isConnected ? 'Conexão com a base de dados OK' : 'Falha na conexão com a base de dados';

    const lastCronRun = CronJob.lastCronRun; 

    const uptimeInSeconds = process.uptime();
    const uptimeInMinutes = uptimeInSeconds / 60;
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    res.status(200).json({ dbStatus, lastCronRun, uptimeInSeconds, uptimeInMinutes, totalMemory, freeMemory, usedMemory });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter os detalhes da API' });
  }
};
async function getProductByCode(req, res) {
  const code = req.params.code;

  try {
    const product = await Product.findOne({ code });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao obter o produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function updateProductByCode(req, res) {
  const code = req.params.code;
  const updatedProduct = req.body;

  try {
    const result = await Product.updateOne({ code }, updatedProduct);

    if (result.nModified === 1) {
      res.json({ message: 'Produto atualizado com sucesso' });
    } else {
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar o produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function deleteProductByCode(req, res) {
  const code = req.params.code;

  try {
    const result = await Product.updateOne({ code }, { status: 'trash' });

    if (result.nModified === 1) {
      res.json({ message: 'Produto removido com sucesso' });
    } else {
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao remover o produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function listProducts(req, res) {
  try {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(Number(limit));
    res.json(products);
  } catch (error) {
    console.error('Erro ao listar os produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = {
  getAPIDetails,
  getProductByCode,
  updateProductByCode,
  deleteProductByCode,
  listProducts,
};
