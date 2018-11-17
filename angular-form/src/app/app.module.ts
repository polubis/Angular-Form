import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './components/form/form.component';
import { ValidationService } from "src/app/components/form/validation.service";
import { NormalInputComponent } from './components/normal-input/normal-input.component';
import { SelectAndTypeComponent } from './components/select-and-type/select-and-type.component';
import { SimpleSelectComponent } from './components/simple-select/simple-select.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    NormalInputComponent,
    SelectAndTypeComponent,
    SimpleSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
  ],
  providers: [ValidationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
