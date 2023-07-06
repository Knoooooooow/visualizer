import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RhythmService } from '../../service/rhythm.service';
import { CubesPosition } from 'src/app/model/cubesPosition.interface';

@Component({
    selector: 'app-visualizer-controller',
    templateUrl: './visualizer-controller.component.html',
    styleUrls: ['./visualizer-controller.component.scss']
})
export class VisualizerControllerComponent implements OnInit, OnDestroy {

    form: FormGroup;
    onDestroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private formBuilder: FormBuilder, public rhythmService: RhythmService) {
        this.form = this.formBuilder.group({
            unit: [100],
            width: [3],
            spacing: [1],
            x: [10],
            y: [10],
            z: [10]
        });
        this.form.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((params: CubesPosition) => {
            for (const key in params) {
                if (typeof params[key] === 'string') {
                    params[key] = Number(params[key]);
                }
            }
            this.rhythmService.changeCubes(params);
        })
    }

    submit() {

    }

    ngOnInit() {
        const formValue: CubesPosition = this.form.value;
        this.rhythmService.initCubesPositionValue(formValue);
    }
    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
