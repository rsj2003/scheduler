const $login = document.querySelector("#login");
const $register = document.querySelector("#register");
const $forgetPassword = document.querySelector(".forgot-password");
const $loginForm = document.querySelector("#login-form");
const $registerForm = document.querySelector("#register-form");
const $formBackgroundGrid = document.querySelector("#form-background .grid");
const $registerGroup = document.querySelector("#register-group");
const $loginGroup = document.querySelector("#login-group");
const $formGroup = document.querySelector("#form-group");
const $inputWrap = document.querySelector("#input-wrap");
const $logout = document.querySelector("#logout");

const loginToMain = e => {
  $todayMonth.style.display = "block";
  $todayMonth.style.fontSize = "125px";
  $todayMonth.style.left = "130%";
  $todayDate.style.display = "block";
  $todayDate.style.fontSize = "175px";
  $todayDate.style.right = "80%";

  $userId.innerHTML = user.id;
  $userEmail.innerHTML = user.email;

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

        logined();
      }, 800)
    }, 800)
  }, 10)

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
      $loginForm.password.focus();
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
    if(res.state == "SUCCESS") {
      user = res.user;
      
      loginToMain();
    }else {
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

const testLogin = e => {
  fetch("/test-login-action", {
    method: "POST"
  })
  .then(req => req.json())
  .then(res => {
    if(res.state == "SUCCESS") {
      user = res.user;
      
      loginToMain();
    }
  })
}