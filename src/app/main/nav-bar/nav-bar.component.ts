import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

    public myColor: string = '';
    public color: string = '';
    constructor(private router: Router) {

    }
    redirectToIndex() {
        this.router.navigate(['/main/blog/index']);
    }

    ngOnInit() {
    }
}
