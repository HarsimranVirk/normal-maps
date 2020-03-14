import * as PIXI from "pixi.js";
import EmbossFilter from "./Filters/EmbossFilter";
import NormalFilter from "./Filters/NormalFilter";

const canvas = document.querySelector("canvas");

const app = new PIXI.Application({
  view: canvas,
  backgroundColor: 0xEEEEEE,
  width: 600,
  height: 500
});

let texture = null;
let imgSprite = null;
const button = document.getElementById("upload_btn");
const convert = document.getElementById("convert");
const heightInput = document.getElementById("heightInput");
const heightSlider = document.getElementById("heightSlider");
let embossStrength = 5;
let normalStrength = 1;

button.addEventListener("change", () => {
  if (button.files && button.files[0]) {
    const file = button.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      texture = PIXI.Texture.from(reader.result);
      createHeightMap(texture);
    };
  }
});

heightInput.oninput = () => {
	heightSlider.value = heightInput.value;
	embossStrength = heightInput.value;
	createHeightMap(texture);
}

heightSlider.oninput = () => {
	heightInput.value = heightSlider.value;
	embossStrength = heightSlider.value;
	createHeightMap(texture);
}

function createHeightMap(texture) {
	console.log(embossStrength);
	if (app.stage.children.length === 1) app.stage.children.pop();
	imgSprite = new PIXI.Sprite(texture);
	imgSprite.filters = [new EmbossFilter(embossStrength), new NormalFilter(normalStrength)];
	app.stage.addChild(imgSprite);
}

function downloadAsImage(renderer, sprite, fileName) {
  renderer.extract.canvas(sprite).toBlob((blob) => {
    var a = document.createElement("a");
    document.body.append(a);
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.click();
    a.remove();
  }, "image/png");
}

convert.addEventListener("click", () => {
  if (imgSprite) {
    downloadAsImage(app.renderer, imgSprite, `heightmap${Date.now()}`);
  }
});
