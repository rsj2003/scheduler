const express = require("express");
const url = require("url");
const router = express.Router();

const render = (re, html, data = {}) => {
  const req = re.req;
  const res = re.res;

  if(req.session.user) {
    data.user = req.session.user;
  }

  html = `${html}.html`;

  return res.render(html, data);
}

const toActionPage = (res, page) => {
  return res.redirect(url.format({
    pathname: "/action",
    query: {
      page
    }
  }));
}

const returnPage = (res, alert = "") => {
  return res.redirect(url.format({
    pathname: "/alert",
    query: {
      alert
    }
  }));
}

router.get("/", function(req, res, next) {
  if(req.session.user) {
    render({res, req}, "index");
  }else {
    render({res, req}, "login");
  }
})

router.get("/action", function(req, res, next) {
  const page = req.query.page;
  render({res, req}, "action", {page});
})

router.get("/alert", function(req, res, next) {
  const alert = req.query.alert;
  render({res, req}, "alert", {alert});
})

router.post("/login-action", function(req, res, next) {
  const param = req.body;
  if(param.id.trim() == "") {
    returnPage(res, "id를 입력해주세요.");
  }else {
    req.session.user = {id: param.id};
    toActionPage(res, "/");
  }
})

router.post("/logout-action", function(req, res, next) {
  req.session.user = null;
  toActionPage(res, "/");
})

module.exports = router;