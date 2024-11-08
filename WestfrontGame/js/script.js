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

function nametoDate(filename){
    const months =  {
        "01" : "Januari",
        "02" : "Februari",
        "03" : "Maart",
        "04" : "April",
        "05" : "Mei",
        "06" : "Juni",
        "07" : "Juli",
        "08" : "Augustus",
        "09" : "September",
        "10" : "Oktober",
        "11" : "November",
        "12" : "December",
    }

    let month = filename.substring(4,6);
    let year = filename.substring(0,4);

    return months[month] + " " + year; 
}

class Timeline{
    constructor(game){
        this.tlel = document.getElementById("timeline");
        this.game = game;
        this.content = [];

        // add first picture to content array
        this.content.push(`img/${this.game.getImages()[0]}`);
        this.first = "img/" + this.game.getImages()[0];
    }

    addPic(pic, pos){
        let newCont = this.content.slice(0, pos);
        newCont.push(pic);
        newCont.push(...this.content.slice(pos));
        this.content = newCont;
        this.draw();
        this.game.loadNextImage();
    }

    draw(){
        this.tlel.replaceChildren();
        for(let i = 0; i < this.content.length; i++) {
            // draw hitbox before img
            let hitbox = createHitbox(i);
            hitbox.addEventListener("drop", (ev) =>{
                ev.preventDefault();
                let data = ev.dataTransfer.getData("text");
                this.addPic(data, i);
                }
            );
                
            this.tlel.appendChild(hitbox);

            // draw image
            let image = createPicture(this.content[i]);
            console.log(image.src.slice(-14).substring(4));

            if(image.src.slice(-14) == this.first){
                console.log("jep");
                let div = document.createElement("div");
                let text = document.createElement("p");
                text.innerHTML = nametoDate(image.src.slice(-14).substring(4));
                div.appendChild(image);
                div.appendChild(text);
                div.className = "firstimg";
                image = div;
            }
            this.tlel.appendChild(image);


            // draw last hitbox
            if (i == this.content.length - 1) {
                let hitbox = createHitbox(this.content.length);
                hitbox.addEventListener("drop", (ev) => {
                    ev.preventDefault();
                    let data = ev.dataTransfer.getData("text");
                    this.addPic(data, this.content.length);
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
        this.bigImage = document.getElementById("bigImage");

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
        this.timeline = new Timeline(this);
        this.timeline.draw();
        this.loadNextImage();
    }

    loadNextImage() {
        this.bigImage.replaceChildren();
        var nextImage = document.createElement("img");
        nextImage.draggable = true;
        let src = `img/${this.randomImages[this.index]}`;
        nextImage.src = src;
        nextImage.id = src;

        // add drag event
        nextImage.addEventListener("dragstart", function (ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        });

        this.bigImage.appendChild(nextImage);
        this.index++;
    }
    
    getImages(){
        return this.randomImages;
    }
}

let game = new Game(allImages);
