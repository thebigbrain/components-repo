const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// const multer = require('multer'); // v1.0.5
// const upload = multer(); // for parsing multipart/form-data

const main = require('./main');

function loadMiddleWares(app) {
  for (let k in main) {
    app.use(`/${k}`, main[k]);
  }
}

const app = express();

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.raw({type: 'application/zip'}));
// app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// app.post('/upload', upload.any(), main.upload);

loadMiddleWares(app);

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
