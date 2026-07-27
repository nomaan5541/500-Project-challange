document.getElementById("toggle").addEventListener("click", changeColor);

isClicked = true;

function changeColor() {
  if(isClicked){
  document.getElementById("boo").classList.remove("hide");
     document.getElementById("boo").classList.add("show");
    isClicked=false;
  } else{
  document.getElementById("boo").classList.remove("show");
     document.getElementById("boo").classList.add("hide");
    isClicked=true;
  }
}