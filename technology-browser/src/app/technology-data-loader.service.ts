import {Injectable} from '@angular/core';
import {CsvFileReaderService} from './csv-file-reader.service';
import {map, Observable} from 'rxjs';
import {RowData} from './models/row-data';

@Injectable({
  providedIn: 'root'
})
export class TechnologyDataLoaderService {
  private _technologyDataFilePath = '../../assets/technologyDataCSV.csv'

  constructor(private csvFileReader: CsvFileReaderService) {
  }

  fetchAllTechnologyData(): Observable<RowData[]> {
    return this.csvFileReader.getCSVData(this._technologyDataFilePath)
      .pipe(map(data => {
        const lines: any[] = [];
        const linesArray = data.split('\n');
        linesArray.forEach((e: any) => {
          const row = e.replace(/[\s]+[;]+|[;]+[\s]+/g, ';').trim();
          lines.push(row);
        });
        lines.slice(lines.length - 1, 1);
        //const columns = lines[0].split(';');
        const rowData = [];
        for (let l = 1; l < 1000; l++) {
        //for (let l = 1; l < 350000; l++) {
        //for (let l = 1; l < lines.length - 1; l++) {
          const tempNadrzedny = lines[l].split(';')[0];
          const tempLlc = lines[l].split(';')[1];
          const tempProdukt = lines[l].split(';')[2];
          const tempMatka = lines[l].split(';')[3];
          const tempTechnologia = lines[l].split(';')[4];
          const tempBom_wzorzec = lines[l].split(';')[5];
          const tempBom_technologia = lines[l].split(';')[6];
          const tempBOM_Final_Idn = lines[l].split(';')[7];
          const tempBOM_Final_Name = lines[l].split(';')[8];
          const tempId_tech = lines[l].split(';')[9];
          const tempId_instr = lines[l].split(';')[10];
          const tempWzorzec = lines[l].split(';')[11];
          const tempFantom = lines[l].split(';')[12];
          const tempNormatyw = lines[l].split(';')[13];
          const tempGrupaBranzowa = lines[l].split(';')[14];
          //const tempIlosc = lines[l].split(';')[15];
          //TODO poprawić ilość gdy będzie wyliczana
          const tempRowData = new RowData(tempNadrzedny, tempLlc, tempProdukt, tempMatka, tempTechnologia,
            tempBom_wzorzec, tempBom_technologia, tempBOM_Final_Idn, tempBOM_Final_Name, tempId_tech, tempId_instr, tempWzorzec, tempFantom, tempNormatyw, tempGrupaBranzowa, 1);
          rowData.push(tempRowData);
        }
        return rowData;
      }));
  }
}
