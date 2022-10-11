const $wrap = document.querySelector("#wrap");
const $login = document.querySelector("#login");
const $register = document.querySelector("#register");
const $forgetPassword = document.querySelector(".forgot-password");
const $loginForm = document.querySelector("#login-form");

$login.addEventListener("click", e => {
  $wrap.classList.remove("register");
})

$register.addEventListener("click", e => {
  $wrap.classList.add("register");
})

$forgetPassword.addEventListener("click", e => {
  $loginForm.classList.add("to-back");
})

const app = e => {
  setTimeout(e => {
    $wrap.classList.add("page-loaded");
  }, 1)
}

app();