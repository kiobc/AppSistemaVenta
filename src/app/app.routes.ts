import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { NgModule } from '@angular/core';
import { SharedModule } from './Reutilizable/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { AppComponent } from './app.component';

export const routes: Routes = [
    {path:'',component: LoginComponent,pathMatch:"full"},
    {path:'login',component: LoginComponent,pathMatch:"full"},
    {path:'pages',loadChildren:() => import('./Components/layout/layout.module').then(m => m.LayoutModule)},
    {path:'**',redirectTo:'login',pathMatch:"full"}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule 
    ],
    providers: [],
    exports: [RouterModule]
})
export class AppRoutingModule { }