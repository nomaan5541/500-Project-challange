const icons = Array.from(document.querySelectorAll("kbd"));
const dialog = document.querySelector("dialog");

const sequence = [
	"ArrowUp",
	"ArrowUp",
	"ArrowDown",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"ArrowLeft",
	"ArrowRight",
	"b",
	"a"
];

let currentIndex = 0;
let error = false;

function trackInput(event) {
	// Ignore when key held
	if (event.repeat) {
		return;
	}
	if (error) {
		currentIndex = 0;
		error = false;
		icons.forEach((icon) => (icon.style.color = "white"));
	}

	const keyPressed = event.key;

	if (keyPressed === sequence[currentIndex]) {
		currentIndex++;
	} else {
		error = true;
	}

	if (error) {
		icons[currentIndex].style.color = "#FF3333";
	} else if (currentIndex > 0) {
		icons[currentIndex - 1].style.color = "lightgreen";
	}

	// If the complete sequence is matched
	if (currentIndex === sequence.length) {
		dialog.showModal();
		currentIndex = 0;
		setTimeout(
			() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
			2000
		);
	}
}

// Attach the event listener to the document
document.addEventListener("keydown", trackInput);