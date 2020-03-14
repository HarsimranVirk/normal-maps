const fragment = `
precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float strength;
uniform vec4 filterArea;


void main(void)
{
	vec2 onePixel = vec2(1.0 / filterArea);

	vec4 color;

	color.rgb = vec3(0.5,0.5,1.0);

	color -= texture2D(uSampler, vTextureCoord - onePixel) * strength;
	color += texture2D(uSampler, vTextureCoord + onePixel) * strength;
    vec4 normal = normalize(color);

	float alpha = texture2D(uSampler, vTextureCoord).a;

	gl_FragColor = vec4(normal.rgb, alpha);
}
`;

export default fragment;