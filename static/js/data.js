const today = new Date();
const page = {x: 0, y: 0, w: 0, h: 0};
const schedulesData = [{
  no: 1,
  name: "test",
  color: "#cdedda",
  content: "this is text schedule",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2022-11-14 12:00:00",
  endDate: "2022-11-18 18:00:00"
},{
  no: 2,
  name: "test2",
  color: "#cddaed",
  content: "this is text schedule2",
  createUser: 3,
  type: -1,
  alert: 0,
  startDate: "2022-11-18 12:00:00",
  endDate: "2022-11-18 18:00:00"
},{
  no: 3,
  name: "test3",
  color: "#daedcd",
  content: "this is text schedule3",
  createUser: 2,
  type: 1,
  alert: 0,
  startDate: "2022-11-14 12:00:00",
  endDate: "2022-11-29 18:00:00"
},{
  no: 4,
  name: "test4",
  color: "#257854",
  content: "this is text schedule4",
  createUser: 2,
  type: -1,
  alert: 0,
  startDate: "2022-11-21 12:00:00",
  endDate: "2022-11-21 18:00:00"
},{
  no: 5,
  name: "test5",
  color: "#257854",
  content: "this is text schedule5",
  createUser: -1,
  type: 1,
  alert: 0,
  startDate: "2022-11-21 12:00:00",
  endDate: "2022-11-21 18:00:00"
},{
  no: 6,
  name: "test6",
  color: "#257854",
  content: "this is text schedule6",
  createUser: 1,
  type: 1,
  alert: 0,
  startDate: "2022-11-21 12:00:00",
  endDate: "2022-11-21 18:00:00"
},{
  no: 7,
  name: "test7",
  color: "#257854",
  content: "this is text schedule7",
  createUser: 1,
  type: -1,
  alert: 0,
  startDate: "2022-11-21 12:00:00",
  endDate: "2022-11-21 18:00:00"
},{
  no: 8,
  name: "test8",
  color: "#54dfa2",
  content: "this is text schedule8",
  createUser: 2,
  type: -1,
  alert: 0,
  startDate: "2022-11-16 12:00:00",
  endDate: "2022-12-01 18:00:00"
},{
  no: 9,
  name: "test9",
  color: "#fa12cd",
  content: "this is text schedule9",
  createUser: -1,
  type: 1,
  alert: 0,
  startDate: "2023-01-23 12:00:00",
  endDate: "2023-01-25 18:00:00"
},{
  no: 10,
  name: "test10",
  color: "#caa5fd",
  content: "this is text schedule10",
  createUser: 2,
  type: -1,
  alert: 0,
  startDate: "2023-01-25 12:00:00",
  endDate: "2023-01-27 18:00:00"
},{
  no: 11,
  name: "test11",
  color: "#853459",
  content: "this is text schedule11",
  createUser: -1,
  type: 1,
  alert: 0,
  startDate: "2023-01-26 12:00:00",
  endDate: "2023-01-31 18:00:00"
},{
  no: 12,
  name: "test12",
  color: "#92cd76",
  content: "this is text schedule12",
  createUser: 2,
  type: 1,
  alert: 0,
  startDate: "2023-01-28 12:00:00",
  endDate: "2023-01-29 18:00:00"
},{
  no: 13,
  name: "test13",
  color: "#e5f46d",
  content: "this is text schedule13",
  createUser: -1,
  type: 1,
  alert: 0,
  startDate: "2023-01-029 12:00:00",
  endDate: "2023-01-30 18:00:00"
},{
  no: 14,
  name: "test14",
  color: "#5e8cf4",
  content: "this is text schedule14",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2023-01-29 12:00:00",
  endDate: "2023-02-07 18:00:00"
},{
  no: 15,
  name: "test15",
  color: "#5e8cf4",
  content: "this is text schedule15",
  createUser: 1,
  type: -1,
  alert: 0,
  startDate: "2022-11-19 12:00:00",
  endDate: "2022-11-19 18:00:00"
},{
  no: 16,
  name: "test16",
  color: "#5e8cf4",
  content: "this is text schedule16",
  createUser: 1,
  type: -1,
  alert: 0,
  startDate: "2022-11-01 12:00:00",
  endDate: "2022-11-13 18:00:00"
},{
  no: 17,
  name: "test17",
  color: "#5e8cb4",
  content: "this is text schedule17",
  createUser: 1,
  type: -1,
  alert: 0,
  startDate: "2022-11-07 12:00:00",
  endDate: "2022-11-12 18:00:00"
},{
  no: 18,
  name: "test18",
  color: "#5edcc4",
  content: "this is text schedule18",
  createUser: 1,
  type: 1,
  alert: 0,
  startDate: "2022-11-06 12:00:00",
  endDate: "2022-11-08 18:00:00"
},{
  no: 19,
  name: "test19",
  color: "#9e8cd4",
  content: "this is text schedule19",
  createUser: 1,
  type: -1,
  alert: 0,
  startDate: "2022-12-12 12:00:00",
  endDate: "2022-12-27 18:00:00"
},{
  no: 20,
  name: "test20",
  color: "#5e8cf4",
  content: "this is text schedule20",
  createUser: 1,
  type: -1,
  alert: 0,
  startDate: "2022-12-21 12:00:00",
  endDate: "2022-12-25 18:00:00"
},{
  no: 21,
  name: "test21",
  color: "#5e8cb4",
  content: "this is text schedule21",
  createUser: 1,
  type: -1,
  alert: 0,
  startDate: "2022-12-16 12:00:00",
  endDate: "2022-12-23 18:00:00"
},{
  no: 22,
  name: "test22",
  color: "#5edcc4",
  content: "this is text schedule22",
  createUser: 1,
  type: 1,
  alert: 0,
  startDate: "2022-12-25 12:00:00",
  endDate: "2022-12-27 18:00:00"
},{
  no: 23,
  name: "test23",
  color: "#5fdcb4",
  content: "this is text schedule23",
  createUser: 1,
  type: 1,
  alert: 0,
  startDate: "2022-12-13 12:00:00",
  endDate: "2022-12-16 18:00:00"
}];


// index.js
let popupOpened = false;
let rightSideOpen = false;
let leftSideOpen = false;
let leftSideOpened = true;


// calendar.js
let calendarMonth = undefined;
let prevTop = 0;
let nextTop = 0;
let moveMonth = false;
let dateScheduleList = [];
let scheduleLoaded = false;
let scheduleTrim = 0;
let scheduleTrimList = [];
let teamScheduleType = 1;
let teamSchedulePrevType = teamScheduleType;
let isToggleTimeout = false;
let disable = [];
let schedules = [];
let moreHoverIdx = 0;
let moreHeight = 0;
let todayDoList = [];


// login.js
let isLogined = false;
let user = {};