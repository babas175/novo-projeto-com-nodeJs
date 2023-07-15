const axios = require('axios');
const { connect, connection } = require('mongoose');
const zlib = require('zlib');
const Product = require('../models/productModel');


let lastCronRun = null;

const setLastCronRun = (time) => {
  lastCronRun = time;
};

class CronJob {
  static async updateData() {
    try {
      const uri = 'mongodb://localhost:27017/admin'; 
      await connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4,
      });
      console.log('Conexão com o MongoDB estabelecida com sucesso !');

      const url = 'https://static.openfoodfacts.org/data/openfoodfacts-products.jsonl.gz';

      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });
      const decompressedData = zlib.gunzipSync(response.data).toString();

      const lines = decompressedData.split('\n');
      let count = 0; 
      for (const line of lines) {
        if (line.trim() !== '') {
          const product = JSON.parse(line);
          await Product.create({ ...product, imported_t: new Date(), status: 'draft' });
          console.log('Produto salvo:', product.code);
          count++;
          if (count === 100) {
            break;
          }
        }
      }

      setLastCronRun(new Date());

      console.log('Importação concluída');
    } catch (error) {
      console.error('Erro durante a importação:', error);
    } finally {
      await connection.close();
      console.log('Conexão com o MongoDB fechada.');
    }
  }
}

module.exports = { CronJob, lastCronRun };
