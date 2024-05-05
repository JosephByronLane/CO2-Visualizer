// Import MqttModule and MqttService configuration interface
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';
import { NgModule } from '@angular/core';

// Define your MQTT options
export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'localhost',
  port: 9001, // Use WebSocket port if you've set up Mosquitto to use WebSockets
  path: '/mqtt' // This might be different based on your broker configuration
};

@NgModule({
  declarations: [
    // your components here
  ],
  imports: [
    // other modules here
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  providers: []
})
export class AppModule { }
