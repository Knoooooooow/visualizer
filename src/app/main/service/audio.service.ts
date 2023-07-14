import { ElementRef, Injectable } from '@angular/core';
import { RhythmService } from './rhythm.service';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    audio: HTMLAudioElement;
    constructor(public rhythmService: RhythmService) { }

    playAudio() {
        if (this.audio) {
            return;
        }
        this.audio = new Audio();
        this.audio.src = '../../../assets/music/shygui.mp3';
        this.audio.load();
        this.audio.play();
        const analyser = this.initAudioNode();
        this.rhythmService.initAnalyser(analyser);
    }

    initActiveAudio(files: any, audio: ElementRef<HTMLAudioElement>) {
        this.audio = audio.nativeElement;
        this.audio.src = URL.createObjectURL(files[0]);
        this.audio.load();
        this.audio.play();
        const analyser = this.initAudioNode();
        this.rhythmService.initAnalyser(analyser);
    }
    initAudioNode() {
        let context = new AudioContext();
        let analyser = context.createAnalyser();
        let source = context.createMediaElementSource(this.audio);
        source.connect(analyser);
        analyser.connect(context.destination);
        analyser.fftSize = this.rhythmService.fftSize;
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        this.rhythmService.initAudioBufferArray(dataArray);
        return analyser;
    }
}
