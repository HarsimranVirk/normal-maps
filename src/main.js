import "pixi.js";
import "pixi-layers";
import * as lights from "pixi-lights";
import EmbossFilter from "./Filters/EmbossFilter";
import NormalFilter from "./Filters/NormalFilter";

const canvasDiv = document.getElementById("canvas");
let texture = null;
let imgSprite = null;
let size = null;
let app = null;
let previewApp = null;
const button = document.getElementById("upload_btn");
const convert = document.getElementById("convert");
const heightInput = document.getElementById("heightInput");
const heightSlider = document.getElementById("heightSlider");
const previewBtn = document.getElementById("preview");
let embossStrength = 5;
let normalStrength = 1;

window.onload = () => {
  renderNormal();
};

const renderNormal = () => {
  convert.disabled = false;
  if (previewApp !== null) {
    canvasDiv.removeChild(previewApp.view);
    previewApp.destroy();
    previewApp = null;
  }
  app = new PIXI.Application({
    backgroundColor: 0xeeeeee,
    width: 600,
    height: 500
  });
  canvasDiv.appendChild(app.view);
  app.view.onwheel = event => moveWheel(event);
  if (texture !== null) createNormalMap(texture, false);
};

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
};

heightSlider.oninput = () => {
  heightInput.value = heightSlider.value;
  embossStrength = heightSlider.value;
  createNormalMap(texture, false);
};

const moveWheel = event => {
  if (imgSprite) {
    size = event.deltaY * -0.001;
    imgSprite.scale.set(Math.max(imgSprite.scale.x - size, 0.125));
    size = imgSprite.scale.x;
  }
};

function createNormalMap(texture, downloadMode) {
  if (app.stage.children.length === 1)
    app.stage.removeChild(app.stage.children[0]);
  if (imgSprite) imgSprite = null;
  imgSprite = new PIXI.Sprite(texture);
  imgSprite.filters = [
    new EmbossFilter(embossStrength),
    new NormalFilter(normalStrength)
  ];
  if (!downloadMode) {
    imgSprite.position.set(300, 250);
    imgSprite.anchor.set(0.5);
    if (size !== null) imgSprite.scale.set(size);
  }
  app.stage.addChild(imgSprite);
  previewBtn.disabled = false;
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

previewBtn.onclick = () => {
  if (!convert.disabled) {
    renderPreview();
    previewBtn.innerHTML = "Back";
  } else {
    renderNormal();
    previewBtn.innerHTML = "Preview";
  }
};

const renderPreview = () => {
  convert.disabled = true;
  canvasDiv.removeChild(app.view);
  if (app !== null) app.destroy();
  app = null;
  previewApp = new PIXI.Application({
    height: 500,
    width: 600,
    backgroundColor: 0x000000
  });
  canvasDiv.appendChild(previewApp.view);
  const stage = (previewApp.stage = new PIXI.display.Stage());
  const light = new lights.PointLight(0xffffff, 1);
  stage.addChild(new PIXI.display.Layer(lights.diffuseGroup));
  stage.addChild(new PIXI.display.Layer(lights.normalGroup));
  stage.addChild(new PIXI.display.Layer(lights.lightGroup));

  const pair = new PIXI.Container();
  const diffuseSprite = new PIXI.Sprite(texture);
  diffuseSprite.parentGroup = lights.diffuseGroup;
  imgSprite.parentGroup = lights.normalGroup;
  pair.addChild(diffuseSprite);
  pair.addChild(imgSprite);
  light.position.set(300, 300);
  pair.position.set(25);
  stage.addChild(pair);
  stage.addChild(new lights.AmbientLight(null, 0.8));
  stage.addChild(new lights.DirectionalLight(null, 1, pair));
  stage.addChild(light);
  stage.interactive = true;
  stage.on("mousemove", function(event) {
    light.position.copy(event.data.global);
  });

  stage.on("pointerdown", function(event) {
    var clickLight = new lights.PointLight(0xffffff);
    clickLight.position.copy(event.data.global);
    stage.addChild(clickLight);
  });
};
