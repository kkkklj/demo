module.exports = function override(config, env) {
  //do stuff with the webpack config...
  console.log(config.output||'no output')
  return config;
}