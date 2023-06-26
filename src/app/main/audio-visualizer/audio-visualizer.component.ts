import { CubeFactoryService } from './../service/cube-factory.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from "gsap";
import * as dat from "dat.gui";

@Component({
    selector: 'app-audio-visualizer',
    templateUrl: './audio-visualizer.component.html',
    styleUrls: ['./audio-visualizer.component.scss']
})
export class AudioVisualizerComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('audioVisualizer', { static: true })
    audioVisualizer!: ElementRef;

    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;

    constructor(public cubeFactoryService: CubeFactoryService) { }

    ngOnInit() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(window.innerWidth / -8, window.innerWidth / 8, window.innerHeight / 8, window.innerHeight / -8, 1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set(0, 0, 300);
        this.scene.add(this.camera);
        window.addEventListener("resize", () => {
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio)
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    ngAfterViewInit() {
        const cubes = this.cubeFactoryService.generateBoxGeometry({ width: 1, height: 5, depth: 1 }, { color: 0x00ff00 }, { spacing: 1, unit: 50, startPosition: { x: 10, y: 10, z: 10 } });
        cubes.forEach(cube => {
            this.scene.add(cube);
        })
        
        this.audioVisualizer.nativeElement.appendChild(this.renderer.domElement);
        this.render();

        const axesHelper = new THREE.AxesHelper(200);
        this.scene.add(axesHelper);
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    ngOnDestroy() {
        window.removeEventListener("resize", () => { });
    }

}
