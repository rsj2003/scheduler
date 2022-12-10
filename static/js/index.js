const resetAlert = e => {
  for(let i = 0; i < $alert.length; i++) {
    $alert[i].innerHTML = " ";
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

$calSideToggle.addEventListener("click", e => {

})

for(let i = 0; i < $closeButton.length; i++) {
  const el = $closeButton[i];
  
  el.addEventListener("click", e => {
    e.preventDefault();
    popupOpened = false;

    resetAlert();
    $popupBackground.style.display = "none";

    for(let j = 0; j < $popup.length; j++) {
      $popup[j].style.display = "none";
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