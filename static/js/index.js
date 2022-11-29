const $wrap = document.querySelector("#wrap");
const $alert = document.querySelectorAll(".alert");
const $alertPop = document.querySelectorAll(".alert-pop");
const $backgroundGrid = document.querySelector("#background .grid");
const $backgroundGridBackground = document.querySelector("#background .grid-background");
const $calendar = document.querySelector("#calendar");
const $calendarDateRel = document.querySelector("#date-rel");
const $calendarSide = document.querySelector("#calendar-side");
const $calendarArea = document.querySelector("#calendar-area");
const $calSideToggle = document.querySelector("#cal-side-toggle");
const $date = document.querySelector("#date");
const $dateSub = document.querySelector("#date-sub");
const $todayMonth = document.querySelector("#today-month");
const $todayDate = document.querySelector("#today-date");
const $userId = document.querySelector("#id span");
const $userEmail = document.querySelector("#email span");
const $thisMonth = document.querySelector("#this-month");
const $prevMonth = document.querySelector("#prev-month");
const $nextMonth = document.querySelector("#next-month");
const $toggleArea = document.querySelector("#toggle-area");
const $selected = document.querySelector("#selected");
const $openCreateTeam = document.querySelector("#open-create-team");
const $openInviteTeam = document.querySelector("#open-invite-team");
const $openRequestTeam = document.querySelector("#open-request-team");
const $createTeam = document.querySelector("#create-team");
const $createTeamForm = document.querySelector("#create-team-form");
const $createTeamButton = document.querySelector("#create-team-button");
const $addSchedule = document.querySelector("#add-schedule");
const $addScheduleForm = document.querySelector("#add-schedule-form");
const $addScheduleButton = document.querySelector("#add-schedule-button");
const $popup = document.querySelectorAll(".popup");
const $closeButton = document.querySelectorAll(".close-button");
const $toggleTextArea = document.querySelector("#selected .toggle-text-area");
const $teamList = document.querySelector("#team-list");
const $popupBackground = document.querySelector("#popup-background");
const today = new Date();
const page = {x: 0, y: 0, w: 0, h: 0};
let calendarMonth = undefined;
let isLogined = false;
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
let popupOpened = false;
let rightSideOpen = false;
let leftSideOpen = true;
let schedules  = [{
  scheduleNo: 1,
  name: "test",
  color: "#cdedda",
  content: "this is text schedule",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2022-11-14 12:00:00",
  endDate: "2022-11-18 18:00:00"
},{
  scheduleNo: 2,
  name: "test2",
  color: "#cddaed",
  content: "this is text schedule2",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2022-11-18 12:00:00",
  endDate: "2022-11-18 18:00:00"
},{
  scheduleNo: 3,
  name: "test3",
  color: "#daedcd",
  content: "this is text schedule3",
  createUser: -1,
  type: 1,
  alert: 0,
  startDate: "2022-11-14 12:00:00",
  endDate: "2022-11-29 18:00:00"
},{
  scheduleNo: 4,
  name: "test4",
  color: "#257854",
  content: "this is text schedule4",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2022-11-21 12:00:00",
  endDate: "2022-11-21 18:00:00"
},{
  scheduleNo: 5,
  name: "test5",
  color: "#257854",
  content: "this is text schedule5",
  createUser: -1,
  type: 1,
  alert: 0,
  startDate: "2022-11-21 12:00:00",
  endDate: "2022-11-21 18:00:00"
},{
  scheduleNo: 6,
  name: "test6",
  color: "#257854",
  content: "this is text schedule6",
  createUser: -1,
  type: 1,
  alert: 0,
  startDate: "2022-11-21 12:00:00",
  endDate: "2022-11-21 18:00:00"
},{
  scheduleNo: 7,
  name: "test7",
  color: "#257854",
  content: "this is text schedule7",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2022-11-21 12:00:00",
  endDate: "2022-11-21 18:00:00"
},{
  scheduleNo: 8,
  name: "test8",
  color: "#54dfa2",
  content: "this is text schedule8",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2022-11-16 12:00:00",
  endDate: "2022-12-01 18:00:00"
},{
  scheduleNo: 9,
  name: "test9",
  color: "#fa12cd",
  content: "this is text schedule9",
  createUser: -1,
  type: 1,
  alert: 0,
  startDate: "2023-01-23 12:00:00",
  endDate: "2023-01-25 18:00:00"
},{
  scheduleNo: 10,
  name: "test10",
  color: "#caa5fd",
  content: "this is text schedule10",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2023-01-25 12:00:00",
  endDate: "2023-01-27 18:00:00"
},{
  scheduleNo: 11,
  name: "test11",
  color: "#853459",
  content: "this is text schedule11",
  createUser: -1,
  type: 1,
  alert: 0,
  startDate: "2023-01-26 12:00:00",
  endDate: "2023-01-31 18:00:00"
},{
  scheduleNo: 12,
  name: "test12",
  color: "#92cd76",
  content: "this is text schedule12",
  createUser: -1,
  type: 1,
  alert: 0,
  startDate: "2023-01-28 12:00:00",
  endDate: "2023-01-29 18:00:00"
},{
  scheduleNo: 13,
  name: "test13",
  color: "#e5f46d",
  content: "this is text schedule13",
  createUser: -1,
  type: 1,
  alert: 0,
  startDate: "2023-01-029 12:00:00",
  endDate: "2023-01-30 18:00:00"
},{
  scheduleNo: 14,
  name: "test14",
  color: "#5e8cf4",
  content: "this is text schedule14",
  createUser: -1,
  type: -1,
  alert: 0,
  startDate: "2023-01-29 12:00:00",
  endDate: "2023-02-07 18:00:00"
},{
  scheduleNo: 15,
  name: "test15",
  color: "#5e8cf4",
  content: "this is text schedule15",
  createUser: 1,
  type: -1,
  alert: 0,
  startDate: "2022-11-19 12:00:00",
  endDate: "2022-11-19 18:00:00"
},{
  scheduleNo: 16,
  name: "test16",
  color: "#5e8cf4",
  content: "this is text schedule16",
  createUser: 1,
  type: -1,
  alert: 0,
  startDate: "2022-11-01 12:00:00",
  endDate: "2022-11-13 18:00:00"
},{
  scheduleNo: 17,
  name: "test17",
  color: "#5e8cb4",
  content: "this is text schedule17",
  createUser: 1,
  type: -1,
  alert: 0,
  startDate: "2022-11-07 12:00:00",
  endDate: "2022-11-12 18:00:00"
},{
  scheduleNo: 18,
  name: "test18",
  color: "#5edcc4",
  content: "this is text schedule18",
  createUser: 1,
  type: 1,
  alert: 0,
  startDate: "2022-11-06 12:00:00",
  endDate: "2022-11-08 18:00:00"
},{
  scheduleNo: 19,
  name: "test19",
  color: "#9e8cd4",
  content: "this is text schedule19",
  createUser: 1,
  type: -1,
  alert: 0,
  startDate: "2022-12-12 12:00:00",
  endDate: "2022-12-27 18:00:00"
},{
  scheduleNo: 20,
  name: "test20",
  color: "#5e8cf4",
  content: "this is text schedule20",
  createUser: 1,
  type: -1,
  alert: 0,
  startDate: "2022-12-21 12:00:00",
  endDate: "2022-12-25 18:00:00"
},{
  scheduleNo: 21,
  name: "test21",
  color: "#5e8cb4",
  content: "this is text schedule21",
  createUser: 1,
  type: -1,
  alert: 0,
  startDate: "2022-12-16 12:00:00",
  endDate: "2022-12-23 18:00:00"
},{
  scheduleNo: 22,
  name: "test22",
  color: "#5edcc4",
  content: "this is text schedule22",
  createUser: 1,
  type: 1,
  alert: 0,
  startDate: "2022-12-25 12:00:00",
  endDate: "2022-12-27 18:00:00"
},{
  scheduleNo: 23,
  name: "test23",
  color: "#5fdcb4",
  content: "this is text schedule23",
  createUser: 1,
  type: 1,
  alert: 0,
  startDate: "2022-12-13 12:00:00",
  endDate: "2022-12-16 18:00:00"
}];

const getTextColorByBackgroundColor = color => {
  const c = color.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luma < 190 ? "#fff" : "#333";
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

const appendTeam = el => {
  const teamList = user.team;
  const $options = el.querySelectorAll("option");

  for(let i = 0; i < $options.length; i++) {
    $options[i].remove();
  }

  for(let i = -1; i < teamList.length; i++) {
    const option = document.createElement("option");
    
    if(i == -1) {
      option.value = -1;
      option.innerText = "개인"
    }else {
      option.value = teamList[i].no;
      option.innerText = teamList[i].name;
    }

    el.append(option);
  }

}

const openAddSchedule = thisDate => {
  if(!popupOpened) {
    popupOpened = true;

    $addSchedule.style.display = "block";
    $popupBackground.style.display = "block";
  
    appendTeam($addScheduleForm.group);

    if(thisDate.month.toString().length == 1) thisDate.month = `0${thisDate.month}`;
  
    $addScheduleForm.name.value = "";
    $addScheduleForm.color.value = "#B1D7B4";
    $addScheduleForm.content.value = "";
    $addScheduleForm.start.value = `${thisDate.year}-${thisDate.month}-${thisDate.date}`;
    $addScheduleForm.end.value = `${thisDate.year}-${thisDate.month}-${thisDate.date}`;
    $addScheduleForm.group.value = -1;
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
  if(isLogined) $calendarDate.addEventListener("click", e => {
    if(e.target == $calendarDate) {
      openAddSchedule({year, month, date})
    }
  });

  if(scheduleLoaded) {
    if(schedules[year] && schedules[year][month] && schedules[year][month][date * 1]) {
      const $prevDate = $line.querySelector(".calendar-date:last-of-type");
      const schedule = schedules[year][month][date * 1];
      const day = new Date(year, month - 1, date).getDay();
      let insert = 0;
      let todo = [];
      
      for(let i = 0; i < schedule.length; i++) {
        const thisSchedule = schedule[i];

        if(teamScheduleType == 0 && thisSchedule.type > -1) {
          continue;
        }
        if(teamScheduleType == 2 && thisSchedule.type == -1) {
          continue;
        }

        insert++;

        if(rows - 1 == insert - scheduleTrim) {
          const $schedule = $calendarDate.querySelector(".schedule:last-of-type");
          const $background = $schedule.querySelector("span");
          const $p = $schedule.querySelector("p");
  
          $schedule.classList.remove("dummy");
          $schedule.classList.add("schedule-more");
          $schedule.classList.add("schedule-end");
          $background.style.background = "#bbb";
          $p.style.color = "#fff";
          
          if($prevDate) {
            const $prevSchedule = $prevDate.querySelector(".schedule:last-of-type");

            if($prevSchedule && $prevSchedule.classList.contains("schedule-more")){
              $schedule.classList.remove("schedule-start");
              $prevSchedule.classList.remove("schedule-end");
              $p.innerText = "";
            }else {
              const $prevSchedules = $prevDate.querySelectorAll(".schedule");
              if(rows - 2 == $prevSchedules.length) {
                $prevSchedule.classList.add("schedule-end");
              }

              $schedule.classList.add("schedule-start");
              $p.innerText = "More...";
            }
          }else {
            $schedule.classList.add("schedule-start");
            $p.innerText = "More...";
          }
  
          break;
        }else {
          if(i + 1 <= scheduleTrim) {
            if(thisSchedule.startDate == "dummy") continue;
            else scheduleTrim = 0;
          }
          const $schedule = document.createElement("span");
          const $background = document.createElement("span");
          const $p = document.createElement("p");
          
          $schedule.classList.add("schedule");

          if(thisSchedule.startDate !== "dummy") {
            let $prevSchedule = false;
            todo.push(1);

            if(scheduleTrimList.indexOf(thisSchedule.idx) > -1) scheduleTrimList.splice(scheduleTrimList.indexOf(thisSchedule.idx), scheduleTrimList.length);

            if($prevDate && rows - 2 == insert - scheduleTrim) {
              $prevSchedule = $prevDate.querySelector(".schedule-more");
            }

            $schedule.classList.add("schedule-date");
            $background.style.background = thisSchedule.color;
            $p.style.color = getTextColorByBackgroundColor(thisSchedule.color);

            if((thisSchedule.startDate.year == year && thisSchedule.startDate.month == month && thisSchedule.startDate.date == date) || day == 0 || $prevSchedule) {
              if(todo.length > 0 && todo.indexOf(1) == insert - 1) {
                const $dummies = $calendarDate.querySelectorAll(".schedule");

                for(let i = 0; i < $dummies.length; i++) {
                  $dummies[i].remove();
                }

                scheduleTrim += todo.length - 1;
              }
              $schedule.classList.add("schedule-start");
              $p.innerText = thisSchedule.name;
            }
            if((thisSchedule.endDate.year == year && thisSchedule.endDate.month == month && thisSchedule.endDate.date == date) || day == 6){
              $schedule.classList.add("schedule-end");
            }
          }else {
            if(day == 0) {
              scheduleTrimList.push(thisSchedule.idx);
              scheduleTrim++;
              continue;
            }else {
              if(scheduleTrimList.indexOf(thisSchedule.idx) > -1) {
                scheduleTrim++;
                continue;
              }
              todo.push(0);
            }

            $schedule.classList.add("dummy");
          }
          
          $background.append($p);
          $schedule.append($background);
          $calendarDate.append($schedule);
        }
      }
    }
  }

  $line.append($calendarDate);
}

const setCalendar = (year, month, $calendar = $date) => {
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
  scheduleTrim = 0;
  scheduleTrimList = [];

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

  const $removeDates = $calendar.querySelectorAll(".calendar-line");

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

      if(monthList[0].getDay() == 6) prevTop = calendarHeight / 6;
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

    $calendar.append($calendarLine);
  }

  $calendar.style.height = `${calendarHeight * 3}px`;
  $calendar.style.top = `-${calendarHeight / 6 * thisMonthLine}px`;
  $calendar.style.gridTemplateRows = `repeat(${6 * 3}, 1fr)`;

  if($calendar == $date) moveMonth = false;
}

const logined = e => {
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

  setCalendar(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1);
}

const loadSchedules = e => {
  fetch("/get-schedules", {
    method: "POST",
    body: JSON.stringify({})
  })
  .then(req => req.json())
  .then(res => {
    if(res.state == "SUCCESS") {
      let result = {};
      let request = res.result;
      let dummyType = {};

      if(request == "test") request = schedules;

      for(let i = 0; i < request.length; i++) {
        let schedule = request[i];
        let start = new Date(schedule.startDate);
        let end = new Date(schedule.endDate);

        schedule.startDate = {year: start.getFullYear(), month: start.getMonth() + 1, date: start.getDate(), day: start.getDay()};
        schedule.endDate = {year: end.getFullYear(), month: end.getMonth() + 1, date: end.getDate(), day: end.getDay()};
        schedule.count = 0;
        schedule.sort = -1;
        schedule.dummy = {startDate: "dummy", sort: schedule.sort, type: schedule.type, idx: i};

        let thisDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        let endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        while(thisDate <= endDate) {
          let year = {};
          let month = {};
          let date = [];
          schedule.count++;

          if(result[thisDate.getFullYear()]) {
            year = result[thisDate.getFullYear()];

            if(year[thisDate.getMonth() + 1]) {
              month = year[thisDate.getMonth() + 1];

              if(month[thisDate.getDate()]) {
                date = month[thisDate.getDate()];
              }else {
                month[thisDate.getDate()] = date;
              }
            }else {
              year[thisDate.getMonth() + 1] = month;
              month[thisDate.getDate()] = date;
            }
          }else {
            result[thisDate.getFullYear()] = year;
            year[thisDate.getMonth() + 1] = month;
            month[thisDate.getDate()] = date;
          }
          
          if(schedule.count == 1) schedule.sort = schedule.dummy.sort = date.length;

          while(date.length < schedule.sort) {
            const dummy = dummyType[date.length];
            date.push(dummy);
          }

          if(date[schedule.sort] !== undefined && date[schedule.sort].startDate !== "dummy") {
            for(let j = date.length - 1; j >= schedule.sort; j--) {
              if(date[j].lastSort != i) {
                date[j].sort++;
                date[j].dummy.sort = date[j].sort
                date[j].lastSort = i;
              }
              date[j + 1] = date[j];

              if(thisDate.getTime() == endDate.getTime()) {
                let end = date[j + 1].endDate;
                let dummyThisDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1);
                let dummyEndDate = new Date(end.year, end.month - 1, end.date);
  
                while(dummyThisDate <= dummyEndDate) {
                  let dummyDate = result[dummyThisDate.getFullYear()][dummyThisDate.getMonth() + 1][dummyThisDate.getDate()];

                  for(let k = dummyDate.length - 1; k >= schedule.sort; k--) {
                    dummyDate[k + 1] = dummyDate[k];
                  }
                  dummyDate[schedule.sort] = schedule.dummy;

                  dummyThisDate = new Date(dummyThisDate.getFullYear(), dummyThisDate.getMonth(), dummyThisDate.getDate() + 1);
                }
              }

              dummyType[date[j].sort] = date[j].dummy;
            }
          }

          schedule.idx = i;
          date[schedule.sort] = schedule;
          dummyType[schedule.sort] = schedule.dummy;
          
          thisDate = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate() + 1);
        }
      }

      schedules = result;
      scheduleLoaded = true;

      logined();
    }else {
      if(res.alert) {
        setAlert(res.alert);
      }
    }
  })
}

const loadTeam = e => {
  fetch("/get-team", {
    method: "POST",
    body: JSON.stringify({})
  })
  .then(req => req.json())
  .then(res => {
    if(res.state == "SUCCESS") {
      let request = res.result;
      user.team = request;

      const teamItems = $teamList.querySelectorAll(".team-item");
      for(let i = 0; i < teamItems.length; i++) {
        teamItems[i].remove();
      }

      for(let i = 0; i < request.length; i++) {
        const data = request[i];
        const $item = document.createElement("div");
        const $header = document.createElement("div");
        const $content = document.createElement("div");
        const $teamName = document.createElement("p");

        $item.classList.add("team-item");
        $header.classList.add("team-header");
        $content.classList.add("team-content");

        $teamName.innerText = data.name;
        $header.append($teamName);
        $header.style.background = data.color;
        $header.style.color = getTextColorByBackgroundColor(data.color);

        for(let j = 0; j < data.member.length; j++) {
          const member = data.member[j];
          const $memberItem = document.createElement("div");
          const $listUi = document.createElement("div");
          const $memberName = document.createElement("p");

          $memberItem.classList.add("member-item");
          $listUi.classList.add("list-ui");
          $memberName.classList.add("member-name");

          if(member.name) $memberName.innerText = member.name;
          else $memberName.innerText = member.id;
          $memberItem.append($listUi);
          $memberItem.append($memberName);

          if(member.position == "leader") {
            $memberItem.classList.add("leader");

            $content.prepend($memberItem);
          }else {
            $content.append($memberItem);
          }
        }

        $item.append($header);
        $item.append($content);

        $teamList.append($item);
      }

      loadSchedules();
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

$toggleArea.addEventListener("click", e => {
  if(!moveMonth || moveMonth == 2) {
    const classList = $toggleArea.classList;
    let scheduleType = 1
    moveMonth = 2;

    if(classList.contains("is-solo")) {
      $toggleArea.classList.remove("is-solo");
      $toggleArea.classList.add("is-team");
      scheduleType = 2;
    }else if(classList.contains("is-team")) {
      $toggleArea.classList.remove("is-team");
      scheduleType = 1;
    }else {
      $toggleArea.classList.add("is-solo");
      scheduleType = 0;
    }

    clearTimeout(isToggleTimeout)
    if(teamSchedulePrevType !== scheduleType) {
      isToggleTimeout = setTimeout(e => {
        moveMonth = true;
        teamScheduleType = scheduleType
        teamSchedulePrevType = teamScheduleType;
        $dateSub.style.opacity = 0;
        $dateSub.style.display = "grid";
        setCalendar(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, $dateSub);
        setTimeout(e => {
          $dateSub.style.transition = ".3s";
          setTimeout(e => {
            $dateSub.style.opacity = 1;
            moveMonth = 2;
            setTimeout(e => {
              $dateSub.style.display = "none";
              $dateSub.style.transition = "";
              setCalendar(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1);
            }, 300);
          }, 10);
        }, 20);
      }, 500);
    }else {
      moveMonth = false;
    }
  }
})

$calSideToggle.addEventListener("click", e => {

})

$openCreateTeam.addEventListener("click", e => {
  e.preventDefault();
  if(!popupOpened) {
    popupOpened = true;
    $createTeam.style.display = "block";
    $popupBackground.style.display = "block";
    $createTeamForm.name.value = "";
    $createTeamForm.color.value = `#${Math.floor(Math.random() * 256).toString(16)}${Math.floor(Math.random() * 256).toString(16)}${Math.floor(Math.random() * 256).toString(16)}`;
  }
})

for(let i = 0; i < $closeButton.length; i++) {
  const el = $closeButton[i];
  
  el.addEventListener("click", e => {
    e.preventDefault();
    popupOpened = false;

    $popupBackground.style.display = "none";

    for(let j = 0; j < $popup.length; j++) {
      $popup[j].style.display = "none";
    }
  })
}

$addScheduleButton.addEventListener("click", e => {
  e.preventDefault();
  const form = $addScheduleForm;

  fetch("/add-schedule", {
    method: "POST",
    body: JSON.stringify({
      name: form.name.value,
      color: form.color.value,
      content: form.content.value,
      start: form.start.value,
      end: form.end.value,
      group: form.group.value
    })
  })
  .then(req => req.json())
  .then(res => {
    if(res.state == "SUCCESS") {
      popupOpened = false;
      $addSchedule.style.display = "none";
      loadSchedules();
    }else {
      console.error(res.err);
    }
  })
})

$createTeamButton.addEventListener("click", e => {
  e.preventDefault();
  const form = $createTeamForm;

  fetch("/create-team", {
    method: "POST",
    body: JSON.stringify({
      name: form.name.value,
      color: form.color.value
    })
  })
  .then(req => req.json())
  .then(res => {
    if(res.state == "SUCCESS") {
      popupOpened = false;
      $createTeam.style.display = "none";
      loadTeam();
    }else {
      console.error(res.err);
    }
  })
})

const indexPageLoaded = e => {
  window.addEventListener("resize", e => {
    setCalendar(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1);
  })
}