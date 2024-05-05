import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSaverService {
  constructor(private http: HttpClient) {}

  public sendData(topic: string, data: any): void {
    this.http.post(`http://localhost:3000/api/save-data/${topic}`, data)
      .subscribe({
        next: (response) => console.log('Data sent to server', response),
        error: (error) => console.error('Error sending data to server', error)
      });
  }

  public fetchData(topic: string) {
    return this.http.get<any[]>(`http://localhost:3000/api/data/${topic}`);    
  }
}
