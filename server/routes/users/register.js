const sequelize = require('../db');
const md5 = require('md5');
const { searchUser, sendEmail, dealCacheMail } = appRequire('utils/tool');
function register({
  username,
  password,
  email,
  secretAnswer
}) {
  return sequelize.query(`insert into tb_user values(null,'${username}','${password}','${email}','${secretAnswer}',${new Date().getTime()},null,NOW());`);
}
for (const key in object) {
  if (Object.hasOwnProperty.call(object, key)) {
    const element = object[key];

  }
}
async function dealRegister(parmas) {
  try {
    const matchArr = ['username', 'password', 'email', 'secret_answer', 'mailCaptcha'];
    const lackParmas = matchArr.find(k => !Object.hasOwnProperty.call(parmas, k));
    if (lackParmas) {
      return Promise.reject({ msg: '缺乏必要参数', code: 404 });
    }
    parmas.secretAnswer = parmas['secret_answer'];
    const { username, password, email, secretAnswer, mailCaptcha } = parmas;

    const mdPass = md5('sql223' + password),
      mdAnswer = md5('mdanhaha' + secretAnswer),
      results = await searchUser({ username, email });
    if (results[0].length > 0) {
      const matchList = results[0];
      console.log('que-->', matchList[0].username, matchList[0].email);
      if (matchList[0].username === username) {
        return Promise.reject({ msg: '用户已存在' });
      } else {
        return Promise.reject({ msg: '邮箱已被注册' });
      }
    }

    const confirmObj = await dealCacheMail(email, true);
    if (confirmObj.code == 0) {
      if (confirmObj.saveCode != mailCaptcha) {
        return Promise.reject({ msg: '邮箱验证码错误' });
      }
    }
    await register({
      username,
      password: mdPass,
      email,
      secretAnswer: mdAnswer
    });

    await sequelize.query(`DELETE FROM tb_cache_mails WHERE email="${email}";`);


    return { msg: '注册成功' };
  } catch (error) {
    if (typeof (error) == 'object') {
      return Promise.reject(err);
    } else {
      return Promise.reject({ msg: 'err' });
    }
  }
}

async function registerSendMail(email) {
  try {
    const result = await searchUser({ email });
    if (result[0] && result[0][0]) {
      throw '邮箱已存在'
    }
    const obj = await dealCacheMail(email);
    if (obj.code == 0) {
      await sendEmail(email, obj.saveCode);
      return {
        code: 0,
        msg: '邮箱发送成功'
      }
    } 
    throw obj.msg
  } catch (error) {
    return Promise.reject({
      code: -1,
      msg: error
    })
  }
}




module.exports = {
  dealRegister,
  registerSendMail
};