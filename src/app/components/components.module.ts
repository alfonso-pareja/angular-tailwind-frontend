import { NgModule } from "@angular/core";
import { MenuComponent } from './menu/menu.component';

import { LoadingButtonComponent } from './loading-button/loading-button.component';
import { BrowserModule } from "@angular/platform-browser";
import { NavbarComponent } from "./navbar/navbar.component";
import { LayoutComponent } from "./layout/layout.component";
import { SpinnerComponent } from "./spinner/spinner.component";

@NgModule({
    declarations:[
        MenuComponent,
        LoadingButtonComponent,
        NavbarComponent,
        LayoutComponent,
        SpinnerComponent
    ],
    imports: [
        BrowserModule
    ],
    exports: [
        MenuComponent,
        LoadingButtonComponent,
        NavbarComponent,
        LayoutComponent,
        SpinnerComponent
    ]
})
export class ComponentsModule { }