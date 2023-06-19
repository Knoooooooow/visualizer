import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
    @ViewChild('audioVisualizer', { static: true }) audioVisualizer: ElementRef | undefined;
    constructor() { }

    ngOnInit() {
        this.camera.position.set(0, 0, 10);
        this.scene.add(this.camera);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        cube.scale.set(3,2,1);
        this.scene.add(cube);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.audioVisualizer?.nativeElement.appendChild(this.renderer.domElement);
        // this.renderer.render(this.scene, this.camera)
        this.render();
        const controls = new OrbitControls(this.camera, this.renderer.domElement);

        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

}
