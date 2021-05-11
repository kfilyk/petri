const express = require('express');
const app = express()
const PORT = process.env.PORT || 5000;; /* default express port */

app.use(express.static(__dirname+'/src'))
app.get('/', (req, res) => res.sendFile('index.html'))
app.listen(PORT, () => console.log('App listening on port ' + PORT))
