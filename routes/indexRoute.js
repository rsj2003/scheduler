const express = require("express");
const url = require("url");
const concat = require("concat-stream");
const router = express.Router();

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
    req.session.user = {id: param.id, email: `${param.id}@mail.com`};
    res.send({state: "SUCCESS", user: req.session.user});
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