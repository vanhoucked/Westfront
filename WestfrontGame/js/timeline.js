var bigImage = document.getElementById("bigImage");
var pics = document.getElementsByClassName("pic");


for (let i = 0; i < pics.length; i++) {
    pics.item(i).addEventListener("drop", function (ev) {
        ev.preventDefault();
        let data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        // check if big image is swiped
        if(!bigImage.hasChildNodes()){
            game.loadNextImage();
        }
    });

    pics.item(i).addEventListener("dragover", function (ev) {
        ev.preventDefault();
    });
}


