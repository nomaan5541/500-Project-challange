const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

let animating = false;

function computeScale() {
	const max = Math.max(window.innerWidth, window.innerHeight);
	return (max * 1.3) / 200;
}

function start() {
	if (animating) return;
	animating = true;

	const scale = computeScale();
	startButton.style.setProperty("--scale", scale);
	startButton.classList.add("animating");
	startButton.style.color = "transparent";

	setTimeout(() => {
		resetButton.classList.add("visible");
		animating = false;
	}, 2700);
}

function reset() {
	startButton.classList.remove("animating");
	resetButton.classList.remove("visible");
	startButton.style.removeProperty("--scale");
	startButton.style.color = "white";
	void startButton.offsetWidth;
}

startButton.addEventListener("click", start);
resetButton.addEventListener("click", reset);