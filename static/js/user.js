const getUser = (openInfomationPop = false) => {
  fetch("/userData-action", {
    method: "POST",
    body: JSON.stringify({})
  })
  .then(req => req.json())
  .then(res => {
    if(res.user.id) {
      user = res.user;

      if(!popupOpened && openInfomationPop) {
        popupOpened = true;

        $userPopForm.id.value = user.id;
        $userPopForm.email.value = user.email;
        $userPopForm.name.value = user.name;
        $userPopForm.cell.value = user.cellNo;
        
        if(user.name) {
          $userIdHeader.innerText = `name: `;
          $userIdContent.innerText = user.name;
        }else {
          $userIdHeader.innerText = `id: `;
          $userIdContent.innerText = user.id;
        }
        $userEmail.innerText = user.email;

        $userPop.style.display = "block";
        $popupBackground.style.display = "block";
      }else {
        loadTeam();
      }
    }
  })
}

$information.addEventListener("click", e => {
  if(!popupOpened) {
    getUser(true);
  }
})

$userPopButton.addEventListener("click", e => {
  e.preventDefault();

  fetch("/modify-user", {
    method: "POST",
    body: JSON.stringify({
      name: $userPopForm.name.value,
      cellNo: $userPopForm.cell.value
    })
  })
  .then(req => req.json())
  .then(res => {
    if(res.state == "SUCCESS") {
      popupOpened = false;
      
      $inviteTeam.style.display = "none";
      $popupBackground.style.display = "none";

      resetAlert();
      getUser();
    }else {
      if(res.alert) {
        setAlert(res.alert);
      }
    }
  })
})