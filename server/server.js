const express = require('express')
const app = express()
const fs = require('fs');
var path = require('path');

const port = 3100;
/**
 * Mongo Database Connection
 */
const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017', function(err, client) {
  if (err) throw err

  const db = client.db('bank_example')

  app.get('/transactions', (request, response) => {
    const startRow = parseInt(request.param('startRow'));
    const endRow = parseInt(request.param('endRow'));
    const filterModel = JSON.parse(request.param('filterModel'));
    const sortModel = JSON.parse(request.param('sortModel'));

    let keyword;
    let column;
    Object.keys(filterModel).forEach( key => {
      keyword = filterModel[key].filter;
      column = key;
    });
    /**
     * MongoDB database query
     */
    db.collection('transactions')
      .find(keyword ? { [column]:  RegExp(keyword) } : {})
      .sort(sortModel.length >0 ? { [sortModel[0].colId]: sortModel && sortModel[0].sort === 'desc' ? -1 : 1} : undefined)
      .skip(startRow)
      .limit(endRow)
      .toArray(function(err, result) {

      const length = db.collection('transactions').count();
      const lastRow = length <= endRow ? length : -1;
      return response.send({
        success: true,
        rows: result,
        lastRow: lastRow
      });
    })
  });

  app.use('/', express.static(path.join(__dirname, '../dist/my-workspace')));
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
