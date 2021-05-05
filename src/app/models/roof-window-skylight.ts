export class RoofWindowSkylight {
  private _kod: string;
  private _nazwaPozycjiPL: string;
  private _windowName: string;
  private _indeksAlgorytm: string;
  private _nazwaPLAlgorytm: string;
  private _status: string;
  private _model: string;
  private _pakietSzybowy: string;
  private _glazingToCalculation: string;
  private _szerokosc: number;
  private _wysokosc: number;
  private _grupaAsortymentowa: string;
  private _typ: string;
  private _geometria: string;
  private _rodzaj: string;
  private _otwieranie: string;
  private _wentylacja: string;
  private _stolarkaMaterial: string;
  private _stolarkaKolor: string;
  private _rodzina: string;
  private _oblachowanieMaterial: string;
  private _oblachowanieKolor: string;
  private _oblachowanieFinisz: string;
  private _zamkniecieTyp: string;
  private _zamkniecieKolor: string;
  private _windowHardware: boolean;
  private _uszczelki: number;
  private _dostepneRozmiary: any[];
  private _windowCoats: any[];
  private _linkiDoZdjec: string[];
  private _listaDodatkow: any[];
  private _CenaDetaliczna: number;
  private _windowUW: number;
  private _windowUG: number;
  private _iloscSprzedanychRok: number;
  private _kolorTworzywWew: string;
  private _kolorTworzywZew: string;
  private _okucia: string;
  private _numberOfGlasses: number;

  // tslint:disable-next-line:max-line-length
  constructor(kod: string, nazwaPozycjiPL: string, windowName: string, indeksAlgorytm: string, nazwaPLAlgorytm: string, status: string, model: string, pakietSzybowy: string, glazingToCalculation, szerokosc: number, wysokosc: number, grupaAsortymentowa: string, typ: string, geometria: string, rodzaj: string, otwieranie: string, wentylacja: string, stolarkaMaterial: string, stolarkaKolor: string, rodzina: string, oblachowanieMaterial: string, oblachowanieKolor: string, oblachowanieFinisz: string, zamkniecieTyp: string, zamkniecieKolor: string, windowHardware: boolean, uszczelki: number, dostepneRozmiary: any[], windowCoats: any[], linkiDoZdjec: string[], listaDodatkow: any[], CenaDetaliczna: number, windowUW: number, windowUG: number, iloscSprzedanychRok: number, kolorTworzywWew: string, kolorTworzywZew: string, okucia: string, numberOfGlasses: number) {
    this._kod = kod;
    this._nazwaPozycjiPL = nazwaPozycjiPL;
    this._windowName = windowName;
    this._indeksAlgorytm = indeksAlgorytm;
    this._nazwaPLAlgorytm = nazwaPLAlgorytm;
    this._status = status;
    this._model = model;
    this._pakietSzybowy = pakietSzybowy;
    this._glazingToCalculation = glazingToCalculation;
    this._szerokosc = szerokosc;
    this._wysokosc = wysokosc;
    this._grupaAsortymentowa = grupaAsortymentowa;
    this._typ = typ;
    this._geometria = geometria;
    this._rodzaj = rodzaj;
    this._otwieranie = otwieranie;
    this._wentylacja = wentylacja;
    this._stolarkaMaterial = stolarkaMaterial;
    this._stolarkaKolor = stolarkaKolor;
    this._rodzina = rodzina;
    this._oblachowanieMaterial = oblachowanieMaterial;
    this._oblachowanieKolor = oblachowanieKolor;
    this._oblachowanieFinisz = oblachowanieFinisz;
    this._zamkniecieTyp = zamkniecieTyp;
    this._zamkniecieKolor = zamkniecieKolor;
    this._windowHardware = windowHardware;
    this._uszczelki = uszczelki;
    this._dostepneRozmiary = dostepneRozmiary;
    this._linkiDoZdjec = linkiDoZdjec;
    this._listaDodatkow = listaDodatkow;
    this._CenaDetaliczna = CenaDetaliczna;
    this._windowUW = windowUW;
    this._windowUG = windowUG;
    this._windowCoats = windowCoats;
    this._iloscSprzedanychRok = iloscSprzedanychRok;
    this._kolorTworzywWew = kolorTworzywWew;
    this._kolorTworzywZew = kolorTworzywZew;
    this._okucia = okucia;
    this._numberOfGlasses = numberOfGlasses;
  }


  get kod(): string {
    return this._kod;
  }

  set kod(value: string) {
    this._kod = value;
  }

  get indeksAlgorytm(): string {
    return this._indeksAlgorytm;
  }

  set indeksAlgorytm(value: string) {
    this._indeksAlgorytm = value;
  }

  get nazwaPozycjiPL(): string {
    return this._nazwaPozycjiPL;
  }

  set nazwaPozycjiPL(value: string) {
    this._nazwaPozycjiPL = value;
  }

  get nazwaPLAlgorytm(): string {
    return this._nazwaPLAlgorytm;
  }

  set nazwaPLAlgorytm(value: string) {
    this._nazwaPLAlgorytm = value;
  }

  get windowName(): string {
    return this._windowName;
  }

  set windowName(value: string) {
    this._windowName = value;
  }

  get model(): string {
    return this._model;
  }

  set model(value: string) {
    this._model = value;
  }

  get pakietSzybowy(): string {
    return this._pakietSzybowy;
  }

  set pakietSzybowy(value: string) {
    this._pakietSzybowy = value;
  }

  get glazingToCalculation(): string {
    return this._glazingToCalculation;
  }

  set glazingToCalculation(value: string) {
    this._glazingToCalculation = value;
  }

  get szerokosc(): number {
    return this._szerokosc;
  }

  set szerokosc(value: number) {
    this._szerokosc = value;
  }

  get wysokosc(): number {
    return this._wysokosc;
  }

  set wysokosc(value: number) {
    this._wysokosc = value;
  }

  get grupaAsortymentowa(): string {
    return this._grupaAsortymentowa;
  }

  set grupaAsortymentowa(value: string) {
    this._grupaAsortymentowa = value;
  }

  get typ(): string {
    return this._typ;
  }

  set typ(value: string) {
    this._typ = value;
  }

  get geometria(): string {
    return this._geometria;
  }

  set geometria(value: string) {
    this._geometria = value;
  }

  get rodzaj(): string {
    return this._rodzaj;
  }

  set rodzaj(value: string) {
    this._rodzaj = value;
  }

  get otwieranie(): string {
    return this._otwieranie;
  }

  set otwieranie(value: string) {
    this._otwieranie = value;
  }

  get wentylacja(): string {
    return this._wentylacja;
  }

  set wentylacja(value: string) {
    this._wentylacja = value;
  }

  get stolarkaMaterial(): string {
    return this._stolarkaMaterial;
  }

  set stolarkaMaterial(value: string) {
    this._stolarkaMaterial = value;
  }

  get stolarkaKolor(): string {
    return this._stolarkaKolor;
  }

  set stolarkaKolor(value: string) {
    this._stolarkaKolor = value;
  }

  get rodzina(): string {
    return this._rodzina;
  }

  set rodzina(value: string) {
    this._rodzina = value;
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

  get zamkniecieTyp(): string {
    return this._zamkniecieTyp;
  }

  set zamkniecieTyp(value: string) {
    this._zamkniecieTyp = value;
  }

  get zamkniecieKolor(): string {
    return this._zamkniecieKolor;
  }

  set zamkniecieKolor(value: string) {
    this._zamkniecieKolor = value;
  }

  get windowHardware(): boolean {
    return this._windowHardware;
  }

  set windowHardware(value: boolean) {
    this._windowHardware = value;
  }

  get uszczelki(): number {
    return this._uszczelki;
  }

  set uszczelki(value: number) {
    this._uszczelki = value;
  }

  get dostepneRozmiary(): any[] {
    return this._dostepneRozmiary;
  }

  set dostepneRozmiary(value: any[]) {
    this._dostepneRozmiary = value;
  }

  get windowCoats(): any[] {
    return this._windowCoats;
  }

  set windowCoats(value: any[]) {
    this._windowCoats = value;
  }

  get linkiDoZdjec(): string[] {
    return this._linkiDoZdjec;
  }

  set linkiDoZdjec(value: string[]) {
    this._linkiDoZdjec = value;
  }

  get listaDodatkow(): any[] {
    return this._listaDodatkow;
  }

  set listaDodatkow(value: any[]) {
    this._listaDodatkow = value;
  }

  get CenaDetaliczna(): number {
    return this._CenaDetaliczna;
  }

  set CenaDetaliczna(value: number) {
    this._CenaDetaliczna = value;
  }

  get windowUW(): number {
    return this._windowUW;
  }

  set windowUW(value: number) {
    this._windowUW = value;
  }

  get windowUG(): number {
    return this._windowUG;
  }

  set windowUG(value: number) {
    this._windowUG = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get iloscSprzedanychRok(): number {
    return this._iloscSprzedanychRok;
  }

  set iloscSprzedanychRok(value: number) {
    this._iloscSprzedanychRok = value;
  }

  get kolorTworzywWew(): string {
    return this._kolorTworzywWew;
  }

  set kolorTworzywWew(value: string) {
    this._kolorTworzywWew = value;
  }

  get kolorTworzywZew(): string {
    return this._kolorTworzywZew;
  }

  set kolorTworzywZew(value: string) {
    this._kolorTworzywZew = value;
  }

  get okucia(): string {
    return this._okucia;
  }

  set okucia(value: string) {
    this._okucia = value;
  }

  get numberOfGlasses(): number {
    return this._numberOfGlasses;
  }

  set numberOfGlasses(value: number) {
    this._numberOfGlasses = value;
  }
}
