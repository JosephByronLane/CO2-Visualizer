# CO2 Visualizer (angular17-mosquitto)

This project is an Angular 17 application designed to connect to an MQTT broker (Mosquitto in this case), subscribe to topics, and visualize the received data. It appears to be specifically tailored for visualizing CO2 sensor data, potentially on charts and maps.

The application uses `ngx-mqtt` for MQTT communication, `Chart.js` and `ApexCharts` for data visualization, and `@angular/google-maps` for displaying data geographically. 

## Project Structure

- `src/`: Contains the Angular application source code.
  - `src/app/`: Core application components, routes, and services.
    - `src/app/services/data-saver.service.ts`: Service for sending data to and fetching data from a backend API.
- `angular.json`: Angular workspace configuration.
- `package.json`: Project metadata, dependencies, and scripts.
- `data_equipo-*.json`: These files are to be sample JSON data, which the backend serves (`server.js`).

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (which includes npm)
- [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd angular17-mosquitto
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

    This will install all the necessary packages defined in `package.json`.

## Development Server

Run `npm start` or `ng serve` for a development server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


## Backend Server

This project includes dependencies for an Express.js backend. This is the process that runs the backend server which stores the data. The Angular `DataSaverService` is configured to interact with an API.


## Key Technologies

- Angular 17
- MQTT (via `ngx-mqtt`)
- Chart.js
- ApexCharts
- Angular Google Maps
- TypeScript

