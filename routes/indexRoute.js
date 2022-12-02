const express = require("express");
const url = require("url");
const concat = require("concat-stream");
const router = express.Router();
const mysql = require("mysql");
const crypto = require("crypto");
const session = require("express-session");

let pool = mysql.createPool({
  host: '158.247.239.116',
  user: 'dongyang',
  password: 'slm*123',
  database: 'scheduler'
})

const cipher = password => {
  return crypto.createHash("sha512").update(password).digest("base64");
}

const render = (re, html, data = {user: false}) => {
  const req = re.req;
  const res = re.res;

  if(req.session.user) {
    data.user = req.session.user;
  }

  html = `${html}.html`;

  return res.render(html, data);
}

router.get("/", function(req, res) {
  render({res, req}, "index");
})

router.post("/userData-action", function(req, res, next) {
  let result = {};

  if(req.session.user) {
    result = req.session.user;
  }

  res.send({user: result});
})

router.post("/register-action", function(req, res, next) {
  let body = [];
  req.on("data", chunk => {body.push(chunk)});
  req.on("end", e => {
    body = Buffer.concat(body).toString();
    req.body = body !== "" ? JSON.parse(body) : undefined;
    next();
  })
}, function(req, res) {
  const param = req.body;
  param.id = param.id.trim().toLocaleLowerCase();
  param.password = param.password.trim();
  param.email = param.email.trim();

  if(param.id == "") {
    res.send({alert: "id를 입력해주세요."});
  }else if(param.password == "") {
    res.send({alert: "비밀번호를를 입력해주세요."});
  }else if(param.email == "") {
    res.send({alert: "이메일를 입력해주세요."});
  }else {
    if(param.id == "login-test") {
      console.log("register-test");
      console.log({id: param.id, email: param.email});
      res.send({state: "SUCCESS", id: param.id});
      return;
    }
    if(param.id.match(/[^a-z|0-9]/g)) {
      res.send({alert: "id에는 영어와 숫자만 사용해주세요."});
    }

    pool.getConnection((err, connection) => {
      if(err) throw err;
      else {
        connection.query(`SELECT id FROM user WHERE id = '${param.id}'`, (err, result) => {
          if(err) throw err;

          if(result.length > 0) {
            res.send({alert: "이미 사용중인 id입니다."});
          }else {
            connection.query(`INSERT INTO user(id, email, password, alert, create_date, update_date) VALUES('${param.id}', '${param.email}', '${cipher(param.password)}', FALSE, now(), now());`, (err, result) => {
              if(err) throw err;
    
              console.log("register");
              console.log({id: param.id, email: param.email});
              res.send({state: "SUCCESS", id: param.id});
            })
          }
        })

        connection.release();
      }
    })
  }
})

router.post("/login-action", function(req, res, next) {
  let body = [];
  req.on("data", chunk => {body.push(chunk)});
  req.on("end", e => {
    body = Buffer.concat(body).toString();
    req.body = body !== "" ? JSON.parse(body) : undefined;
    next();
  })
}, function(req, res) {
  const param = req.body;
  param.id = param.id.trim().toLocaleLowerCase();
  param.password = param.password.trim();
  
  if(param.id == "") {
    res.send({alert: "id를 입력해주세요."});
  }else if(param.password == "") {
    res.send({alert: "비밀번호를 입력해주세요."});
  }else {
    if(param.id == "login-test") {
      console.log("login-test");
      req.session.user = {no: -1, id: "login-test", email: "test-account-email", name: "tester", cellNo: "000", alert: 0, team: []};
      console.log(req.session.user);
      res.send({state: "SUCCESS", user: req.session.user});
      return;
    }

    pool.getConnection((err, connection) => {
      if(err) throw err;
      else {
        connection.query(`SELECT user_no as no, id, email, name, cell_no as cellNo, alert FROM user WHERE id = '${param.id}' AND password = '${cipher(param.password)}'`, (err, result) => {
          if(err) throw err;

          if(result.length > 0) {
            let account = result[0];

            connection.query(`SELECT gr.group_no as no, gr.name as name, color, position, alert FROM scheduler.group gr, member where gr.group_no = member.group_no AND member.user_no = ${account.no}`, (err, result) => {
              if(err) throw err;
          
              account.team = result;

              console.log("login");
              console.log(account);
              req.session.user = account;
              res.send({state: "SUCCESS", user: req.session.user});
            })
          }else {
            res.send({alert: "id와 비밀번호가 일치하지 않습니다."});
          }
        })

        connection.release();
      }
    })
  }
})

router.post("/test-login-action", function(req, res, next) {
  let body = [];
  req.on("data", chunk => {body.push(chunk)});
  req.on("end", e => {
    body = Buffer.concat(body).toString();
    req.body = body !== "" ? JSON.parse(body) : undefined;
    next();
  })
}, function(req, res) {
  req.session.user = {no: -1, id: "login-test", email: "test-account-email", name: null, cellNo: "000", alert: 0};
  res.send({state: "SUCCESS", user: req.session.user});
})

router.post("/logout-action", function(req, res, next) {
  let body = [];
  req.on("data", chunk => {body.push(chunk)});
  req.on("end", e => {
    body = Buffer.concat(body).toString();
    req.body = body !== "" ? JSON.parse(body) : undefined;
    next();
  })
}, function(req, res) {
  req.session.user = null;
  res.send({state: "SUCCESS"});
})

router.post("/get-schedules", function(req, res, next) {
  if(req.session.user.id == "login-test") return res.send({state: "SUCCESS", result: "test"});

  
  pool.getConnection((err, connection) => {
    if(err) throw err;
    else {
      let sql = `SELECT schedule_no as no, name, color, content, type, alert, start_date as startDate, end_date as endDate FROM schedule where create_user = ${req.session.user.no}`;
      const teamList = req.session.user.team;
    
      for(let i = 0; i < teamList.length; i++) {
        sql += ` OR type = ${teamList[i].no}`;
      }

      connection.query(sql, (err, result) => {
        if(err) throw err;

        res.send({state: "SUCCESS", result: result});
      })

      connection.release();
    }
  })
})

router.post("/add-schedule", function(req, res, next) {
  let body = [];
  req.on("data", chunk => {body.push(chunk)});
  req.on("end", e => {
    body = Buffer.concat(body).toString();
    req.body = body !== "" ? JSON.parse(body) : undefined;
    next();
  })
}, function(req, res) {
  const param = req.body;
  param.name = param.name.trim();
  param.color = param.color.trim();
  param.content = param.content.trim();
  param.start = param.start.trim();
  param.end = param.end.trim();
  param.group = param.group.trim();

  if(param.name == "") {
    res.send({alert: "스케줄 명을 입력해주세요."});
  }else if(param.start == "") {
    res.send({alert: "시작 날짜를 입력해주세요."});
  }else if(param.end == "") {
    res.send({alert: "끝 날짜를 입력해주세요."});
  }else {
    connection.query(`INSERT INTO schedule(name, color, content, create_user, type, alert, start_date, end_date, create_date, update_date) VALUES('${param.name}', '${param.color}', '${param.content}', ${req.session.user.no}, '${param.group}', FALSE, '${param.start}', '${param.end}', now(), now());`, (err, result) => {
      if(err) throw err;

      res.send({state: "SUCCESS"});
    })
  }
})

router.post("/get-team", function(req, res, next) {
  if(req.session.user.id == "login-test") return res.send({state: "SUCCESS", result: [{no: 1, name: "test team", color: "#abc", member: [{no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -1, id: "login-test", name: null, position: "leader"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}]}, {no: 1, name: "test team", color: "#abc", member: [{no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -1, id: "login-test", name: null, position: "leader"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}]}, {no: 1, name: "test team", color: "#abc", member: [{no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -1, id: "login-test", name: null, position: "leader"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}]}, {no: 1, name: "test team", color: "#abc", member: [{no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -1, id: "login-test", name: null, position: "leader"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}]}, {no: 1, name: "test team", color: "#852", member: [{no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -1, id: "login-test", name: null, position: "leader"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}]}, {no: 1, name: "test team", color: "#abc", member: [{no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -1, id: "login-test", name: null, position: "leader"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}]}]});

  pool.getConnection((err, connection) => {
    if(err) throw err;
    else {
      connection.query(`SELECT gr.group_no as no, gr.name as name, color, position, alert FROM scheduler.group gr, member where gr.group_no = member.group_no AND member.user_no = ${req.session.user.no}`, (err, result) => {
        if(err) throw err;

        const teamList = result;
        let loadTeamCount = 0;

        for(let i = 0; i < teamList.length; i++) {
          const team = teamList[i];

          connection.query(`SELECT user.user_no as no, id, email, name, cell_no, position FROM user, member WHERE member.user_no = user.user_no AND group_no = ${team.no}`, (err, result) => {
            if(err) throw err;

            loadTeamCount++;
            team.member = result;
      
            if(loadTeamCount == teamList.length) {
              req.session.user.team = teamList;
              res.send({state: "SUCCESS", result: teamList});
            }
          })
        }
      })
      
      connection.release();
    }
  })
})

router.post("/create-team", function(req, res, next) {
  let body = [];
  req.on("data", chunk => {body.push(chunk)});
  req.on("end", e => {
    body = Buffer.concat(body).toString();
    req.body = body !== "" ? JSON.parse(body) : undefined;
    next();
  })
}, function(req, res) {
  const param = req.body;
  param.name = param.name.trim();
  param.color = param.color.trim();

  if(param.name == "") {
    res.send({alert: "팀 명을 입력해주세요."});
  }else {
    const exCode = new Date().getTime().toString() + Math.floor(Math.random() * 10).toString();

    pool.getConnection((err, connection) => {
      if(err) throw err;
      else {
        connection.query(`INSERT INTO scheduler.group(name, color, create_date, update_date) VALUES('${exCode}', '${param.color}', now(), now())`, (err, result) => {
          if(err) throw err;

          connection.query(`SELECT group_no as no FROM scheduler.group WHERE name = '${exCode}'`, (err, result) => {
            if(err) throw err;

            const groupNo = result[0].no;

            connection.query(`INSERT INTO member(group_no, user_no, position, alert, create_date, update_date) VALUES(${groupNo}, ${req.session.user.no}, 'leader', FALSE, now(), now())`, (err, result) => {
              if(err) throw err;
  
              connection.query(`UPDATE scheduler.group SET name = '${param.name}' WHERE group_no = ${groupNo}`, (err, result) => {
                if(err) throw err;
    
                res.send({state: "SUCCESS"});
              })
            })
          })
        })
        
        connection.release();
      }
    })
  }
})

const DBfunction = e => {
  pool.getConnection((err, connection) => {
    if(err) throw err;
    else {
      connection.query(`SELECT 1`, (err, result) => {
        if(err) throw err;
      })
       
      connection.release();
    }
  })

  DBquery = setTimeout(e => {DBfunction()}, 1000);
}

let DBquery = setTimeout(e => {DBfunction()}, 1000);

module.exports = router;