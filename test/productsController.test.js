const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../src/server'); // Supondo que o arquivo do servidor Express seja app.js ou index.js
const mongoose = require('mongoose');
const Product = require('../src/models/productModel');
const productsController = require('../src/controller/productsController');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Testes dos Endpoints do Controlador de Produtos', () => {
  let sandbox;

  // Antes de cada teste, crie um novo sandbox para utilizar o Sinon
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  // Após cada teste, restaure o sandbox para evitar efeitos colaterais
  afterEach(() => {
    sandbox.restore();
  });

  // Teste do endpoint GET (Recuperar um produto por código)
  describe('GET /products/:code', () => {
    it('Deve retornar um produto válido quando o ID é válido', async () => {
      const productData = {
        code: 123456789,
        product_name: 'Produto de Teste',
        categories: ['Categoria1', 'Categoria2'],
      };

      // Criar um stub para simular a consulta ao banco de dados
      const productStub = sandbox.stub(Product, 'findOne').resolves(productData);

      const req = { params: { code: productData.code } };
      const res = {
        json: sandbox.stub(),
        status: sandbox.stub().returnsThis(), // Para permitir o encadeamento de chamadas (res.status(200).json(...))
      };

      await productsController.getProductByCode(req, res);

      // Verificar se a resposta foi enviada corretamente
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(productData)).to.be.true;

      // Verificar se a consulta ao banco de dados foi chamada com os parâmetros corretos
      expect(productStub.calledWithExactly({ code: productData.code })).to.be.true;
    });

    it('Deve retornar status 404 quando o ID do produto não existe', async () => {
      // Criar um stub que retorna null para simular a consulta a um produto inexistente
      const productStub = sandbox.stub(Product, 'findOne').resolves(null);

      const req = { params: { code: 'nao_existe' } };
      const res = {
        json: sandbox.stub(),
        status: sandbox.stub().returnsThis(),
      };

      await productsController.getProductByCode(req, res);

      // Verificar se a resposta foi enviada corretamente
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      // Verificar se a consulta ao banco de dados foi chamada com os parâmetros corretos
      expect(productStub.calledWithExactly({ code: 'nao_existe' })).to.be.true;
    });
  });

  // Teste do endpoint PUT (Atualizar um produto por código)
  describe('PUT /products/:code', () => {
    it('Deve atualizar os detalhes de um produto quando o ID é válido', async () => {
      const productData = {
        code: 123456789,
        product_name: 'Produto de Teste',
        categories: ['Categoria1'],
      };

      // Criar um stub para simular a atualização no banco de dados
      const updateOneStub = sandbox.stub(Product, 'updateOne').resolves({ nModified: 1 });

      const req = { params: { code: productData.code }, body: { product_name: 'Produto Atualizado', categories: ['Categoria1', 'Categoria2'] } };
      const res = {
        json: sandbox.stub(),
        status: sandbox.stub().returnsThis(),
      };

      await productsController.updateProductByCode(req, res);

      // Verificar se a resposta foi enviada corretamente
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Produto atualizado com sucesso' })).to.be.true;

      // Verificar se a atualização no banco de dados foi chamada com os parâmetros corretos
      expect(updateOneStub.calledWithExactly({ code: productData.code }, { product_name: 'Produto Atualizado', categories: ['Categoria1', 'Categoria2'] })).to.be.true;
    });

    it('Deve retornar status 404 quando tentar atualizar um produto com ID inexistente', async () => {
      // Criar um stub que retorna nModified = 0 para simular a tentativa de atualização de um produto inexistente
      const updateOneStub = sandbox.stub(Product, 'updateOne').resolves({ nModified: 0 });

      const req = { params: { code: 'nao_existe' }, body: { product_name: 'Produto Atualizado', categories: ['Categoria1', 'Categoria2'] } };
      const res = {
        json: sandbox.stub(),
        status: sandbox.stub().returnsThis(),
      };

      await productsController.updateProductByCode(req, res);

      // Verificar se a resposta foi enviada corretamente
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      // Verificar se a atualização no banco de dados foi chamada com os parâmetros corretos
      expect(updateOneStub.calledWithExactly({ code: 'nao_existe' }, { product_name: 'Produto Atualizado', categories: ['Categoria1', 'Categoria2'] })).to.be.true;
    });
  });
});
