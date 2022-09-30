const $wrap = document.querySelector("#wrap");
const $login = document.querySelector("#login");
const $register = document.querySelector("#register");

$login.addEventListener("click", e => {
  $wrap.classList.remove("register");
})

$register.addEventListener("click", e => {
  $wrap.classList.add("register");
})

const app = e => {
  $wrap.classList.add("page-loaded");
}

app();