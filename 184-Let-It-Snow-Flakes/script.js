const arr = []; // particles
const c = document.querySelector("canvas");
const ctx = c.getContext("2d");
const cw = (c.width = 3000);
const ch = (c.height = 3000);
const c2 = c.cloneNode(true); //document.querySelector(".fixed-bg").append(c2);
const ctx2 = c2.getContext("2d", {willReadFrequently:true});
const txtImg = document.querySelector('.text-img');
if (txtImg.complete) ctx2.drawImage(txtImg, 560, 1380);
else txtImg.onload = ()=> ctx2.drawImage(txtImg, 560, 1380);

for (let i = 0; i < 1300; i++) makeFlake(i, true);

function makeFlake(i, ff){
  arr.push({ i:i, x:0, x2:0, y:0, s:0 })
  arr[i].t = gsap.timeline({repeat:-1, repeatRefresh:true})
    .fromTo(arr[i], {
      x:()=>-400 + (cw+800) * Math.random(),
      y:-15,
      s:()=>'random(1.8, 7, .1)',
      x2:-500
    }, {
      ease:'none',
      y:ch,
      x:'+='+'random(-400, 400, 1)',
      x2:500
    })
    .seek( ff ? Math.random()*99 : 0)
    .timeScale( arr[i].s / 37 )
}

ctx.fillStyle="#fff";
gsap.ticker.add(render);

function render() {
  ctx.clearRect(0, 0, cw, ch);
  arr.forEach((c) => {
    if (c.t){
      if (c.t.isActive()){
        const d = ctx2.getImageData(c.x+c.x2, c.y, 1, 1);
        if (d.data[3]>150 && Math.random()>0.5) {
          c.t.pause();
          if (arr.length<9000) makeFlake(arr.length-1, false);
        }
      }
    }
    ctx.beginPath();
    ctx.arc(c.x+c.x2, c.y, c.s*gsap.utils.interpolate(1, .2, c.y/ch), 0, Math.PI * 2);
    ctx.fill();
  });
}