import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

let baseUrl = environment.Base_Url

@Injectable({
  providedIn: 'root'
})
export class OsipService {

  constructor(private http: HttpClient) { }

  getFromServer(url: string) {
    return this.http.get(baseUrl + url);
  }
  postToServer(url: string, data: object) {
    return this.http.post(baseUrl + url, data);
  }
  updateToServer(url: string, data: object) {
    return this.http.put(baseUrl + url, data);
  }
  // deleteFromServer(url: string, data: object){
  //   return this.http.delete(baseUrl + url, data);
  // }
  deleteFromServer(url: string, data: object = {}): Observable<any> {
    return this.http.delete(baseUrl + url, data);
  }
  
  // deleteFromServer(url: string): Observable<any> {
  //   return this.http.delete(`${this.baseUrl}/${url}`);
  // }
  postCsvToServer(url: string, data: object) {
    return this.http.post(baseUrl + url, data);
  }
  
  getCsvDataFromServer(url: string, data: object) {
    return this.http.get(baseUrl + url, { responseType: 'arraybuffer' });
  }

  getstoredData(){
    const storedData = sessionStorage.getItem('data');
    if (storedData) { 
      try {
        const parsedData = JSON.parse(storedData);
        console.log(parsedData); // This will log the stored data
        return parsedData;  
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    } else {
      console.error('No data found in session storage');
    }  }
}
