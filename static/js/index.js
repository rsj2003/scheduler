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

const logined = e => {
  if(!isLogined) {
    isLogined = true;

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

const colIntoLine = ($line, year, month, date, classList = ["calendar-date"]) => {
  const $calendarDate = document.createElement("div");

  if(today.getFullYear() == year && today.getMonth() + 1 == month && today.getDate() == date) {
    classList = JSON.parse(JSON.stringify(classList));
    classList.push("today");
  }

  for(let i = 0; i < classList.length; i++) {
    $calendarDate.classList.add(classList[i]);
  }

  if(date.toString().length == 1) date = `0${date}`;

  $calendarDate.innerHTML = `<span class="flex"><p>${date}</p></span>`;
  
  $line.append($calendarDate);
}

const setCalendar = (year, month) => {
  const thisMonth = new Date(year, month, 0);
  const prevMonth = new Date(year, month - 1, 0);
  const prevDataMonth = new Date(year, month - 2, 0);
  const nextMonth = new Date(year, month + 1, 0);
  const nextDataMonth = new Date(year, month + 2, 0);
  const monthList = [prevDataMonth, prevMonth, thisMonth, nextMonth, nextDataMonth];
  let nowMonth = 1;
  let nowDates = 0;
  let thisMonthLine = 0;

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
        colIntoLine($calendarLine, monthList[nowMonth].getFullYear(), monthList[nowMonth].getMonth(), j, ["calendar-date", "prev-data-date"]);
      }
      
      for(let j = 0; j < 6 - prevDataMonth.getDay(); j++) {
        colIntoLine($calendarLine, monthList[nowMonth].getFullYear(), monthList[nowMonth].getMonth() + 1, j + 1, ["calendar-date", "prev-date"]);
        
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
        colIntoLine($calendarLine, monthList[nowMonth].getFullYear(), monthList[nowMonth].getMonth() + 1, j + 1, classList);

        nowDates++;
      }
  
      if(nowDates == monthList[nowMonth].getDate()) {
        nowMonth++;
        nowDates = 0;
        
        let firstDate = 0;

        if(monthList[nowMonth - 1].getDay() == 6) firstDate = 1;

        if(nowMonth == 2) thisMonthLine = (i + firstDate);
        if(nowMonth == 3) nextTop = (i + firstDate) * 110;
        
        let classList = ["calendar-date"];
        
        if(nowMonth == 1) classList.push("prev-date");
        if(nowMonth == 2) classList.push("this-date");
        if(nowMonth == 3) classList.push("next-date");
        if(nowMonth == 4) classList.push("next-data-date");
        
        if(nowMonth < 5) {
          for(let j = 0; j < 6 - monthList[nowMonth - 1].getDay(); j++) {
            colIntoLine($calendarLine, monthList[nowMonth].getFullYear(), monthList[nowMonth].getMonth() + 1, j + 1, classList);
  
            nowDates++;
          }
        }else {
          break;
        }
      }
    }


    $date.append($calendarLine);
  }

  $date.style.height = `${110 * 6 * 3}px`;
  $date.style.top = `-${110 * thisMonthLine}px`;
  $date.style.gridTemplateRows = `repeat(${6 * 3}, 1fr)`;
  moveMonth = false;
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