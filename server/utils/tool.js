const sequelize = appRequire('routes/db');

var nodemailer = require('nodemailer');
var mailTransport = nodemailer.createTransport({
  service: '163',
  secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
  auth: {
    user: 'qq819103524@163.com',
    pass: 'OQSKSEISPZVTHEMK'
  },
});
function sendEmail(email,cont) {
  var options = {
    from: 'qq819103524@163.com',
    to: email||'819103524@qq.com',
    subject: '一封来自Node Mailer的邮件',
    text: '一封来自Node Mailer的邮件',
    html: `<h1>你好，这是一封来自NodeMailer的邮件！</h1><p>验证码:${cont}</p>`,
  };
  return new Promise((resolve,reject) => {
    mailTransport.sendMail(options, function (err, msg) {
      if (err) {
        console.log(err);
        reject({ msg: err })
      }
      else {
        console.log(msg);
        resolve({msg:msg.accepted});
      }
    });
  })
  
}


function searchUser(parmas) {
  console.log('params:', parmas)
  let str = '',
    matchArr = ['username', 'password', 'email', 'secretAnswer'];
  for (const key in parmas) {
    if (parmas.hasOwnProperty(key)) {
      if (matchArr.indexOf(key) == -1) {
        return Promise.reject({ msg: '服务器键名异常' });
      }
      const keyVal = typeof (parmas[key]) == 'number' ? `${parmas[key]}` : `"${parmas[key]}"`
      if (str.length > 0) {
        str = str + ` or ${key}=${keyVal}`;
      } else {
        str = ` where ${key}=${keyVal}`
      }
    }
  }
  const queryStr = `SELECT * FROM tb_user` + str
  return sequelize.query(queryStr);
}
function updateUser(id, parmas) {
  if (!id) {
    return Promise.reject({ msg: '更新时未传id' })
  }
  let str = '',
    matchArr = ['username', 'password', 'secretAnswer', 'token_get_date'];
  for (const key in parmas) {
    if (parmas.hasOwnProperty(key)) {
      if (matchArr.indexOf(key) == -1) {
        return Promise.reject({ msg: '服务器键名异常' });
      }
      const keyVal = typeof (parmas[key]) == 'number' ? `${parmas[key]}` : `"${parmas[key]}"`
      if (str.length > 0) {
        str = str + `,${key}=${keyVal}`;
      } else {
        str = `${key}=${keyVal}`
      }
    }
  }
  const queryStr = `update tb_user set ${str} where id=${id};`;
  return sequelize.query(queryStr);
}

async function dealCacheMail(email, getCode = false) {
  try {
    const searchRes = await sequelize.query(`SELECT * FROM tb_cache_mails where email='${email}';`);
    const saveCode = parseInt(Math.random() * 100000),
          hasResult = searchRes[0] && searchRes[0][0];
    
    if(getCode) {
      if(hasResult) {
        return {
          code: 0,
          saveCode: hasResult.code
        }
      } else {
        return {
          code: -1,
          msg: '缓存没有邮箱'
        }
      }
    }
    if (hasResult) {
      await sequelize.query(`update tb_cache_mails set code=${saveCode}`);
      return {
        code: 0,
        msg: '邮箱已存在缓存中',
        saveCode
      }
    } else {
      await sequelize.query(`insert into tb_cache_mails values(null,'${email}',${saveCode});`);
      return {
        code: 0,
        msg: '插入缓存成功',
        saveCode
      }
    }
  } catch (error) {
    return {
      code: -1,
      msg: error
    }
  }
}

module.exports = {
  searchUser,
  updateUser,
  sendEmail,
  dealCacheMail
}