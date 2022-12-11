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

const loadRequestCount = () => {
  fetch("/get-request-count", {
    method: "POST",
    body: JSON.stringify({})
  })
  .then(req => req.json())
  .then(res => {
    if(res.state == "SUCCESS") {
      if(res.result.count == 0) {
        $requestCount.style.display = "none";
      }else {
        $requestCount.style.display = "";
        $requestCount.innerHTML = res.result.count;
      }
    }
  })
}

const loadTeam = (invite = false) => {
  fetch("/get-team", {
    method: "POST",
    body: JSON.stringify({})
  })
  .then(req => req.json())
  .then(res => {
    if(res.state == "SUCCESS") {
      let request = res.result;
      user.team = request;

      if(invite && !popupOpened) {
        popupOpened = true;

        $inviteTeam.style.display = "block";
        $popupBackground.style.display = "block";
        $inviteTeamForm.user.value = "";

        const inviteTeamList = $inviteTeamList.querySelectorAll(".invite-item");
        for(let i = 0; i < inviteTeamList.length; i++) {
          inviteTeamList[i].remove();
        }

        for(let i = 0; i < request.length; i++) {
          const data = request[i];
          const members = data.member;

          for(let j = 0; j < members.length; j++) {
            const member = members[j];

            if(member.position == "leader" && member.no == user.no) {
              const $item = document.createElement("div");
              const $checkbox = document.createElement("input");
              const $colorBox = document.createElement("div");
              const $label = document.createElement("label");
              const $color = document.createElement("span");
              const $name = document.createElement("p");

              $item.classList.add("invite-item");
              $checkbox.classList.add("invite-checkbox");
              $colorBox.classList.add("invite-color-box");
              $label.classList.add("invite-label");
              $color.classList.add("invite-color");
              $name.classList.add("invite-name");
              
              $checkbox.dataset.no = data.no;
              $checkbox.classList.add("none");
              $checkbox.type = "checkbox";
              $checkbox.name = "checkedTeam";
              $checkbox.id = `invite-checkbox-${data.no}`;

              $label.setAttribute("for", `invite-checkbox-${data.no}`);

              $colorBox.append($label);
              $label.append($color);

              $item.style.backgroundColor = data.color;
              $item.style.color = getTextColorByBackgroundColor(data.color);
              $label.style.borderColor = getTextColorByBackgroundColor(data.color);
              $color.style.backgroundColor = getTextColorByBackgroundColor(data.color);

              $name.innerText = data.name;

              $item.append($checkbox);
              $item.append($colorBox);
              $item.append($name);

              $inviteTeamList.append($item);
            }
          }
        }
      }

      const teamItems = $teamList.querySelectorAll(".team-item");
      for(let i = 0; i < teamItems.length; i++) {
        teamItems[i].remove();
      }

      for(let i = 0; i < request.length; i++) {
        const data = request[i];
        const $item = document.createElement("div");
        const $header = document.createElement("div");
        const $content = document.createElement("div");
        const $headerIcon = document.createElement("span");
        const $teamName = document.createElement("p");
        const $teamShow = document.createElement("input");
        const $teamShowLabel = document.createElement("label");
        const $teamShowLabelCheck = document.createElement("span");

        $item.classList.add("team-item");
        $header.classList.add("team-header");
        $content.classList.add("team-content");
        $headerIcon.classList.add("team-icon");
        $headerIcon.classList.add("active");
        $teamShow.classList.add("team-show");
        $teamShowLabel.classList.add("team-show-label");
        $teamShowLabelCheck.classList.add("team-show-label-check");

        $header.append($teamShow);
        $header.append($headerIcon);
        $headerIcon.style.background = getTextColorByBackgroundColor(data.color);

        $headerIcon.addEventListener("click", e => {
          if($headerIcon.classList.contains("active")) {
            $headerIcon.classList.remove("active");
            $content.style.display = "none";
          }else {
            $headerIcon.classList.add("active");
            $content.style.display = "block";
          }
        })

        $teamName.innerText = data.name;
        $header.append($teamName);
        $header.style.background = data.color;
        $header.style.color = getTextColorByBackgroundColor(data.color);

        $teamShow.id = `team-show-${i}`;
        $teamShow.type = "checkbox";
        $teamShow.checked = true;

        $teamShow.addEventListener("change", e => {
          if(!moveMonth) {
            let idx = disable.indexOf(data.no);
            if($teamShow.checked) {
              if(idx > -1) disable.splice(idx, 1);
            }else {
              if(idx == -1) disable.push(data.no);
            }
  
            moveMonth = true;
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
          }
        })

        $teamShowLabel.setAttribute("for", `team-show-${i}`);
        $teamShowLabel.style.color = getTextColorByBackgroundColor(data.color);
        $teamShowLabelCheck.style.background = getTextColorByBackgroundColor(data.color);
        $teamShowLabel.addEventListener("click", e => {
          if(moveMonth) e.preventDefault();
        })
        $teamShowLabel.append($teamShowLabelCheck);
        $header.append($teamShowLabel);

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

const loadRequest = (open = false) => {
  fetch("/get-request", {
    method: "POST",
    body: JSON.stringify({})
  })
  .then(req => req.json())
  .then(res => {
    if(res.state == "SUCCESS") {
      if(!popupOpened || open) {
        popupOpened = true;

        const result = res.result;

        if(result.length == 0) {
          $requestCount.style.display = "none";
        }else {
          $requestCount.style.display = "";
          $requestCount.innerHTML = result.length;
        }

        const requestTeamList = $requestTeamList.querySelectorAll(".request-item");
        for(let i = 0; i < requestTeamList.length; i++) {
          requestTeamList[i].remove();
        }

        for(let i = 0; i < result.length; i++) {
          const data = result[i];
          const $item = document.createElement("div");
          const $name = document.createElement("p");
          const $accept = document.createElement("div");
          const $refuse = document.createElement("div");

          $item.classList.add("request-item");
          $name.classList.add("request-name");
          $accept.classList.add("request-button");
          $refuse.classList.add("request-button");
          
          $item.style.backgroundColor = data.color;
          $accept.style.borderColor =
          $refuse.style.borderColor =
          $item.style.color = getTextColorByBackgroundColor(data.color);

          $name.innerText = data.name;
          $accept.innerText = "Accept";
          $refuse.innerText = "Refuse";

          $accept.addEventListener("click", e => {
            fetch("/accept-request", {
              method: "POST",
              body: JSON.stringify({
                groupNo: data.no
              })
            })
            .then(req => req.json())
            .then(res => {
              if(res.state == "SUCCESS") {
                loadRequest(true);
                loadTeam();
              }else {
                if(res.alert) {
                  loadRequest(true);
                  loadTeam();
                  setAlert(res.alert);
                }
              }
            })
          })

          $refuse.addEventListener("click", e => {
            fetch("/refuse-request", {
              method: "POST",
              body: JSON.stringify({
                groupNo: data.no
              })
            })
            .then(req => req.json())
            .then(res => {
              if(res.state == "SUCCESS") {
                loadRequest(true);
              }else {
                if(res.alert) {
                  setAlert(res.alert);
                }
              }
            })
          })

          $item.append($name);
          $item.append($accept);
          $item.append($refuse);

          $requestTeamList.append($item);
        }

        $requestTeam.style.display = "block";
        $popupBackground.style.display = "block";
      }
    }else {
      if(res.alert) {
        setAlert(res.alert);
      }
    }
  })
}

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

$openInviteTeam.addEventListener("click", e => {
  e.preventDefault();
  if(!popupOpened) loadTeam(true);
})

$openRequestTeam.addEventListener("click", e => {
  e.preventDefault();
  if(!popupOpened) {
    loadRequest();
  }
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
      $popupBackground.style.display = "none";
      resetAlert();
      loadTeam();
    }else {
      if(res.alert) {
        setAlert(res.alert);
      }
    }
  })
})

$inviteTeamButton.addEventListener("click", e => {
  e.preventDefault();
  const form = $inviteTeamForm;
  const param = {};
  param.uid = form.user.value;
  param.no = [];

  for(let i = 0; i < form.checkedTeam.length; i++) {
    const thisCheckbox = form.checkedTeam[i];

    if(thisCheckbox.checked) {
      param.no.push(thisCheckbox.dataset.no);
    }
  }

  fetch("/invite-team", {
    method: "POST",
    body: JSON.stringify(param)
  })
  .then(req => req.json())
  .then(res => {
    if(res.state == "SUCCESS") {
      popupOpened = false;
      $inviteTeam.style.display = "none";
      $popupBackground.style.display = "none";
      resetAlert();
    }else {
      if(res.alert) {
        setAlert(res.alert);
      }
    }
  })
})