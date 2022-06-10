import {Injectable} from '@angular/core';
import {CsvFileReaderService} from './csv-file-reader.service';
import {map} from 'rxjs/operators';
import {GlazingType} from '../models/glazing-type';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationDataService {
  private _windowModelsFilePath = '../../../assets/csv/roof-windows.csv';
  private _flashingModelsFilePath = '../../../assets/csv/flashings.csv';
  private _accessoryModelsFilePath = '../../../assets/csv/accessories.csv';
  private _flatRoofWindowModelsFilePath = '../../../assets/csv/flat-windows.csv';
  private _glazingFilePath = '../../../assets/csv/translator-pakietow-szybowych.csv';
  private _roofWindowsExclusionsFilePath = '../../../assets/csv/roof-windows-exclusions.csv';
  private _flashingsExclusionsFilePath = '../../../assets/csv/flashings-exclusions.csv';
  private _accessoriesExclusionsFilePath = '../../../assets/csv/accessories-exclusions.csv';
  private _flatRoofWindowsExclusionsFilePath = '../../../assets/csv/flat-windows-exclusions.csv';

  constructor(private csv: CsvFileReaderService) {
  }

  fetchAllWindowsData() {
    return this.csv.getCSVData(this._windowModelsFilePath)
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
        // this.models = models;
        // Fill arrays with options
        const availableOptions = [];
        const materials = [];
        const openingTypes = [];
        const innerColors = [];
        const glazingTypes = [];
        const outerMaterials = [];
        const outerColorFinishes = [];
        const outerColors = [];
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
            if (lines[j].split(';')[1] === 'outerColor') {
              outerColors.push(lines[j].split(';')[0]);
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
        return {
          models,
          availableOptions,
          materials,
          openingTypes,
          innerColors,
          glazingTypes,
          coats,
          dimensions,
          extras,
          handles,
          handleColors,
          ventilations,
          technicalInformation,
          outerColors,
          outerColorFinishes,
          outerMaterials
        };
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

  fetchAllWindowExclusions() {
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
        const exArray = [];
        for (let i = 1; i < columns.length; i++) {
          const tempExObject = {};
          for (let j = 0; j < lines.length - 1; j++) {
            Object.assign(tempExObject, {selectedOption: lines[i].split(';')[0]});
            tempExObject[lines[j].split(';')[0]] = lines[j].split(';')[i];
          }
          exArray.push(tempExObject);
        }
        return exArray;
      }));
  }

  fetchAllFlashingsData() {
    return this.csv.getCSVData(this._flashingModelsFilePath)
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
            flashingModel: lines[0].split(';')[i]
          };
          for (let j = 1; j < lines.length - 1; j++) {
            model[lines[j].split(';')[0]] = lines[j].split(';')[i];
          }
          models.push(model);
        }
        // Fill arrays with options
        const flashingTypes = [];
        const lShapeds = [];
        const availableOptions = [];
        const verticalSpacings = [];
        const horizontalSpacings = [];
        const outerMaterials = [];
        const outerColors = [];
        const outerColorFinishes = [];
        const dimensions = [];
        const apronTypes = [];
        const technicalInformation = [];
        for (let i = 1; i < 2; i++) {
          for (let j = 1; j < lines.length - 1; j++) {
            availableOptions.push(lines[j].split(';')[0]);
            if (lines[j].split(';')[1] === 'flashingType') {
              flashingTypes.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'lShaped') {
              lShapeds.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'verticalSpacing') {
              verticalSpacings.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'horizontalSpacing') {
              horizontalSpacings.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'outerColorFinish') {
              outerColorFinishes.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'outerMaterial') {
              outerMaterials.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'outerColor') {
              outerColors.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'apronType') {
              apronTypes.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'dimensions') {
              dimensions.push(dimensions[lines[j].split(';')[0]] = lines[j].split(';')[3]);
            }
            if (lines[j].split(';')[1] === 'technical') {
              technicalInformation.push(lines[j].split(';')[0]);
            }
          }
        }
        return {
          models,
          flashingTypes,
          lShapeds,
          availableOptions,
          verticalSpacings,
          horizontalSpacings,
          dimensions,
          apronTypes,
          technicalInformation,
          outerColors,
          outerColorFinishes,
          outerMaterials
        };
      }));
  }

  fetchAllFlashingExclusions() {
    return this.csv.getCSVData(this._flashingsExclusionsFilePath).pipe(
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
        const exArray = [];
        for (let i = 1; i < columns.length; i++) {
          const tempExObject = {};
          for (let j = 0; j < lines.length - 1; j++) {
            Object.assign(tempExObject, {selectedOption: lines[i].split(';')[0]});
            tempExObject[lines[j].split(';')[0]] = lines[j].split(';')[i];
          }
          exArray.push(tempExObject);
        }
        return exArray;
      }));
  }

  fetchAllAccessoriesData() {
    return this.csv.getCSVData(this._accessoryModelsFilePath)
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
            accessoryModel: lines[0].split(';')[i]
          };
          for (let j = 1; j < lines.length - 1; j++) {
            model[lines[j].split(';')[0]] = lines[j].split(';')[i];
          }
          models.push(model);
        }
        // Fill arrays with options
        const accessoryTypes = [];
        const accessoryKinds = [];
        const framesMatchings = [];
        const materials = [];
        const materialColors = [];
        const equipmentColors = [];
        const dimensions = [];
        for (let i = 1; i < 2; i++) {
          for (let j = 1; j < lines.length - 1; j++) {
            if (lines[j].split(';')[1] === 'accessoryType') {
              accessoryTypes.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'accessoryKind') {
              accessoryKinds.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'framesMatching') {
              framesMatchings.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'material') {
              materials.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'materialColor') {
              materialColors.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'equipmentColor') {
              equipmentColors.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'dimensions') {
              dimensions.push(dimensions[lines[j].split(';')[0]] = lines[j].split(';')[3]);
            }
          }
        }
        return {
          models,
          accessoryTypes,
          accessoryKinds,
          framesMatchings,
          materials,
          materialColors,
          equipmentColors,
          dimensions,
        };
      }));
  }

  fetchAllAccessoryExclusions() {
    return this.csv.getCSVData(this._accessoriesExclusionsFilePath).pipe(
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
        const exArray = [];
        for (let i = 1; i < columns.length; i++) {
          const tempExObject = {};
          for (let j = 0; j < lines.length - 1; j++) {
            Object.assign(tempExObject, {selectedOption: lines[i].split(';')[0]});
            tempExObject[lines[j].split(';')[0]] = lines[j].split(';')[i];
          }
          exArray.push(tempExObject);
        }
        return exArray;
      }));
  }

  fetchAllFlatRoofWindowsData() {
    return this.csv.getCSVData(this._flatRoofWindowModelsFilePath)
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
        // this.models = models;
        // Fill arrays with options
        const availableOptions = [];
        const openingTypes = [];
        const glazingTypes = [];
        const outerMaterials = [];
        const outerColors = [];
        const outerColorFinishes = [];
        const dimensions = [];
        const extras = [];
        const handles = [];
        const technicalInformation = [];
        for (let i = 1; i < 2; i++) {
          for (let j = 1; j < lines.length - 1; j++) {
            availableOptions.push(lines[j].split(';')[0]);
            if (lines[j].split(';')[1] === 'openingType') {
              openingTypes.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'outerColorFinish') {
              outerColorFinishes.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'outerMaterial') {
              outerMaterials.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'outerColor') {
              outerColors.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'glazing') {
              glazingTypes.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'dimensions') {
              dimensions.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'extras') {
              extras.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'handle') {
              handles.push(lines[j].split(';')[0]);
            }
            if (lines[j].split(';')[1] === 'technical') {
              technicalInformation.push(lines[j].split(';')[0]);
            }
          }
        }
        return {
          models,
          availableOptions,
          openingTypes,
          glazingTypes,
          dimensions,
          extras,
          handles,
          technicalInformation,
          outerColors,
          outerColorFinishes,
          outerMaterials
        };
      }));
  }

  fetchAllFlatRoofWindowExclusions() {
    return this.csv.getCSVData(this._flatRoofWindowsExclusionsFilePath).pipe(
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
        const exArray = [];
        for (let i = 1; i < columns.length; i++) {
          const tempExObject = {};
          for (let j = 0; j < lines.length - 1; j++) {
            Object.assign(tempExObject, {selectedOption: lines[i].split(';')[0]});
            tempExObject[lines[j].split(';')[0]] = lines[j].split(';')[i];
          }
          exArray.push(tempExObject);
        }
        return exArray;
      }));
  }
}
