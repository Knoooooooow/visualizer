import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RhythmService {

    private _audioBufferArray:Uint8Array;
    private _analyser:AnalyserNode;
    

    constructor() { }

    renderByFrame(controls:any,renderer:any,scene:any,camera:any) {
        if(this._audioBufferArray && this._analyser){
            this._analyser.getByteFrequencyData(this._audioBufferArray);
            console.log(this._audioBufferArray);
        }
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(this.renderByFrame.bind(this,controls,renderer,scene,camera));
    }

    initAudioBufferArray(value:Uint8Array){
        this._audioBufferArray = value;
    }

    initAnalyser(value:AnalyserNode){
        this._analyser = value;
    }

}
