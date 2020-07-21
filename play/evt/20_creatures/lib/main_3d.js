let vs = `
  uniform float time;

  varying vec2 vUv;

  void main()
  {
    vUv = uv;
    vUv.y = (1.0 - uv.y);
    vec4 p = vec4(position, 1.0);
    vec2 uv = p.xy;
    float k = sin(time*0.2)*0.5+0.5;
    //k = pow(k, 2.0);
    p.x += k * cos(uv.y * 3.14 * 5.0 - time * 10.0) * 0.1 * uv.y;

    //vUv.x -= k * cos(uv.y * 3.14 * 10.0 - time * 10.0) * 0.01 * uv.y;

    vec4 mvPosition = modelViewMatrix * p;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

let fs = `
  uniform float time;

  uniform sampler2D colorTexture;
  uniform sampler2D strokeTexture;
  uniform vec3 base_color;

  varying vec2 vUv;

  void main( void ) {
    vec2 position = - 1.0 + 2.0 * vUv;

    float fill_mask = texture2D( colorTexture, vUv ).a;
    vec4 stroke_tex = texture2D( strokeTexture, vUv );
    float stroke_mask = stroke_tex.a;

    vec3 a = vec3(cos(time*0.2)*0.5+0.5, sin(time)*0.5+0.5, vUv.y);
    a = vec3(1.0*(0.5+0.5*sin(time)), 0.2, 0.3*cos(time*0.5));
    float k = (1.0 - length(position - vec2(0.0, 0.4))) * 0.5;
    k = clamp(k, 0.0, 1.0);
    a += pow(k, 0.8);
    vec3 b = vec3(0.2, 0.4, 0.2 + 0.5*sin(time));
    b = b * sin(length(vUv) * 3.141592 * 5.0);

    vec3 color = a * fill_mask * (1.0 - stroke_mask) + stroke_mask * b;
    //vec3 color = vec3(1.0, 0.0, 0.0);
    color = a * (1.0 - stroke_mask) + stroke_mask * b;
    gl_FragColor = vec4( color, 1.0 );

  }
`;

let fs1 = `
  uniform float time;

  uniform sampler2D colorTexture;
  uniform sampler2D strokeTexture;
  uniform vec3 base_color;

  varying vec2 vUv;

  void main( void ) {
    vec2 position = - 1.0 + 2.0 * vUv;

    float fill_mask = texture2D( colorTexture, vUv ).a;
    vec4 stroke_tex = texture2D( strokeTexture, vUv );
    float stroke_mask = stroke_tex.a;

    vec3 a = vec3(cos(time*0.2)*0.5+0.5, sin(time)*0.5+0.5, vUv.y);
    a = vec3(1.0*(0.5+0.5*sin(time)), 0.2, 0.3*cos(time*0.5));
    float k = (1.0 - length(position - vec2(0.0, 0.4))) * 0.5;
    k = clamp(k, 0.0, 1.0);
    a += pow(k, 0.8);
    vec3 b = vec3(0.2, 0.4, 0.2 + 0.5*sin(time));
    b = b * sin(length(vUv) * 3.141592 * 5.0);

    vec3 color = a * fill_mask * (1.0 - stroke_mask) + stroke_mask * b;
    if(stroke_tex.a < 0.1) {
      color = base_color * gl_FragCoord.y / 512.0;
    }
    else {
      color = stroke_tex.rgb;
    }

    //gl_FragColor = vec4( color, 1.0 );
    gl_FragColor = vec4( vec3(1.0, vUv.y, 1.0), 1.0 );

  }
`;

let xdoc;
let im0, im1;

let camera, scene, renderer;
let msh, ext, uniforms;

let dom_parser = new DOMParser();

camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 3000 );
camera.position.z = 3;

scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
//renderer.setPixelRatio( window.devicePixelRatio );
renderer.setPixelRatio( 1 );

renderer.domElement.id = 'layer-3d';
document.querySelector('#stage').appendChild( renderer.domElement );

let texture = new THREE.Texture(im0);
let texture1 = new THREE.Texture(im1);

uniforms = {
  "time": { value: Date.now() / 1000 },
  "base_color": { value: new THREE.Color(1.0, 1.0, 1.0) },
  "colorTexture": { value: texture },
  "strokeTexture": { value: texture1 },
};

let material = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader: vs,
  fragmentShader: fs,
  side: THREE.DoubleSide,
} );

let material1 = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader: vs,
  fragmentShader: fs1,
  side: THREE.DoubleSide,
} );

const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
const ctx = canvas.getContext('2d');

function loadsvg(url) {
  if(ext) {
    scene.remove(ext);
  }
  
  fetch(url)
  .then(r => r.text())
  .then(text => {

    xdoc = dom_parser.parseFromString(text, "text/xml");

    let paths = xdoc.querySelectorAll('path');

    let white = paths[0].outerHTML;
    let black = paths[1].outerHTML;


    let svg_string = ''; 

    svg_string = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2">${white}</svg>`;

    v0 = canvg.Canvg.fromString(ctx, svg_string);
    v0.start();
    im0 = ctx.getImageData(0, 0, canvas.width, canvas.height);

    svg_string = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2">${black}</svg>`;

    v1 = canvg.Canvg.fromString(ctx, svg_string);
    v1.start();
    im1 = ctx.getImageData(0, 0, canvas.width, canvas.height);

    texture.image = im0;
    texture.needsUpdate = true;

    texture1.image = im1;
    texture1.needsUpdate = true;

    uniforms['colorTexture'].value = texture;
    uniforms['strokeTexture'].value = texture1; 

    let obj = {
      depths: [],
      paths: [],
      colors: [],
      center: { x: 0, y: 0 },
    };

    obj.paths.push(paths[0].getAttribute('d'));
    obj.colors.push(0xff00ee);
    obj.depths.push(0.025);


    let group = new THREE.Group();
    addExtrudeObject( group, obj, material );

    ext = group;

    scene.add(group);
  });
}

function process_png(e) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(e.target, 0, 0);
  let im1 = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  let im0 = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
  for(let i = 0; i < im1.data.length / 4; i++) {
    let a = (255 - im1.data[4 * i + 3]) / 255;
    let b = 255 * a | 0;
    im0.data[4 * i + 0] = b;
    im0.data[4 * i + 1] = b;
    im0.data[4 * i + 2] = b;
    im0.data[4 * i + 3] = 255;
  }
  ctx.putImageData(im0, 0, 0);
  Potrace.loadImageFromUrl(ctx.canvas.toDataURL());
  Potrace.process(function(){
    let svg_string = Potrace.getSVG(1);
    let xdoc = dom_parser.parseFromString(svg_string, "text/xml");
    let paths = xdoc.querySelectorAll('path');
    
    //texture.image = im0;
    //texture.needsUpdate = true;
    texture = new THREE.Texture(im0);
    
    //texture1.image = im1;
    //texture1.needsUpdate = true;
    texture = new THREE.Texture(im1);

    uniforms['colorTexture'].value = texture;
    uniforms['strokeTexture'].value = texture1; 

    uniforms['base_color'].value = new THREE.Color(0.5+Math.random()*0.5,0.5+Math.random()*0.5,0.5+Math.random()*0.5);

    let obj = {
      depths: [],
      paths: [],
      colors: [],
      center: { x: 0, y: 0 },
    };

    obj.paths.push(paths[0].getAttribute('d'));
    obj.colors.push(0xff00ee);
    obj.depths.push(0.025);


    let group = new THREE.Group();
    addExtrudeObject( group, obj, material1 );

    ext = group;

    scene.add(group);
  });
}
  
function loadpng(url) {
  if(ext) {
    scene.remove(ext);
  }
  
  let png_image = new Image();
  png_image.src = url;
  png_image.onload = process_png;
}

function render() {
  if(ext) {
      let time = elapsed_time / 1000;
      ext.rotation.y = 0.2 * 3.141592 * Math.sin(time);
      let k = 0.5 + 0.5 * Math.sin(time * 4);
      ext.position.y = k*k*0.2 - 0.2;
      uniforms['time'].value = time;
    }
  
  renderer.render( scene, camera );
}