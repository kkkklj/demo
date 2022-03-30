const sequelize = require('../db');
const md5 = require('md5');
const { searchUser } = appRequire('utils/tool');

async function dealLogin({ email, password }) {
  try {
    if (!email || !password) {
      throw { msg: `请输入${email ? '密码' : '邮箱'}` }
    }
    const results = await searchUser({ email });
    const matchList = results[0];
    if (!matchList || !matchList.length) {
      throw { msg: '用户不存在' };
    }
    // console.log('que-->', matchList[0].username, matchList[0].email);
    const item = matchList[0],
      mdPass = md5('sql223' + password);
    if (mdPass == item.password) {
      return { msg: '登陆成功' }
    }
    throw { msg: '密码错误' };
  } catch (error) {
    const transferError = typeof (error) == 'object' ? error : { msg: 'err' };
    return Promise.reject(transferError)
  }
}
module.exports = dealLogin;