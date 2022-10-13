const $wrap = document.querySelector("#wrap");
const $login = document.querySelector("#login");
const $register = document.querySelector("#register");
const $forgetPassword = document.querySelector(".forgot-password");
const $alert = document.querySelectorAll(".alert");
const $alertPop = document.querySelectorAll(".alert-pop");
const $loginForm = document.querySelector("#login-form");
const $registerForm = document.querySelector("#register-form");
const $backgroundGrid = document.querySelector("#background .grid");
const $formBackgroundGrid = document.querySelector("#form-background .grid");
const $registerGroup = document.querySelector("#register-group");
const $loginGroup = document.querySelector("#login-group");
const $formGroup = document.querySelector("#form-group");
const $inputWrap = document.querySelector("#input-wrap");
const $todayMonth = document.querySelector("#today-month");
const $todayDate = document.querySelector("#today-date");

const loginToMain = e => {
  const datetime = new Date();

  $backgroundGrid.style.width = "300px";
  $registerForm.style.display = "none";
  $loginGroup.style.display = "none";
  $registerGroup.style.left = "-75px";
  $formGroup.style.left = "760px";
  $inputWrap.style.transition = ".8s";
  $todayMonth.style.display = "block";
  $todayDate.style.display = "block";

  $todayMonth.innerHTML = datetime.getMonth() + 1;
  $todayDate.innerHTML = datetime.getDate();
  
  setTimeout(e => {
    $registerGroup.style.display = "none";
    $formGroup.style.display = "none";
    $inputWrap.style.transform = "translate(-50%, -50%) rotate(90deg)";
    $inputWrap.style.width = "580px";
    $formBackgroundGrid.style.width = "210px";
    
    setTimeout(e => {
      $inputWrap.style.width = "220px";
      $inputWrap.style.height = "180px";
      $inputWrap.style.left = "150px";
      $inputWrap.style.top = "160px";
      $formBackgroundGrid.style.width = "90px";
    }, 800)
  }, 800)
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

const app = e => {
  setTimeout(e => {
    $wrap.classList.add("page-loaded");
  }, 1)
}

app();