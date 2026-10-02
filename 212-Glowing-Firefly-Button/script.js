// create instance of kinet with custom settings
var kinet = new Kinet({
  acceleration: 0.02,
  friction: 0.25,
  names: ["x", "y"],
});

// select circle element
var circle = document.getElementById('circle');

// set handler on kinet tick event
kinet.on('tick', function(instances) {
  circle.style.transform = `translate3d(${ (instances.x.current) }px, ${ (instances.y.current) }px, 0) rotateX(${ (instances.x.velocity/2) }deg) rotateY(${ (instances.y.velocity/2) }deg)`;
});

// call kinet animate method on mousemove
document.addEventListener('mousemove', function (event) {
  kinet.animate('x', event.clientX - window.innerWidth/2);
  kinet.animate('y', event.clientY - window.innerHeight/2);
});

// log
kinet.on('start', function() {
  console.log('start');
});

kinet.on('end', function() {
  console.log('end');
});