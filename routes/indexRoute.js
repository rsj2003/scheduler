const express = require("express");
const url = require("url");
const concat = require("concat-stream");
const router = express.Router();
const mysql = require("mysql");
const conn = mysql.createConnection({
  host: '158.247.239.116',
  user: 'root',
  password: '=M8om+hJmasabs-L',
  database: 'scheduler'
})

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
  param.id = param.id.trim();

  if(param.id == "") {
    res.send({alert: "id를 입력해주세요."});
  }else {
    conn.connect();
    
    conn.query(`INSERT INTO user(id, email, password, alert, create_date, update_date) VALUES('${param.id}', '${param.email}', '${param.password}', FALSE, now(), now());`)

    conn.end();
    res.send({state: "SUCCESS", id: param.id});
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
  
  if(param.id.trim() == "") {
    res.send({alert: "id를 입력해주세요."});
  }else {
    conn.connect();
    
    conn.query(`SELECT id, email, name, cell_no as cellNo, alert FROM user WHERE id = '${param.id}' AND password = '${param.password}'`).then(res => {
      console.log(res);
      req.session.user = {id: param.id, email: `${param.id}@mail.com`};
      res.send({state: "SUCCESS", user: req.session.user});
    })

    conn.end();
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

module.exports = router;