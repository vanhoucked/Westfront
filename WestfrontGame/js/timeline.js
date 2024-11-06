var bigImage = document.getElementById("bigImage");
var pics = document.getElementsByClassName("pic");

pics.array.forEach(element => {
    element.addEventListener("drop", function(ev){
        ev.preventDefault();
        ev.target.appendChild(document.getElementById("bigImage"));
    });

    element.addEventListener("dragover", function(ev){
        ev.preventDefault();
    });
});