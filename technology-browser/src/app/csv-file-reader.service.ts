import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CsvFileReaderService {

  constructor(private http: HttpClient) { }

  getCSVData(filePath: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'text',
        charset: 'utf-8'
      }),
      responseType: 'text' as 'json',
      accept: 'charset'
    };
    return this.http.get<string>(filePath, httpOptions);
  }
}
