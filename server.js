const express = require('express')
const app = express()
const fs = require('fs');
var path = require('path');

const port = 3100
let student;

app.get('/testData', (req, res) => {
fs.readFile('testData.json', (err, data) => {  
    if (err) throw err;
     this.student = JSON.parse(data);
    console.log(student);
});
return res.send(this.student);
})
// yay!
app.use('/', express.static(path.join(__dirname, './dist/my-workspace')))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

