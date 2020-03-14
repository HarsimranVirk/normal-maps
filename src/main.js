import * as PIXI from "pixi.js";
import EmbossFilter from './Filters/EmbossFilter';

const app = new PIXI.Application({
  transparent: true,
	height: 300,
	width: 400,
});

document.body.appendChild(app.view);
let texture = null;
let imgSprite = null;
const button = document.getElementById("upload_btn");
const convert = document.getElementById("convert");

button.addEventListener('change', () => {
	if(button.files && button.files[0]){
		const file = button.files[0];
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			texture = PIXI.Texture.from(reader.result);
			createSprite(texture);
		};
	}
});


function createSprite(texture) {
	if(app.stage.children.length === 1) app.stage.children.pop(); 
	imgSprite = new PIXI.Sprite(texture);
	imgSprite.filters = [new EmbossFilter(1)];
	app.stage.addChild(imgSprite);
}

function downloadAsImage(renderer, sprite, fileName) {
	renderer.extract.canvas(sprite).toBlob(function(b){
		var a = document.createElement('a');
		document.body.append(a);
		a.download = fileName;
		a.href = URL.createObjectURL(b);
		a.click();
		a.remove();
	}, 'image/png');
}

convert.addEventListener('click', () => {
	if(imgSprite) {
		downloadAsImage(app.renderer, imgSprite, `heightmap${Date.now()}`);
	}
})




