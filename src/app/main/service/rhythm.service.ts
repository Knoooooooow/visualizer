import { Injectable } from '@angular/core';
import { CubeFactoryService } from './cube-factory.service';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CubesInfo } from 'src/app/model/cubesInfo.interface';
import { Subject, interval, take, throttle } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RhythmService {


    public fftSize = 512;

    private get sampling() {
        return this.fftSize / 2;
    }

    private _audioBufferArray: Uint8Array;
    private _audioBufferListArray: Uint8Array[];
    private _analyser: AnalyserNode;



    private _cubes: THREE.Mesh[];

    private _cubesInfo: CubesInfo;
    private _visualizerValue: any = {};

    private _audioBufferSubject$: Subject<any>;


    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;


    constructor(public cubeFactoryService: CubeFactoryService) {
        this._audioBufferListArray = [];
        this._audioBufferSubject$ = new Subject();
        this._audioBufferSubject$.pipe(throttle(_ => interval(1000)), take(20)).subscribe(data => {
            this._analyser.getByteFrequencyData(this._audioBufferArray);
            this.updateBufferListArray(this._audioBufferArray);
            let bufferArray = this.formatBufferValue();
            // console.log(bufferArray)
            this.formatBufferToBarLength(bufferArray)
        })
    }

    formatBufferToBarLength(bufferArray:Uint8Array[]){
        let bufferLength = bufferArray[0].length;
        let barLength = this._cubesInfo.unit
        let step = Math.floor(bufferLength/barLength)
        console.log(bufferLength,barLength,step)
    }


    initAudioBufferArray(value: Uint8Array) {
        this._audioBufferArray = value;
    }

    initAnalyser(value: AnalyserNode) {
        this._analyser = value;
    }

    initCubesPositionValue(params: CubesInfo) {
        this._cubesInfo = params;
    }
    initVisualizerValue(params: CubesInfo) {
        this._visualizerValue.samplingSpacing = params.samplingSpacing;
    }


    changeCubes(params: CubesInfo) {
        this.initCubesPositionValue(params);
        this.initVisualizerValue(params);
        this.disposeCubes();
        this.generateCubesAndInsertScene();
    }

    initScene(navBarHeight: number) {
        const width = window.innerWidth;
        const height = window.innerHeight - navBarHeight;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.OrthographicCamera(width / -8, width / 8, height / 8, height / -8, 1, 1000);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.set(0, 0, 800);
        this.scene.add(this.camera);
        
        window.addEventListener("resize", () => {
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight - navBarHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
        });

        this.renderer.setSize(width, height);
        return this.renderer.domElement;
    }

    disposeCubes() {
        this._cubes.forEach(cube => {
            this.scene.remove(cube);
            if (cube.material instanceof THREE.Material) {
                cube.material.dispose()
            } else if (Array.isArray(cube.material)) {
                for (const material of cube.material) {
                    material.dispose()
                }
            }
            cube.geometry.dispose();
            (<any>cube) = undefined;
        })
        this._cubes = [];
    }

    generateCubesAndInsertScene() {
        const { width, unit, spacing, x, y, z } = this._cubesInfo;
        this._cubes = this.cubeFactoryService.generateBoxGeometry({ width, height: 5, depth: 1 }, { color: 0x00ff00 }, { spacing, unit, startPosition: { x, y, z } });
        this.scene.add(...this._cubes);

        this.renderByFrame(this.controls, this.renderer, this.scene, this.camera);

        const axesHelper = new THREE.AxesHelper(200);
        this.scene.add(axesHelper);
    }
    renderByFrame(controls: any, renderer: any, scene: any, camera: any) {
        if (this._audioBufferArray && this._analyser) {
            this._audioBufferSubject$.next(1);
        }
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(this.renderByFrame.bind(this, controls, renderer, scene, camera));
    }

    updateBufferListArray(arr: Uint8Array) {
        this._audioBufferListArray.push(new Uint8Array(arr));
        if (this._audioBufferListArray.length > 5) {
            this._audioBufferListArray.shift();
        }
    }
    /**
     * 
     */
    formatBufferValue() {
        let compareMinBuffer: Uint8Array = new Uint8Array(this.sampling);
        let compareMaxBuffer: Uint8Array = new Uint8Array(this.sampling);
        let compareMedianSumArray: number[] = [];
        for (let i = 0; i < this._audioBufferListArray.length; i++) {
            const element = this._audioBufferListArray[i];
            if (i === 0) {
                compareMinBuffer = new Uint8Array(element);
                compareMaxBuffer = new Uint8Array(element);
                compareMedianSumArray = Array.from(element);
            }
            if (i > 0) {
                for (let j = 0; j < element.length; j++) {
                    const buffer = element[j];
                    if (buffer < compareMinBuffer[j]) {
                        compareMinBuffer[j] = buffer;
                    }
                    if (buffer > compareMaxBuffer[j]) {
                        compareMaxBuffer[j] = buffer;
                    }
                    compareMedianSumArray[j] += buffer
                }
            }
        }
        let compareMedianBuffer: Uint8Array = new Uint8Array(this.sampling);
        for (let i = 0; i < compareMedianSumArray.length; i++) {
            compareMedianBuffer[i] = compareMedianSumArray[i] / 5;
        }
        return [compareMinBuffer, compareMaxBuffer, compareMedianBuffer]
    }

}
