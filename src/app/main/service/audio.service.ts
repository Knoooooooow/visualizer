import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    constructor() { }

    playAudio() {
        const audio = new Audio();
        audio.src = '../../../assets/music/shygui.mp3';
        audio.load();
        audio.play();
    }
}
