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
    if(req.session.user.id == "login-test") {
      req.session.user = {no: -1, id: "login-test", email: "test-account-email", name: "tester", cellNo: "000", alert: 0, team: []};
      res.send({user: req.session.user});
      return;
    }

    pool.getConnection((err, connection) => {
      if(err) throw err;
      else {
        try{
          connection.query(`SELECT user_no as no, id, email, name, cell_no as cellNo, alert FROM user WHERE id = ${connection.escape(req.session.user.id)} AND user_no = ${connection.escape(req.session.user.no)}`, (err, result) => {
            if(err) throw err;
  
            if(result.length > 0) {
              let account = result[0];
  
              connection.query(`SELECT gr.group_no as no, gr.name as name, color, position, alert FROM scheduler.group gr, member where gr.group_no = member.group_no AND member.user_no = ${connection.escape(account.no)}`, (err, result) => {
                if(err) throw err;
            
                account.team = result;
                req.session.user = account;

                res.send({user: account});
              })
            }else {
              res.send({alert: "id와 비밀번호가 일치하지 않습니다.", user: {}});
            }
          })
        }catch(err) {
          res.send({alert: "오류가 발생했습니다.", user: {}});
        }

        connection.release();
      }
    })
  }else {
    res.send({user: {}});
  }
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
  }else if(param.id.length > 25) {
    res.send({alert: "id 길이가 너무 깁니다."});
  }else if(param.password == "") {
    res.send({alert: "비밀번호를 입력해주세요."});
  }else if(param.password.length > 50) {
    res.send({alert: "비밀번호 길이가 너무 깁니다."});
  }else if(param.email == "") {
    res.send({alert: "이메일를 입력해주세요."});
  }else if(param.email.length > 50) {
    res.send({alert: "이메일 길이가 너무 깁니다."});
  }else {
    if(param.id == "login-test") {
      console.log("register-test");
      console.log({id: param.id, email: param.email});
      res.send({state: "SUCCESS", id: param.id});
      return;
    }
    if(param.id.match(/[^a-z|0-9]/g)) {
      res.send({alert: "id에는 영어와 숫자만 사용해주세요."});
      return;
    }

    pool.getConnection((err, connection) => {
      if(err) throw err;
      else {
        try{
          connection.query(`SELECT id FROM user WHERE id = '${param.id}'`, (err, result) => {
            if(err) throw err;
  
            if(result.length > 0) {
              res.send({alert: "이미 사용중인 id입니다."});
            }else {
              connection.query(`INSERT INTO user(id, email, password, alert, create_date, update_date) VALUES(${connection.escape(param.id)}, ${connection.escape(param.email)}, ${connection.escape(cipher(param.password))}, FALSE, now(), now());`, (err, result) => {
                if(err) throw err;
      
                console.log("register");
                console.log({id: param.id, email: param.email});
                res.send({state: "SUCCESS", id: param.id});
              })
            }
          })
        }catch(err) {
          res.send({alert: "오류가 발생했습니다."});
        }

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
  }else if(param.id.length > 25) {
    res.send({alert: "id가 잘못되었습니다."});
  }else if(param.password == "") {
    res.send({alert: "비밀번호를 입력해주세요."});
  }else if(param.password.length > 50) {
    res.send({alert: "비밀번호가 잘못되었습니다."});
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
        try{
          connection.query(`SELECT user_no as no, id, email, name, cell_no as cellNo, alert FROM user WHERE id = ${connection.escape(param.id)} AND password = ${connection.escape(cipher(param.password))}`, (err, result) => {
            if(err) throw err;
  
            if(result.length > 0) {
              let account = result[0];
  
              connection.query(`SELECT gr.group_no as no, gr.name as name, color, position, alert FROM scheduler.group gr, member where gr.group_no = member.group_no AND member.user_no = ${connection.escape(account.no)}`, (err, result) => {
                if(err) throw err;
            
                account.team = result;
  
                console.log("login");
                console.log({no: account.no, id: account.id, email: account.email, name: account.name, cellNo: account.cellNo});
                req.session.user = account;
                res.send({state: "SUCCESS", user: req.session.user});
              })
            }else {
              res.send({alert: "id와 비밀번호가 일치하지 않습니다."});
            }
          })
        }catch(err) {
          res.send({alert: "오류가 발생했습니다."});
        }

        connection.release();
      }
    })
  }
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
      try{
        let sql = `SELECT schedule_no as no, name, color, content, type, alert, start_date as startDate, end_date as endDate, create_user as createUser FROM schedule where create_user = ${connection.escape(req.session.user.no)}`;
        const teamList = req.session.user.team;
      
        for(let i = 0; i < teamList.length; i++) {
          sql += ` OR type = ${teamList[i].no}`;
        }
  
        connection.query(sql, (err, result) => {
          if(err) throw err;
  
          res.send({state: "SUCCESS", result: result});
        })
      }catch(err) {
        res.send({alert: "오류가 발생했습니다."});
      }

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
  }else if(param.name.length > 25) {
    res.send({alert: "스케줄 명 길이가 너무 깁니다."});
  }else if(param.start == "") {
    res.send({alert: "시작 날짜를 입력해주세요."});
  }else if(param.end == "") {
    res.send({alert: "끝 날짜를 입력해주세요."});
  }else if(param.start > param.end || param.start < '2000-01-01' || param.end < '2000-01-01' || param.start > '3000-01-01' || param.end > '3000-01-01') {
    res.send({alert: "스케줄 기간이 잘못되었습니다."});
  }else {
    pool.getConnection((err, connection) => {
      if(err) throw err;
      else {
        try{
          connection.query(`INSERT INTO schedule(name, color, content, create_user, type, alert, start_date, end_date, create_date, update_date) VALUES(${connection.escape(param.name)}, ${connection.escape(param.color)}, ${connection.escape(param.content)}, ${connection.escape(req.session.user.no)}, ${connection.escape(param.group)}, FALSE, ${connection.escape(param.start)}, ${connection.escape(param.end)}, now(), now());`, (err, result) => {
            if(err) throw err;
  
            res.send({state: "SUCCESS"});
          })
        }catch(err) {
          res.send({alert: "오류가 발생했습니다."});
        }

        connection.release();
      }
    })
  }
})

router.post("/get-team", function(req, res, next) {
  if(req.session.user.id == "login-test") return res.send({state: "SUCCESS", result: [{no: 1, name: "test team", color: "#abc", member: [{no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -1, id: "login-test", name: null, position: "leader"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}]}, {no: 1, name: "test team", color: "#abc", member: [{no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -1, id: "login-test", name: null, position: "leader"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}]}, {no: 1, name: "test team", color: "#abc", member: [{no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -1, id: "login-test", name: null, position: "leader"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}]}, {no: 1, name: "test team", color: "#abc", member: [{no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -1, id: "login-test", name: null, position: "leader"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}]}, {no: 1, name: "test team", color: "#852", member: [{no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -1, id: "login-test", name: null, position: "leader"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}]}, {no: 1, name: "test team", color: "#abc", member: [{no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -1, id: "login-test", name: null, position: "leader"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}, {no: -2, id: "login-test2", name: "teseter", position: "member"}]}]});

  pool.getConnection((err, connection) => {
    if(err) throw err;
    else {
      try{
        connection.query(`SELECT gr.group_no as no, gr.name as name, color, position, alert FROM scheduler.group gr, member where gr.group_no = member.group_no AND member.user_no = ${connection.escape(req.session.user.no)}`, (err, result) => {
          if(err) throw err;
  
          const teamList = result;
          let loadTeamCount = 0;
  
          if(teamList.length > 0) {
            for(let i = 0; i < teamList.length; i++) {
              const team = teamList[i];
    
              connection.query(`SELECT user.user_no as no, id, email, name, cell_no, position FROM user, member WHERE member.user_no = user.user_no AND group_no = ${connection.escape(team.no)}`, (err, result) => {
                if(err) throw err;
    
                loadTeamCount++;
                team.member = result;
          
                if(loadTeamCount == teamList.length) {
                  req.session.user.team = teamList;
    
                  res.send({state: "SUCCESS", result: teamList});
                }
              })
            }
          }else {
            req.session.user.team = [];
  
            res.send({state: "SUCCESS", result: []});
          }
  
        })
      }catch(err) {
        res.send({alert: "오류가 발생했습니다."});
      }
      
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
  }else if(param.name.length > 25) {
    res.send({alert: "팀 명 길이가 너무 깁니다."});
  }else {
    const exCode = new Date().getTime().toString() + Math.floor(Math.random() * 10).toString();

    pool.getConnection((err, connection) => {
      if(err) throw err;
      else {
        try{
          connection.query(`INSERT INTO scheduler.group(name, color, create_date, update_date) VALUES(${connection.escape(exCode)}, ${connection.escape(param.color)}, now(), now())`, (err, result) => {
            if(err) throw err;
  
            connection.query(`SELECT group_no as no FROM scheduler.group WHERE name = ${connection.escape(exCode)}`, (err, result) => {
              if(err) throw err;
  
              const groupNo = result[0].no;
  
              connection.query(`INSERT INTO member(group_no, user_no, position, alert, create_date, update_date) VALUES(${connection.escape(groupNo)}, ${connection.escape(req.session.user.no)}, 'leader', FALSE, now(), now())`, (err, result) => {
                if(err) throw err;
    
                connection.query(`UPDATE scheduler.group SET name = ${connection.escape(param.name)} WHERE group_no = ${connection.escape(groupNo)}`, (err, result) => {
                  if(err) throw err;
      
                  res.send({state: "SUCCESS"});
                })
              })
            })
          })
        }catch(err) {
          res.send({alert: "오류가 발생했습니다."});
        }
        
        connection.release();
      }
    })
  }
})

router.post("/invite-team", function(req, res, next) {
  let body = [];
  req.on("data", chunk => {body.push(chunk)});
  req.on("end", e => {
    body = Buffer.concat(body).toString();
    req.body = body !== "" ? JSON.parse(body) : undefined;
    next();
  })
}, function(req, res) {
  const param = req.body;
  param.uid = param.uid.trim().toLocaleLowerCase();

  if(param.uid == "") {
    res.send({alert: "초대할 유저의 id를 입력해주세요."});
  }else if(param.uid.length > 25) {
    res.send({alert: "id 길이가 너무 깁니다."});
  }else if(param.no.length == 0) {
    res.send({alert: "초대할 팀을 선택해주세요."});
  }else if(param.no.length > 10) {
    res.send({alert: "초대할 팀이 잘못되었습니다."});
  }else if(param.uid.match(/[^a-z|0-9]/g)) {
    res.send({alert: "id에는 영어와 숫자만 입력해주세요."});
  }else {
    pool.getConnection((err, connection) => {
      if(err) throw err;
      else {
        try{
          connection.query(`SELECT user_no as no FROM user WHERE id = ${connection.escape(param.uid)}`, (err, result) => {
            if(err) throw err;
            
            if(result.length > 0) {
              let insertInviteCount = 0;
  
              const userNo = result[0].no;
              
              for(let i = 0; i < param.no.length; i++) {
                const groupNo = param.no[i];
                connection.query(`SELECT invite_no FROM invite WHERE user_no = ${connection.escape(userNo)} AND group_no = ${connection.escape(groupNo)}`, (err, result) => {
                  if(err) throw err;
                  
                  if(result.length == 0) {
                    connection.query(`SELECT member_no FROM member WHERE user_no = ${connection.escape(userNo)} AND group_no = ${connection.escape(groupNo)}`, (err, result) => {
                      if(err) throw err;
                      
                      if(result.length == 0) {
                        connection.query(`INSERT INTO invite(group_no, user_no, create_date, update_date) VALUES(${connection.escape(groupNo)}, ${connection.escape(userNo)}, now(), now())`, (err, result) => {
                          if(err) throw err;
                          
                          insertInviteCount++;
  
                          if(insertInviteCount == param.no.length) {
                            res.send({state: "SUCCESS"});
                          }
                        })
                      }else {
                        insertInviteCount++;
  
                        if(insertInviteCount == param.no.length) {
                          res.send({state: "SUCCESS"});
                        }
                      }
                    })
                  }else {
                    insertInviteCount++;
  
                    if(insertInviteCount == param.no.length) {
                      res.send({state: "SUCCESS"});
                    }
                  }
                })
              }
            }else {
              res.send({alert: "존재하지 않는 id입니다."});
            }
          })
        }catch(err ){
          res.send({alert: "오류가 발생했습니다."});
        }
          
        connection.release();
      }
    })
  }
})

router.post("/get-request", function(req, res, next) {
  pool.getConnection((err, connection) => {
    if(err) throw err;
    else {
      try{
        connection.query(`SELECT gr.group_no as no, gr.name as name, gr.color as color FROM invite inv, scheduler.group gr where gr.group_no = inv.group_no AND user_no = ${connection.escape(req.session.user.no)}`, (err, result) => {
          if(err) throw err;
  
          res.send({state: "SUCCESS", result: result});
        })
      }catch(err) {
        res.send({alert: "오류가 발생했습니다."});
      }
      
      connection.release();
    }
  })
})

router.post("/get-request-count", function(req, res, next) {
  if(req.session.user.id == "login-test") return res.send({state: "SUCCESS", result: {count: 0}});

  pool.getConnection((err, connection) => {
    if(err) throw err;
    else {
      try{
        connection.query(`SELECT count(*) as count FROM invite where user_no = ${connection.escape(req.session.user.no)}`, (err, result) => {
          if(err) throw err;
  
          res.send({state: "SUCCESS", result: result[0]});
        })
      }catch(err) {
        res.send({alert: "오류가 발생했습니다."});
      }
      
      connection.release();
    }
  })
})

router.post("/accept-request", function(req, res, next) {
  let body = [];
  req.on("data", chunk => {body.push(chunk)});
  req.on("end", e => {
    body = Buffer.concat(body).toString();
    req.body = body !== "" ? JSON.parse(body) : undefined;
    next();
  })
}, function(req, res) {
  const param = req.body;
  const groupNo = param.groupNo;

  pool.getConnection((err, connection) => {
    if(err) throw err;
    else {
      try{
        connection.query(`SELECT invite_no FROM invite WHERE user_no = ${connection.escape(req.session.user.no)} AND group_no = ${connection.escape(groupNo)}`, (err, result) => {
          if(err) throw err;
          
          if(result.length > 0) {
            connection.query(`SELECT member_no FROM member WHERE user_no = ${connection.escape(req.session.user.no)} AND group_no = ${connection.escape(groupNo)}`, (err, result) => {
              if(err) throw err;
      
              let memberLenth = result.length;
  
              connection.query(`DELETE FROM invite WHERE user_no = ${connection.escape(req.session.user.no)} AND group_no = ${connection.escape(groupNo)}`, (err, result) => {
                if(err) throw err;
        
                if(memberLenth == 0) {
                  connection.query(`INSERT INTO member(group_no, user_no, position, alert, create_date, update_date) VALUES(${connection.escape(groupNo)}, ${connection.escape(req.session.user.no)}, 'member', FALSE, now(), now())`, (err, result) => {
                    if(err) throw err;
            
                    res.send({state: "SUCCESS"});
                  })
                }else {
                  res.send({alert: "이미 가입된 팀입니다."});
                }
              })
            })
          }else {
            res.send({alert: "존재하지 않는 초대 입니다."});
          }
        })
      }catch(err) {
        res.send({alert: "오류가 발생했습니다."});
      }
      
      connection.release();
    }
  })
})

router.post("/refuse-request", function(req, res, next) {
  let body = [];
  req.on("data", chunk => {body.push(chunk)});
  req.on("end", e => {
    body = Buffer.concat(body).toString();
    req.body = body !== "" ? JSON.parse(body) : undefined;
    next();
  })
}, function(req, res) {
  const param = req.body;
  const groupNo = param.groupNo;

  pool.getConnection((err, connection) => {
    if(err) throw err;
    else {
      try{
        connection.query(`DELETE FROM invite WHERE user_no = ${connection.escape(req.session.user.no)} AND group_no = ${connection.escape(groupNo)}`, (err, result) => {
          if(err) throw err;
          
          res.send({state: "SUCCESS"});
        })
      }catch(err) {
        res.send({alert: "오류가 발생했습니다."});
      }
      
      connection.release();
    }
  })
})

router.post("/modify-user", function(req, res, next) {
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
  param.cellNo = param.cellNo.trim();

  if(param.name.length > 25) {
    res.send({alert: "이름 길이가 너무 깁니다."});
  }else if(param.cellNo.length > 25) {
    res.send({alert: "전화번호 길이가 너무 깁니다."});
  }else if(param.cellNo.match(/[^0-9|\-]/g)) {
    res.send({alert: "전화번호가 잘못되었습니다."});
  }else {
    pool.getConnection((err, connection) => {
      if(err) throw err;
      else {
        try{
          let sql = `UPDATE user SET name = ${connection.escape(param.name)}, cell_no = ${connection.escape(param.cellNo)}`;

          sql += ` WHERE user_no = ${connection.escape(req.session.user.no)}`;

          connection.query(sql, (err, result) => {
            if(err) throw err;
            
            res.send({state: "SUCCESS"});
          })
        }catch(err) {
          res.send({alert: "오류가 발생했습니다."});
        }
        
        connection.release();
      }
    })
  }
})

router.post("/delete-schedule", function(req, res, next) {
  let body = [];
  req.on("data", chunk => {body.push(chunk)});
  req.on("end", e => {
    body = Buffer.concat(body).toString();
    req.body = body !== "" ? JSON.parse(body) : undefined;
    next();
  })
}, function(req, res) {
  const param = req.body;
  param.no = param.no

  pool.getConnection((err, connection) => {
    if(err) throw err;
    else {
      try{
        connection.query(`SELECT schedule_no as no, name, color, content, type, alert, start_date as startDate, end_date as endDate, create_user as createUser FROM schedule WHERE schedule_no = ${connection.escape(param.no)}`, (err, result) => {
          if(err) throw err;
          
          if(result.length == 0) {
            res.send({alert: "존재하지 않는 스케줄입니다."});
          }else {
            let schedule = result[0];

            if(schedule.createUser == req.session.user.no) {
              connection.query(`DELETE FROM schedule WHERE schedule_no = ${connection.escape(param.no)}`, (err, result) => {
                if(err) throw err;

                res.send({state: "SUCCESS"});
              })
            }else {
              connection.query(`SELECT position FROM member WHERE group_no = ${connection.escape(schedule.type)} AND user_no = ${connection.escape(req.session.user.no)}`, (err, result) => {
                if(err) throw err;

                if(result.length == 0) {
                  res.send({alert: "이 스케줄을 삭제할 권한이 없습니다."});
                }else {
                  if(result[0].position == "leader") {
                    connection.query(`DELETE FROM schedule WHERE schedule_no = ${connection.escape(param.no)}`, (err, result) => {
                      if(err) throw err;
      
                      res.send({state: "SUCCESS"});
                    })
                  }else {
                    res.send({alert: "이 스케줄을 삭제할 권한이 없습니다."});
                  }
                }
              })
            }
          }
        })
      }catch(err) {
        res.send({alert: "오류가 발생했습니다."});
      }
      
      connection.release();
    }
  })
})

const DBfunction = e => {
  pool.getConnection((err, connection) => {
    if(err) throw err;
    else {
      try {
        connection.query(`SELECT 1`, (err, result) => {
          if(err) throw err;
        })
      }catch(err) {
      }
       
      connection.release();
    }
  })

  DBquery = setTimeout(e => {DBfunction()}, 1000);
}

// let DBquery = setTimeout(e => {DBfunction()}, 1000);

module.exports = router;