import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSaverService {
  constructor(private http: HttpClient) {}

  public sendData(topic: string, data: any): void {
    this.http.post(`http://http://3.128.26.206/:3000/save-data/${topic}`, data)
      .subscribe({
        next: (response) => console.log('Data sent to server', response),
        error: (error) => console.error('Error sending data to server', error)
      });
  }

  public fetchData(topic: string) {
    return this.http.get<any[]>(`http://http://3.128.26.206/:3000/data/${topic}`);    
  }
}
