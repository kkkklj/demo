const sequelize = require('../db');
const md5 = require('md5');
const {searchUser, updateUser, sendEmail} = appRequire('utils/tool');



async function getToken({email,secretAnswer}) {
  if(!email || !secretAnswer) {
    return Promise.reject({msg:`请输入${email?'安全问题':'邮箱'}`});
  }
  try {
    const results = await searchUser({ email }),
          matchList = results[0];
    if(matchList&&matchList.length) {
      const item = matchList[0],
          mdAnswer = md5('mdanhaha'+ secretAnswer);
          // console.log(mdAnswer,item)
        if(mdAnswer == item.secretAnswer) {
          const upDate = new Date().getTime();
          const resu = await updateUser(item.id,{token_get_date: upDate})
          // console.log('resul-->',resu);
          const emsg =await sendEmail();
          console.log('emsg-->',emsg);
          return {msg: '验证成功', token: md5('qdxs' + upDate)};
        } else {
          throw {msg:'验证失败'}
        }
    }
  } catch (err) {
    if(typeof(err) == 'object') {
      return Promise.reject(err);
    } else {
      return Promise.reject({msg:'err'});
    }
  }
}

module.exports = {
  getToken
}