import { Component, Input, OnChanges } from '@angular/core';
import { StopData, WeatherData } from '../app.model';

@Component({
  selector: 'app-stop-list',
  template: `
    <div class="stop-list-container">
      <div *ngIf="stops.length === 0">
        <p>Not found</p>
      </div>
      <div class="stop-list-item" *ngFor="let stop of displayedStops">
        <div class="stop-name">
          <div class="circle"></div>
          <p>{{ stop.name }}</p>
        </div>
        <div class="arrival-time">
          <p>{{ calculateArrivalTime(stop.expectedArrivalTime) }}</p>
        </div>

        <div class="weather-info">
          <app-weather-temperature
            *ngIf="isNumber(getWeatherTemperature(stop))"
            [weatherTemperature]="getWeatherTemperature(stop)"
          ></app-weather-temperature>

          <app-weather-icon
            *ngIf="isNumber(getWeatherIconValue(stop))"
            [weatherIconValue]="getWeatherIconValue(stop)"
          ></app-weather-icon>

          <app-weather-wind
            *ngIf="isNumber(getWeatherWind(stop))"
            [weatherWind]="getWeatherWind(stop)"
          ></app-weather-wind>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./stop-list.component.scss'],
})
export class StoplistComponent implements OnChanges {
  @Input() stops: StopData[] = [];
  @Input() weatherData: WeatherData[] = [];

  displayedStops: StopData[] = [];

  ngOnChanges() {
    this.updateDisplayedStops();
  }

  updateDisplayedStops() {
    this.displayedStops = this.stops
      .filter(
        (stop) =>
          this.calculateArrivalTime(stop.expectedArrivalTime) !==
            'Already arrived' &&
          this.getMinutesRemaining(stop.expectedArrivalTime) > 0,
      )
      .slice(0, 4);
  }

  calculateArrivalTime(expectedArrivalTime: string): string {
    if (!expectedArrivalTime) {
      return '--';
    }

    const differenceInMinutes = this.getMinutesRemaining(expectedArrivalTime);

    return differenceInMinutes < 0
      ? 'Already arrived'
      : `${differenceInMinutes} min`;
  }

  getMinutesRemaining(expectedArrivalTime: string): number {
    if (!expectedArrivalTime) {
      return 0;
    }

    const arrivalTime = new Date();
    const [hours, minutes] = expectedArrivalTime.split(':').map(Number);
    arrivalTime.setHours(hours);
    arrivalTime.setMinutes(minutes);

    const currentTime = new Date();
    const differenceInMinutes = Math.round(
      (arrivalTime.getTime() - currentTime.getTime()) / (1000 * 60),
    );

    return differenceInMinutes;
  }

  getWeatherTemperatureForCoordinates(stop: any): number {
    const weatherForStop = this.weatherData.find(
      (weather) =>
        weather &&
        weather.latitude === stop.latitude &&
        weather.longitude === stop.longitude,
    );
    if (weatherForStop) {
      return weatherForStop.data.temp;
    } else {
      return NaN;
    }
  }

  getWeatherTemperatureForCity(stop: any): number {
    const weatherForStop = this.weatherData.find(
      (weather) =>
        weather && weather.data && weather.data.cityName === stop.name,
    );
    if (weatherForStop) {
      return weatherForStop.data.temp;
    } else {
      return NaN;
    }
  }

  getWeatherTemperature(stop: any): number {
    const weather = this.weatherData.find(
      (weather) => weather && weather.weatherLookupType,
    );
    if (
      weather &&
      weather.weatherLookupType &&
      weather.weatherLookupType === 'GPS'
    ) {
      return this.getWeatherTemperatureForCoordinates(stop);
    } else if (
      weather &&
      weather.weatherLookupType &&
      weather.weatherLookupType === 'Location Name'
    ) {
      return this.getWeatherTemperatureForCity(stop);
    } else return NaN;
  }

  getWeatherIconValueForCoordinates(stop: any): number {
    const weatherForStop = this.weatherData.find(
      (weather) =>
        weather &&
        weather.latitude === stop.latitude &&
        weather.longitude === stop.longitude,
    );
    if (weatherForStop) {
      return weatherForStop.data.wsymb;
    } else {
      return NaN;
    }
  }

  getWeatherIconValueForCity(stop: any): number {
    const weatherForStop = this.weatherData.find(
      (weather) => weather.data && weather.data.cityName === stop.name,
    );
    if (weatherForStop) {
      return weatherForStop.data.wsymb;
    } else {
      return NaN;
    }
  }

  getWeatherIconValue(stop: any): number {
    const weather = this.weatherData.find(
      (weather) => weather && weather.weatherLookupType,
    );

    if (
      weather &&
      weather.weatherLookupType &&
      weather.weatherLookupType === 'GPS'
    ) {
      return this.getWeatherIconValueForCoordinates(stop);
    } else if (
      weather &&
      weather.weatherLookupType &&
      weather.weatherLookupType === 'Location Name'
    ) {
      return this.getWeatherIconValueForCity(stop);
    } else return NaN;
  }
  getWeatherWindForCoordinates(stop: any): number {
    const weatherForStop = this.weatherData.find(
      (weather) =>
        weather &&
        weather.latitude === stop.latitude &&
        weather.longitude === stop.longitude,
    );
    if (weatherForStop) {
      return weatherForStop.data.winSpd;
    } else {
      return NaN;
    }
  }

  getWeatherWindForCity(stop: any): number {
    const weatherForStop = this.weatherData.find(
      (weather) =>
        weather.data && weather.data && weather.data.cityName === stop.name,
    );
    if (weatherForStop) {
      return weatherForStop.data.winSpd;
    } else {
      return NaN;
    }
  }

  getWeatherWind(stop: any): number {
    const weather = this.weatherData.find(
      (weather) => weather && weather.weatherLookupType,
    );

    if (
      weather &&
      weather.weatherLookupType &&
      weather.weatherLookupType === 'GPS'
    ) {
      return this.getWeatherWindForCoordinates(stop);
    } else if (
      weather &&
      weather.weatherLookupType &&
      weather.weatherLookupType === 'Location Name'
    ) {
      return this.getWeatherWindForCity(stop);
    } else return NaN;
  }

  isNumber(value: any): boolean {
    return !isNaN(value) && typeof value === 'number';
  }
}
