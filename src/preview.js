import * as PIXI from 'pixi.js';
import 'pixi-layers';
import 'pixi-lights';

export function createAppStage() {
    app = new PIXI.Application({
    stage: new PIXI.display.Stage(),
    view: document.querySelector('canvas'),
    height: 600,
    width: 600
    });
    app.stage.addChild(new PIXI.display.Layer(PIXI.lights.diffuseGroup));
    app.stage.addChild(new PIXI.display.Layer(PIXI.lights.normalGroup));
    app.stage.addChild(new PIXI.display.Layer(PIXI.lights.lightGroup));
    return app;
}

export function createPair(diffuseTex, normalSprite) {
    const container = new PIXI.Container();
    const diffuseSprite = new PIXI.Sprite(diffuseTex);
    diffuseSprite.parentGroup = PIXI.lights.diffuseGroup;
    normalSprite.parentGroup = PIXI.lights.normalGroup;
     container.addChild(diffuseSprite);
    container.addChild(normalSprite);
    return container;
}


