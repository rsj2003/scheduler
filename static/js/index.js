const resetAlert = e => {
  for(let i = 0; i < $alert.length; i++) {
    $alert[i].innerText = " ";
  }
  for(let i = 0; i < $alertPop.length; i++) {
    $alertPop[i].style.display = "none";
  }
}

const setAlert = alert => {
  for(let i = 0; i < $alert.length; i++) {
    $alert[i].innerText = alert;
  }
  for(let i = 0; i < $alertPop.length; i++) {
    $alertPop[i].style.display = "block";
  }
}

$sideToggle.addEventListener("click", e => {
  if(page.w < 1600) {
    $backgroundGroup.style.transition = ".8s";
    $inputWrap.style.transition = ".8s";
    setTimeout(e => {
      if(leftSideOpen) {
        leftSideOpen = false;
        $backgroundGroup.style.left = "-300px";
        $inputWrap.style.left = "-150px";
        $sideToggle.style.right = "-36px";
      }else {
        leftSideOpen = true;
        $backgroundGroup.style.left = "0";
        $inputWrap.style.left = "150px";
        $sideToggle.style.right = "-18px";
      }
    }, 1)
  }
})

$calSideToggle.addEventListener("click", e => {
  if(page.w < 1920) {
    if(rightSideOpen) {
      rightSideOpen = false;
      $calendarSide.style.left = "0";
      $calSideToggle.style.left = "";
    }else {
      rightSideOpen = true;
      $calendarSide.style.left = "-300px";
      $calSideToggle.style.left = "-18px";
    }
  }
})

for(let i = 0; i < $closeButton.length; i++) {
  const el = $closeButton[i];
  
  el.addEventListener("click", e => {
    e.preventDefault();
    
    if(popupOpened == "more") {
      morePopupOpened = false;
    }

    if(morePopupOpened) {
      popupOpened = "more";
    }else {
      popupOpened = false;
    }

    resetAlert();
    
    if(morePopupOpened) {
      $addSchedule.style.display = "none";
    }else {
      $popupBackground.style.display = "none";

      for(let j = 0; j < $popup.length; j++) {
        $popup[j].style.display = "none";
      }
    }
  })
}

$popupBackground.addEventListener("click", e => {
  e.preventDefault();
  popupOpened = false;

  resetAlert();
  $popupBackground.style.display = "none";

  for(let j = 0; j < $popup.length; j++) {
    $popup[j].style.display = "none";
  }
})

const resizeLeftSide = e => {
  $backgroundGroup.style.transition = "0s";
  $inputWrap.style.transition = "0s";
  setTimeout(e => {
    if(page.w < 1600) {
      $backgroundGroup.style.left = "-300px";
      $inputWrap.style.left = "-150px";
    }
  }, 1)
}

const indexPageLoaded = e => {
  window.addEventListener("resize", e => {
    page.w = window.innerWidth;
    page.h = window.innerHeight;
    page.x = page.w / 2;
    page.y = page.h / 2;
    
    if(isLogined) {
      if(page.w >= 1920) {
        rightSideOpen = false;
        $calendarSide.style.left = "0";
        $calSideToggle.style.left = "";
      }
  
      $backgroundGroup.style.transition = "0s";
      $inputWrap.style.transition = "0s";
      setTimeout(e => {
        if(page.w >= 1600) {
          leftSideOpen = false;
          $backgroundGroup.style.left = "0";
          $inputWrap.style.left = "150px";
          $sideToggle.style.right = "-18px";
        }else if(!leftSideOpen) {
          $backgroundGroup.style.left = "-300px";
          $inputWrap.style.left = "-150px";
          $sideToggle.style.right = "-36px";
        }
      }, 1)
    }

    setCalendar(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1);
  })
}

const getTextColorByBackgroundColor = color => {
  const c = color.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luma < 190 ? "#fff" : "#333";
}