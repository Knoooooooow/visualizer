import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from "gsap";
import * as dat from "dat.gui";

@Component({
    selector: 'app-audio-visualizer',
    templateUrl: './audio-visualizer.component.html',
    styleUrls: ['./audio-visualizer.component.scss']
})
export class AudioVisualizerComponent implements OnInit {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    renderer = new THREE.WebGLRenderer();
    controls = new OrbitControls(this.camera,this.renderer.domElement)
    @ViewChild('audioVisualizer', { static: true }) audioVisualizer: ElementRef | undefined;
    constructor() { }

    ngOnInit() {
        this.camera.position.set(0, 0, 10);
        this.scene.add(this.camera);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        let animate1 = gsap.to(cube.position, {
            x: 2 * Math.PI, duration: 5, ease: "power1.inOut", yoyo: true, onStart: () => {
                console.log('动画开始');
            }
        });

        const gui = new dat.GUI();
        gui.add(cube.position,"x").min(0).max(5).step(0.1).name('cube').onChange((value)=>{

        })
        gui.addColor({color:"#ffff00"},"color").onChange((value)=>{
            cube.material.color.set(value);
        })


        window.addEventListener("dblclick",()=>{
            const fullScreenElement = document.fullscreenElement;
            if(!fullScreenElement){
                this.renderer.domElement.requestFullscreen();
            }else{
                document.exitFullscreen();
            }
        });
        window.addEventListener("resize",()=>{
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth , window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio)
        });

        this.scene.add(cube);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.audioVisualizer?.nativeElement.appendChild(this.renderer.domElement);
        // this.renderer.render(this.scene, this.camera)
        this.render();

        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

}
