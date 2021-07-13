import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LoginComponent} from "./login-component/login.component";
import {ActivityTableComponent} from "./activity-table-component/activity-table.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MaterialModule} from "./material-module";
import {MatNativeDateModule} from "@angular/material/core";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {APP_BASE_HREF} from "@angular/common";
import {LoadComponent} from "./load-component/load.component";

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  entryComponents: [ActivityTableComponent, LoginComponent, AppComponent, LoadComponent],
  declarations: [ActivityTableComponent, LoginComponent, AppComponent, LoadComponent],
  bootstrap: [AppComponent],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    {provide: APP_BASE_HREF, useValue : '/' }
  ]
})

export class AppModule { }
