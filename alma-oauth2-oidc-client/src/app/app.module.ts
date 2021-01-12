import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppLoadModule } from '../oidc-oauth/app.load.module';
import { AppComponent } from './app.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { OidcAuthModule } from 'alma-oauth2-oidc-client';
import { environment } from '../environments/environment';
import { DynamicTwoColorPieChartComponent } from './dynamic-two-color-pie-chart/dynamic-two-color-pie-chart.component';
import { ModalModule } from './modal-dialog-box';

@NgModule({
    declarations: [
        AppComponent,
        DynamicTwoColorPieChartComponent
    ],
    imports: [
        AppLoadModule,
        BrowserModule,
        OAuthModule.forRoot(),
        OidcAuthModule.forRoot( { securedURLs: environment.allApiURLs } ),
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
