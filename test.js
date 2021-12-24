var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, '0.0.0.0', function() {
  console.log('서버 실행중...');
});

var connection = mysql.createConnection({
  host     : 'database-kyr.c2drpoqm7zkr.ap-northeast-2.rds.amazonaws.com',
  user     : 'admin',
  password : 'seereal1!',
  database : 'info',
  port : '3306'
});

app.post('/user/test', function(req, res){
    console.log(req.body);
    var email = req.body.email;
  
    var sql = 'select * from info.manager_info';
  
    connection.query(sql, email, function (err, result){
      var resultCode = 404;
      var message = '에러가 발생했습니다.';
  
      if (err){
        console.log(err);
      } else {
        resultCode = 200;
      
        firstname = result[0].firstname;
        lastname = result[0].lastname;
        email = result[0].email;
        pw = result[0].pw;
        pwc = result[0].pwc;
        
      }
      res.json({
        'code': resultCode,
        'firstname' : firstname,
        'lastname' : lastname,
        'email' : email,
        'pw' : pw,
        'pwc' : pwc

      });
    });
  });