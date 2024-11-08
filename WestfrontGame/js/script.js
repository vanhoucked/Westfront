const allImages = [
    "191408.jpg",
    "191409.jpg",
    "191609.jpg",
    "191612.jpg",
    "191704.jpg",
    "191705.jpg",
    "191706.jpg",
    "191811.jpg",
    "191907.jpg",
    "192002.jpg",
    "192011.jpg",
    "192012.jpg",
    "192812.jpg",
];
// var secondWindow = window.open("secondScreen.html", "", "width=800,height=800");

function createHitbox(id){
    let hitbox = document.createElement("div");
    hitbox.className = "hitbox";
    hitbox.id = "hb" + id;
    hitbox.addEventListener("dragover", function(ev){
        ev.preventDefault(ev);
    });
    return hitbox;
}

function createPicture(src){
    let picture = document.createElement("img");
    picture.src = src;
    picture.id = src;
    picture.draggable = false;

    picture.addEventListener("dragstart", function(ev){
        ev.dataTransfer.setData("text", ev.target.id);
    });
    return picture;
}

class Timeline{
    constructor(firstImagesrc){
        this.tlel = document.getElementById("timeline");
        this.content = [];

        // add first picture to content array
        this.content.push(firstImagesrc);
    }

    addPic(pic, pos){
        let newCont = this.content.slice(0, pos);
        newCont.push(pic);
        newCont.push(...this.content.slice(pos));
        this.content = newCont;
        console.log(this.content);
        this.draw();
    }

    draw(){
        console.log(this.content);
        this.tlel.replaceChildren();
        for(let i = 0; i < this.content.length; i++) {
            // draw hitbox before img
            let hitbox = createHitbox(i);
            hitbox.addEventListener("drop", 
                (ev) => {
                    ev.preventDefault();
                    let data = ev.dataTransfer.getData("text");
                    this.addPic(data, i);
                }
            );
                
            this.tlel.appendChild(hitbox);

            // draw image
            this.tlel.appendChild(createPicture(this.content[i]));
            // draw last hitbox
            if (i == this.content.length - 1) {
                let hitbox = createHitbox(this.content.length);
                hitbox.addEventListener("drop", (ev) => {
                    ev.preventDefault();
                    let data = ev.dataTransfer.getData("text");
                    this.addPic(data, i);
                });
                this.tlel.appendChild(hitbox);
            }
        }
    }

}

class Game {
    constructor(images) {
        // init variables
        this.index = 1;

        // select 10 random images
        let imageSelection = [...images];

        // Shuffle the array
        for (let i = imageSelection.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [imageSelection[i], imageSelection[j]] = [
                imageSelection[j],
                imageSelection[i],
            ];
        }

        // Select first 10 elements from the shuffled array
        this.randomImages = imageSelection.slice(0, 10);

        // create timeline
        this.timeline = new Timeline("img/" + this.randomImages[0]);
        this.timeline.draw();
        this.loadNextImage();
    }

    loadNextImage() {
        var nextImage = document.createElement("img");
        nextImage.draggable = true;
        let src = `img/${this.randomImages[this.index]}`;
        nextImage.src = src;
        nextImage.id = src;

        // add drag event
        nextImage.addEventListener("dragstart", function (ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        });

        document.getElementById("bigImage").appendChild(nextImage);
        this.index++;
    }
}

let game = new Game(allImages);
