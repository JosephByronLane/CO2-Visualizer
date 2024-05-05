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

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'localhost',
  port: 9001,
  path: '/',
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
  title = 'angular17-mosquitto';
  initialZoom: number = 12; 
  datapointClicked=false;
  client: MqttService | undefined;
  constructor(private mqttService: MqttService, private dataService: DataSaverService) {
    this.client = this.mqttService;
  }

  connection = {
    hostname: 'localhost',
    port: 9001,
    path: '/',
    clean: true, // Retain session
    connectTimeout: 4000, // Timeout period
    reconnectPeriod: 4000, // Reconnect period
    // Authentication information
    clientId: 'mqttx_597046f4',
    username: '',
    password: '',
    protocol: 'ws',
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
      this.mqttService.observe(topic).subscribe((message: IMqttMessage) => {
        const messageData = JSON.parse(message.payload.toString());
        this.dataService.sendData(topic, messageData);
      });
    });  }  

    public lineChartData: ChartConfiguration<'line'>['data'] = {
      datasets: [],
    };
    public lineChartOptions: ChartOptions<'line'> = {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          ticks: {
            display: false // Hides the x-axis labels
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
              // Parsing the timestamp directly from the tooltip item
              try {
                const rawTimestamp = tooltipItems[0].parsed.x;  // Assuming this is where the timestamp is stored
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
