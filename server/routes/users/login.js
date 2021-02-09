const sequelize = require('../db');
const md5 = require('md5');
const {searchUser} = appRequire('utils/tool');

function dealLogin ({email,password}) {
  if(!email || !password) {
    return Promise.reject({msg:`请输入${email?'密码':'邮箱'}`});
  }
  return searchUser({ email })
  .then(results => {
    const matchList = results[0];
    
    if(matchList&&matchList.length) {
      console.log('que-->',matchList[0].username,matchList[0].email);
      const item = matchList[0],
            mdPass = md5('sql223'+password);
      if(mdPass == item.password) {
        return {msg: '登陆成功'}
      } else {
        return Promise.reject({msg: '密码错误'});
      }

    } else {
      return Promise.reject({msg: '用户不存在'})
    }
  })
  .catch(err => {
    if(typeof(err) == 'object') {
      return Promise.reject(err);
    } else {
      return Promise.reject({msg:'err'});
    }
  })
}
module.exports = dealLogin;