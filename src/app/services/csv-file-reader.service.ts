import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CsvFileReaderService {

  constructor(private http: HttpClient) {
  }

  getCSVData(filePath: string) {
    return this.http.get<string>(filePath, {responseType: 'text' as 'json'});
  }
}

