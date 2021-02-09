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
function sendEmail() {
  var options = {
    from: 'qq819103524@163.com',
    to: '819103524@qq.com',
    // cc         : ''  //抄送
    // bcc      : ''    //密送
    subject: '一封来自Node Mailer的邮件',
    text: '一封来自Node Mailer的邮件',
    html: '<h1>你好，这是一封来自NodeMailer的邮件！</h1><p>22222</p>',
    // attachments : 
    //             [
    //                 {
    //                     filename: 'img1.png',            // 改成你的附件名
    //                     path: 'public/images/img1.png',  // 改成你的附件路径
    //                     cid : '00000001'                 // cid可被邮件使用
    //                 },
    //                 {
    //                     filename: 'img2.png',            // 改成你的附件名
    //                     path: 'public/images/img2.png',  // 改成你的附件路径
    //                     cid : '00000002'                 // cid可被邮件使用
    //                 },
    //             ]
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
module.exports = {
  searchUser,
  updateUser,
  sendEmail
}