

import {loadGLTF,loadVideo} from "./libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './assets/targets/camp-target.mind',
    });
    const {renderer, scene, camera} = mindarThree;
    
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const gltf = await loadGLTF('./assets/models/scene.gltf');
    gltf.scene.scale.set(0.002, 0.002, 0.002);
    gltf.scene.position.set(0.6,1.2,0);
    gltf.scene.rotation.set(1, 0, -1.5);

    const anchor1 = mindarThree.addAnchor(0);
    anchor1.group.add(gltf.scene);

    const mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();

    const clock = new THREE.Clock();

    //get the video
    const video = await loadVideo('./assets/videos/trailer.mp4');
    const texture = new THREE.VideoTexture(video);

    // making a plane to play the video
    const geometry = new THREE.PlaneGeometry(1.5, 304/280);
    const material = new THREE.MeshBasicMaterial({map: texture});
    const plane = new THREE.Mesh(geometry, material);
 
    plane.rotation.z = -1.6;
    
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    anchor.onTargetFound = () =>{
      video.play();
    }
    anchor.onTargetLost = ()=>{
      video.pause();
    }

    // the image in the picture is capture at 6th second in the video(transition is good)
    video.addEventListener("play", ()=>{
      video.currentTime = 6;
    })

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta =clock.getDelta();
      mixer.update(delta);
      renderer.render(scene, camera);
    });
  }
  start();
});