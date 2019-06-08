const express = require('express')
const app = express()
const fs = require('fs');
var path = require('path');

const port = 3100;
/**
 * Mongo Database Connection
 */
var MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017', function(err, client) {
  if (err) throw err

  var db = client.db('bank_example')

  app.get('/transactions', (request, response) => {
    var startRow = parseInt(request.param('startRow'));
    var endRow = parseInt(request.param('endRow'));

    db.collection('transactions').find().skip(startRow).limit(endRow).toArray(function(err, result) {

      const length = db.collection('transactions').count();
      var lastRow = length <= endRow ? length : -1;
      return response.send({
        success: true,
        rows: result,
        lastRow: lastRow
      });
    })
  });

  app.use('/', express.static(path.join(__dirname, './dist/my-workspace')));
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
