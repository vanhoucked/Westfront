const allImages = ['191408.jpg', '191409.jpg', '191609.jpg', '191612.jpg', '191704.jpg', '191705.jpg', '191706.jpg', '191811.jpg', '191907.jpg', '192002.jpg', '192011.jpg', '192012.jpg', '192812.jpg'];
// var secondWindow = window.open("secondScreen.html", "", "width=800,height=800");

function selectRandomImages(allImages) {
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
  imageSelection = imageSelection.slice(0, 10);

  return imageSelection;
}

function loadFirstImage(randomImages) {
    var imageElement = document.createElement("img");
    imageElement.src = `img/${randomImages[0]}`;
    // document.getElementById("timeline").appendChild(imageElement);
    loadNewImage(randomImages, 1);
}

function loadNewImage(randomImages, index) {
    var imageElement = document.createElement("img");
    imageElement.draggable = true;
    imageElement.src = `img/${randomImages[index]}`;
    document.getElementById('bigImage').appendChild(imageElement);
}

function newGame() {
    randomImages = selectRandomImages(allImages);
    loadFirstImage(randomImages);
}

document.addEventListener("DOMContentLoaded", (event) => {
    newGame();
});