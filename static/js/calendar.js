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
let disable = [];
let schedules = [];
let moreHoverIdx = 0;
let moreHeight = 0;

const getTextColorByBackgroundColor = color => {
  const c = color.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luma < 190 ? "#fff" : "#333";
}

const getHoverColorByBackgroundColor = color => {
  const c = color.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  let result = "#";

  if(luma < 210) {
    result += (r + 17 >= 255 ? 255 : r + 17).toString(16);
    result += (g + 17 >= 255 ? 255 : g + 17).toString(16);
    result += (b + 17 >= 255 ? 255 : b + 17).toString(16);
  }else {
    result += (r - 17 <= 0 ? 0 : r - 17).toString(16);
    result += (g - 17 <= 0 ? 0 : g - 17).toString(16);
    result += (b - 17 <= 0 ? 0 : b - 17).toString(16);
  }

  return result;
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

const colIntoLine = ($line, year, month, date, classList, lineHeight, more = false) => {
  const $calendarDate = document.createElement("div");
  const thisHeight = lineHeight / 6;
  let rows = 1;
  let moreCount = 0;

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

        if(teamScheduleType == 0 && thisSchedule.type > -1) continue;
        if(teamScheduleType == 2 && thisSchedule.type == -1) continue;
        if(disable.indexOf(thisSchedule.type) > -1) continue;

        insert++;

        if(rows - 1 == insert - scheduleTrim && more !== false) {
          moreCount++;
          if(moreCount + (rows - 1) > moreHeight) moreHeight = moreCount + (rows - 1);
          $line.style.height = `${thisHeight + (thisHeight / (rows - 1) * (moreHeight - (rows - 1)))}px`;
        }

        if(rows - 1 == insert - scheduleTrim && more == false) {
          const $schedule = $calendarDate.querySelector(".schedule:last-of-type");
          if(!$schedule) break;
          const $background = $schedule.querySelector("span");
          const $p = $schedule.querySelector("p");
          const no = $schedule.dataset.no;
  
          $schedule.classList.remove(`schedule-no-${no}`);
          $schedule.classList.remove("dummy");
          $schedule.classList.add("schedule-more");
          $schedule.classList.add("schedule-end");
          $background.style.background = "#bbb";
          $schedule.dataset.color = "#bbbbbb";
          $schedule.dataset.hoverColor = "#cccccc";
          $p.style.color = "#fff";

          $schedule.addEventListener("click", e => {
            if(!popupOpened) {
              popupOpened = true;
              $morePop.style.display = "block";
              $popupBackground.style.display = "block";
              scheduleTrim = 0;
              moreHeight = 1;

              const moreStartDate = new Date(year, month - 1, date - day);
              const $calendarLine = document.createElement("div");
              const $prevCalendarList = $moreCalendar.querySelector(".calendar-line");
              let thisDate = moreStartDate;

              if($prevCalendarList) $prevCalendarList.remove();

              $calendarLine.classList.add("calendar-line");
              $calendarLine.style.width = `${$calendarDateRel.clientWidth}px`;

              for(let j = 0; j < 7; j++) {
                colIntoLine($calendarLine, thisDate.getFullYear(), thisDate.getMonth() + 1, thisDate.getDate(), ["calendar-date"], $calendarDateRel.clientHeight + 1, moreHeight);
                thisDate = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate() + 1);
              }

              const $moreDates = $calendarLine.querySelectorAll(".calendar-date");

              for(let j = 0; j < $moreDates.length; j++) {
                $moreDates[j].style.gridTemplateRows = `repeat(${moreHeight}, 1fr)`;
              }

              console.log($schedule.clientHeight);
              console.log(moreStartDate);

              $moreCalendar.append($calendarLine);
            }
          })
          
          if($prevDate) {
            const $prevSchedule = $prevDate.querySelector(".schedule:last-of-type");

            if($prevSchedule && $prevSchedule.classList.contains("schedule-more")){
              $schedule.classList.remove("schedule-start");
              $prevSchedule.classList.remove("schedule-end");
              $schedule.classList.add(`schedule-no-more-${moreHoverIdx}`);
              $schedule.dataset.no = `more-${moreHoverIdx}`;  
              $p.innerText = "";
            }else {
              const $prevSchedules = $prevDate.querySelectorAll(".schedule");
              if(rows - 2 == $prevSchedules.length) {
                $prevSchedule.classList.add("schedule-end");
              }

              moreHoverIdx++;
              $schedule.classList.add("schedule-start");
              $schedule.classList.add(`schedule-no-more-${moreHoverIdx}`);
              $schedule.dataset.no = `more-${moreHoverIdx}`;  
              $p.innerText = "More...";
            }
          }else {
            moreHoverIdx++;
            $schedule.classList.add("schedule-start");
            $schedule.classList.add(`schedule-no-more-${moreHoverIdx}`);
            $schedule.dataset.no = `more-${moreHoverIdx}`;  
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

            $schedule.dataset.color = thisSchedule.color;
            $schedule.dataset.hoverColor = getHoverColorByBackgroundColor(thisSchedule.color);
            $schedule.dataset.no = thisSchedule.no;
            $schedule.classList.add("schedule-date");
            $schedule.classList.add(`schedule-no-${thisSchedule.no}`);
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
  moreHoverIdx = 0;
  scheduleTrimList = [];

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

      loadRequestCount();

      if(request == "test") request = JSON.parse(JSON.stringify(schedulesData));

      for(let i = 0; i < request.length; i++) {
        let schedule = request[i];
        let start = new Date(schedule.startDate);
        let end = new Date(schedule.endDate);
        let dummyType = {};

        schedule.startDate = {year: start.getFullYear(), month: start.getMonth() + 1, date: start.getDate(), day: start.getDay()};
        schedule.endDate = {year: end.getFullYear(), month: end.getMonth() + 1, date: end.getDate(), day: end.getDay()};
        schedule.count = 0;
        schedule.sort = -1;
        schedule.dummy = {startDate: "dummy", sort: schedule.sort, type: schedule.type, idx: i};
        schedule.idx = i;

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
          
          if(start.getFullYear() == thisDate.getFullYear() && start.getMonth() == thisDate.getMonth() && start.getDate() == thisDate.getDate()) {
            for(let j = 0; j < date.length; j++) {
              if(date[j].startDate == "dummy") dummyType[j] = date[j];
              else dummyType[j] = date[j].dummy;
            }
          }
          
          if(schedule.count == 1) schedule.sort = schedule.dummy.sort = date.length;

          while(date.length < schedule.sort) {
            const dummy = dummyType[date.length];
            date.push(dummy);
          }
            for(let j = date.length - 1; j >= schedule.sort; j--) {
              if(date[j].lastSort != i && date[j].startDate !== "dummy") {
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
            }

          date[schedule.sort] = schedule;
          
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
      $popupBackground.style.display = "none";
      resetAlert();
      loadSchedules();
    }else {
      if(res.alert) {
        setAlert(res.alert);
      }
    }
  })
})

document.addEventListener("mousemove", e => {
  const target = e.target;
  const no = target.dataset.no;
  const hoverColor = target.dataset.hoverColor;
  const $hovered = document.querySelectorAll(".schedule-hover");
  const $targets = document.querySelectorAll(`.schedule-no-${no}`);

  for(let i = 0; i < $hovered.length; i++) {
    $hovered[i].classList.remove("schedule-hover");
    $hovered[i].querySelector("span").style.background = $hovered[i].dataset.color;
  }

  for(let i = 0; i < $targets.length; i++) {
    $targets[i].classList.add("schedule-hover");
    $targets[i].querySelector("span").style.background = hoverColor;
  }
})

const indexPageLoaded = e => {
  window.addEventListener("resize", e => {
    setCalendar(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1);
  })
}