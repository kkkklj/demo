var express = require('express');
var router = express.Router();
const multiparty = require("multiparty");
const fs=require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/postImg', (req, res) => {
  console.log("body-->",req.body)
  const form = new multiparty.Form({ uploadDir: `${$gPath}/public/images` });
    form.parse(req, function(err, fields, files) {
        console.log(fields, files,' fields2')
        if (err) {
          console.log(err)
        } else {
          res.json({ imgSrc: files.image[0].path })
        }
    });
})

router.get('/imgsList', (req, res) => {
  fs.readdir(`${$gPath}/public/images`,(err, files) => {
    let arr = [...files];
    arr = arr.map (item => `${$gMyIp}/images/${item}`)
    res.send({
      imgsList: arr
    })
  })
  
})

module.exports = router;
