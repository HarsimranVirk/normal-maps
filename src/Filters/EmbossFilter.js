import { Filter } from 'pixi.js';
import fragment from './emboss.frag';

export default class EmbossFilter extends Filter {
    constructor(strength = 5){
        super(undefined, fragment);
        this.strength = strength;
    }

    /**
     * Strength of emboss.
     *
     * @member {number}
     */
    get strength() {
        return this.uniforms.strength;
    }
    set strength(value) {
        this.uniforms.strength = value;
    }
}