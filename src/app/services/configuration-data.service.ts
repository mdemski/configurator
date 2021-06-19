import {Injectable} from '@angular/core';
import {CsvFileReaderService} from './csv-file-reader.service';
import {map} from 'rxjs/operators';
import {GlazingType} from '../models/glazing-type';
import {ExclusionsModel} from '../models/exclusions-model';
import {ErpNameTranslatorService} from './erp-name-translator.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationDataService {
  private _modelsFilePath = '../../../assets/csv/roof-windows.csv';
  private _glazingFilePath = '../../../assets/csv/translator-pakietow-szybowych.csv';
  private _roofWindowsExclusionsFilePath = '../../../assets/csv/roof-windows-exclusions.csv';
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
  private _handleColors;
  private _ventialtions;
  private _extras;
  private _technicalInformation;
  private _glazings;

  constructor(private csv: CsvFileReaderService, private erpTranslator: ErpNameTranslatorService) {
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
        for (let i = 3; i < columns.length; i++) {
          const model = {
            windowModel: lines[0].split(';')[i]
          };
          for (let j = 1; j < lines.length - 1; j++) {
            model[lines[j].split(';')[0]] = lines[j].split(';')[i];
          }
          models.push(model);
        }
        this.models = models;
        // Fill arrays with options
        const availableOptions = [];
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
        const handleColors = [];
        const ventilations = [];
        const technicalInformation = [];
        for (let i = 1; i < 2; i++) {
          for (let j = 1; j < lines.length - 1; j++) {
            availableOptions.push(lines[j].split(';')[0]);
            // availableOptions[lines[j].split(';')[0]] = lines[j].split(';')[1];
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
            if (lines[j].split(';')[1] === 'handleColor') {
              handleColors.push(lines[j].split(';')[0]);
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
        this.handleColors = handleColors;
        this.ventialtions = ventilations;
        this.technicalInformation = technicalInformation;
        // TODO uzupełnić listę o dostępne kolory
        // this.outerColor = require('../../assets/json/RalCodes.json') as [];
        this.outerColor = ['Aluminium:RAL7022'];
        this.outerColorFinishes = outerColorFinishes;
        this.outerMaterials = outerMaterials;
      }));
  }

  fetchAllGlazingConfigurations() {
    return this.csv.getCSVData(this._glazingFilePath).pipe(
      map(data => {
        const arrayWithGlazingModels: GlazingType[] = [];
        const lines = [];
        const linesArray = data.split('\n');
        linesArray.forEach((e: any) => {
          // TODO jak usunąć puste linie???
          const row = e.replace(/[\s]+[;]+|[;]+[\s]+/g, ';').trim();
          lines.push(row);
        });
        lines.slice(lines.length - 1, 1);
        const glazingModelNames = lines[0].split(';'); // zwaraca nazwy pakietów
        for (let i = 1; i < glazingModelNames.length; i++) {
          const tempGlazingModel: GlazingType = new GlazingType(
            null, false, false, false, false, false, false,
            false, false, false, false, false, false, false,
            false, 1.0, 'argon', 'okno');
          for (let j = 0; j < lines.length - 1; j++) {
            // lines[j].split(';')[0] // zwraca pierwszą kolumnę z nazwami wartości
            // lines[j].split(';')[i] // zwraca wartości z kolejnych kolumn oprócz pierwszej
            if (lines[j].split(';')[i] === 'TAK') {
              tempGlazingModel[lines[j].split(';')[0]] = true;
            } else if (lines[j].split(';')[i] === 'NIE') {
              tempGlazingModel[lines[j].split(';')[0]] = false;
            } else {
              if (!isNaN(+lines[j].split(';')[i])) {
                tempGlazingModel[lines[j].split(';')[0]] = Number.parseFloat(lines[j].split(';')[i]);
              } else {
                tempGlazingModel[lines[j].split(';')[0]] = lines[j].split(';')[i];
              }
            }
          }
          arrayWithGlazingModels.push(tempGlazingModel);
        }
        return arrayWithGlazingModels;
      }));
  }

  fetchAllExclusions() {
    return this.csv.getCSVData(this._roofWindowsExclusionsFilePath).pipe(
      map(data => {
        const lines = [];
        const linesArray = data.split('\n');
        linesArray.forEach((e: any) => {
          // TODO jak usunąć puste linie???
          const row = e.replace(/[\s]+[;]+|[;]+[\s]+/g, ';').trim();
          lines.push(row);
        });
        lines.slice(lines.length - 1, 1);
        const columns = lines[0].split(';');
        // tslint:disable-next-line:max-line-length
        const woodenExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const PVCExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const centrePivotExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const topHungExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const fipExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const lShapedFipExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const lShapedUExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const lShapedPVCFixExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const lShapedPVCUExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const lShapedPVCURLExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const lShapedPVCURPExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const electricSwitchExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const electricPilotExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const topPivotExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const colorlessExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const whitePaintExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const whitePVCExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const aluminiumExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const copperExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const titanExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const semiMatExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const matExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const glossExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const naturalExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const ralExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const naturalColorExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const doubleGlazingExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const tripleGlazingExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const kryptonGlazingExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const externalToughenedExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const internalToughenedExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const sunGuardExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const bioCleanExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const matGlassExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const noiseReductionExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const laminatedP1Exclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const laminatedP2Exclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const laminatedP4Exclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const extraSecureExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const unoExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const solarEngineExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const closure7048Exclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const closure9016Exclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const neoVentExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const neoCoverExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        // tslint:disable-next-line:max-line-length
        const latchExclusions: ExclusionsModel = new ExclusionsModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);

        for (let i = 1; i < columns.length; i++) {
          for (let j = 2; j < lines.length - 1; j++) {
            // lines[j].split(';')[0] // zwraca pierwszą kolumnę z nazwami wartości
            // lines[j].split(';')[i] // zwraca wartości z kolejnych kolumn oprócz pierwszej
            const firstPartName = this.erpTranslator.translatePropertyNamesERP(lines[j].split(';')[0]).firstPart;
            const secondPartName = this.erpTranslator.translatePropertyNamesERP(lines[j].split(';')[0]).secondPart;
            const fullName = String(firstPartName + secondPartName);
            if (i === 1 && lines[j].split(';')[i] === 'TRUE') {
              woodenExclusions[fullName] = true;
            }
            if (i === 2 && lines[j].split(';')[i] === 'TRUE') {
              PVCExclusions[fullName] = true;
            }
            if (i === 3 && lines[j].split(';')[i] === 'TRUE') {
              centrePivotExclusions[fullName] = true;
            }
            if (i === 4 && lines[j].split(';')[i] === 'TRUE') {
              topHungExclusions[fullName] = true;
            }
            if (i === 5 && lines[j].split(';')[i] === 'TRUE') {
              fipExclusions[fullName] = true;
            }
            if (i === 6 && lines[j].split(';')[i] === 'TRUE') {
              lShapedFipExclusions[fullName] = true;
            }
            if (i === 7 && lines[j].split(';')[i] === 'TRUE') {
              lShapedUExclusions[fullName] = true;
            }
            if (i === 8 && lines[j].split(';')[i] === 'TRUE') {
              lShapedPVCFixExclusions[fullName] = true;
            }
            if (i === 9 && lines[j].split(';')[i] === 'TRUE') {
              lShapedPVCUExclusions[fullName] = true;
            }
            if (i === 10 && lines[j].split(';')[i] === 'TRUE') {
              lShapedPVCURLExclusions[fullName] = true;
            }
            if (i === 11 && lines[j].split(';')[i] === 'TRUE') {
              lShapedPVCURPExclusions[fullName] = true;
            }
            if (i === 12 && lines[j].split(';')[i] === 'TRUE') {
              electricSwitchExclusions[fullName] = true;
            }
            if (i === 13 && lines[j].split(';')[i] === 'TRUE') {
              electricPilotExclusions[fullName] = true;
            }
            if (i === 14 && lines[j].split(';')[i] === 'TRUE') {
              topPivotExclusions[fullName] = true;
            }
            if (i === 15 && lines[j].split(';')[i] === 'TRUE') {
              colorlessExclusions[fullName] = true;
            }
            if (i === 16 && lines[j].split(';')[i] === 'TRUE') {
              whitePaintExclusions[fullName] = true;
            }
            if (i === 17 && lines[j].split(';')[i] === 'TRUE') {
              whitePVCExclusions[fullName] = true;
            }
            if (i === 18 && lines[j].split(';')[i] === 'TRUE') {
              aluminiumExclusions[fullName] = true;
            }
            if (i === 19 && lines[j].split(';')[i] === 'TRUE') {
              copperExclusions[fullName] = true;
            }
            if (i === 20 && lines[j].split(';')[i] === 'TRUE') {
              titanExclusions[fullName] = true;
            }
            if (i === 21 && lines[j].split(';')[i] === 'TRUE') {
              semiMatExclusions[fullName] = true;
            }
            if (i === 22 && lines[j].split(';')[i] === 'TRUE') {
              matExclusions[fullName] = true;
            }
            if (i === 23 && lines[j].split(';')[i] === 'TRUE') {
              glossExclusions[fullName] = true;
            }
            if (i === 24 && lines[j].split(';')[i] === 'TRUE') {
              naturalExclusions[fullName] = true;
            }
            if (i === 25 && lines[j].split(';')[i] === 'TRUE') {
              ralExclusions[fullName] = true;
            }
            if (i === 26 && lines[j].split(';')[i] === 'TRUE') {
              naturalColorExclusions[fullName] = true;
            }
            if (i === 27 && lines[j].split(';')[i] === 'TRUE') {
              naturalColorExclusions[fullName] = true;
            }
            if (i === 28 && lines[j].split(';')[i] === 'TRUE') {
              doubleGlazingExclusions[fullName] = true;
            }
            if (i === 29 && lines[j].split(';')[i] === 'TRUE') {
              tripleGlazingExclusions[fullName] = true;
            }
            if (i === 30 && lines[j].split(';')[i] === 'TRUE') {
              kryptonGlazingExclusions[fullName] = true;
            }
            if (i === 31 && lines[j].split(';')[i] === 'TRUE') {
              externalToughenedExclusions[fullName] = true;
            }
            if (i === 32 && lines[j].split(';')[i] === 'TRUE') {
              internalToughenedExclusions[fullName] = true;
            }
            if (i === 33 && lines[j].split(';')[i] === 'TRUE') {
              sunGuardExclusions[fullName] = true;
            }
            if (i === 34 && lines[j].split(';')[i] === 'TRUE') {
              bioCleanExclusions[fullName] = true;
            }
            if (i === 35 && lines[j].split(';')[i] === 'TRUE') {
              matGlassExclusions[fullName] = true;
            }
            if (i === 36 && lines[j].split(';')[i] === 'TRUE') {
              noiseReductionExclusions[fullName] = true;
            }
            if (i === 37 && lines[j].split(';')[i] === 'TRUE') {
              laminatedP1Exclusions[fullName] = true;
            }
            if (i === 38 && lines[j].split(';')[i] === 'TRUE') {
              laminatedP2Exclusions[fullName] = true;
            }
            if (i === 39 && lines[j].split(';')[i] === 'TRUE') {
              laminatedP4Exclusions[fullName] = true;
            }
            if (i === 40 && lines[j].split(';')[i] === 'TRUE') {
              extraSecureExclusions[fullName] = true;
            }
            if (i === 41 && lines[j].split(';')[i] === 'TRUE') {
              unoExclusions[fullName] = true;
            }
            if (i === 42 && lines[j].split(';')[i] === 'TRUE') {
              solarEngineExclusions[fullName] = true;
            }
            if (i === 43 && lines[j].split(';')[i] === 'TRUE') {
              closure7048Exclusions[fullName] = true;
            }
            if (i === 44 && lines[j].split(';')[i] === 'TRUE') {
              closure9016Exclusions[fullName] = true;
            }
            if (i === 45 && lines[j].split(';')[i] === 'TRUE') {
              neoVentExclusions[fullName] = true;
            }
            if (i === 46 && lines[j].split(';')[i] === 'TRUE') {
              neoCoverExclusions[fullName] = true;
            }
            if (i === 47 && lines[j].split(';')[i] === 'TRUE') {
              latchExclusions[fullName] = true;
            }
          }
        }
        // tslint:disable-next-line:max-line-length
        return [woodenExclusions, PVCExclusions, centrePivotExclusions, topHungExclusions, fipExclusions, lShapedFipExclusions, lShapedUExclusions, lShapedPVCFixExclusions, lShapedPVCUExclusions, lShapedPVCURLExclusions, lShapedPVCURPExclusions, electricSwitchExclusions, electricPilotExclusions, topPivotExclusions, colorlessExclusions, whitePaintExclusions, whitePVCExclusions, aluminiumExclusions, copperExclusions, titanExclusions, semiMatExclusions, matExclusions, glossExclusions, naturalExclusions, ralExclusions, naturalColorExclusions, doubleGlazingExclusions, tripleGlazingExclusions, kryptonGlazingExclusions, externalToughenedExclusions, internalToughenedExclusions, sunGuardExclusions, bioCleanExclusions, matGlassExclusions, noiseReductionExclusions, laminatedP1Exclusions, laminatedP2Exclusions, laminatedP4Exclusions, extraSecureExclusions, unoExclusions, solarEngineExclusions, closure7048Exclusions, closure9016Exclusions, neoVentExclusions, neoCoverExclusions, latchExclusions];
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

  get handleColors() {
    return this._handleColors;
  }

  set handleColors(value) {
    this._handleColors = value;
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

  get glazings() {
    return this._glazings;
  }

  set glazings(value) {
    this._glazings = value;
  }
}
