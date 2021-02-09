var express = require('express');
var router = express.Router();
const sequelize = require('./db');
const dealRegister = require('./users/register');
const dealLogin = require('./users/login');
const {getToken} = require('./users/resetPass');
// const mysql = require('mysql');
// const connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '123456test',    
//   database : 'db1'   //数据库名
// });

async function testConection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
testConection();

/* GET users listing. */
router.get('/', function (req, res, next) {
  getTable().then().catch(err => { console.log(err) })
  res.send('respond with a resource');
});

router.use((req, res, next) => {
  console.log('body-->',req.body);
  let params = null,
    method = req.method.toLocaleLowerCase();
  if (method == 'get') {
    params = req.query;
  }
  if (method == 'post') {
    params = req.body;
  }
  if (params) {
    const { username, password, email } = params;
    const regUserName = /^[A-Za-z0-9]+$/.test(username),
      regPassWord = /^[0-9a-zA-Z_]{1,}$/.test(password),
      regEmail = /[\w]+(\.[\w]+)*@[\w]+(\.[\w])+/.test(email);
    if (username && (username.length > 13 || username.length < 5 || !regUserName)) {
      res.send({ msg: '用户名不符合格式' });
      return;
    }
    if (password && (password.length > 16 || password.length < 6 || !regPassWord)) {
      res.send({ msg: '密码不符合格式' });
      return;
    }
    if (email && !regEmail) {
      res.send({ msg: '邮箱不符合格式' });
      return;
    }
  }
  next();
})

router.post('/register', (req, res) => {
  const query = req.body;
  dealRegister(query)
    .then(obj => {
      res.send(obj)
    })
    .catch(err => {
      err.code = 403;
      res.send(err)
    })
})

router.post('/login', (req, res) => {
  const query = req.body;
  dealLogin(query)
    .then(obj => {
      res.send(obj)
    })
    .catch(err => {
      err.code = 404;
      res.send(err)
    })
})

router.post('/forgetPassword', (req, res) => {
  const query = req.body;
  getToken(query)
    .then(obj => {
      res.send(obj)
    })
    .catch(err => {
      err.code = 404;
      res.send(err)
    })
})


router.get('/test', (req, res) => {
  console.log('test params-->', req.query);
  res.send({ msg: 'success' })
})

module.exports = router;
