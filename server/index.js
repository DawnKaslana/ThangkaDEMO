const cors = require('cors');
const express = require('express');
const app = express();
const mysql = require('./mysql');

var bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(process.env.REACT_APP_SERVER_PORT, () => {
  console.log(`App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`);
});

app.get('/', (req, res) => {
  res.send('OUO')
});


// Connect Mysql Test
// const test = (req, res) => {
//   mysql('sample').select('*')
//   .then((result)=>{
//     res.send(result)
//   }).catch((err) => {
//     console.error(err)
//   })
// }
// app.get('/test', (req, res) => test(req, res));


//file
const { putFile, getFile }  = require('./models/file');
app.post('/uploadFile', (req, res) => putFile(req, res));
app.get('/getVideo', (req, res) => getFile(req, res));

//user
const { getUserList, addUser, putUser, deleteUser }  = require('./models/user');
app.get('/getUserList', (req, res) => getUserList(req, res));
app.post('/addUser', (req, res) => addUser(req, res));
app.put('/putUser', (req, res) => putUser(req, res));
app.delete('/deleteUser', (req, res) => deleteUser(req, res));

//class
const { getClassList, addClass, putClass, deleteClass }  = require('./models/class');
app.get('/getClassList', (req, res) => getClassList(req, res));
app.post('/addClass', (req, res) => addClass(req, res));
app.put('/putClass', (req, res) => putClass(req, res));
app.delete('/deleteClass', (req, res) => deleteClass(req, res));

//label
const { getLabelList, addLabel, putLabel, deleteLabel }  = require('./models/label');
app.get('/getLabelList', (req, res) => getLabelList(req, res));
app.post('/addLabel', (req, res) => addLabel(req, res));
app.put('/putLabel', (req, res) => putLabel(req, res));
app.delete('/deleteLabel', (req, res) => deleteLabel(req, res));


