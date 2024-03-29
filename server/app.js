var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const os = require('os');
global.$gPath = __dirname;
global.appRequire = function (p) {
  return require(path.resolve(__dirname, p))
}

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const witeList = ['http://localhost:3001']
const allowCrossDomain = function (req, res, next) {
  const origin = req.headers.origin,
    localhost = /localhost/g.test(origin);
  if (witeList.indexOf(origin) != -1 || localhost) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'content-type');
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  // next();
  next();
};
app.use(allowCrossDomain);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//OQSKSEISPZVTHEMK

function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    const address = iface.find(alias => alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal);
    return address.address;
  }
}
const myIp = getIPAdress();

const listener = app.listen(9999, () => {
  console.log('服务启动--》', listener.address().port);
  console.log('地址为:', myIp + ':' + listener.address().port)
})
global.$gMyIp = myIp + ':' + listener.address().port
module.exports = app;
