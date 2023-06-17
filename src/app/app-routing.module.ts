import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';


const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            {
                path: 'main',
                loadChildren: () => import('./main/main.module').then(mod => mod.MainModule),
            },
            {
                path: '**',
                redirectTo: 'main',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }