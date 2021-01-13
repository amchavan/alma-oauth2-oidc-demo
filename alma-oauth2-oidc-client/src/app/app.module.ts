import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
// @ts-ignore
import { OAuthModule } from 'angular-oauth2-oidc';
import { OidcAuthModule } from 'alma-oauth2-oidc-client';
import { environment } from '../environments/environment';
import { DynamicTwoColorPieChartComponent } from './dynamic-two-color-pie-chart/dynamic-two-color-pie-chart.component';
import { ModalModule } from './modal-dialog-box';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
        DynamicTwoColorPieChartComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        OAuthModule.forRoot(),
        OidcAuthModule.forRoot( { securedURLs: environment.protectedApiURLs } ),
        ModalModule
    ],
    providers: [
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
