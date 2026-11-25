import chroma from "https://cdn.jsdelivr.net/npm/chroma-js@3.1.2/+esm";

let select = (e) => document.querySelector(e);
let selectAll = (e) => document.querySelectorAll(e);

const
gsapWrapper = select("#gsapWrapper"),
gsapBody = select("#gsapBody"),
t0 = select("#t0"),
t1 = select("#t1"),
t2 = select("#t2"),
svg00 = select("svg#svg00"),
svg0 = select("svg#svg0"),
svg1 = select("svg#svg1"),
svg2 = select("svg#svg2"),
svg2b = select("svg#svg2b"),
svg2d = select("svg#svg2d"),
svg3 = select("svg#svg3"),
svg4 = select("svg#svg4"),
svg5 = select("svg#svg5"),
svg6 = select("svg#svg6");

var bodyStyle = getComputedStyle(select("body"));


/* createTrees(svg, start, direction, division, numT, scale) */

createTrees(svg00, 0.49, 1, 14, 4, 2.2);
createTrees(svg00, 0.49, -1, 14, 4, 2.2);

createTrees(svg0, 0.42, 1, 22, 4, 2);
createTrees(svg0, 0.32, -1, 20, 3, 2);

createTrees(svg1, 0.30, 1, 34, 2, 1.5);

createTrees(svg2d, 0.42, 1, 13, 3, 2);

createTrees(svg2b, 0.42, 1, 18, 3, 1.5);
createTrees(svg2b, 0.3, -1, 18, 3, 1.5);

createTrees(svg2, 0.3, 1, 24, 3, 1);
createTrees(svg2, 0.32, 1, 24, 2, 1.25);
createTrees(svg2, 0.2, -1, 28, 2, 1);
createTrees(svg2, 0.1, 1, 1, 1, 1.5 );

createTrees(svg3, 0.35, 1, 60, 8, 0.3);
createTrees(svg3, 0.3, -1, 60, 8, 0.3);

createTrees(svg4, 0.32, 1, 30, 3, 0.2);
createTrees(svg4, 0.34, 1, 38, 6, 0.2);
createTrees(svg4, 0.32, -1, 42, 5, 0.2);

createTrees(svg5, 0.18, 1, 40, 5, 0.15);
createTrees(svg5, 0.16, 1, 80, 3, 0.15);
createTrees(svg5, 0.1, 1, 30, 5, 0.15);

createTrees(svg6, 0.31, -1, 170, 4, 0.1);
createTrees(svg6, 0.3, -1, 120, 6, 0.1);
createTrees(svg6, 0.22, -1, 120, 6, 0.1);


closePath(svg00, "bgColor130");
closePath(svg0, "bgColor130");
closePath(svg1, "bgColor140");
closePath(svg2, "bgColor150");
closePath(svg2b, "bgColor150");
closePath(svg2d, "bgColor140");
closePath(svg3, "bgColor130");
closePath(svg4, "bgColor");
closePath(svg5, "bgColor90");
closePath(svg6, "bgColor80");

// add trees along SVG path
function createTrees(svg, start, direction, division, numT, scale) {
	
	let path = svg.querySelector(".mPath");
    var newTree;
	for( let i = 0; i < numT; i++ ) {

        /* clone tree based on distance */
        if( scale <= 0.15 )
		     newTree = t2.cloneNode(true);
        else if( scale <= 0.3 )
		     newTree = t1.cloneNode(true);
        else
		    newTree = t0.cloneNode(true);

		newTree.id = svg.id + "tb" + i;
		svg.appendChild(newTree);

		let startPos = 0;
		if ( direction > 0 )
        {
            startPos = 0.5 - start + i * (1 / division);
            if( startPos < 0 )
                startPos = 0;
        }
		else
        {
            startPos = 0.5 + start - i * (1 / division);
            if( startPos > 1 )
                startPos = 1;
        }

		gsap.set(newTree, {
			scale: scale,

			motionPath: {
				path: path,
				align: path,
				alignOrigin: [0.5, 0.97],
				start: startPos,
				end: startPos,
				autoRotate: true
			}
		});
	}
	
}

var flameTimelines = [];
createFlames();
// add flame paths to fire
function createFlames( numT=15 ) {
	
    var flamesWrapper = select("#flames");
    const fColor = ["#FFFFFF", "#FFFF00", "#FF8C00"];
	for( let i = 1; i < numT; i++ ) {
        var flameClone = select("#f0").cloneNode(true);
		flameClone.id = "f" + i;
        gsap.set( flameClone, { attr: { fill: fColor[gsap.utils.random(0, 2, 1)], href: "#fPath"+gsap.utils.random(1, 4, 1)} });
		flamesWrapper.appendChild(flameClone);
    }

    const flames = selectAll("#flames > use");
    flames.forEach( ( flameElement, i ) => {
        const tFire = gsap.timeline({ repeat: -1, repeatDelay: 0, repeatRefresh: true, defaults: { ease: "sine.inOut", duration: 2 },
        })
        .set( flameElement, { opacity: 1, scaleY: 0.2, transformOrigin: "50% 100%", x: "random(-35, 30)" , y: -25 } )
        .to( flameElement, { opacity: 0, transformOrigin: "50% 100%", scaleY: "random(0.75 1.25)" });
        tFire.seek( gsap.utils.random( 0, 2, 0.2 ) );
        tFire.pause();
        flameTimelines.push(tFire);
    });


}

// close nodes and add fill color
function closePath(svg, fillColorClass, cX=1200, drop=800) {
	
	const mPath = svg.querySelector(".mPath"),
    id = mPath.getAttribute("id"),
    d = mPath.getAttribute("d");

	mPath.classList.add(fillColorClass);

	let newPath = d + " V " + cX + " H -" + drop + "z";
	gsap.set(mPath, { attr: { d: newPath } });
	
}


// change the background aurora colors
let auroraChanges = gsap.timeline({
    repeat: -1,
    repeatDelay: 0,
    onUpdate() {

        // tint snow by prominent aurora color
        //let bg0 =  docStyle.getPropertyValue('--bg0');
		let bg0 = "#FFFFFF";
			let auroraColor1 = bodyStyle.getPropertyValue('--auroraColor1');
      let auroraColor1A12 = chroma( auroraColor1 ).alpha(0.12);
			let bg = chroma( bg0 ).mix( auroraColor1, 0.4 );
			let bgColor = chroma( bg ).mix( "#000000", 0.7 );
			let bgColor90 = chroma( bgColor ).mix( "#000000", 0.1 );
			let bgColor80 = chroma( bgColor ).mix( "#000000", 0.2 );
			let bgColor70 = chroma( bgColor ).mix( "#000000", 0.3 );
			let bgColor60 = chroma( bgColor ).mix( "#000000", 0.4 );
			let bgColor50 = chroma( bgColor ).mix( "#000000", 0.5 );
			let bgColor110 = chroma( bgColor ).mix( "#FFFFFF", 0.1 );
			let bgColor120 = chroma( bgColor ).mix( "#FFFFFF", 0.2 );
			let bgColor130 = chroma( bgColor ).mix( "#FFFFFF", 0.3 );
			let bgColor140 = chroma( bgColor ).mix( "#FFFFFF", 0.4 );
			let bgColor150 = chroma( bgColor ).mix( "#FFFFFF", 0.5 );

			gsap.set( "body", {
				"--bg": "rgba("+bg.rgba()+")",
        "--auroraColor1A12": "rgba("+auroraColor1A12.rgba()+")",
				"--bgColor": "rgba("+bgColor.rgba()+")",
				"--bgColor90": "rgba("+bgColor90.rgba()+")",
				"--bgColor80": "rgba("+bgColor80.rgba()+")",
				"--bgColor70": "rgba("+bgColor70.rgba()+")",
				"--bgColor60": "rgba("+bgColor60.rgba()+")",
				"--bgColor50": "rgba("+bgColor50.rgba()+")",
				"--bgColor110": "rgba("+bgColor110.rgba()+")",
				"--bgColor120": "rgba("+bgColor120.rgba()+")",
				"--bgColor130": "rgba("+bgColor130.rgba()+")",
				"--bgColor140": "rgba("+bgColor140.rgba()+")",
				"--bgColor150": "rgba("+bgColor150.rgba()+")",
			});

	}, defaults: { duration: 10, yoyo: true, ease: 'none'  }})
.to( "body", { "--auroraColor0": "rgb(0 0 255)" })
.to( "body", { "--auroraColor1": "rgb(255 0 0)" }, 0 )
.to( "body", { "--auroraColor2": "rgb(0 255 0)" }, 0 )
.to( "body", { "--auroraColor0": "rgb(0 255 0)" })
.to( "body", { "--auroraColor1": "rgb(0 0 255)" }, "<" )
.to( "body", { "--auroraColor2": "rgb(255 0 0)" }, "<" )
.to( "body", { "--auroraColor0": "rgb(255 0 0)" })
.to( "body", { "--auroraColor1": "rgb(0 255 0)" }, "<" )
.to( "body", { "--auroraColor2": "rgb(0 0 255)" }, "<" );

let iglooFireAnim = gsap.timeline( {
    repeat: -1,
    repeatDelay: 0.5,
    defaults: { duration: 0.5, yoyo: true, ease: "rough({ template: none.out, strength: 1, points: 5, taper: none, randomize:true, clamp:true }) }" }
 })
.to( "body", { "--fireLight1": "#ed9f0e" } )
.to( "body", { duration: 0.25, "--fireLight1": "#edbd0e" } )
.to( "body", { "--fireLight1": "#edaa0e" } )
.to( "body", { duration: 0.25, "--fireLight1": "#edbd0e" } )
.to( "body", { "--fireLight1": "#ed9f0e" } );

// Igloo animations - rotation and resize
var svg2IglooWrapper = select("#svg2IglooWrapper"),
land2Igloo = select("#land2Igloo"),
newIgloo = select("#svg2Igloo");
svg2IglooWrapper.appendChild(newIgloo);


gsap.set(newIgloo, {
    scale: 1,
    motionPath: {
        path: land2Igloo,
        align: land2Igloo,
        alignOrigin: [0.5, 0.5],
        start: 0.5,
        end: 0.5,
		autoRotate: true
    }
});

let tween = gsap.timeline({
    scrollTrigger: {
        trigger: ".scrollTriggerWrapper",
        start: "10 top",
        end: "+=150%",
        scrub: true
    },
    defaults: { ease: "power1.inOut" }
})
.to( ["#svg0","#svg00"], { translateZ: 1500 })
.to( "#svg1", { translateZ: 900 }, 0)
.to( "#svg2", {  translateZ: 600, translateX: 400, translateY: -25 }, 0)
.to( "#svg2b",  { scale: 1.5, translateZ: 400, translateX: 400, translateY: -25 }, 0)
.to( "#svg2d", {  translateZ: 900, translateX: 100, translateY: -15 }, 0)
.to( "#svg3",  { scale: 1.15, translateZ: -200, translateX: 200 }, 0)
.to( "#svg4",  { scale: 1.05, translateZ: -200, translateX: 100, }, 0)

.to( "#vLine1a", { morphSVG: "#vLine1b" }, 0)
.to( "#vLine2a", { morphSVG: "#vLine2b" }, 0)
.to( "#vLine3a", { morphSVG: "#vLine3b" }, 0)
.to( "#vLine4a", { morphSVG: "#vLine4b" }, 0)
.to( "#vLine5a", { morphSVG: "#vLine5b" }, 0)
.to( "#vLine6a", { morphSVG: "#vLine6b" }, 0)
.to( "#vLine7a", { morphSVG: "#vLine7b" }, 0)
.to( "#vLine8a", { morphSVG: "#vLine8b" }, 0)
.to( "#vLine9a", { morphSVG: "#vLine9b" }, 0)
.to( "#vLine10a", { morphSVG: "#vLine10b" }, 0)
.to( "#vLine11a", { morphSVG: "#vLine11b" }, 0)
.to( "#vLine12a", { morphSVG: "#vLine12b" }, 0)
.to( "#vLine13a", { morphSVG: "#vLine13b" }, 0)
.to( "#vLine14a", { morphSVG: "#vLine14b" }, 0)
.to( "#vLine15a", { morphSVG: "#vLine15b" }, 0)
.to( "#vLine16a", { morphSVG: "#vLine16b" }, 0)
.to( "#vLine17a", { morphSVG: "#vLine17b" }, 0)
.to( "#vLine18a", { morphSVG: "#vLine18b" }, 0)

.fromTo( "#vLine16a", { opacity: 1 }, { opacity: 0, ease: "power1.in" }, 0)
.fromTo( "#vLine5a", { opacity: 0 }, { opacity: 1, ease: "power1.out" }, 0)
.fromTo( ["#vLine7a","#vLine17a","#vLine18a"], { opacity: 0 }, { opacity: 1, ease: "power1.in" }, 0)

.fromTo( "#svg2Igloo", { scale: 0.33, translateX: -310, translateY: 150 }, { scale: 1, translateX: 120 }, 0 )
.fromTo( "#iglooDoor",
{ attr: { transform: "matrix(-0.98812,0.15371,-0.15371,-0.98812,1287.3235,818.60391)" } },
{ attr: { transform: "matrix(-0.99984,0.01785,-0.01785,-0.99984,982.06726,908.52364)" } }, 0 )
.fromTo( "#iglooDoorShadow",   
{ opacity: 1, attr: { transform: "matrix(-0.99531,0.09677,-0.09677,-0.99531,1215.87726,856.94156)" } },
{ opacity: 0, attr: { transform: "matrix(-0.99976,0.02173,-0.02173,-0.99976,992.8021,906.74256)" } }, 0 ).fromTo( "#iglooWhiteFadeWallsPath", { opacity: 0 },{ opacity: 0.5}, 0);

let tween2 = gsap.timeline({
    scrollTrigger: {
        trigger: ".scrollTriggerWrapper",
        start: "15% top",
        end: "+=150%",
        onEnter: () => {
            flameTimelines.forEach( ( flameTimeline, i ) => {
                flameTimeline.play();
            });
        },
        onLeaveBack: () => {
            flameTimelines.forEach( ( flameTimeline, i ) => {
                flameTimeline.pause();
            });
        },
        scrub: true
    }
});


gsap.set("#gsapWrapper", { autoAlpha: 1 });