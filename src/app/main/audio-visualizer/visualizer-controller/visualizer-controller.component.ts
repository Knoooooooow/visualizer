import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubjectService } from './../../service/subject.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RhythmService } from '../../service/rhythm.service';

@Component({
    selector: 'app-visualizer-controller',
    templateUrl: './visualizer-controller.component.html',
    styleUrls: ['./visualizer-controller.component.scss']
})
export class VisualizerControllerComponent implements OnInit, OnDestroy {

    form: FormGroup;
    onDestroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private formBuilder: FormBuilder,public rhythmService:RhythmService) {
        this.form = this.formBuilder.group({
            unit: [100],
            width: [5],
            spacing: [1],
            x:[10],
            y:[10],
            z:[10]
        });
        this.form.controls['unit'].valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(value => {
            this.rhythmService.changeCubes(value);
        })
    }

    submit() {

    }

    ngOnInit() {
    }
    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
