import { SubjectService } from './../service/subject.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AudioService } from '../service/audio.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit,AfterViewInit {

    public myColor: string = '';
    public color: string = '';

    @ViewChild('audioUpload', { static: true })
    public audioUpload: ElementRef<HTMLElement>;

    @ViewChild('navBar', { static: true })
    public navBar: ElementRef<HTMLElement>;

    @ViewChild('audio', { static: true })
    public audio: ElementRef<HTMLAudioElement>;

    constructor(public audioService: AudioService, public subjectService: SubjectService) {

    }
    play() {
        this.audioService.playAudio();
    }
    ngOnInit() {
        
    }

    ngAfterViewInit() {
        this.subjectService.navBarLoaded.next({ type: 'loaded', payload: this.navBar.nativeElement.offsetHeight });
    }

    openInput() {
        this.audioUpload.nativeElement.click();
    }

    fileChange(event: any) {
        const files = event.target.files;
        if (files && files.length) {
            this.audioService.initActiveAudio(files,this.audio);
        }
    }
}
