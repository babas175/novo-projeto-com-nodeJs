const express = require('express');
const morgan = require('morgan');
const cron = require('node-cron');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const productsRouter = require('./routes/products');
const { CronJob } = require('./controller/cronJob');
const { connectDB } = require('./database/database');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(morgan('dev'));

// Middleware do Swagger para a rota '/api-docs'
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(productsRouter);

connectDB();

app.listen(port, async () => {
  console.log(`API em execução na porta ${port}`);
});

cron.schedule('0 2 * * *', () => {
  CronJob.updateData()
    .then(() => {
      console.log('Atualização de dados concluída');
    })
    .catch((error) => {
      console.error('Erro durante a atualização de dados:', error);
    });
});
