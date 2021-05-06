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


  public get kod(): string {
    return this._kod;
  }

  public set kod(value: string) {
    this._kod = value;
  }

  public get indeksAlgorytm(): string {
    return this._indeksAlgorytm;
  }

  public set indeksAlgorytm(value: string) {
    this._indeksAlgorytm = value;
  }

  public get nazwaPozycjiPL(): string {
    return this._nazwaPozycjiPL;
  }

  public set nazwaPozycjiPL(value: string) {
    this._nazwaPozycjiPL = value;
  }

  public get nazwaPLAlgorytm(): string {
    return this._nazwaPLAlgorytm;
  }

  public set nazwaPLAlgorytm(value: string) {
    this._nazwaPLAlgorytm = value;
  }

  public get windowName(): string {
    return this._windowName;
  }

  public set windowName(value: string) {
    this._windowName = value;
  }

  public get model(): string {
    return this._model;
  }

  public set model(value: string) {
    this._model = value;
  }

  public get pakietSzybowy(): string {
    return this._pakietSzybowy;
  }

  public set pakietSzybowy(value: string) {
    this._pakietSzybowy = value;
  }

  public get glazingToCalculation(): string {
    return this._glazingToCalculation;
  }

  public set glazingToCalculation(value: string) {
    this._glazingToCalculation = value;
  }

  public get szerokosc(): number {
    return this._szerokosc;
  }

  public set szerokosc(value: number) {
    this._szerokosc = value;
  }

  public get wysokosc(): number {
    return this._wysokosc;
  }

  public set wysokosc(value: number) {
    this._wysokosc = value;
  }

  public get grupaAsortymentowa(): string {
    return this._grupaAsortymentowa;
  }

  public set grupaAsortymentowa(value: string) {
    this._grupaAsortymentowa = value;
  }

  public get typ(): string {
    return this._typ;
  }

  public set typ(value: string) {
    this._typ = value;
  }

  public get geometria(): string {
    return this._geometria;
  }

  public set geometria(value: string) {
    this._geometria = value;
  }

  public get rodzaj(): string {
    return this._rodzaj;
  }

  public set rodzaj(value: string) {
    this._rodzaj = value;
  }

  public get otwieranie(): string {
    return this._otwieranie;
  }

  public set otwieranie(value: string) {
    this._otwieranie = value;
  }

  public get wentylacja(): string {
    return this._wentylacja;
  }

  public set wentylacja(value: string) {
    this._wentylacja = value;
  }

  public get stolarkaMaterial(): string {
    return this._stolarkaMaterial;
  }

  public set stolarkaMaterial(value: string) {
    this._stolarkaMaterial = value;
  }

  public get stolarkaKolor(): string {
    return this._stolarkaKolor;
  }

  public set stolarkaKolor(value: string) {
    this._stolarkaKolor = value;
  }

  public get rodzina(): string {
    return this._rodzina;
  }

  public set rodzina(value: string) {
    this._rodzina = value;
  }

  public get oblachowanieMaterial(): string {
    return this._oblachowanieMaterial;
  }

  public set oblachowanieMaterial(value: string) {
    this._oblachowanieMaterial = value;
  }

  public get oblachowanieKolor(): string {
    return this._oblachowanieKolor;
  }

  public set oblachowanieKolor(value: string) {
    this._oblachowanieKolor = value;
  }

  public get oblachowanieFinisz(): string {
    return this._oblachowanieFinisz;
  }

  public set oblachowanieFinisz(value: string) {
    this._oblachowanieFinisz = value;
  }

  public get zamkniecieTyp(): string {
    return this._zamkniecieTyp;
  }

  public set zamkniecieTyp(value: string) {
    this._zamkniecieTyp = value;
  }

  public get zamkniecieKolor(): string {
    return this._zamkniecieKolor;
  }

  public set zamkniecieKolor(value: string) {
    this._zamkniecieKolor = value;
  }

  public get windowHardware(): boolean {
    return this._windowHardware;
  }

  public set windowHardware(value: boolean) {
    this._windowHardware = value;
  }

  public get uszczelki(): number {
    return this._uszczelki;
  }

  public set uszczelki(value: number) {
    this._uszczelki = value;
  }

  public get dostepneRozmiary(): any[] {
    return this._dostepneRozmiary;
  }

  public set dostepneRozmiary(value: any[]) {
    this._dostepneRozmiary = value;
  }

  public get windowCoats(): any[] {
    return this._windowCoats;
  }

  public set windowCoats(value: any[]) {
    this._windowCoats = value;
  }

  public get linkiDoZdjec(): string[] {
    return this._linkiDoZdjec;
  }

  public set linkiDoZdjec(value: string[]) {
    this._linkiDoZdjec = value;
  }

  public get listaDodatkow(): any[] {
    return this._listaDodatkow;
  }

  public set listaDodatkow(value: any[]) {
    this._listaDodatkow = value;
  }

  public get CenaDetaliczna(): number {
    return this._CenaDetaliczna;
  }

  public set CenaDetaliczna(value: number) {
    this._CenaDetaliczna = value;
  }

  public get windowUW(): number {
    return this._windowUW;
  }

  public set windowUW(value: number) {
    this._windowUW = value;
  }

  public get windowUG(): number {
    return this._windowUG;
  }

  public set windowUG(value: number) {
    this._windowUG = value;
  }

  public get status(): string {
    return this._status;
  }

  public set status(value: string) {
    this._status = value;
  }

  public get iloscSprzedanychRok(): number {
    return this._iloscSprzedanychRok;
  }

  public set iloscSprzedanychRok(value: number) {
    this._iloscSprzedanychRok = value;
  }

  public get kolorTworzywWew(): string {
    return this._kolorTworzywWew;
  }

  public set kolorTworzywWew(value: string) {
    this._kolorTworzywWew = value;
  }

  public get kolorTworzywZew(): string {
    return this._kolorTworzywZew;
  }

  public set kolorTworzywZew(value: string) {
    this._kolorTworzywZew = value;
  }

  public get okucia(): string {
    return this._okucia;
  }

  public set okucia(value: string) {
    this._okucia = value;
  }

  public get numberOfGlasses(): number {
    return this._numberOfGlasses;
  }

  public set numberOfGlasses(value: number) {
    this._numberOfGlasses = value;
  }
}
