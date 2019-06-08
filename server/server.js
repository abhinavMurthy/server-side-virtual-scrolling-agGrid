const express = require('express')
const app = express()
const fs = require('fs');
var path = require('path');

const port = 3100;
let databaseObj;
fs.readFile('data/transactions.json', (err, data) => {
    if (err) throw err;

    databaseObj = JSON.parse(data);


    app.get('/getPaginatedData', (request, response) => {
        var startRow = request.param('startRow');
        var endRow = request.param('endRow');
        console.log("startRow=>",startRow);
        console.log("endRow=>",endRow);

        var rowsThisPage = databaseObj.slice(startRow, endRow);
        var lastRow = databaseObj.length <= endRow ? databaseObj.length : -1;
        return response.send({
            success: true,
            rows: rowsThisPage,
            lastRow: lastRow
        });
    })
});
app.use('/', express.static(path.join(__dirname, '../dist/my-workspace')))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

