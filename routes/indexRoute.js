const express = require("express");
const url = require("url");
const concat = require("concat-stream");
const router = express.Router();
const mysql = require("mysql");
const crypto = require("crypto");

const getConn = e => mysql.createConnection({
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
    if(param.id.match(/[^a-z|0-9]/g)) {
      res.send({alert: "id에는 영어와 숫자만 사용해주세요."});
    }
    const conn = getConn();
    conn.connect();
    
    conn.query(`SELECT id FROM user WHERE id = '${param.id}'`, (err, result, fields) => {
      if(err) throw err;

      if(result.length > 0) {
        res.send({alert: "이미 사용중인 id입니다."});
      }else {
        const conn = getConn();
        conn.connect();

        conn.query(`INSERT INTO user(id, email, password, alert, create_date, update_date) VALUES('${param.id}', '${param.email}', '${cipher(param.password)}', FALSE, now(), now());`, (err, result, fields) => {
          if(err) throw err;

          console.log("register");
          console.log({id: param.id, email: param.email});
          res.send({state: "SUCCESS", id: param.id});
        })
        
        conn.end();
      }
    })

    conn.end();
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
    const conn = getConn();
    conn.connect();
    
    conn.query(`SELECT id, email, name, cell_no as cellNo, alert FROM user WHERE id = '${param.id}' AND password = '${cipher(param.password)}'`, (err, result, fields) => {
      if(err) throw err;
      
      if(result.length > 0) {
        console.log("login");
        console.log(result[0]);
        let account = result[0];
        req.session.user = account;
        res.send({state: "SUCCESS", user: req.session.user});
      }else {
        res.send({alert: "id와 비밀번호가 일치하지 않습니다."});
      }
    })

    conn.end();
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
  
  res.send({state: "SUCCESS", user: {id: "login-test", email: "test-account-email", name: "tester", cellNo: "000", alert: 0}});
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

module.exports = router;