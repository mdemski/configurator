import {Injectable} from '@angular/core';
import {CsvFileReaderService} from '../services/csv-file-reader.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationDataService {
  private _modelsFilePath = '../../../assets/csv/roof-windows.csv';
  private _availableOptions;
  private _models;
  private _materials;
  private _openingTypes;
  private _dimensions;
  private _innerColors;
  private _outerMaterials;
  private _outerColor;
  private _outerColorFinishes;
  private _glazingTypes;
  private _coats;
  private _handles;
  private _ventialtions;
  private _extras;
  private _technicalInformation;

  constructor(private csv: CsvFileReaderService) {
  }

  fetchAllData() {
    return this.csv.getCSVData(this._modelsFilePath)
      .pipe(map(data => {
        const lines = [];
        const linesArray = data.split('\n');
        linesArray.forEach((e: any) => {
          // TODO jak usunąć puste linie???
          const row = e.replace(/[\s]+[;]+|[;]+[\s]+/g, ';').trim();
          lines.push(row);
        });
        lines.slice(lines.length - 1, 1);
        const columns = lines[0].split(';');
        // Models
        const models = [];
        for (let i = 4; i < columns.length; i++) {
          const model = {};
          for (let j = 1; j < lines.length - 1; j++) {
            model[lines[j].split(';')[0]] = lines[j].split(';')[i];
          }
          models.push(model);
        }
        this.models = models;
        // Fill arrays with options
        const availableOptions = {};
        const materials = [];
        const openingTypes = [];
        const innerColors = [];
        const glazingTypes = [];
        const outerMaterials = [];
        const outerColorFinishes = [];
        const coats = [];
        const dimensions = [];
        const extras = [];
        const handles = [];
        const ventilations = [];
        const technicalInformation = [];
        for (let i = 1; i < 2; i++) {
          for (let j = 2; j < lines.length - 1; j++) {
            availableOptions[lines[j].split(';')[0]] = lines[j].split(';')[1];
            if (lines[j].split(';')[1] === 'material') {
              materials.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'openingType') {
              openingTypes.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'innerColor') {
              innerColors.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'outerColorFinish') {
              outerColorFinishes.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'outerMaterial') {
              outerMaterials.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'glazing') {
              glazingTypes.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'coats') {
              coats.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'dimensions') {
              dimensions.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'extras') {
              extras.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'ventilation') {
              ventilations.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'handle') {
              handles.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'technical') {
              technicalInformation.push(lines[j].split(';')[0]);
            }
          }
        }
        this.availableOptions = availableOptions;
        this.materials = materials;
        this.openingTypes = openingTypes;
        this.innerColors = innerColors;
        this.glazingTypes = glazingTypes;
        this.coats = coats;
        this.dimensions = dimensions;
        this.extras = extras;
        this.handles = handles;
        this.ventialtions = ventilations;
        this.technicalInformation = technicalInformation;
        this.outerColor = require('../../assets/json/RalCodes.json') as [];
        this.outerColorFinishes = outerColorFinishes;
        this.outerMaterials = outerMaterials;
      }));
  }

  get availableOptions() {
    return this._availableOptions;
  }

  set availableOptions(value) {
    this._availableOptions = value;
  }

  get models() {
    return this._models;
  }

  set models(value) {
    this._models = value;
  }

  get modelsFilePath(): string {
    return this._modelsFilePath;
  }

  set modelsFilePath(value: string) {
    this._modelsFilePath = value;
  }

  get materials() {
    return this._materials;
  }

  set materials(value) {
    this._materials = value;
  }

  get openingTypes() {
    return this._openingTypes;
  }

  set openingTypes(value) {
    this._openingTypes = value;
  }

  get dimensions() {
    return this._dimensions;
  }

  set dimensions(value) {
    this._dimensions = value;
  }

  get innerColors() {
    return this._innerColors;
  }

  set innerColors(value) {
    this._innerColors = value;
  }

  get outerMaterials() {
    return this._outerMaterials;
  }

  set outerMaterials(value) {
    this._outerMaterials = value;
  }

  get outerColor() {
    return this._outerColor;
  }

  set outerColor(value) {
    this._outerColor = value;
  }

  get outerColorFinishes() {
    return this._outerColorFinishes;
  }

  set outerColorFinishes(value) {
    this._outerColorFinishes = value;
  }

  get glazingTypes() {
    return this._glazingTypes;
  }

  set glazingTypes(value) {
    this._glazingTypes = value;
  }

  get coats() {
    return this._coats;
  }

  set coats(value) {
    this._coats = value;
  }

  get extras() {
    return this._extras;
  }

  set extras(value) {
    this._extras = value;
  }

  get handles() {
    return this._handles;
  }

  set handles(value) {
    this._handles = value;
  }

  get ventialtions() {
    return this._ventialtions;
  }

  set ventialtions(value) {
    this._ventialtions = value;
  }

  get technicalInformation() {
    return this._technicalInformation;
  }

  set technicalInformation(value) {
    this._technicalInformation = value;
  }
}
