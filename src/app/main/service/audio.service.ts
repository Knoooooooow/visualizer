import { ElementRef, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    audio: HTMLAudioElement;
    constructor() { }

    playAudio() {
        this.audio = new Audio();
        this.audio.src = '../../../assets/music/shygui.mp3';
        this.audio.load();
        this.audio.play();
    }

    initActiveAudio(files: any, audio: ElementRef<HTMLAudioElement>) {
        this.audio = audio.nativeElement;
        this.audio.src = URL.createObjectURL(files[0]);
        this.audio.load();
        this.audio.play();
    }
}
