import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {RoofWindowSkylight} from '../../models/roof-window-skylight';

@Component({
  selector: 'app-roof-windows-config',
  templateUrl: './roof-windows-config.component.html',
  styleUrls: ['./roof-windows-config.component.scss']
})
export class RoofWindowsConfigComponent implements OnInit {
  configuredWindow: RoofWindowSkylight;
  windowConfigurationForm: FormGroup;
  categories = [];
  windowModels = [];
  glazingUnits = [];
  ventilationTypes = [];

  constructor() {
  }

  ngOnInit(): void {
    this.windowConfigurationForm = new FormGroup({
      'category': new FormControl(this.getAllWindowCategories()[0], Validators.required),
      'model': new FormControl(this.getAllWindowModels()[0], Validators.required),
      'glazing': new FormControl(this.getAllGlazingUnits()[0], Validators.required),
      'height': new FormControl(118, [this.validateHeight.bind(this), Validators.required]),
      'width': new FormControl(78, [this.validateWidth.bind(this), Validators.required]),
      'innerColor': new FormControl('pane'),
      'outerColor': new FormControl('RAL7022'),
      'ventilation': new FormControl(this.getAllVentilations()[0], Validators.required)
    });
  }

  getAllWindowCategories() {
    // TODO wczytywanie z bazy danych lub z pliku excel
    // TODO wykorzystać mapę do sprawdzenia warunków czy kolumna model pokrywa
    // się z kategorią i tak dalej - wysokość z kolumną model
    return this.categories = ['okna obrotowe', 'okna na dach płaski', 'okna uchylno-przesuwne', 'okna wysokoosiowe'];
  }

  private getAllWindowModels() {
    return this.windowModels = ['ISO', 'PGX', 'IGK', 'IGW'];
  }

  private getAllGlazingUnits() {
    return this.glazingUnits = ['I22', 'E2', 'I6', 'A1'];
  }

  // TODO możliwe że będzie konieczny validator asynchroniczny wczytujący dane z bazy
  private validateHeight(control: FormControl): { [s: string]: boolean } {
    if (control.value > 160 && control.value < 98) {
      return {'roofWindowToHeight': true};
    } else {
      return null;
    }
  }

  private validateWidth(control: FormControl): { [s: string]: boolean } {
    if (control.value > 134 && control.value < 55) {
      return {'roofWindowToWidth': true};
    } else {
      return null;
    }
  }

  private validateSurface(): { [s: string]: boolean } {
    if (this.configuredWindow.windowWidth * this.configuredWindow.windowHeight > 12597) {
      return {'roofWindowToLarge': true};
    } else {
      return null;
    }
  }

  onSubmit() {
    console.log(this.windowConfigurationForm);
  }

  private getAllVentilations() {
    return this.ventilationTypes = ['Vent-AIR', 'bez nawiewnika'];
  }
}
