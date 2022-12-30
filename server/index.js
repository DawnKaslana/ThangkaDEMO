const cors = require('cors');
const express = require('express');
const app = express();
const mysql = require('./mysql');

app.use(cors());

app.listen(process.env.REACT_APP_SERVER_PORT, () => {
  console.log(`App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`);
});

app.get('/', (req, res) => {
  res.send('OUO')
});


//Connect Mysql Test
const test = (req, res) => {
  mysql('sample').select('*')
  .then((result)=>{
    res.send(result)
  }).catch((err) => {
    console.error(err)
  })
}
app.get('/test', (req, res) => test(req, res));


//aggregated
const {selectByDate, selectByMonth, selectByYear, selectInfo}  = require('./models/aggregated');
app.get('/selectByDate', (req, res) => selectByDate(req, res));
app.get('/selectByMonth', (req, res) => selectByMonth(req, res));
app.get('/selectByYear', (req, res) => selectByYear(req, res));
app.get('/selectInfo', (req, res) => selectInfo(req, res));


