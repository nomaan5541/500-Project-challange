console.clear();
// CONFIG
const FLIP_SPEED = 700;
const PENS_TO_DISPLAY = 82; // adjust as needed

const PENS = [
  {
    url: "https://codepen.io/cbolson/pen/azZoePb",
    img: "merry-christmas.webp",
    title: "Merry Christmas",
    likes: 36,
    views: 2155
  },
  {
    url: "https://codepen.io/cbolson/pen/myEbxmZ",
    img: "before-after.webp",
    title: "Before & After using position-anchor",
    likes: 11,
    views: 538
  },
		{
    url: "https://codepen.io/cbolson/pen/JoXQJNq",
    img: "2025-rewind.webp",
    title: "2025 Rewind",
    likes: 100,
    views: 2644
  },
  {
    url: "https://codepen.io/cbolson/pen/WbwPQdV",
    img: "cross-stitch.webp",
    title: "Christmas Cross-Stitch Messages",
    likes: 45,
    views: 1010
  },
	
  {
    url: "https://codepen.io/cbolson/pen/gbrBwQX",
    img: "image-bars.webp",
    title: "Full Height Image Bars",
    likes: 27,
    views: 867
  },
  {
    url: "https://codepen.io/cbolson/pen/gbrdLOd",
    img: "snow-landscape.webp",
    title: "I wonder if the snow loves the trees",
    likes: 31,
    views: 819
  },
  {
    url: "https://codepen.io/cbolson/pen/PwNQWNa",
    img: "sibling-index-animation.webp",
    title: "Animation using sibling-index() + corner-shape",
    likes: 42,
    views: 2711
  },
  {
    url: "https://codepen.io/cbolson/pen/wBGeyzL",
    img: "math.webp",
    title: "Math using CSS only function() & if() functions",
    likes: 34,
    views: 1395
  },
  {
    url: "https://codepen.io/cbolson/pen/NPNjvOQ",
    img: "flip-text-lando.webp",
    title: "Flip Text, Lando Norris Style",
    likes: 128,
    views: 2507
  },
  {
    url: "https://codepen.io/cbolson/pen/EaKKJdq",
    img: "mask-gallery.webp",
    title: "Mask Gallery",
    likes: 15,
    views: 790
  },
  {
    url: "https://codepen.io/cbolson/pen/LENGENp",
    img: "stepped-selector.webp",
    title: "Stepped Value Selector",
    likes: 36,
    views: 659
  },
  {
    url: "https://codepen.io/cbolson/pen/ogxgRBJ",
    img: "custom-select-2.webp",
    title: "Custom Select List",
    likes: 23,
    views: 995
  },
  {
    url: "https://codepen.io/cbolson/pen/VYawwgQ",
    img: "linked-lists.webp",
    title: "Linked Lists, multiple > single",
    likes: 11,
    views: 182
  },
  {
    url: "https://codepen.io/cbolson/pen/WbrWMbm",
    img: "corner-shape-gallery.webp",
    title: "Corner-Shape Gallery",
    likes: 81,
    views: 2459
  },
  {
    url: "https://codepen.io/cbolson/pen/QwyZKBp",
    img: "animated-svg-path.webp",
    title: "Animated SVG path with stops",
    likes: 95,
    views: 955
  },
	{
    url: "https://codepen.io/cbolson/pen/raxrRJm",
    img: "boarding-pass.webp",
    title: "Boarding Pass",
    likes: 9,
    views: 74
  },
  {
    url: "https://codepen.io/cbolson/pen/vELrOPz",
    img: "curved-scrollbar.webp",
    title: "Custom curved corner scrollbars",
    likes: 672,
    views: 12638
  },
  {
    url: "https://codepen.io/cbolson/pen/pvgdJmx",
    img: "spooky-spin.webp",
    title: "Spooky Spin",
    likes: 13,
    views: 783
  },
  {
    url: "https://codepen.io/cbolson/pen/GgoMyVp",
    img: "bad-date-picker.webp",
    title: "Bad UX Date Picker",
    likes: 19,
    views: 1296
  },
  {
    url: "https://codepen.io/cbolson/pen/dPGWzQX",
    img: "dot-clock-2.webp",
    title: "Minimal Dot Clock",
    likes: 74,
    views: 1086
  },
  {
    url: "https://codepen.io/cbolson/pen/dPGGRZd",
    img: "carousel-scroll.webp",
    title: "Carousel using ::scroll-* Demo 2",
    likes: 72,
    views: 1883
  },
  {
    url: "https://codepen.io/cbolson/pen/LEGVzpR",
    img: "carousel-scroll-1.webp",
    title: "Carousel using ::scroll-* Demo 1",
    likes: 31,
    views: 1211
  },
  {
    url: "https://codepen.io/cbolson/pen/QwjRvrr",
    img: "gradient-border-overlay.webp",
    title: "Gradient overlay using border-image",
    likes: 16,
    views: 911
  },
  {
    url: "https://codepen.io/cbolson/pen/OPyvEaE",
    img: "superheroes-carousel.webp",
    title: "Superheroes Carousel",
    likes: 110,
    views: 3637
  },
	{
    url: "https://codepen.io/cbolson/pen/ByoJRvg",
    img: "scrollspy.webp",
    title: "Scrollspy using animation-timeline",
    likes: 10,
    views: 254
  },
  {
    url: "https://codepen.io/cbolson/pen/KwdZzOM",
    img: "pie-chart-attr.webp",
    title: "Pie Chart using attr()",
    likes: 21,
    views: 903
  },
  {
    url: "https://codepe.io/cbolson/pen/NPGwpGY",
    img: "in-the-shade.webp",
    title: "In the Shade",
    likes: 30,
    views: 1049
   },
  {
    url: "https://codepen.io/cbolson/pen/jEbGZRB",
    img: "sphere-shadow.webp",
    title: "Sphere with shadow",
    likes: 19,
    views: 1200
  },
  {
    url: "https://codepen.io/cbolson/pen/MYavyqQ",
    img: "corner-shape-generator.webp",
    title: "corner-shape superellipse() generator",
    likes: 242,
    views: 7015
  },
  {
    url: "https://codepen.io/cbolson/pen/ogjWyyg",
    img: "hexagon-avatars.webp",
    title: "corner-shape hexagon avatars",
    likes: 11,
    views: 245
  },
  {
    url: "https://codepen.io/cbolson/pen/Byopzvy",
    img: "1000-followers-2.webp",
    title: "♥ 1,000 Followers on CodePen ♥",
    likes: 148,
    views: 2948
  },
  {
    url: "https://codepen.io/cbolson/pen/XJmNPQw",
    img: "sliding-scroll-images.webp",
    title: "Sliding Images using animation-timeline",
    likes: 32,
    views: 1531
  },
  {
    url: "https://codepen.io/cbolson/pen/VYvYeag",
    img: "circular-nav.webp",
    title: "Circular Nav component",
    likes: 35,
    views: 1010
  },
  {
    url: "https://codepen.io/cbolson/pen/ogjvJzR",
    img: "grid-cols-style.webp",
    title: "Grid columns using style()",
    likes: 14,
    views: 558
  },
  {
    url: "https://codepen.io/cbolson/pen/EaVYoVd",
    img: "slide-out-nav.webp",
    title: "Slide-out nav with flip effect",
    likes: 81,
    views: 2610
  },
  {
    url: "https://codepen.io/cbolson/pen/raVXxmb",
    img: "grid-areas-attr.webp",
    title: "grid areas using attr()",
    likes: 104,
    views: 5059
  },
  {
    url: "https://codepen.io/cbolson/pen/ZYGVZvJ",
    img: "spiralling.webp",
    title: "Spiralling",
    likes: 11,
    views: 182
  },
  {
    url: "https://codepen.io/cbolson/pen/wBaEjoe",
    img: "harmonic-motion.webp",
    title: "Harmonic Motion",
    likes: 13,
    views: 532
  },
	{
    url: "https://codepen.io/cbolson/pen/PwqBVqB",
    img: "css-counter.webp",
    title: "CSS Only Counter",
    likes: 13,
    views: 1087
  },
  {
    url: "https://codepen.io/cbolson/pen/pvJagVe",
    img: "ladybird.webp",
    title: "Where the Ladybird Flew",
    likes: 12,
    views: 468
  },
  {
    url: "https://codepen.io/cbolson/pen/PwqQwRo",
    img: "gradient-button.webp",
    title: "Animated Gradient Button",
    likes: 38,
    views: 1031
  },
  {
    url: "https://codepen.io/cbolson/pen/NPqrxbb",
    img: "squircles-gallery.webp",
    title: "Squircles Gallery with view-transition",
    likes: 120,
    views: 5293
  },
	{
    url: "https://codepen.io/cbolson/pen/dPoMpYB",
    img: "pieoneer.webp",
    title: "Pieoneer inspired App Icons around a circle",
    likes: 9,
    views: 324
  },
	{
    url: "https://codepen.io/cbolson/pen/bNdVjRe",
    img: "view-transition-gallery.webp",
    title: "View Transition Gallery",
    likes: 7,
    views: 496
  },
	{
    url: "https://codepen.io/cbolson/pen/azzgmQM",
    img: "alphabet-soup.webp",
    title: "Alphabet Soup",
    likes: 8,
    views: 131
  },	
  {
    url: "https://codepen.io/cbolson/pen/dPPeapv",
    img: "burger.webp",
    title: "Grab a Burger",
    likes: 13,
    views: 967
  },
  {
    url: "https://codepen.io/cbolson/pen/VYYrpoV",
    img: "the-doctors.webp",
    title: "The Doctors",
    likes: 112,
    views: 3907
  },
	{
    url: "https://codepen.io/cbolson/pen/wBBozqx",
    img: "carousel-direction-toggle.webp",
    title: "Carousel with direction toggle",
    likes: 7,
    views: 240
  },
  {
    url: "https://codepen.io/cbolson/pen/LEENGmB",
    img: "butterflies.webp",
    title: "Butterflies",
    likes: 94,
    views: 4138
  },
  {
    url: "https://codepen.io/cbolson/pen/wBBaegL",
    img: "goldfish.webp",
    title: "Goldfish",
    likes: 32,
    views: 2414
  },
	{
    url: "https://codepen.io/cbolson/pen/JoooXGR",
    img: "hypnotic-glow.webp",
    title: "Hypnotic glow ",
    likes: 23,
    views: 860
  },
  {
    url: "https://codepen.io/cbolson/pen/raaBgPz",
    img: "cut-out-curved-corners.webp",
    title: "Cutout Curved Corners using SVG",
    likes: 40,
    views: 915
  },
  {
    url: "https://codepen.io/cbolson/pen/raaBmwy",
    img: "moon-cards.webp",
    title: "The Moon - Glowing Cards",
    likes: 129,
    views: 6909
  },
	{
    url: "https://codepen.io/cbolson/pen/ByagVRo",
    img: "alice-in-wonderland.webp",
    title: "Alice in Wonderland: March of the cards",
    likes: 7,
    views: 220
  },
  {
    url: "https://codepen.io/cbolson/pen/ZYEdGQX",
    img: "easter-cards.webp",
    title: "Easter Card Carousel",
    likes: 151,
    views: 10930
  },
  {
    url: "https://codepen.io/cbolson/pen/mydYrKg",
    img: "poetic-cards.webp",
    title: "Stacked Poetic Cards",
    likes: 161,
    views: 4909
  },
  {
    url: "https://codepen.io/cbolson/pen/bNGjarJ",
    img: "flip-text.webp",
    title: "Flip Text",
    likes: 16,
    views: 323
  },
  {
    url: "https://codepen.io/cbolson/pen/vEYrqop",
    img: "cicada.webp",
    title: "Cicada Principal synthesizer",
    likes: 31,
    views: 1427
  },
  {
    url: "https://codepen.io/cbolson/pen/PwoKMXd",
    img: "404-lost-in-space.webp",
    title: "404 - Lost in space",
    likes: 43,
    views: 1203
  },
  {
    url: "https://codepen.io/cbolson/pen/zxYdrYx",
    img: "nonstop.webp",
    title: "Nonstop",
    likes: 12,
    views: 252
  },
  {
    url: "https://codepen.io/cbolson/pen/qEBjpeo",
    img: "bugliest-bug.webp",
    title: "The Bugliest Bug - custom cursors",
    likes: 139,
    views: 4047
  },
  {
    url: "https://codepen.io/cbolson/pen/WbNONXK",
    img: "the-fly.webp",
    title: "The Fly",
    likes: 31,
    views: 1158
  },
  {
    url: "https://codepen.io/cbolson/pen/VYwbypx",
    img: "jumpy-cards.webp",
    title: "Jumpy Intro Cards",
    likes: 14,
    views: 832
  },
	{
    url: "https://codepen.io/cbolson/pen/mydRGNe",
    img: "alarm-stopwatch.webp",
    title: "Alarm, Timer & Stopwatch component",
    likes: 8,
    views: 67
  },
	{
    url: "https://codepen.io/cbolson/pen/VYwPYYq",
    img: "flip-images.webp",
    title: "Flip Gallery",
    likes: 8,
    views: 707
  },
  {
    url: "https://codepen.io/cbolson/pen/MYWarzy",
    img: "dynamic-patterns.webp",
    title: "Dynamic patterns with config panel",
    likes: 60,
    views: 1358
  },
  {
    url: "https://codepen.io/cbolson/pen/yyLYBBg",
    img: "sticky-rotating-cards.webp",
    title: "Sticky rotating cards with scroll-timeline animation",
    likes: 14,
    views: 378
  },
  {
    url: "https://codepen.io/cbolson/pen/WbNbwrO",
    img: "mini-gallery.webp",
    title: "Mini Gallery",
    likes: 38,
    views: 1122
  },
  {
    url: "https://codepen.io/cbolson/pen/QwWWrgK",
    img: "electric-switch.webp",
    title: "Electric Circuit Switch",
    likes: 60,
    views: 2168
  },
  {
    url: "https://codepen.io/cbolson/pen/yyBmLvb",
    img: "retro-switch.webp",
    title: "Retro toggle switch",
    likes: 12,
    views: 1433
  },
  {
    url: "https://codepen.io/cbolson/pen/EaYzgaq",
    img: "3-way-toggle.webp",
    title: "3-way toggle",
    likes: 84,
    views: 1776
  },
  {
    url: "https://codepen.io/cbolson/pen/QwLRyqJ",
    img: "theme-toggle.webp",
    title: "Theme Toggle",
    likes: 56,
    views: 1279
  },
  {
    url: "https://codepen.io/cbolson/pen/gbYEWZP",
    img: "dance.webp",
    title: "Dance!",
    likes: 29,
    views: 868
  },
  {
    url: "https://codepen.io/cbolson/pen/WbePgJN",
    img: "dance-to-express.webp",
    title: "Dance to express",
    likes: 15,
    views: 775
  },
	{
    url: "https://codepen.io/cbolson/pen/ByBPjGr",
    img: "flip-gallery.webp",
    title: "Flip gallery",
    likes: 94,
    views: 2940
  },
	{
    url: "https://codepen.io/cbolson/pen/JoPZBzq",
    img: "spinning-rings.webp",
    title: "Spinning rings",
    likes: 10,
    views: 583
  },
  {
    url: "https://codepen.io/cbolson/pen/dPbKpyG",
    img: "lets-dance.webp",
    title: "Let's dance! Rotating disco ball on scroll",
    likes: 32,
    views: 1330
  },
  {
    url: "https://codepen.io/cbolson/pen/WbeJKad",
    img: "random-rotation.webp",
    title: "Random Rotation",
    likes: 18,
    views: 646
  },
	{
    url: "https://codepen.io/cbolson/pen/ByBxBez",
    img: "animated-profile-cards.webp",
    title: "Animated Profile Cards",
    likes: 11,
    views: 302
  },
  {
    url: "https://codepen.io/cbolson/pen/XJrZozp",
    img: "viewport-gallery.webp",
    title: "Full Viewport Gallery",
    likes: 19,
    views: 530
  },
  {
    url: "https://codepen.io/cbolson/pen/raBJWOJ",
    img: "pokemon-gallery-2.webp",
    title: "Pokemon Slide Gallery",
    likes: 460,
    views: 8450
  },
  {
    url: "https://codepen.io/cbolson/pen/MYgrjrm",
    img: "shuffle.webp",
    title: "Shuffling Effect in Pure CSS",
    likes: 308,
    views: 7451
  },
  {
    url: "https://codepen.io/cbolson/pen/vEBWwxL",
    img: "wheel-timeline-2.webp",
    title: " Wheel Timeline",
    likes: 402,
    views: 10744
  },
	{
    url: "https://codepen.io/cbolson/pen/azoVvZm",
    img: "clock-wheel.webp",
    title: "100 Year Clock Wheel",
    likes: 671,
    views: 12712
  },

];
/*
,
  {
    url: "",
    img: "",
    title: "",
    likes: ,
    views: 
  }
*/

// ANIMATIONS
const flipTiming = { duration: FLIP_SPEED, iterations: 1 };

const flipAnimationTop = [
    { transform: "rotateX(0)" },
    { transform: "rotateX(-90deg)" },
    { transform: "rotateX(-90deg)" }
];

const flipAnimationBottom = [
    { transform: "rotateX(90deg)" },
    { transform: "rotateX(90deg)" },
    { transform: "rotateX(0)" }
];

const flipAnimationTopReverse = [
    { transform: "rotateX(-90deg)" },
    { transform: "rotateX(-90deg)" },
    { transform: "rotateX(0)" }
];

const flipAnimationBottomReverse = [
    { transform: "rotateX(0)" },
    { transform: "rotateX(90deg)" },
    { transform: "rotateX(90deg)" }
];

// SELECTORS
const flipGallery = document.getElementById("flip-gallery");
const flipUnite = flipGallery.querySelectorAll(".unite");
const thumbsContainer = document.getElementById("gallery");

// STATE
let currentIndex = 0;

// SORT AND LIMIT PENS
function sortPens(pens, property) {
    return [...pens].sort((a, b) => (b[property] || 0) - (a[property] || 0));
}
const sortedPens = sortPens(PENS, "likes").slice(0, PENS_TO_DISPLAY);

// PRELOAD IMAGES
function preloadImages() {
    sortedPens.forEach(item => {
        const img = new Image();
        img.src = `https://raw.githubusercontent.com/cbolson/assets/refs/heads/main/codepen/2025/${item.img}`;
    });
}
preloadImages();

// CURRENT IMAGE
function setActiveImage(el, index) {
    const img = `https://raw.githubusercontent.com/cbolson/assets/refs/heads/main/codepen/2025/${sortedPens[index].img}`;
    el.style.backgroundImage = `url("${img}")`;
}

const DURATION_INFO = 300;

function setImageTitle(index) {
    const itemInfo = flipGallery.querySelector("#info");
    itemInfo.classList.add("hidden");

    setTimeout(() => {
        itemInfo.querySelector(".item-link").href = sortedPens[index].url;
			itemInfo.querySelector(".item-link").title = `See pen:  ${sortedPens[index].title}`;
			
        itemInfo.querySelector(".item-link").textContent = sortedPens[index].title;
        itemInfo.querySelector(".item-likes").textContent = new Intl.NumberFormat().format(sortedPens[index].likes);
        itemInfo.querySelector(".item-views").textContent = new Intl.NumberFormat().format(sortedPens[index].views);

        setTimeout(() => itemInfo.classList.remove("hidden"), 20);
    }, DURATION_INFO);
}

function updateActiveThumb(index) {
    document.querySelectorAll(".thumb.active").forEach(t => t.classList.remove("active"));

    const thumbs = document.querySelectorAll(".thumb");
    if (thumbs[index]) {
        thumbs[index].classList.add("active");
        thumbs[index].classList.add("visited");
    }
}

function updateGallery(index, isReverse = false) {
    const topAnimation = isReverse ? flipAnimationTopReverse : flipAnimationTop;
    const bottomAnimation = isReverse ? flipAnimationBottomReverse : flipAnimationBottom;

    flipGallery.querySelector(".overlay-top").animate(topAnimation, flipTiming);
    flipGallery.querySelector(".overlay-bottom").animate(bottomAnimation, flipTiming);

    flipUnite.forEach((el, idx) => {
        const delay = isReverse
            ? (idx === 1 || idx === 2 ? 0 : FLIP_SPEED - 200)
            : (idx === 1 || idx === 2 ? FLIP_SPEED - 200 : 0);

        setTimeout(() => setActiveImage(el, index), delay);
    });

    setTimeout(() => setImageTitle(index), FLIP_SPEED * 0.5);

    // update active thumbnail
    updateActiveThumb(index);
}

// NAV
function updateIndex(increment) {
    const newIndex = Number(increment);
    const isReverse = newIndex < 0;
    currentIndex = (currentIndex + newIndex + sortedPens.length) % sortedPens.length;
    updateGallery(currentIndex, isReverse);
}

document.querySelectorAll("[data-gallery-nav]").forEach(btn => {
    btn.addEventListener("click", () => updateIndex(parseInt(btn.dataset.galleryNav, 10)));
});

// THUMBS
function createThumbnails() {
    sortedPens.forEach((item, idx) => {
        const btn = document.createElement("button");
        btn.className = "thumb";
			btn.title = item.title;
        btn.style.backgroundImage = `url("https://raw.githubusercontent.com/cbolson/assets/refs/heads/main/codepen/2025/${item.img}")`;

        btn.addEventListener("click", () => {
            currentIndex = idx;
            updateGallery(currentIndex, false);
        });

        thumbsContainer.appendChild(btn);
    });
}
createThumbnails();

// INIT (random item)
currentIndex = Math.floor(Math.random() * sortedPens.length);

function defineFirstImg() {
    flipUnite.forEach(el => setActiveImage(el, currentIndex));
    setImageTitle(currentIndex);
    updateActiveThumb(currentIndex); // mark first thumb active
}
defineFirstImg();