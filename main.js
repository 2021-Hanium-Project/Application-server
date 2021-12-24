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
  host     : 'yerim-db.cbkqykgy0mci.ap-northeast-2.rds.amazonaws.com',
  user     : 'admin',
  password : 'seereal1!',
  database : 'info',
  charset : 'utf8mb4',
  port : '3306'
});

app.post('/user/join', function(req, res){
  console.log(req.body);
  var id = req.body.id;
  var pw = req.body.pw;
  var pwChk = req.body.pwChk;
  var email = req.body.email;
  var nickname = req.body.nickname;
  
  var insert_sql = 'INSERT INTO member (id, pw, pwChk, email, nickname) VALUES (?, ?, ?, ?, ?)';
  var params = [id,pw,pwChk,email,nickname];
  
  
  connection.query(insert_sql,params,function(err,result){
    var resultCode = 404;
    var message = '에러가 발생했습니다.'+'\n' +'입력하신 정보를 확인해주세요';

    if (err){
      console.log(err);
    } 
    else {
      resultCode = 200;
      
      message = '회원가입에 성공했습니다.';
      
      var val = null
      var insert_id = 'INSERT INTO RR_info (id, nickname ,sex, dom, smoke, sleepHabit, food, sleepTime, numberOfCleaning, numberOfShower) VALUES (?,?,?,?,?,?,?,?,?,?)'
      var params = [id,nickname,val,val,val,val,val,val,val,val]
      connection.query(insert_id,params,function (err, result){
          if (err) {
              console.log(err);
            } else {
              console.log(" id : "+id+" 님이 회원가입을 했습니다.");
            }
      });
  }
  res.json({
    'code' : resultCode,
    'message' : message
    });
  });

});

app.post('/user/idchk', function(req, res){
  console.log(req.body);
  var id = req.body.id;
  
  var sql = 'SELECT * FROM member WHERE id = ? '

  connection.query(sql, id, function (err, result){
    var resultCode = 404;
    var message = '에러가 발생했습니다.';

    if (err){
      console.log(err);
    } else {
      if (result.length !== 0) {
        resultCode = 204;
        message ='이미 사용중인 아이디입니다.';
      }  else {
        resultCode = 200;
        message = '사용가능한 아이디입니다.';
      }
    }
    res.json({
      'code': resultCode,
      'message': message
    });
  });
});


app.post('/user/issueTempPassword', function(req, res){
    console.log(req.body);
    var id = req.body.id;
    var email = req.body.email;
    var params = [id,email];
    
    var sql = 'SELECT * FROM member WHERE id = ? AND email =? '
  
    connection.query(sql, params, function (err, result){
      var resultCode = 404;
      var message = '에러가 발생했습니다.';
  
      if (err){
        console.log(err);
      } else {
        if (result.length == 1) {
          resultCode = 200; //가입된 데이터 존재
          message = '임시 비밀번호를 발급했습니다.'
          
          var pw = Math.random().toString(36).slice(2);
          var pwChk = pw;

            var val =""
            var modify_pw = 'UPDATE member SET pw = ?, pwChk =? WHERE id =?'
            var params =[pw,pw,id]
            connection.query(modify_pw,params,function (err, result){
          if (err) {
              console.log(err);
            } else {
                console.log(" id : "+id+" 님이 비밀번호를 재발급했습니다.");
            }
      });

        }  else {
          resultCode = 204; //가입된 데이터 존재하지 않음
          message = '가입된 정보가 없습니다.'
        }
      }
      res.json({
        'code': resultCode,
        'message' : message,
        'pw': pw,
        'pwChk':pwChk
      });
    });
  });

app.post('/user/login', function(req, res){
  console.log(req.body);
  var id = req.body.id;
  var pw = req.body.pw;
  var sql = 'select * from member where id = ?';

  connection.query(sql, id, function (err, result){
    let resultCode = 404;
    var message = '에러가 발생했습니다.';
    var nickname; 
    

    if (err){
      console.log(err);
    } else {
      if (result.length === 0) {
        resultCode = 204;
        message ='존재하지 않는 계정입니다.';
      } else if (pw !== result[0].pw) {
        resultCode = 204;
        message ='비밀번호가 틀렸습니다!';
      } else {
        resultCode = 200;
        message = '로그인 성공! ' + result[0].nickname + '님 환영합니다!';
        nickname = result[0].nickname;
  
      }
    }
    res.json({
      'code': resultCode,
      'message': message,
      'id' : id,
      'nickname' :nickname
    });
  });
});


app.post('/user/RR', function(req, res){
  var id = req.body.id;
  var sex = req.body.sex;
  var dom = req.body.dom;
  var smoke = req.body.smoke;
  var sleepHabit = req.body.sleepHabit;
  var food = req.body.food;
  var sleepTime = req.body.sleepTime;
  var numberOfCleaning = req.body.numberOfCleaning;
  var numberOfShower = req.body.numberOfShower;
  var title = req.body.title;
  var desc = req.body.desc

  var insert_sql = "UPDATE RR_info SET sex=?, dom=?, smoke=?, sleepHabit=?, food=?, sleepTime=?, numberOfCleaning=?, numberOfShower=?, title=?, `desc`=? WHERE id="+id;
  
  connection.query(insert_sql,[sex, dom, smoke, sleepHabit, food, sleepTime, numberOfCleaning, numberOfShower,title,desc],function(err,result){
    var resultCode = 404;
    var message = '에러가 발생했습니다.'+'\n' +'입력하신 정보를 확인해주세요';
    var inputCheck = true;

    if (err){
      console.log(err);
    } 
    else {
      resultCode = 200;
      message = '정보 입력 성공';
      console.log(" id : "+id+" 님이 룸메이트 추천 서비스의 본인 정보 입력을 완료하였습니다..");  
  }
  res.json({
    'code' : resultCode,
    'message' : message,
    'inputCheck' : inputCheck
    });
  });
 

});


app.get('/user/recommendList', function(req, res){
    var id = req.query.id;
    
    var sql = 'select * from info.RR_info where `id` not in (?) and sex = (select sex from info.RR_info where `id`=?)';
    params = [id,id]
    connection.query(sql , params , function (err, result){
      let resultCode = 404;
      var message = '에러가 발생했습니다.';
    
  
      if (err){
        console.log(err);
        
      } else {
          resultCode = 200;
          message = '성공';
    
        
          var data = []
          for(let i = 0; i < result.length; i++){
              let rr_list = {
                'id': result[i].id,
                'nickname':result[i].nickname,
                'sex' : result[i].sex,
                'dom' : result[i].dom,
                'smoke' : result[i].smoke,
                'sleepHabit' : result[i].sleepHabit,
                'food' : result[i].food,
                'sleepTime' : result[i].sleepTime,
                'numberOfCleaning' : result[i].numberOfCleaning,
                'numberOfShower' : result[i].numberOfShower,
                'title' : result[i].title,
                'desc' : result[i].desc
              };
              
            data.push(rr_list)
            
            // var value = Object.values(rr_list)
            // if(value.includes("비흡연자")) {data.push(rr_list)}
            // console.log(value)
              
          }
          
      }
      res.json({'code': resultCode, 'message': message,data});
    });
  });


  app.get('/user/recommendFilteringList', function(req, res){
    var id = req.query.id;
    
    var array = req.query.filteringArray
    if(typeof(array)=="string"){
      var array = new Array();
      array.push(req.query.filteringArray)
    }
    console.log(array)
    
    console.log(array,typeof(array));
   
    var dom_sql = filteringDom(array);
    var smoke_sql = filteringSmoke(array);
    var sleepHabit_sql = filteringSleepHabit(array);
    var food_sql = filteringFood(array);
    var sleepTime_sql = filteringSleepTime(array);
    var numberOfCleaning_sql = filteringNumberOfCleaning(array);
    var numberOfShower_sql = filteringNumberOfShower(array);
    var first_sql = 'select * from RR_info where `id` not in (?) and sex = (select sex from info.RR_info where `id`=?) ';
    var sql = first_sql+dom_sql+smoke_sql+sleepHabit_sql+food_sql+sleepTime_sql+numberOfCleaning_sql+numberOfShower_sql;
    console.log(sql)
    params = [id,id]
    connection.query(sql , params , function (err, result){
      let resultCode = 404;
      var message = '에러가 발생했습니다.';
    
  
      if (err){
        console.log(err);
        
      } else {
          resultCode = 200;
          message = '성공';
    
        
          var data = []
          for(let i = 0; i < result.length; i++){
              let rr_list = {
                'id': result[i].id,
                'nickname':result[i].nickname,
                'sex' : result[i].sex,
                'dom' : result[i].dom,
                'smoke' : result[i].smoke,
                'sleepHabit' : result[i].sleepHabit,
                'food' : result[i].food,
                'sleepTime' : result[i].sleepTime,
                'numberOfCleaning' : result[i].numberOfCleaning,
                'numberOfShower' : result[i].numberOfShower,
                'title' : result[i].title,
                'desc' : result[i].desc
              };
              
              data.push(rr_list)
             console.log(data)
          }
          
      }
      res.json({'code': resultCode, 'message': message, data});
    });
  });


  
  function filteringDom(array){
      var dom=[]
      if(array.includes("1기숙사")){
          dom.push("\"1기숙사\"")
          array =array.filter((element) => element !== '\"1기숙사\"');
          
      }
      if(array.includes("2기숙사")){
        dom.push("\"2기숙사\"")
          array =array.filter((element) => element !== '\"2기숙사\"');
          
    }
    if(array.includes("3기숙사")){
        dom.push("\"3기숙사\"")
          array =array.filter((element) => element !== '\"3기숙사\"');
          
    }
    if(dom.length>0){
    var str = dom.join(",")
    var string = 'and dom in ('+ str +')'}
    else{
        string =""
    }
    return string
    
  }

  function filteringSmoke(array){
    var smoke=[]
    if(array.includes("흡연자")){
        smoke.push("\"흡연자\"")
        array =array.filter((element) => element !== '\"흡연자\"');
        
    }
    if(array.includes("비흡연자")){
      smoke.push("\"비흡연자\"")
        array =array.filter((element) => element !== '\"비흡연자\"');
        
  }
        
  if(smoke.length>0){
    var str = smoke.join(",")
    var string = 'and smoke in ('+ str +')'}
    else{
        string =""
    }
    return string
}

function filteringSleepHabit(array){
    sleepHabit=[]
    if(array.includes("괜찮음")){
        sleepHabit.push("\"괜찮음\"")
        var string = 'and sleepHabit not in ("없음")'
        array =array.filter((element) => element !== '\"괜찮음\"');
        
    }
    if(array.includes("없음")){
        sleepHabit.push("\"없음\"")
        string = 'and sleepHabit in ("없음")'
        array =array.filter((element) => element !== '\"없음\"');
        
  }
  if(sleepHabit.length==0 || sleepHabit.length==2){
        string =""
    }
    
    return string
  
}


function filteringFood(array){
    var food=[]
    if(array.includes("가능")){
        food.push("\"가능\"")
        array =array.filter((element) => element !== '\"가능\"');
        
    }
    if(array.includes("일부 가능")){
        food.push("\"일부 가능\"")
        array =array.filter((element) => element !== '\"일부 가능\"');
        
  }
  if(array.includes("불가능")){
        food.push("\"불가능\"")
        array =array.filter((element) => element !== '\"불가능\"');
        
  }
  if(food.length>0){
  var str = food.join(",")
  var string = 'and food in ('+ str +')'}
  else{
      string =""
  }
  return string
  
}

function filteringSleepTime(array){
    var sleepTime=[]
    if(array.includes("9시 이전")){
        sleepTime.push("\"9시 이전\"")
        array =array.filter((element) => element !== '\"9시 이전\"');
        
    }
    if(array.includes("9~12시")){
        sleepTime.push("\"9~12시\"")
        array =array.filter((element) => element !== '\"9~12시\"');
        
  }
  if(array.includes("12시 이후")){
    sleepTime.push("\"12시 이후\"")
        array =array.filter((element) => element !== '\"12시 이후\"');
        
  }
  if(sleepTime.length>0){
  var str = sleepTime.join(",")
  var string = 'and sleepTime in ('+ str +')'}
  else{
      string =""
  }
  return string
  
}

function filteringNumberOfCleaning(array){
    var numberOfCleaning=[]
    if(array.includes("c:주 0~2회")){
        numberOfCleaning.push("\"0~2회\"")
        array =array.filter((element) => element !== '\"c:주 0~2회"');
        
    }
    if(array.includes("c:주 3~6회")){
        numberOfCleaning.push("\"3~6회\"")
        array =array.filter((element) => element !== '\"c:주 3~6회"');
        
  }
  if(array.includes("c:매일")){
        numberOfCleaning.push("\"매일\"")
        array =array.filter((element) => element !== '\"c:매일"');
        
  }
  if(numberOfCleaning.length>0){
  var str = numberOfCleaning.join(",")
  var string = 'and numberOfCleaning in ('+ str +')'}
  else{
      string =""
  }
  return string
  
}

function filteringNumberOfShower(array){
    var numberOfShower=[]
    if(array.includes("s:주 0~2회")){
        numberOfShower.push("\"0~2회\"")
        array =array.filter((element) => element !== '\"s:주 0~2회"');
        
    }
    if(array.includes("s:주 3~6회")){
        numberOfShower.push("\"3~6회\"")
        array =array.filter((element) => element !== '\"s:주 3~6회"');
        
  }
  if(array.includes("s:매일")){
        numberOfShower.push("\"매일\"")
        array.splice(array.indexOf("\"s:매일\""),1);
        
  }
  if(numberOfShower.length>0){
  var str = numberOfShower.join(",")
  var string = 'and numberOfShower in ('+ str +')'}
  else{
      string =""
  }
  return string
  
}



app.get('/user/myInfo', function(req, res){
    var id = req.query.id;
    
    var sql = 'select nickname, email from info.member where `id` =?';
    connection.query(sql, id , function (err, result){
      let resultCode = 404;
      var message = '에러가 발생했습니다.';
      
  
      if (err){
        console.log(err);
      } else {
        if (result.length !== 0) {
          resultCode = 200;


          message ='내 정보를 보냅니다.';
          nickname = result[0].nickname;
          email = result[0].email;
          
          
        }  
      }             
          
      
      res.json({
        'code': resultCode,
        'message' : message,
        'nickname': nickname,
        'email':email
        });
    });
  });


app.get('/user/modifyPassword', function(req, res){
    var id = req.query.id;
    var currentPw = req.query.currentPassword;
    var newPw = req.query.newPassword;
    
    console.log(id,currentPw,newPw);
    var sql = 'select pw from info.member where `id` =?';
    connection.query(sql, id , function (err, result){
      let resultCode = 404;
      var message = '에러가 발생했습니다.';
      
      console.log(result,typeof(result));
    
  
      if (err){
        console.log(err);
      } else {
        if (result[0].pw == currentPw) {
          resultCode = 200; //올바른 현재 비밀번호 입력
          message = '비밀번호를 변경했습니다..'
          
            var modify_pw_sql = 'UPDATE member SET pw = ?, pwChk =? WHERE id =?'
            var params =[newPw,newPw,id]
            connection.query(modify_pw_sql,params,function (err, result){
          if (err) {
              console.log(err);
            } else {
                console.log(" id : "+id+" 님이 비밀번호를 변경했습니다.");
            }
      });

        }  else {
          resultCode = 204; //틀린 비밀번호 입력
          message = '현재 비밀번호를 잘못 입력하셨습니다.'
        }
      }
      res.json({
        'code': resultCode,
        'message' : message,
      });
    });
  });


  app.get('/user/getFixList', function(req, res){
    var id = req.query.id;
    console.log(id);
  
    var sql = 'select * from repair where `id`=? ';
  
    connection.query(sql , id , function (err, result){
      let resultCode = 404;
      var message = '에러가 발생했습니다.';
    
  
      if (err){
        console.log(err);
        
      } else {
          resultCode = 200;
          message = '성공';
          console.log(result.length);
    
              if(result.length>0){
              var data = []
              for(let i = 0; i < result.length; i++){
                  let fix_list = {
                    'id': result[i].id,
                    'organization':result[i].organization,
                    'content' : result[i].content,
                    'date' : result[i].date
                   
                  }
                  data.push(fix_list)
                }
              }
            
              console.log(data)
      
          
      }
      res.json({'code': resultCode, 'message': message, data});
    });
  });

  app.post('/user/sendFix', function(req, res){
    var id = req.body.id;
    var organization = req.body.organization;
    var content = req.body.content;
    var date = req.body.date;
    
  
    var insert_fix_sql = 'insert into repair (id, organization, content, date) values (?,?,?,?)';
    params =[id, organization,content,date]
  
    connection.query(insert_fix_sql , params , function (err, result){
      let resultCode = 404;
      var message = '에러가 발생했습니다.';
    
  
      if (err){
        console.log(err);
        
      } else {
          resultCode = 200;
          message = '고장 수리 접수가 완료되었습니다.';
          console.log(params);
    
      
      }
      console.log(message);
      res.json({'code': resultCode, 'message': message});
    });
  });