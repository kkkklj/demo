const sequelize = require('../db');
const md5 = require('md5');
const {searchUser} = appRequire('utils/tool');
function register({
  username,
  password,
  email,
  secretAnswer
}) {
  return sequelize.query(`insert into tb_user values(null,'${username}','${password}','${email}','${secretAnswer}',${new Date().getTime()},NOW());`);
}

function dealRegister(parmas) {
  const matchArr = ['username', 'password', 'email', 'secret_answer'];
  let tag = true;
  matchArr.map(item => {
    if(!parmas[item]) {
      tag = false;
    } 
  })
  if(!tag) {
    return Promise.reject({msg:'缺乏必要参数',code:404});
  }
  parmas.secretAnswer = parmas['secret_answer'];
  const {username, password, email, secretAnswer} = parmas;
  
  const mdPass = md5('sql223'+password),
        mdAnswer = md5('mdanhaha'+ secretAnswer);
  return searchUser({username, email})
  .then(results => {
    
    if(results[0].length > 0) {
      const matchList = results[0];
      console.log('que-->',matchList[0].username,matchList[0].email);
      if(matchList[0].username == username) {
        return Promise.reject({msg: '用户已存在'});
      } else {
        return Promise.reject({msg: '邮箱已被注册'});
      }
    }
    return register({
      username,
      password: mdPass,
      email,
      secretAnswer:mdAnswer
    })
  })
  .then(results => {
    console.log('result->',results);
    return {msg:'注册成功'};
  })
  .catch(err => {
    if(typeof(err) == 'object') {
      return Promise.reject(err);
    } else {
      return Promise.reject({msg:'err'});
    }
    
  });
}

module.exports = dealRegister;