const $logout = document.querySelector("#logout");

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