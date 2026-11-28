// List of all standard CSS named colors
const cssColors = [
	"aliceblue",
	"antiquewhite",
	"aqua",
	"aquamarine",
	"azure",
	"beige",
	"bisque",
	"black",
	"blanchedalmond",
	"blue",
	"blueviolet",
	"brown",
	"burlywood",
	"cadetblue",
	"chartreuse",
	"chocolate",
	"coral",
	"cornflowerblue",
	"cornsilk",
	"crimson",
	"cyan",
	"darkblue",
	"darkcyan",
	"darkgoldenrod",
	"darkgray",
	"darkgreen",
	"darkgrey",
	"darkkhaki",
	"darkmagenta",
	"darkolivegreen",
	"darkorange",
	"darkorchid",
	"darkred",
	"darksalmon",
	"darkseagreen",
	"darkslateblue",
	"darkslategray",
	"darkslategrey",
	"darkturquoise",
	"darkviolet",
	"deeppink",
	"deepskyblue",
	"dimgray",
	"dimgrey",
	"dodgerblue",
	"firebrick",
	"floralwhite",
	"forestgreen",
	"fuchsia",
	"gainsboro",
	"ghostwhite",
	"goldenrod",
	"gold",
	"gray",
	"green",
	"greenyellow",
	"grey",
	"honeydew",
	"hotpink",
	"indianred",
	"indigo",
	"ivory",
	"khaki",
	"lavenderblush",
	"lavender",
	"lawngreen",
	"lemonchiffon",
	"lightblue",
	"lightcoral",
	"lightcyan",
	"lightgoldenrodyellow",
	"lightgray",
	"lightgreen",
	"lightgrey",
	"lightpink",
	"lightsalmon",
	"lightseagreen",
	"lightskyblue",
	"lightslategray",
	"lightslategrey",
	"lightsteelblue",
	"lightyellow",
	"lime",
	"limegreen",
	"linen",
	"magenta",
	"maroon",
	"mediumaquamarine",
	"mediumblue",
	"mediumorchid",
	"mediumpurple",
	"mediumseagreen",
	"mediumslateblue",
	"mediumspringgreen",
	"mediumturquoise",
	"mediumvioletred",
	"midnightblue",
	"mintcream",
	"mistyrose",
	"moccasin",
	"navajowhite",
	"navy",
	"oldlace",
	"olive",
	"olivedrab",
	"orange",
	"orangered",
	"orchid",
	"palegoldenrod",
	"palegreen",
	"paleturquoise",
	"palevioletred",
	"papayawhip",
	"peachpuff",
	"peru",
	"pink",
	"plum",
	"powderblue",
	"purple",
	"rebeccapurple",
	"red",
	"rosybrown",
	"royalblue",
	"saddlebrown",
	"salmon",
	"sandybrown",
	"seagreen",
	"seashell",
	"sienna",
	"silver",
	"skyblue",
	"slateblue",
	"slategray",
	"slategrey",
	"snow",
	"springgreen",
	"steelblue",
	"tan",
	"teal",
	"thistle",
	"tomato",
	"turquoise",
	"violet",
	"wheat",
	"white",
	"whitesmoke",
	"yellow",
	"yellowgreen"
];

/**
 * Converts a CSS color name to its RGB components by leveraging the DOM's computed styles.
 */
function nameToRgb(name) {
	const fakeDiv = document.createElement("div");
	fakeDiv.style.color = name;
	document.body.appendChild(fakeDiv);
	const cs = window.getComputedStyle(fakeDiv).color;
	document.body.removeChild(fakeDiv);
	const values = cs.match(/\d+/g).map(Number);
	return { r: values[0], g: values[1], b: values[2] };
}

/**
 * Converts RGB values to a Hexadecimal string.
 */
function rgbToHex(r, g, b) {
	return (
		"#" +
		[r, g, b]
			.map((x) => {
				const hex = x.toString(16);
				return hex.length === 1 ? "0" + hex : hex;
			})
			.join("")
	);
}

/**
 * Converts RGB values to CMYK percentages.
 */
function rgbToCmyk(r, g, b) {
	let c = 1 - r / 255;
	let m = 1 - g / 255;
	let y = 1 - b / 255;
	let k = Math.min(c, Math.min(m, y));

	if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

	c = Math.round(((c - k) / (1 - k)) * 100);
	m = Math.round(((m - k) / (1 - k)) * 100);
	y = Math.round(((y - k) / (1 - k)) * 100);
	k = Math.round(k * 100);

	return { c, m, y, k };
}

/**
 * Converts RGB values to HSL (Hue, Saturation, Lightness).
 */
function rgbToHsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;
	const max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	let h,
		s,
		l = (max + min) / 2;

	if (max === min) {
		h = s = 0;
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Categorizes a color into a "Family" based on its HSL values.
 */
function getFamily(h, s, l) {
	if (l < 10) return "Blacks";
	if (l > 95) return "Whites";
	if (s < 12) return "Greys";
	if (h < 20 || h >= 340) return "Reds";
	if (h < 50) return "Oranges";
	if (h < 70) return "Yellows";
	if (h < 170) return "Greens";
	if (h < 200) return "Cyans";
	if (h < 260) return "Blues";
	return "Purples";
}

// Process color list and attach metadata for sorting and display
const colorData = cssColors.map((name) => {
	const rgb = nameToRgb(name);
	const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
	return {
		name,
		rgb,
		hsl,
		family: getFamily(hsl.h, hsl.s, hsl.l)
	};
});

// Sort strategy: Group by Family (predefined order) and then sort from Light to Dark
const familiesOrder = [
	"Whites",
	"Yellows",
	"Oranges",
	"Reds",
	"Purples",
	"Blues",
	"Cyans",
	"Greens",
	"Greys",
	"Blacks"
];

colorData.sort((a, b) => {
	const famA = familiesOrder.indexOf(a.family);
	const famB = familiesOrder.indexOf(b.family);
	if (famA !== famB) return famA - famB;
	return b.hsl.l - a.hsl.l;
});

// Render the grid columns
const grid = document.getElementById("color-grid");

colorData.forEach((color) => {
	const col = document.createElement("div");
	col.className = "color-column";
	col.style.backgroundColor = color.name;

	// Requirement: Height depends on the length of the color name
	col.style.height = `${color.name.length * 1.5 + 10}rem`;

	const span = document.createElement("span");
	span.className = "color-name";
	span.textContent = color.name;

	// Ensure readable text color based on background lightness
	span.style.color = color.hsl.l > 60 ? "black" : "white";

	col.appendChild(span);
	col.addEventListener("click", () => showDetails(color));
	grid.appendChild(col);
});

// Modal Logic for detail view
const modal = document.getElementById("color-modal");
const closeBtn = document.querySelector(".close-button");

/**
 * Populates and displays the modal with detailed color information.
 */
function showDetails(color) {
	const { r, g, b } = color.rgb;
	const hex = rgbToHex(r, g, b);
	const cmyk = rgbToCmyk(r, g, b);

	document.getElementById("modal-color-display").style.backgroundColor =
		color.name;
	document.getElementById("modal-color-name").textContent = color.name;
	document.getElementById("modal-rgb").textContent = `${r}, ${g}, ${b}`;
	document.getElementById("modal-hex").textContent = hex.toUpperCase();
	document.getElementById(
		"modal-cmyk"
	).textContent = `C:${cmyk.c}% M:${cmyk.m}% Y:${cmyk.y}% K:${cmyk.k}%`;

	modal.classList.remove("hidden");
}

// Event listeners for closing the modal
closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", (e) => {
	if (e.target === modal) modal.classList.add("hidden");
});