const canvasAnimation = e => {
  const frame = new Date().getTime() - letFrame;
  letFrame = letFrame + frame;

  $backgroundCanvas.width = page.w;
  $backgroundCanvas.height = page.h;

  let grd = backgroundCtx.createLinearGradient(0, 0, 0, page.h);
  grd.addColorStop(0, "#7ea1f3");
  grd.addColorStop(1, "#dbe5fe");

  backgroundCtx.globalAlpha = 1;
  backgroundCtx.fillStyle = grd;
  backgroundCtx.fillRect(0, 0, page.w, page.h);

  backgroundCtx.fillStyle = "#fff";

  for(let i = 0; i < backgroundParticle.length; i++) {
    let item = backgroundParticle[i];

    backgroundCtx.globalAlpha = item.opacity;
    backgroundCtx.beginPath();
    backgroundCtx.arc(item.x + (Math.cos(item.theta) * item.size), item.y, item.size, 0, PI * 2);
    backgroundCtx.fill();
    backgroundCtx.beginPath();
    
    if(item.y > -20) {
      item.y += (7 - item.size) * frame * 0.04;
      item.theta += (7 - item.size) * frame * 0.0007;
    }

    if(item.y > page.h + 10) {
      item.size = (Math.random() * 4) + 2;
      item.x = (Math.random() * (page.w + 20)) - 10;
      if(item.y > page.h + 20) item.y = (Math.random() * (page.h + 20)) - 10;
      else item.y = -10;
      item.theta = Math.random() * 2 * PI;
      item.opacity = (Math.random() * 0.5) + 0.2;
    }
  }

  requestAnimationFrame(canvasAnimation);
}

const canvasLoad = e => {
  $backgroundCanvas.width = page.w;
  $backgroundCanvas.height = page.h;

  let grd = backgroundCtx.createLinearGradient(0, 0, 0, page.h);
  grd.addColorStop(0, "#7ea1f3");
  grd.addColorStop(1, "#dbe5fe");

  backgroundCtx.fillStyle = grd;
  backgroundCtx.fillRect(0, 0, page.w, page.h);

  for(let i = 0; i < 500; i++) {
    let result = {};

    result.size = (Math.random() * 4) + 2;
    result.x = (Math.random() * (page.w + 20)) - 10;
    result.y = (Math.random() * (page.h + 20)) - 10;
    result.theta = Math.random() * 2 * PI;
    result.opacity = (Math.random() * 0.5) + 0.2;

    backgroundParticle.push(result);
  }

  letFrame = new Date().getTime();

  canvasAnimation();
}