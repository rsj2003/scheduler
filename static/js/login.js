const $wrap = document.querySelector("#wrap");
const $login = document.querySelector("#login");
const $register = document.querySelector("#register");
const $forgetPassword = document.querySelector(".forgot-password");
const $alert = document.querySelectorAll(".alert");
const $alertPop = document.querySelectorAll(".alert-pop");
const $loginForm = document.querySelector("#login-form");
const $registerForm = document.querySelector("#register-form");
const $backgroundGrid = document.querySelector("#background .grid");
const $backgroundGridBackground = document.querySelector("#background .grid-background");
const $formBackgroundGrid = document.querySelector("#form-background .grid");
const $registerGroup = document.querySelector("#register-group");
const $loginGroup = document.querySelector("#login-group");
const $formGroup = document.querySelector("#form-group");
const $inputWrap = document.querySelector("#input-wrap");
const $todayMonth = document.querySelector("#today-month");
const $todayDate = document.querySelector("#today-date");
const $logout = document.querySelector("#logout");
const today = new Date();
const $date = document.querySelector("#date");

const loginToMain = e => {
  $todayMonth.style.display = "block";
  $todayMonth.style.fontSize = "125px";
  $todayMonth.style.left = "130%";
  $todayDate.style.display = "block";
  $todayDate.style.fontSize = "175px";
  $todayDate.style.right = "80%";

  setTimeout(e => {
    $todayMonth.style.transition = ".8s";
    $todayDate.style.transition = ".8s";
  }, 5);

  setTimeout(e => {
    $backgroundGrid.style.width = "300px";
    $backgroundGrid.style.boxShadow = "0 0 20px #0000";
    $backgroundGridBackground.style.width = "calc(100% - 300px)";
    $backgroundGridBackground.style.left = "300px";
    $registerForm.style.display = "none";
    $loginGroup.style.display = "none";
    $registerGroup.style.left = "-75px";
    $registerGroup.style.transition = ".8s";
    $formGroup.style.left = "760px";
    $formGroup.style.transition = ".8s";
    $inputWrap.style.transition = ".8s";
    $todayDate.style.right = "11%";
    $todayMonth.style.left = "50%";
    $formBackgroundGrid.style.width = `${$formBackgroundGrid.clientWidth}px`;
    
    setTimeout(e => {
      $formBackgroundGrid.style.transition = ".8s";
    }, 5);
  
    setTimeout(e => {
      $backgroundGridBackground.style.zIndex = "2";
      // $backgroundGridBackground.style.width = "100%";
      $registerGroup.style.display = "none";
      $formGroup.style.display = "none";
      $inputWrap.style.transform = "translate(-50%, -50%) rotate(90deg)";
      // $inputWrap.style.width = "580px";
      // $formBackgroundGrid.style.width = "210px";
      $inputWrap.style.width = "220px";
      $inputWrap.style.height = "180px";
      $inputWrap.style.left = "150px";
      $inputWrap.style.top = "160px";
      $inputWrap.style.boxShadow = "0 0 20px #3338";
      $formBackgroundGrid.style.width = "90px";
      $todayMonth.style.fontSize = "50px";
      $todayDate.style.fontSize = "70px";
      $todayDate.style.right = "0";
      
      setTimeout(e => {
        $backgroundGridBackground.style.left = "0";
        $backgroundGridBackground.style.width = "300px";
        $backgroundGridBackground.style.boxShadow = "box-shadow: 0 0 20px #3333";
        $wrap.classList.add("main");
      }, 800)
    }, 800)
  }, 10)

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

const removeRegisterClass = e => {
  resetAlert();
  $wrap.classList.remove("register");
}

$login.addEventListener("click", removeRegisterClass)

$register.addEventListener("click", e => {
  resetAlert();
  $wrap.classList.add("register");
})

$forgetPassword.addEventListener("click", e => {
  resetAlert();
  $loginForm.classList.add("to-back");
})

$registerForm.addEventListener("submit", e => {
  e.preventDefault();

  fetch("/register-action", {
    method: "POST",
    body: JSON.stringify({
      id: e.target.id.value,
      password: e.target.password.value,
      email: e.target.email.value
    })
  })
  .then(req => req.json())
  .then(res => {
    if(res.state == "SUCCESS") {
      removeRegisterClass();
      $loginForm.id.value = res.id;
      setTimeout(e => {
        $registerForm.reset();
      }, 800);
    }else {
      if(res.alert) {
        setAlert(res.alert);
      }
    }
  })
})

$loginForm.addEventListener("submit", e => {
  e.preventDefault();

  fetch("/login-action", {
    method: "POST",
    body: JSON.stringify({
      id: e.target.id.value,
      password: e.target.password.value
    })
  })
  .then(req => req.json())
  .then(res => {
    if(res.state == "SUCCESS") loginToMain();
    else {
      if(res.alert) {
        setAlert(res.alert);
      }
    }
  })
})

$logout.addEventListener("click", e => {
  fetch("/logout-action", {
    method: "POST",
    body: JSON.stringify({})
  })
  .then(req => req.json())
  .then(res => {
    if(res.state == "SUCCESS") window.top.location.href = "/";
    else {
      console.error(res.err);
    }
  })
})

const setCalender = (year, month, date) => {
  const thisMonth = new Date(year, month + 1, 0);

  for(let i = 0; i < 6; i++) {
    const $calenderLine = document.createElement("div");
    $calenderLine.classList.add("calender-line");

    for(let j = 0; j < 7; j++) {
      const $calenderDate = document.createElement("div");
      $calenderDate.classList.add("calender-date");

      $calenderDate.innerHTML = `<p>${1 + j + i * 7}</p>`;

      $calenderLine.append($calenderDate);
    }

    $date.append($calenderLine);
  }
}

const app = e => {
  $todayMonth.innerHTML = today.getMonth() + 1;
  $todayDate.innerHTML = today.getDate();

  setTimeout(e => {
    $wrap.classList.add("page-loaded");
  }, 1)

  setCalender(today.getFullYear(), today.getMonth() + 1, today.getDate());
}

app();