import * as PIXI from "pixi.js";

const app = new PIXI.Application({
  transparent: true
});

document.body.appendChild(app.view);
let texture = null;
const button = document.getElementById("upload_btn");

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
	const imgSprite = new PIXI.Sprite(texture);
	app.stage.addChild(imgSprite);
}

