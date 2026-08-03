const palette = ['--c1', '--c2', '--c3', '--c4', '--c5', '--c6'];
let currentMode = 'h'; 
let sliceCount = 4;
let offsets = Array(12).fill(0);
let locked = Array(12).fill(false);

const stage = document.getElementById('stage');
const cssOutput = document.getElementById('css-output');

function updateUI() {
  stage.innerHTML = '';
  const activePalette = palette.slice(0, sliceCount);
  
  let cssText = `/* slice configuration */\n`;

  activePalette.forEach((color, i) => {
    const layer = document.createElement('div');
    layer.className = `slice-layer ${locked[i] ? 'locked' : ''}`;
    layer.innerText = 'SLICE'; // 
    layer.style.color = `var(${color})`;
    
    const step = 100 / sliceCount;
    let clip = '';
    
    if (currentMode === 'h') {
      const top = i * step;
      const bottom = 100 - ((i + 1) * step);
      clip = `inset(${top}% 0 ${bottom}% 0)`;
      layer.style.transform = `translate(calc(-50% + ${offsets[i]}px), -50%)`;
    } else {
      const left = i * step;
      const right = 100 - ((i + 1) * step);
      clip = `inset(0 ${right}% 0 ${left}%)`;
      layer.style.transform = `translate(-50%, calc(-50% + ${offsets[i]}px))`;
    }
    
    layer.style.clipPath = clip;
    
    layer.onclick = () => {
      locked[i] = !locked[i];
      updateUI();
    };

    stage.appendChild(layer);
    if(locked[i]) {
        cssText += `.slice-${i} { \n  clip-path: ${clip};\n  transform: translate${currentMode.toUpperCase()}(${offsets[i].toFixed(0)}px);\n}\n`;
    }
  });

  cssOutput.innerText = cssText || "move cursor to distort, tap to lock";
}

window.onpointermove = (e) => {
  const mouseX = (e.clientX - window.innerWidth / 2) * 0.4;
  const mouseY = (e.clientY - window.innerHeight / 2) * 0.4;

  offsets = offsets.map((off, i) => {
    if (locked[i]) return off;
    const baseDelta = currentMode === 'h' ? mouseX : mouseY;
    return baseDelta * (i % 2 === 0 ? 1 : -0.5);
  });
  
  updateUI();
};

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
    offsets.fill(0);
    locked.fill(false);
    updateUI();
  };
});

document.querySelectorAll('.qty-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    sliceCount = parseInt(btn.dataset.val);
    updateUI();
  };
});

document.getElementById('reset-btn').onclick = () => {
  offsets.fill(0);
  locked.fill(false);
  updateUI();
};

document.getElementById('copy-btn').onclick = () => {
  navigator.clipboard.writeText(cssOutput.innerText);
  document.getElementById('copy-btn').innerText = "copied";
  setTimeout(() => document.getElementById('copy-btn').innerText = "copy css", 1000);
};

updateUI();