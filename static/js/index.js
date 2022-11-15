const $wrap = document.querySelector("#wrap");
const $alert = document.querySelectorAll(".alert");
const $alertPop = document.querySelectorAll(".alert-pop");
const $backgroundGrid = document.querySelector("#background .grid");
const $backgroundGridBackground = document.querySelector("#background .grid-background");
const $calendar = document.querySelector("#calendar");
const $calendarDateRel = document.querySelector("#date-rel");
const $calendarSide = document.querySelector("#calendar-side");
const $calendarArea = document.querySelector("#calendar-area");
const $date = document.querySelector("#date");
const $todayMonth = document.querySelector("#today-month");
const $todayDate = document.querySelector("#today-date");
const $userId = document.querySelector("#id span");
const $userEmail = document.querySelector("#email span");
const $thisMonth = document.querySelector("#this-month");
const $prevMonth = document.querySelector("#prev-month");
const $nextMonth = document.querySelector("#next-month");
const today = new Date();
const page = {x: 0, y: 0, w: 0, h: 0};
let calendarMonth = undefined;
let isLogined = false;
let prevTop = 0;
let nextTop = 0;
let moveMonth = false;
let dateScheduleList = [];
let schedules  = [{
  scheduleNo: 1,
  name: "test",
  color: "#cdedda",
  notice: "this is text schedule",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2022-11-14 12:00:00",
  endDate: "2022-11-18 18:00:00"
},{
  scheduleNo: 2,
  name: "test2",
  color: "#cddaed",
  notice: "this is text schedule2",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2022-11-18 12:00:00",
  endDate: "2022-11-18 18:00:00"
},{
  scheduleNo: 3,
  name: "test3",
  color: "#daedcd",
  notice: "this is text schedule3",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2022-11-14 12:00:00",
  endDate: "2022-11-29 18:00:00"
},{
  scheduleNo: 4,
  name: "test4",
  color: "#257854",
  notice: "this is text schedule4",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2022-11-21 12:00:00",
  endDate: "2022-11-21 18:00:00"
},{
  scheduleNo: 5,
  name: "test5",
  color: "#257854",
  notice: "this is text schedule5",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2022-11-21 12:00:00",
  endDate: "2022-11-21 18:00:00"
},{
  scheduleNo: 6,
  name: "test6",
  color: "#257854",
  notice: "this is text schedule6",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2022-11-21 12:00:00",
  endDate: "2022-11-21 18:00:00"
},{
  scheduleNo: 7,
  name: "test7",
  color: "#257854",
  notice: "this is text schedule7",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2022-11-21 12:00:00",
  endDate: "2022-11-21 18:00:00"
}];

const getTextColorByBackgroundColor = color => {
  const c = color.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luma < 127.5 ? "#fff" : "#333";
}

const resetAlert = e => {
  for(let i = 0; i < $alert.length; i++) {
    $alert[i].innerHTML = "";
  }
  for(let i = 0; i < $alertPop.length; i++) {
    $alertPop[i].style.display = "none";
  }
}

const setAlert = alert => {
  for(let i = 0; i < $alert.length; i++) {
    $alert[i].innerHTML = alert;
  }
  for(let i = 0; i < $alertPop.length; i++) {
    $alertPop[i].style.display = "block";
  }
}

const colIntoLine = ($line, year, month, date, classList, lineHeight) => {
  const $calendarDate = document.createElement("div");
  const thisHeight = lineHeight / 6;
  let rows = 1;

  if(today.getFullYear() == year && today.getMonth() + 1 == month && today.getDate() == date) {
    classList = JSON.parse(JSON.stringify(classList));
    classList.push("today");
  }

  for(let i = 0; i < classList.length; i++) {
    $calendarDate.classList.add(classList[i]);
  }

  if(date.toString().length == 1) date = `0${date}`;

  while(thisHeight / rows > 25) {
    rows++;
  }

  $calendarDate.innerHTML = `<span class="date flex"><p style="width: ${thisHeight / rows * 1.25}px">${date}</p></span>`;
  $calendarDate.style.gridTemplateRows = `repeat(${rows - 1}, 1fr)`;

  let insert = 0;
  let todo = [];
  for(let i = 0; i < schedules.length; i++) {
    let schedule = schedules[i];

    if(year == schedule.startDate.year && month == schedule.startDate.month && date == schedule.startDate.date) {
      insert++;
      todo.push(schedule);

      if(schedule.startDate.year != schedule.endDate.year || schedule.startDate.month != schedule.endDate.month || schedule.startDate.date != schedule.endDate.date) {
        if(schedule.startDate.year == schedule.endDate.year && schedule.startDate.month == schedule.endDate.month) {
          
        }
      }

      if(rows - 1 == insert) {
        const $schedule = $calendarDate.querySelector(".schedule:last-of-type");
        const $background = $schedule.querySelector("span");
        const $p = $schedule.querySelector("p");

        $background.style.background = "#ddd";
        $p.innerText = " ● ● ●";
        $p.style.fontSize = "10px";

        break;

      }else {
        const $schedule = document.createElement("span");
        const $background = document.createElement("span");
        const $p = document.createElement("p");
        
        $schedule.classList.add("schedule");
        $background.style.background = schedule.color;
        $p.style.color = getTextColorByBackgroundColor(schedule.color);
        $p.innerText = schedule.name;
        
        $background.append($p);
        $schedule.append($background);
        $calendarDate.append($schedule);
      }
    }
  }

  $line.append($calendarDate);
}

const setCalendar = (year, month) => {
  const thisMonth = new Date(year, month, 0);
  const prevMonth = new Date(year, month - 1, 0);
  const prevDataMonth = new Date(year, month - 2, 0);
  const nextMonth = new Date(year, month + 1, 0);
  const nextDataMonth = new Date(year, month + 2, 0);
  const monthList = [prevDataMonth, prevMonth, thisMonth, nextMonth, nextDataMonth];
  const calendarHeight = $calendarDateRel.clientHeight + 1;
  let nowMonth = 1;
  let nowDates = 0;
  let thisMonthLine = 0;

  $calendarDateRel.clientHeight = $calendarDateRel.clientHeight - ($calendarDateRel.clientHeight % 6 + 1);

  calendarMonth = new Date(year, month, 0);

  let thisCalendarYear = calendarMonth.getFullYear();
  let thisCalendarMonth = calendarMonth.getMonth() + 1;

  if(thisCalendarMonth <= 0) {
    thisCalendarMonth = 12 - thisCalendarMonth;
    thisCalendarYear--;
  }
  if(thisCalendarMonth >= 13) {
    thisCalendarMonth = thisCalendarMonth - 12;
    thisCalendarYear++;
  }

  $thisMonth.innerHTML = `${thisCalendarYear}.${thisCalendarMonth.toString().length > 1 ? thisCalendarMonth : "0" + thisCalendarMonth}`;

  const $removeDates = $date.querySelectorAll(".calendar-line");

  for(let i = 0; i < $removeDates.length; i++) {
    $removeDates[i].remove();
  }

  for(let i = 0; i < 6 * 3; i++) {
    const $calendarLine = document.createElement("div");
    $calendarLine.classList.add("calendar-line");

    if(i == 0) {
      for(let j = prevDataMonth.getDate() - prevDataMonth.getDay(); j <= prevDataMonth.getDate(); j++) {
        colIntoLine($calendarLine, monthList[nowMonth].getFullYear(), monthList[nowMonth].getMonth(), j, ["calendar-date", "prev-data-date"], calendarHeight);
      }
      
      for(let j = 0; j < 6 - prevDataMonth.getDay(); j++) {
        colIntoLine($calendarLine, monthList[nowMonth].getFullYear(), monthList[nowMonth].getMonth() + 1, j + 1, ["calendar-date", "prev-date"], calendarHeight);
        
        nowDates++;
      }

      if(monthList[0].getDay() == 6) prevTop = 110;
      else prevTop = 0;
    }else {
      let otherDates = monthList[nowMonth].getDate() > nowDates + 7 ? nowDates + 7 : monthList[nowMonth].getDate();
      let classList = ["calendar-date"];

      if(nowMonth == 1) classList.push("prev-date");
      if(nowMonth == 2) classList.push("this-date");
      if(nowMonth == 3) classList.push("next-date");
      if(nowMonth == 4) classList.push("next-data-date");

      for(let j = nowDates; j < otherDates; j++) {
        colIntoLine($calendarLine, monthList[nowMonth].getFullYear(), monthList[nowMonth].getMonth() + 1, j + 1, classList, calendarHeight);

        nowDates++;
      }
  
      if(nowDates == monthList[nowMonth].getDate()) {
        nowMonth++;
        nowDates = 0;
        
        let firstDate = 0;

        if(monthList[nowMonth - 1].getDay() == 6) firstDate = 1;

        if(nowMonth == 2) thisMonthLine = (i + firstDate);
        if(nowMonth == 3) nextTop = (i + firstDate) * calendarHeight / 6;
        
        let classList = ["calendar-date"];
        
        if(nowMonth == 1) classList.push("prev-date");
        if(nowMonth == 2) classList.push("this-date");
        if(nowMonth == 3) classList.push("next-date");
        if(nowMonth == 4) classList.push("next-data-date");
        
        if(nowMonth < 5) {
          for(let j = 0; j < 6 - monthList[nowMonth - 1].getDay(); j++) {
            colIntoLine($calendarLine, monthList[nowMonth].getFullYear(), monthList[nowMonth].getMonth() + 1, j + 1, classList, calendarHeight);
  
            nowDates++;
          }
        }else {
          break;
        }
      }
    }


    $date.append($calendarLine);
  }

  $date.style.height = `${calendarHeight * 3}px`;
  $date.style.top = `-${calendarHeight / 6 * thisMonthLine}px`;
  $date.style.gridTemplateRows = `repeat(${6 * 3}, 1fr)`;
  moveMonth = false;
}

const logined = e => {
  setCalendar(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1);

  if(!isLogined) {
    isLogined = true;
    let widthType = 0;


    if(page.w < 1920) widthType = 1;
    if(page.w < 1600) widthType = 2;

    setTimeout(e => {
      $calendarArea.style.opacity = "1";
      $calendarArea.style.transform = "scale(1)";
      $calendarArea.style.pointerEvents = "unset";

      setTimeout(e => {
        $calendarSide.style.left = "0";
      }, 250);
    }, 1000);
  }
}

const loadSchedules = e => {
  fetch("/get-schedules", {
    method: "POST",
    body: JSON.stringify({})
  })
  .then(req => req.json())
  .then(res => {
    if(res.state == "SUCCESS") {
      let result = res.result;
      if(result == "test");

      result = schedules;

      for(let i = 0; i < result.length; i++) {
        let schedule = result[i];
        let start = new Date(schedule.startDate);
        let end = new Date(schedule.endDate);

        schedule.startDate = {year: start.getFullYear(), month: start.getMonth() + 1, date: start.getDate(), day: start.getDay(), hour: start.getHours(), minutes: start.getMinutes()};
        schedule.endDate = {year: end.getFullYear(), month: end.getMonth() + 1, date: end.getDate(), day: end.getDay(), hour: end.getHours(), minutes: end.getMinutes()};
      }

      schedules = result;

      logined();
    }else {
      if(res.alert) {
        setAlert(res.alert);
      }
    }
  })
}

const prevMonthAni = e => {
  if(!moveMonth) {
    moveMonth = true;

    let thisCalendarYear = calendarMonth.getFullYear();
    let thisCalendarMonth = calendarMonth.getMonth();
  
    if(thisCalendarMonth <= 0) {
      thisCalendarMonth = 12 - thisCalendarMonth;
      thisCalendarYear--;
    }
    if(thisCalendarMonth >= 13) {
      thisCalendarMonth = thisCalendarMonth - 12;
      thisCalendarYear++;
    }
  
    $thisMonth.innerHTML = `${thisCalendarYear}.${thisCalendarMonth.toString().length > 1 ? thisCalendarMonth : "0" + thisCalendarMonth}`;
  
    const $thisDates = $date.querySelectorAll(".this-date");
    const $prevDates = $date.querySelectorAll(".prev-date");
  
    for(let i = 0; i < $thisDates.length; i++) {
      $thisDates[i].style.transition = ".8s";
    }
    for(let i = 0; i < $prevDates.length; i++) {
      $prevDates[i].style.transition = ".8s";
    }
    
    $date.style.transition = ".8s";
  
    setTimeout(e => {
      for(let i = 0; i < $thisDates.length; i++) {
        $thisDates[i].classList.add("next-date");
      }
      for(let i = 0; i < $prevDates.length; i++) {
        $prevDates[i].classList.remove("prev-date");
      }
  
      $date.style.top = `-${prevTop}px`;
  
      setTimeout(e => {
        $date.style.transition = "0s";
        setCalendar(thisCalendarYear, thisCalendarMonth);
      }, 800);
    }, 1);
  }
}

const nextMonthAni = e => {
  if(!moveMonth) {
    moveMonth = true;

    let thisCalendarYear = calendarMonth.getFullYear();
    let thisCalendarMonth = calendarMonth.getMonth() + 2;
  
    if(thisCalendarMonth <= 0) {
      thisCalendarMonth = 12 - thisCalendarMonth;
      thisCalendarYear--;
    }
    if(thisCalendarMonth >= 13) {
      thisCalendarMonth = thisCalendarMonth - 12;
      thisCalendarYear++;
    }
  
    $thisMonth.innerHTML = `${thisCalendarYear}.${thisCalendarMonth.toString().length > 1 ? thisCalendarMonth : "0" + thisCalendarMonth}`;
  
    const $thisDates = $date.querySelectorAll(".this-date");
    const $nextDates = $date.querySelectorAll(".next-date");
  
    for(let i = 0; i < $thisDates.length; i++) {
      $thisDates[i].style.transition = ".8s";
    }
    for(let i = 0; i < $nextDates.length; i++) {
      $nextDates[i].style.transition = ".8s";
    }
    
    $date.style.transition = ".8s";
  
    setTimeout(e => {
      for(let i = 0; i < $thisDates.length; i++) {
        $thisDates[i].classList.add("next-date");
      }
      for(let i = 0; i < $nextDates.length; i++) {
        $nextDates[i].classList.remove("next-date");
      }
  
      $date.style.top = `-${nextTop}px`;
  
      setTimeout(e => {
        $date.style.transition = "0s";
        setCalendar(thisCalendarYear, thisCalendarMonth);
      }, 800);
    }, 1);
  }
}

$prevMonth.addEventListener("click", e => {
  prevMonthAni();
})

$nextMonth.addEventListener("click", e => {
  nextMonthAni();
})

$calendarDateRel.addEventListener("wheel", e => {
  if(e.wheelDelta > 0) {
    prevMonthAni();
  }else {
    nextMonthAni();
  }
})

const indexPageLoaded = e => {
  window.addEventListener("resize", e => {
    setCalendar(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1);
  })
}