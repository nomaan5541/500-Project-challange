document.addEventListener("DOMContentLoaded", () => {
	const buttons = document.querySelectorAll(".button");
	buttons.forEach((button) => {
		button.addEventListener("mousemove", (e) => {
			const rect = button.getBoundingClientRect();
			const offsetX = e.clientX - rect.left;
			const percent = (offsetX / rect.width) * 100;
			let mapped = percent - 50;
			const step = 5;
			mapped = Math.round(mapped / step) * step;
			button.style.setProperty("--x", `${mapped}%`);
		});
		button.addEventListener("mouseleave", () => {
			button.style.setProperty("--x", `0%`);
		});
	});
});
