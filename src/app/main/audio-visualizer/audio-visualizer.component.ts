import { CubeFactoryService } from './../service/cube-factory.service';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SubjectService } from '../service/subject.service';
import gsap from "gsap";
import * as dat from "dat.gui";
import { RhythmService } from '../service/rhythm.service';

@Component({
    selector: 'app-audio-visualizer',
    templateUrl: './audio-visualizer.component.html',
    styleUrls: ['./audio-visualizer.component.scss']
})
export class AudioVisualizerComponent implements OnInit, OnDestroy {

    @ViewChild('audioVisualizer', { static: true })
    audioVisualizer: ElementRef<HTMLDivElement>;


    navBarHeight: number;

    isOpenedController:boolean;

    constructor(public cubeFactoryService: CubeFactoryService,
        public subjectService: SubjectService,
        public rhythmService:RhythmService
        ) { }

    ngOnInit() {
        this.isOpenedController = true;
        this.subjectService.navBarLoaded.subscribe((params: any) => {
            this.navBarHeight = params.payload;
            this.initCanvasContainer();
        })
        this.subjectService.toggleController.subscribe(_ => {
            this.isOpenedController = !this.isOpenedController;
        })
    }

    initCanvasContainer() {
        const domElement = this.rhythmService.initScene(this.navBarHeight);
        this.rhythmService.initCubes();

        this.audioVisualizer.nativeElement.appendChild(domElement);
    }

    ngOnDestroy() {
        window.removeEventListener("resize", () => { });
    }

}
