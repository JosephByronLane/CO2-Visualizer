import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {  IMqttMessage,  IMqttServiceOptions,  MqttService, } from 'ngx-mqtt';
import { DataSaverService } from './services/data-saver.service';
import { HttpClientModule } from '@angular/common/http';
import { BaseChartDirective} from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';

//For de-neuterization

//set the initial state of datapointClicked to false
//remove line of code that autimatically updates charts.
//set neutered bool to false


export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: '3.138.100.11',
  port: 9001,
  path: '/mqtt',
  protocol: 'ws',
  connectOnCreate: true
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GoogleMapsModule, CommonModule, HttpClientModule, BaseChartDirective],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    {
      provide: MqttService,
      useFactory: () => new MqttService(MQTT_SERVICE_OPTIONS)
    },
    DataSaverService,
    provideCharts(withDefaultRegisterables())
  ]
})

export class AppComponent implements OnInit {
  title = 'Raspberry Pi-TO';
  initialZoom: number = 12; 
  datapointClicked=false; 
  neutered=false
  currentlyClickedMarker = "";
  client: MqttService | undefined;
  constructor(private mqttService: MqttService, private dataService: DataSaverService) {
    this.client = this.mqttService;
  }

  markers = [
    { id: 1, position: { lat: 20.985794, lng: -89.615382 }, label: { color: 'white', text: 'equipo-1' }},
    { id: 2, position: { lat: 20.975794, lng: -89.615382 }, label: { color: 'white', text: 'equipo-2' }},
    { id: 3, position: { lat: 20.965794, lng: -89.615382 }, label: { color: 'white', text: 'equipo-3' }},
    { id: 4, position: { lat: 20.955794, lng: -89.615382 }, label: { color: 'white', text: 'equipo-4' }},
    { id: 5, position: { lat: 20.945794, lng: -89.615382 }, label: { color: 'white', text: 'equipo-5' }},
    { id: 6, position: { lat: 20.935794, lng: -89.615382 }, label: { color: 'white', text: 'equipo-6' }},

  ];


  ngOnInit(): void {
    const topics = ['equipo-1', 'equipo-2', 'equipo-3', 'equipo-4', 'equipo-5', 'equipo-6'];
    topics.forEach(topic => {
      console.log("connecting to topic:", topic)
      this.mqttService.observe(topic).subscribe((message: IMqttMessage) => {
        console.log("recieved updated dara from: ", topic)
        this.dataService.fetchData(this.currentlyClickedMarker).subscribe(data => {
          this.updateChartData(data, this.currentlyClickedMarker);
        });      });
    }); 
  
  }  

    public lineChartData: ChartConfiguration<'line'>['data'] = {
      datasets: [],
    };
    public lineChartOptions: ChartOptions<'line'> = {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          ticks: {
            display: false 
          }
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: function(tooltipItems) {
              try {
                const rawTimestamp = tooltipItems[0].parsed.x;  
                return new Date(rawTimestamp).toLocaleString();
              } catch (e) {
                console.error('Error parsing date:', e);
                return 'Invalid Date';
              }
            }
          }
        }
      }
    };
   public lineChartLegend = true;
   public currentData = [];

    onMarkerClick(marker: any): void {
      this.datapointClicked=true;
      this.currentlyClickedMarker = marker.label.text;
      console.log(`Marker clicked: ${marker.label.text}`);
      this.dataService.fetchData(marker.label.text).subscribe(data => {
        this.updateChartData(data, marker.label.text);
      });
    }

    private updateChartData(data: any[], topic: string): void {
      this.lineChartData.labels = data.map(d => d.timestamp);
      this.lineChartData.datasets = [
        { data: data.map(d => d.tvoc), label: 'TVOC', borderColor: 'red', fill: false },
        { data: data.map(d => d.temperature), label: 'Temperature', borderColor: 'blue', fill: false },
        { data: data.map(d => d.aqi), label: 'AQI', borderColor: 'green', fill: false },
        { data: data.map(d => d.humidity), label: 'Humidity', borderColor: 'purple', fill: false },
        { data: data.map(d => d.co2), label: 'CO2', borderColor: 'orange', fill: false }
      ];
    }
}
