let user = {};

fetch("/userData-action", {
  method: "POST",
  body: JSON.stringify({})
})
.then(req => req.json())
.then(res => {
  if(res.user.id) {
    user = res.user;
    loadTeam();
  }
})