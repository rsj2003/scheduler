const app = e => {
  let todayYear = today.getFullYear();
  let todayMonth = today.getMonth() + 1;

  if(todayMonth <= 0) {
    todayMonth = 12 - todayMonth;
    todayYear--;
  }
  if(todayMonth >= 13) {
    todayMonth = todayMonth - 12;
    todayYear++;
  }

  calendarMonth = new Date(todayYear, todayMonth, 0);
  
  $todayMonth.innerHTML = todayMonth;
  $todayDate.innerHTML = today.getDate().toString().length > 1 ? today.getDate() : "0" + today.getDate();

  setTimeout(e => {
    $wrap.classList.add("page-loaded");
  }, 1)

  if(user.id) {
    logined();
  }

  page.w = window.innerWidth;
  page.h = window.innerHeight;
  page.x = page.w / 2;
  page.y = page.h / 2;

  indexPageLoaded();

  setCalendar(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1);
}

app();