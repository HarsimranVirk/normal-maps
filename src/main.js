import * as PIXI from "pixi.js";
import EmbossFilter from "./Filters/EmbossFilter";
import NormalFilter from "./Filters/NormalFilter";

const canvas = document.querySelector("canvas");

const app = new PIXI.Application({
  view: canvas,
  backgroundColor: 0xEEEEEE,
  width: 600,
  height: 600
});

let texture = null;
let imgSprite = null;
let size = null;
const button = document.getElementById("upload_btn");
const convert = document.getElementById("convert");
const heightInput = document.getElementById("heightInput");
const heightSlider = document.getElementById("heightSlider");
let embossStrength = 5;
let normalStrength = 1;

button.onchange = () => {
  if (button.files && button.files[0]) {
    const file = button.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      texture = PIXI.Texture.from(reader.result);
      createNormalMap(texture, false);
    };
  }
};

heightInput.oninput = () => {
	heightSlider.value = heightInput.value;
	embossStrength = heightInput.value;
	createNormalMap(texture, false);
}

heightSlider.oninput = () => {
	heightInput.value = heightSlider.value;
	embossStrength = heightSlider.value;
	createNormalMap(texture, false);
}

canvas.onwheel = (event) => {
  if(imgSprite) {
    size = event.deltaY * -0.001;
    imgSprite.scale.set(Math.max(imgSprite.scale.x - size, 0.125));
    size = imgSprite.scale.x;
  }
}

function createNormalMap(texture, downloadMode) {
	if (app.stage.children.length === 1) app.stage.removeChild(app.stage.children[0]);
  if(imgSprite) imgSprite = null;
	imgSprite = new PIXI.Sprite(texture);
	imgSprite.filters = [new EmbossFilter(embossStrength), new NormalFilter(normalStrength)];
  if(!downloadMode) {
    imgSprite.position.set(300,300);
    imgSprite.anchor.set(0.5);
    if(size !== null) imgSprite.scale.set(size);
  }
  app.stage.addChild(imgSprite);
}

function downloadAsImage(renderer, sprite, fileName) {
    const image = renderer.plugins.extract.image(sprite);
    var a = document.createElement("a");
    document.body.append(a);
    a.download = fileName;
    a.href = image.src;
    a.click();
    a.remove();
    createNormalMap(texture, false);
}

convert.addEventListener("click", () => {
  if (imgSprite) {
    createNormalMap(texture, true);
    downloadAsImage(app.renderer, imgSprite, `normalmap${Date.now()}`);
  }
});

