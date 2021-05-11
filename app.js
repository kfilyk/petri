const express = require('express');
const app = express()
const port = 3000; /* default express port */

app.use(express.static(__dirname+'/src'))
app.get('/', (req, res) => res.sendFile('index.html'))
app.listen(port, () => console.log('App listening on port ' + port))
