import { NgModule } from "@angular/core";

import { HomeComponent } from './home/home.component';
import { DestinatariosComponent } from './destinatarios/destinatarios.component';
import { TransferenciasComponent } from './transferencias/transferencias.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { LoginComponent } from "./login/login.component";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { ComponentsModule } from "../components/components.module";
import { CLPCurrencyPipe } from "../pipes/currency.pipe";


@NgModule({
    declarations: [
        LoginComponent,
        HomeComponent,
        DestinatariosComponent,
        TransferenciasComponent,
        MovimientosComponent,
        CLPCurrencyPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ComponentsModule
    ],
    exports: [
        LoginComponent,
        HomeComponent,
        DestinatariosComponent,
        TransferenciasComponent,
        MovimientosComponent,
    ]
})
export class PagesModule { }