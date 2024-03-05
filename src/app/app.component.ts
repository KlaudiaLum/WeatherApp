import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { LuminatorWindow } from './app.model';
import { CoordinatesService } from './coordinates.service';
import { StopListService } from './stop-list.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="weather-container">
      <app-weather-temperature
        [weatherTemperature]="weatherTemperature"
      ></app-weather-temperature>
      <app-weather-icon
        [weatherIconValue]="weatherIconValue"
      ></app-weather-icon>
      <app-weather-wind [weatherWind]="weatherWind"></app-weather-wind>
      <app-lat-lng [coordinates]="coordinates"></app-lat-lng>
    </div>
    <app-stop-list [stops]="stops"></app-stop-list>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'WeatherApp';
  weatherData: any;
  weatherWind = 0;
  weatherTemperature = 0;
  weatherIconValue = 0;
  state: any;
  stops: any[] = []; // Array to store stop data
  latitude = 0;
  longitude = 0;
  mqttConfig = environment.mqtt;
  coordinates: { latitude: number; longitude: number; }[] =[];


  constructor(
    private apiService: ApiService,
    private coordinatesService: CoordinatesService,
    private stopListService: StopListService,

  ) {}

  ngOnInit(): void {
    this.initConnection();
    this.getWeather();
  }

  getWeather(): void {
    this.apiService.getWeather().subscribe((data) => {
      this.weatherData = data;
      this.weatherTemperature = this.weatherData.temp;
      this.weatherWind = this.weatherData.winSpd;
      if (this.weatherData && this.weatherData.wsymb) {
        this.weatherIconValue = this.weatherData.wsymb;
      }
    });
  }

  // connectet libpis with mqtt broker - Please check if this connection is okay I'm not sure about this code.
  // initConnection(): void {
  //   (window as Window as LuminatorWindow).luminator.pis.init(this.mqttConfig);

  //   (window as Window as LuminatorWindow).luminator.pis.client
  //     .updates()
  //     .subscribe({
  //       next: (state: any) => {
  //         if (state && state.stopList) {
  //           console.log('LIBPIS DATA', state.stopList);
  //           this.handleCoordinates(state); 
  //           this.handleStopListData(state);
  //         } else {
  //           console.log('Waiting for data...');
  //         }
  //       },
  //       error: (error: any) => {
  //         console.error('Error occurred while fetching data:', error);
  //       },
  //     });
  // }
  initConnection(): void {
    const { luminator: { pis } } = window as Window as LuminatorWindow;
  
    pis.init(this.mqttConfig);
    pis.client.updates().subscribe({
      next: (state: any) => {
        if (state && state.stopList) {
          console.log('LIBPIS DATA', state.stopList);
          this.handleCoordinates(state); 
          this.handleStopListData(state);
        } else {
          console.log('Waiting for data...');
        }
      },
      error: (error: any) => {
        console.error('Error occurred while fetching data:', error);
      },
    });
  }


 // read Latitude and Longitude
  handleCoordinates(state: any): void {
    if (state.stopList && state.stopList.length > 0) {
      const coordinate = this.coordinatesService.processCoordinates(state.stopList);
      if (coordinate) {
        this.coordinates = coordinate;
      } else {
        console.log('Failed to process coordinates.');
        this.coordinates = []; // Set an empty array when the coordinates could not be processed
      }
    } else {
      console.log('StopList is either undefined or empty');
      this.coordinates = []; 
    }
          console.log('LIBPIS DATA', state);
         
        }
  

  // get stopList

  handleStopListData(state: any): void {
    const parsedStopList = this.parseStopList(state.stopList);
    console.log('Parsed stop list:', parsedStopList);

    // Update stop list
    this.stops = parsedStopList;
    this.stopListService.updateStops(parsedStopList);
  }

  parseStopList(stopList: any): any[] {
    return stopList; // By default, it returns the unprocessed stop list

  }
}
