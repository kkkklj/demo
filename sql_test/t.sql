CREATE TABLE `tb_user`(
  `id` INT UNSIGNED AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `secretAnswer` VARCHAR(100) NOT NULL,
  `submission_date` DATE,
  PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


insert into students values('小米',4,null);


describe tb_user;
+-----------------+--------------+------+-----+---------+----------------+
| Field           | Type         | Null | Key | Default | Extra          |
+-----------------+--------------+------+-----+---------+----------------+
| id              | int unsigned | NO   | PRI | NULL    | auto_increment |
| username        | varchar(100) | NO   |     | NULL    |                |
| password        | varchar(100) | NO   |     | NULL    |                |
| email           | varchar(100) | NO   |     | NULL    |                |
| secretAnswer    | varchar(100) | NO   |     | NULL    |                |
| submission_date | date         | YES  |     | NULL    |                |
+-----------------+--------------+------+-----+---------+----------------+