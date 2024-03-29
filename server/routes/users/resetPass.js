const sequelize = require('../db');
const md5 = require('md5');
const { searchUser, updateUser, sendEmail, dealCacheMail } = appRequire('utils/tool');



async function getToken({ email, secretAnswer }) {
  if (!email || !secretAnswer) {
    return Promise.reject({ msg: `请输入${email ? '安全问题' : '邮箱'}` });
  }
  try {
    const results = await searchUser({ email }),
      matchList = results[0];
    if (!matchList || !matchList.length) {
      throw { msg: '用户不存在' }
    }
    const item = matchList[0],
      mdAnswer = md5('mdanhaha' + secretAnswer);
    // console.log(mdAnswer,item)
    if (mdAnswer == item.secretAnswer) {
      const upDate = new Date().getTime();
      const resu = await updateUser(item.id, { token_get_date: upDate })
      // console.log('resul-->',resu);
      const emsg = await sendEmail(email);
      console.log('emsg-->', emsg);
      return { msg: '验证成功', token: md5('qdxs' + upDate) };
    } else {
      throw { msg: '验证失败' }
    }
  } catch (err) {
    if (typeof (err) == 'object') {
      return Promise.reject(err);
    } else {
      return Promise.reject({ msg: 'err' });
    }
  }
}

async function resetByMail(email) {
  try {
    email = decodeURIComponent(email)
    const userRaw = await searchUser({ email }),
      userRes = userRaw[0] && userRaw[0][0];
    console.log('userraw-->', userRes)
    if (!userRes) {
      return {
        code: 403,
        msg: '该邮箱用户不存在'
      }
    }

    const cacheMailRaw = await dealCacheMail(email),
      cacheMailRes = cacheMailRaw.saveCode;
    if (!cacheMailRes || cacheMailRaw.code !== 0) {
      throw cacheMailRaw.msg
    }
    await sendEmail(email, cacheMailRes);
    return {
      code: 0,
      msg: '邮箱发送成功'
    }
  } catch (error) {
    return Promise.reject({
      code: -1,
      msg: error
    })
  }


}

async function confirmByMail({ email, mailCaptcha, password }) {
  if (!email || !mailCaptcha || !password) {
    return Promise.reject({
      code: 404,
      msg: '请填写完整信息'
    })
  }
  try {
    const raw = await dealCacheMail(email, true);
    if (raw.code !== 0) {
      throw raw.msg
    }
    if (raw.saveCode !== +mailCaptcha) {
      return Promise.reject({ msg: '邮箱验证码错误' });
    }
    const p = md5('sql223' + password);
    await sequelize.query(`update tb_user set password="${p}" where email='${email}';`);
    return {
      code: 0,
      msg: '修改密码成功'
    }
  } catch (error) {
    return Promise.reject({
      code: 500,
      msg: error
    })
  }

}

module.exports = {
  getToken,
  resetByMail,
  confirmByMail
}