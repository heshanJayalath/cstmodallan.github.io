const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF} from './libs/loader.js';

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './assets/targets/camp-target.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    // the 3D model is dark so light it up
    const light = new THREE.HemisphereLight(0xffffff,0xbbbbff,1);
    scene.add(light);

    const anchor = mindarThree.addAnchor(0);

    // load the gltf model and do scaling and postioning because lot of
    //model out in the internet do not have an right scaling and postioning
    const gltf = await loadGLTF("./assets/models/scene.gltf");
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.position.set(0,-0.4,0);
    gltf.scene.rotation.set(Math.PI / 2, 0, 0);
    anchor.group.add(gltf.scene);


    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
