var bigImage = document.getElementById("bigImage");
var pics = document.getElementsByClassName("pic");


console.log(pics);

for (let i = 0; i < pics.length; i++) {
    pics.item(i).addEventListener("drop", function(ev){
        ev.preventDefault();
        ev.target.appendChild(document.getElementById("bigImage").firstChild);
        game.loadNextImage();
    });

    pics.item(i).addEventListener("dragover", function(ev){
        ev.preventDefault();
    });
}

