export class GlazingType {
  private _model: string;
  private _DrewnoSosna: boolean;
  private _PVC: boolean;
  private _dwuszybowy: boolean;
  private _trzyszybowy: boolean;
  private _trzyszybowyKrypton: boolean;
  private _zewnetrznaHartowana: boolean;
  private _wewnetrznaHartowana: boolean;
  private _sunGuard: boolean;
  private _bioClean: boolean;
  private _matowa: boolean;
  private _redukcjaHalasu: boolean;
  private _laminowanaP1: boolean;
  private _laminowanaP2: boolean;
  private _laminowanaP4: boolean;
  private _ug: number;
  private _gazSzlachetny: string;
  private _zastosowanie: string;


  constructor(model: string, DrewnoSosna: boolean, PVC: boolean, dwuszybowy: boolean, trzyszybowy: boolean, trzyszybowyKrypton: boolean, zewnetrznaHartowana: boolean, wewnetrznaHartowana: boolean, sunGuard: boolean, bioClean: boolean, matowa: boolean, redukcjaHalasu: boolean, laminowanaP1: boolean, laminowanaP2: boolean, laminowanaP4: boolean, ug: number, gazSzlachetny: string, zastosowanie: string) {
    this._model = model;
    this._DrewnoSosna = DrewnoSosna;
    this._PVC = PVC;
    this._dwuszybowy = dwuszybowy;
    this._trzyszybowy = trzyszybowy;
    this._trzyszybowyKrypton = trzyszybowyKrypton;
    this._zewnetrznaHartowana = zewnetrznaHartowana;
    this._wewnetrznaHartowana = wewnetrznaHartowana;
    this._sunGuard = sunGuard;
    this._bioClean = bioClean;
    this._matowa = matowa;
    this._redukcjaHalasu = redukcjaHalasu;
    this._laminowanaP1 = laminowanaP1;
    this._laminowanaP2 = laminowanaP2;
    this._laminowanaP4 = laminowanaP4;
    this._ug = ug;
    this._gazSzlachetny = gazSzlachetny;
    this._zastosowanie = zastosowanie;
  }

  get model(): string {
    return this._model;
  }

  set model(value: string) {
    this._model = value;
  }

  get DrewnoSosna(): boolean {
    return this._DrewnoSosna;
  }

  set DrewnoSosna(value: boolean) {
    this._DrewnoSosna = value;
  }

  get PVC(): boolean {
    return this._PVC;
  }

  set PVC(value: boolean) {
    this._PVC = value;
  }

  get dwuszybowy(): boolean {
    return this._dwuszybowy;
  }

  set dwuszybowy(value: boolean) {
    this._dwuszybowy = value;
  }

  get trzyszybowy(): boolean {
    return this._trzyszybowy;
  }

  set trzyszybowy(value: boolean) {
    this._trzyszybowy = value;
  }

  get trzyszybowyKrypton(): boolean {
    return this._trzyszybowyKrypton;
  }

  set trzyszybowyKrypton(value: boolean) {
    this._trzyszybowyKrypton = value;
  }

  get zewnetrznaHartowana(): boolean {
    return this._zewnetrznaHartowana;
  }

  set zewnetrznaHartowana(value: boolean) {
    this._zewnetrznaHartowana = value;
  }

  get wewnetrznaHartowana(): boolean {
    return this._wewnetrznaHartowana;
  }

  set wewnetrznaHartowana(value: boolean) {
    this._wewnetrznaHartowana = value;
  }

  get sunGuard(): boolean {
    return this._sunGuard;
  }

  set sunGuard(value: boolean) {
    this._sunGuard = value;
  }

  get bioClean(): boolean {
    return this._bioClean;
  }

  set bioClean(value: boolean) {
    this._bioClean = value;
  }

  get matowa(): boolean {
    return this._matowa;
  }

  set matowa(value: boolean) {
    this._matowa = value;
  }

  get redukcjaHalasu(): boolean {
    return this._redukcjaHalasu;
  }

  set redukcjaHalasu(value: boolean) {
    this._redukcjaHalasu = value;
  }

  get laminowanaP1(): boolean {
    return this._laminowanaP1;
  }

  set laminowanaP1(value: boolean) {
    this._laminowanaP1 = value;
  }

  get laminowanaP2(): boolean {
    return this._laminowanaP2;
  }

  set laminowanaP2(value: boolean) {
    this._laminowanaP2 = value;
  }

  get laminowanaP4(): boolean {
    return this._laminowanaP4;
  }

  set laminowanaP4(value: boolean) {
    this._laminowanaP4 = value;
  }

  get ug(): number {
    return this._ug;
  }

  set ug(value: number) {
    this._ug = value;
  }

  get gazSzlachetny(): string {
    return this._gazSzlachetny;
  }

  set gazSzlachetny(value: string) {
    this._gazSzlachetny = value;
  }

  get zastosowanie(): string {
    return this._zastosowanie;
  }

  set zastosowanie(value: string) {
    this._zastosowanie = value;
  }
}
