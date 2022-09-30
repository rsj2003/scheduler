const express = require("express");
const url = require("url");
const router = express.Router();

const render = (re, html, data = {}) => {
  const req = re.req;
  const res = re.res;

  if(req.session.user) {
    data.user = req.session.user;
  }

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

router.get("/", function(req, res, next) {
  if(req.session.user) {
    render({res, req}, "home.html");
  }else {
    render({res, req}, "index.html");
  }
})

router.get("/action", function(req, res, next) {
  const page = req.query.page;
  render({res, req}, "action.html", {page});
})

router.post("/login-action", function(req, res, next) {
  req.session.user = {id: req.body.id};
  toActionPage(res, "/");
})

router.post("/logout-action", function(req, res, next) {
  req.session.user = null;
  toActionPage(res, "/");
})

module.exports = router;