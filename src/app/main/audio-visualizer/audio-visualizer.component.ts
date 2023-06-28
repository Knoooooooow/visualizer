import { CubeFactoryService } from './../service/cube-factory.service';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SubjectService } from '../service/subject.service';
import gsap from "gsap";
import * as dat from "dat.gui";
import { RhythmService } from '../service/rhythm.service';

@Component({
    selector: 'app-audio-visualizer',
    templateUrl: './audio-visualizer.component.html',
    styleUrls: ['./audio-visualizer.component.scss']
})
export class AudioVisualizerComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('audioVisualizer', { static: true })
    audioVisualizer: ElementRef<HTMLDivElement>;

    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;

    navBarHeight: number;

    constructor(public cubeFactoryService: CubeFactoryService,
        public subjectService: SubjectService,
        public rhythmService:RhythmService
        ) { }

    ngOnInit() {
        this.subjectService.navBarLoaded.subscribe((params: any) => {
            this.navBarHeight = params.payload;
            this.initCanvasContainer();
        })

    }

    ngAfterViewInit() {
    }

    initCanvasContainer() {
        const width = window.innerWidth;
        const height = window.innerHeight - this.navBarHeight;
        console.log(width,height);

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.OrthographicCamera(width / -8, width / 8, height / 8, height / -8, 1, 800);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
         
        this.camera.position.set(0, 0, 300);
        this.scene.add(this.camera);
        window.addEventListener("resize", () => {
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight - this.navBarHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
        });

        this.renderer.setSize(width, height);
        this.initCubes();
    }

    initCubes() {
        const cubes = this.cubeFactoryService.generateBoxGeometry({ width: 1, height: 5, depth: 1 }, { color: 0x00ff00 }, { spacing: 1, unit: 50, startPosition: { x: 10, y: 10, z: 10 } });
        cubes.forEach(cube => {
            this.scene.add(cube);
        })

        this.audioVisualizer.nativeElement.appendChild(this.renderer.domElement);
        
        this.rhythmService.renderByFrame(this.controls,this.renderer,this.scene,this.camera)

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
