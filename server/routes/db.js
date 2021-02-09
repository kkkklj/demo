const { Sequelize,Model, DataTypes, Deferrable } = require('sequelize');


// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize('db1', 'root', '123456test', {
  dialect: 'mysql',
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const user = sequelize.define(
  'tb_user',
  {
    'username': {
      'type': Sequelize.STRING(100), // 字段类型,STRING就是VARCHAR
      'allowNull': false,         // 是否允许为NULL
      'unique': true              // 字段是否UNIQUE
    },
    'password': {
      'type': Sequelize.STRING(100),
      'allowNull': false,         
    },
    'email': {
      'type': Sequelize.STRING(100), 
      'allowNull': false,        
    },
    'secretAnswer': {
      'type': Sequelize.STRING(100),
      'allowNull': false,         
    },
    'token_get_date': {
      'type': Sequelize.BIGINT(64),
      'allowNull': false,
    }
  },
  {
    'freezeTableName': true,
    'tableName': 'tb_user',
    'timestamps': true,//是否需要增加createdAt、updatedAt、deletedAt字段
    'createdAt': 'submission_date',
    'updatedAt': false,
    //同时需要设置paranoid为true（此种模式下，删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    'deletedAt': false,
  }
)
user.sync();
module.exports = sequelize;