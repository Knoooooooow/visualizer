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
    camera = new THREE.OrthographicCamera(window.innerWidth / -8, window.innerWidth / 8, window.innerHeight / 8, window.innerHeight / -8, 1, 1000);
    renderer = new THREE.WebGLRenderer();
    controls = new OrbitControls(this.camera, this.renderer.domElement)
    @ViewChild('audioVisualizer', { static: true }) audioVisualizer: ElementRef | undefined;
    constructor() { }

    ngOnInit() {
        this.camera.position.set(0, 0, 300);
        this.scene.add(this.camera);
        window.addEventListener("resize", () => {
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio)
        });
        const cubes = this.generateBoxGeometry({ width: 1, height: 5, depth: 1 }, { color: 0x00ff00 }, { spacing: 1, unit: 50, startPosition: { x: 10, y: 10, z: 10 } });
        cubes.forEach(cube => {
            this.scene.add(cube);
        })

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.audioVisualizer?.nativeElement.appendChild(this.renderer.domElement);
        // this.renderer.render(this.scene, this.camera)
        this.render();

        const axesHelper = new THREE.AxesHelper(200);
        this.scene.add(axesHelper);
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
    generateBoxGeometry(boxGeometry: {
        width: number,
        height: number,
        depth: number,
    }, meshBasicMaterial: {
        color?: THREE.ColorRepresentation | undefined;
    },
        params: { spacing: number, unit: number, startPosition: { x: number, y: number, z: number } }): THREE.Mesh[] {

        let cubeList: THREE.Mesh[] = [];
        let unit = params.unit;
        let position = { x: params.startPosition.x, y: params.startPosition.y, z: params.startPosition.z };

        for (let i = 0; i < unit; i++) {
            const geometry = new THREE.BoxGeometry(boxGeometry.width, boxGeometry.height, boxGeometry.depth);
            const material = new THREE.MeshBasicMaterial({ color: meshBasicMaterial.color });
            const cube = new THREE.Mesh(geometry, material);

            const x = position.x + (boxGeometry.width + params.spacing) * i;
            const y = position.y;
            const z = position.z;
            cube.position.set(x, y, z);

            cubeList.push(cube);
        }

        return cubeList;
    }

    fullScreen() {
        window.addEventListener("dblclick", () => {
            const fullScreenElement = document.fullscreenElement;
            if (!fullScreenElement) {
                this.renderer.domElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
    }
}
