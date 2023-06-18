import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { SharedModule } from './shared/shared.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AudioVisualizerComponent } from './audio-visualizer/audio-visualizer.component';



@NgModule({
    declarations: [MainComponent, NavBarComponent, AudioVisualizerComponent],
    imports: [
        CommonModule,
        MainRoutingModule,
        SharedModule
    ]
})
export class MainModule { }
