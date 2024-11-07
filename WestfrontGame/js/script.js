const allImages = ['191408.jpg', '191409.jpg', '191609.jpg', '191612.jpg', '191704.jpg', '191705.jpg', '191706.jpg', '191811.jpg', '191907.jpg', '192002.jpg', '192011.jpg', '192012.jpg', '192812.jpg'];
// var secondWindow = window.open("secondScreen.html", "", "width=800,height=800");

class Game {
  constructor(images) {
    // init variables
    this.index = 1;

    // select 10 random images
    let imageSelection = [...allImages];

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

    
    // Load first image on timeline
    let firstImage = document.createElement("img");
    firstImage.src = `img/${this.randomImages[0]}`;
    // document.getElementById("timeline").appendChild(firstImage);
    this.loadNextImage();
  }

  loadNextImage(){
    var nextImage = document.createElement("img");
    nextImage.draggable = true;
    nextImage.src = `img/${this.randomImages[this.index]}`;
    document.getElementById('bigImage').appendChild(nextImage);
    this.index++;
  }
}

let game = new Game(allImages);