import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherTemperatureComponent } from './weather-temperature/weather-temperature.component';
import { WeatherIconComponent } from './weather-icon/weather-icon.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherTemperatureComponent,
    WeatherIconComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
