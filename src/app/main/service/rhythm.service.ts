import { Injectable } from '@angular/core';
import { CubeFactoryService } from './cube-factory.service';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Injectable({
    providedIn: 'root'
})
export class RhythmService {

    private _audioBufferArray: Uint8Array;
    private _analyser: AnalyserNode;


    private _cubes: THREE.Mesh[];

    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;


    constructor(public cubeFactoryService: CubeFactoryService) { }


    initAudioBufferArray(value: Uint8Array) {
        this._audioBufferArray = value;
    }

    initAnalyser(value: AnalyserNode) {
        this._analyser = value;
    }

    changeCubes(value: number) {
        console.log(value)
    }

    initScene(navBarHeight: number) {
        const width = window.innerWidth;
        const height = window.innerHeight - navBarHeight;
        console.log(width, height);

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.OrthographicCamera(width / -8, width / 8, height / 8, height / -8, 1, 800);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.set(0, 0, 300);
        this.scene.add(this.camera);
        window.addEventListener("resize", () => {
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight - navBarHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
        });

        this.renderer.setSize(width, height);
        return this.renderer.domElement;
    }

    initCubes() {

        const cubes = this.cubeFactoryService.generateBoxGeometry({ width: 1, height: 5, depth: 1 }, { color: 0x00ff00 }, { spacing: 1, unit: 50, startPosition: { x: 10, y: 10, z: 10 } });
        cubes.forEach(cube => {
            this.scene.add(cube);
        })

        this.renderByFrame(this.controls, this.renderer, this.scene, this.camera)

        const axesHelper = new THREE.AxesHelper(200);
        this.scene.add(axesHelper);
    }

    renderByFrame(controls: any, renderer: any, scene: any, camera: any) {
        if (this._audioBufferArray && this._analyser) {
            this._analyser.getByteFrequencyData(this._audioBufferArray);
            console.log(this._audioBufferArray);
        }
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(this.renderByFrame.bind(this, controls, renderer, scene, camera));
    }
}
