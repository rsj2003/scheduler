const express = require("express");
const session = require("express-session")({
  secret: "seungjae-schedule",
  resave: true,
  saveUninitialized: true
});
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = app.listen(process.env.PORT || 80);

const userList = [];
exports.userList = userList;

const indexRouter = require(__dirname + "/routes/indexRoute");

app.use(session)

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set("views", __dirname + "/static/views");

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use("/css", express.static(__dirname + "/static/css"));
app.use("/js", express.static(__dirname + "/static/js"));
app.use("/img", express.static(__dirname + "/static/image"));
app.use("/font", express.static(__dirname + "/static/font/css"));
app.use("/fonts", express.static(__dirname + "/static/font"));

app.use(express.static(__dirname + "/public"));

function page(url, router = indexRouter) {
  app.use(url, router);
}

page("/");

module.exports = app;

server.listen(port, function() {
  console.log("server starting..");
})