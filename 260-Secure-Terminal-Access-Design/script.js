document.addEventListener('DOMContentLoaded', () => {
    const lenses = document.querySelectorAll('.lens');
    const container = document.getElementById('game-container');
    const input = document.getElementById('guess');
    const status = document.getElementById('status-line');
    const consoleBox = document.getElementById('console-ui');
    const submitBtn = document.getElementById('submit');
    const canvas = document.getElementById('pong');
    const ctx = canvas.getContext('2d');

    let activeLens = null, startX, startY, startLeft, startTop, lockedOut = false;
    let score = 0;
    let highscore = localStorage.getItem('pong-high') || 0;
    document.getElementById('highscore').innerText = highscore;

    document.getElementById('init-btn').addEventListener('click', () => {
        document.getElementById('intro-modal').style.display = 'none';
        input.focus();
    });

    function updateClip(lens) {
        const revealer = document.getElementById('reveal-' + lens.id);
        const x = lens.offsetLeft + (lens.offsetWidth / 2);
        const y = lens.offsetTop + (lens.offsetHeight / 2);
        revealer.style.clipPath = `circle(${lens.offsetWidth / 2}px at ${x}px ${y}px)`;
    }

    lenses.forEach(lens => {
        updateClip(lens);
        lens.onmousedown = (e) => {
            if (lockedOut) return;
            activeLens = lens;
            startX = e.clientX; startY = e.clientY;
            startLeft = lens.offsetLeft; startTop = lens.offsetTop;
            lens.style.zIndex = 150;
        };
    });

    window.onmousemove = (e) => {
        if (!activeLens || lockedOut) return;
        let x = Math.max(0, Math.min(startLeft + (e.clientX - startX), container.clientWidth - activeLens.offsetWidth));
        let y = Math.max(0, Math.min(startTop + (e.clientY - startY), container.clientHeight - activeLens.offsetHeight));
        activeLens.style.left = x + 'px';
        activeLens.style.top = y + 'px';
        updateClip(activeLens);
    };

    window.onmouseup = () => { if (activeLens) activeLens.style.zIndex = 10; activeLens = null; };

    submitBtn.onclick = async () => {
        if (lockedOut || input.value === "") return;
        const val = input.value.toUpperCase();
        lockedOut = true; input.disabled = true; submitBtn.disabled = true;

        if (val === '74B92X') {
            for (let i = 0; i <= 100; i += 10) {
                status.innerText = `AUTHORIZING [${i}%]`;
                await new Promise(r => setTimeout(r, 100));
            }
            document.getElementById('main-interface').style.display = 'none';
            document.getElementById('pong-container').style.display = 'block';
            initPong();
        } else {
            consoleBox.classList.add('error-flash-bg');
            status.innerText = "ERROR: UNAUTHORIZED. REBOOTING...";
            status.classList.add('error-state');
            setTimeout(() => {
                lockedOut = false; input.disabled = false; submitBtn.disabled = false;
                input.value = ""; status.innerText = "READY_";
                status.classList.remove('error-state'); consoleBox.classList.remove('error-flash-bg');
                input.focus();
            }, 2000);
        }
    };

    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') submitBtn.click(); });

    function initPong() {
        let p1 = 185, p2 = 185, bx = 400, by = 225, vx = 0, vy = 0;
        const paddleHeight = 80;
        let gameActive = false;
        const startBtn = document.getElementById('pong-start-btn');
        const scoreEl = document.getElementById('score');
        const initSpeed = 3.5;

        canvas.onmousemove = (e) => {
            const rect = canvas.getBoundingClientRect();
            p1 = e.clientY - rect.top - paddleHeight / 2;
        };

        function resetBall() {
            gameActive = false;
            bx = 400; by = 225; vx = 0; vy = 0;
            score = 0;
            scoreEl.innerText = score;
            document.getElementById('pong-overlay').style.display = 'flex';
            startBtn.innerText = "RESTART_STREAK";
        }

        startBtn.onclick = () => {
            document.getElementById('pong-overlay').style.display = 'none';
            vx = initSpeed; // Fixed: Ball now always starts going right
            vy = (Math.random() - 0.5) * initSpeed;
            gameActive = true;
        };

        function draw() {
            ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 800, 450);
            ctx.fillStyle = '#0f0';
            ctx.fillRect(10, p1, 10, paddleHeight);
            ctx.fillRect(780, p2, 10, paddleHeight);
            ctx.fillRect(bx-5, by-5, 10, 10);

            if (gameActive) {
                bx += vx; by += vy;
                if (by < 0 || by > 450) vy *= -1;
                
                if (bx < 20 && by > p1 && by < p1 + paddleHeight) {
                    vx = Math.abs(vx) * 1.05;
                    vy += (by - (p1 + 40)) * 0.1;
                    score++;
                    scoreEl.innerText = score;
                    if (score > highscore) {
                        highscore = score;
                        localStorage.setItem('pong-high', highscore);
                        document.getElementById('highscore').innerText = highscore;
                    }
                }
                
                if (bx > 780) {
                    vx = -Math.abs(vx);
                }
                
                if (bx < 0) resetBall();
                p2 = by - paddleHeight / 2;
            }
            requestAnimationFrame(draw);
        }
        draw();
    }
});