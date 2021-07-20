import {Flashing} from './flashing';

export class FlashingKombi {
  private _flashing: Flashing[];
  private _numberOfFlashings: number;
  private _flashingCombinationCode: string;
  private _flashingName: string;
  private _localizationInCombination: string;
  private _oblachowanieMaterial: string;
  private _oblachowanieKolor: string;
  private _oblachowanieFinisz: string;
  private _typKolnierza: string;
  private _CenaDetaliczna: number;
  private _wiatrownicaDlugosc: number;
  private _typFartucha: string;
  private _flashingTileHeight: number;

  // tslint:disable-next-line:max-line-length
  constructor(flashing: Flashing[], numberOfFlashings: number, flashingCombinationCode: string, flashingName: string, localizationInCombination: string, oblachowanieMaterial: string, oblachowanieKolor: string, oblachowanieFinisz: string, typKolnierza: string, CenaDetaliczna: number, wiatrownicaDlugosc: number, typFartucha: string, flashingTileHeight: number) {
    this._flashing = flashing;
    this._numberOfFlashings = numberOfFlashings;
    this._flashingCombinationCode = flashingCombinationCode;
    this._flashingName = flashingName;
    this._localizationInCombination = localizationInCombination;
    this._oblachowanieMaterial = oblachowanieMaterial;
    this._oblachowanieKolor = oblachowanieKolor;
    this._oblachowanieFinisz = oblachowanieFinisz;
    this._typKolnierza = typKolnierza;
    this._CenaDetaliczna = CenaDetaliczna;
    this._wiatrownicaDlugosc = wiatrownicaDlugosc;
    this._typFartucha = typFartucha;
    this._flashingTileHeight = flashingTileHeight;
  }

  get flashing(): Flashing[] {
    return this._flashing;
  }

  set flashing(value: Flashing[]) {
    this._flashing = value;
  }

  get numberOfFlashings(): number {
    return this._numberOfFlashings;
  }

  set numberOfFlashings(value: number) {
    this._numberOfFlashings = value;
  }

  get flashingCombinationCode(): string {
    return this._flashingCombinationCode;
  }

  set flashingCombinationCode(value: string) {
    this._flashingCombinationCode = value;
  }

  get flashingName(): string {
    return this._flashingName;
  }

  set flashingName(value: string) {
    this._flashingName = value;
  }

  get localizationInCombination(): string {
    return this._localizationInCombination;
  }

  set localizationInCombination(value: string) {
    this._localizationInCombination = value;
  }

  get oblachowanieMaterial(): string {
    return this._oblachowanieMaterial;
  }

  set oblachowanieMaterial(value: string) {
    this._oblachowanieMaterial = value;
  }

  get oblachowanieKolor(): string {
    return this._oblachowanieKolor;
  }

  set oblachowanieKolor(value: string) {
    this._oblachowanieKolor = value;
  }

  get oblachowanieFinisz(): string {
    return this._oblachowanieFinisz;
  }

  set oblachowanieFinisz(value: string) {
    this._oblachowanieFinisz = value;
  }

  get typKolnierza(): string {
    return this._typKolnierza;
  }

  set typKolnierza(value: string) {
    this._typKolnierza = value;
  }

  get CenaDetaliczna(): number {
    return this._CenaDetaliczna;
  }

  set CenaDetaliczna(value: number) {
    this._CenaDetaliczna = value;
  }

  get wiatrownicaDlugosc(): number {
    return this._wiatrownicaDlugosc;
  }

  set wiatrownicaDlugosc(value: number) {
    this._wiatrownicaDlugosc = value;
  }

  get typFartucha(): string {
    return this._typFartucha;
  }

  set typFartucha(value: string) {
    this._typFartucha = value;
  }

  get flashingTileHeight(): number {
    return this._flashingTileHeight;
  }

  set flashingTileHeight(value: number) {
    this._flashingTileHeight = value;
  }
}
