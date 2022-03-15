export class Accessory {
  private _kod: string;
  private _nazwaPozycjiPL: string;
  private _productName: string;
  private _indeksAlgorytm: string;
  private _nazwaPLAlgorytm: string;
  private _status: string;
  private _model: string;
  private _szerokosc: number;
  private _wysokosc: number;
  private _grupaAsortymentowa: string;
  private _typ: string;
  private _geometria: string;
  private _rodzaj: string;
  private _rodzina: string;
  private _dopasowanieRoletyDlugosc: string;
  private _dopasowanieRoletySzerokosc: string;
  private _typTkaniny: string;
  private _kolorTkaniny: string;
  private _kolorTworzywWew: string;
  private _roletyKolorOsprzetu: string; // kolor dodatków takich jak prowadnice
  private _accessoryHorizontalSpacing: number; // czy montowane dwa okna jedno pod drugim? Jeśli tak to y=25cm
  private _otwieranie: string;
  private _tabliczka: string;
  private _CenaDetaliczna: number;
  private _linkiDoZdjec: string[];
  private _dostepneRozmiary: string[];
  private _cennik: string;

  // tslint:disable-next-line:max-line-length
  constructor(kod: string, nazwaPozycjiPL: string, productName: string, indeksAlgorytm: string, nazwaPLAlgorytm: string, status: string, model: string, szerokosc: number, wysokosc: number, grupaAsortymentowa: string, typ: string, geometria: string, rodzaj: string, rodzina: string, dopasowanieRoletyDlugosc: string, dopasowanieRoletySzerokosc: string, typTkaniny: string, kolorTkaniny: string, kolorTworzywWew: string, roletyKolorOsprzetu: string, accessoryHorizontalSpacing: number, otwieranie: string, tabliczka: string, CenaDetaliczna: number, linkiDoZdjec: string[], dostepneRozmiary: string[], cennik: string) {
    this._kod = kod;
    this._nazwaPozycjiPL = nazwaPozycjiPL;
    this._productName = productName;
    this._indeksAlgorytm = indeksAlgorytm;
    this._nazwaPLAlgorytm = nazwaPLAlgorytm;
    this._status = status;
    this._model = model;
    this._szerokosc = szerokosc;
    this._wysokosc = wysokosc;
    this._grupaAsortymentowa = grupaAsortymentowa;
    this._typ = typ;
    this._geometria = geometria;
    this._rodzaj = rodzaj;
    this._rodzina = rodzina;
    this._dopasowanieRoletyDlugosc = dopasowanieRoletyDlugosc;
    this._dopasowanieRoletySzerokosc = dopasowanieRoletySzerokosc;
    this._typTkaniny = typTkaniny;
    this._kolorTkaniny = kolorTkaniny;
    this._kolorTworzywWew = kolorTworzywWew;
    this._roletyKolorOsprzetu = roletyKolorOsprzetu;
    this._accessoryHorizontalSpacing = accessoryHorizontalSpacing;
    this._otwieranie = otwieranie;
    this._tabliczka = tabliczka;
    this._CenaDetaliczna = CenaDetaliczna;
    this._linkiDoZdjec = linkiDoZdjec;
    this._dostepneRozmiary = dostepneRozmiary;
    this._cennik = cennik;
  }

  get kod(): string {
    return this._kod;
  }

  set kod(value: string) {
    this._kod = value;
  }

  get nazwaPozycjiPL(): string {
    return this._nazwaPozycjiPL;
  }

  set nazwaPozycjiPL(value: string) {
    this._nazwaPozycjiPL = value;
  }

  get productName(): string {
    return this._productName;
  }

  set productName(value: string) {
    this._productName = value;
  }

  get indeksAlgorytm(): string {
    return this._indeksAlgorytm;
  }

  set indeksAlgorytm(value: string) {
    this._indeksAlgorytm = value;
  }

  get nazwaPLAlgorytm(): string {
    return this._nazwaPLAlgorytm;
  }

  set nazwaPLAlgorytm(value: string) {
    this._nazwaPLAlgorytm = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get model(): string {
    return this._model;
  }

  set model(value: string) {
    this._model = value;
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

  get rodzina(): string {
    return this._rodzina;
  }

  set rodzina(value: string) {
    this._rodzina = value;
  }

  get dopasowanieRoletyDlugosc(): string {
    return this._dopasowanieRoletyDlugosc;
  }

  set dopasowanieRoletyDlugosc(value: string) {
    this._dopasowanieRoletyDlugosc = value;
  }

  get dopasowanieRoletySzerokosc(): string {
    return this._dopasowanieRoletySzerokosc;
  }

  set dopasowanieRoletySzerokosc(value: string) {
    this._dopasowanieRoletySzerokosc = value;
  }

  get typTkaniny(): string {
    return this._typTkaniny;
  }

  set typTkaniny(value: string) {
    this._typTkaniny = value;
  }

  get kolorTkaniny(): string {
    return this._kolorTkaniny;
  }

  set kolorTkaniny(value: string) {
    this._kolorTkaniny = value;
  }

  get kolorTworzywWew(): string {
    return this._kolorTworzywWew;
  }

  set kolorTworzywWew(value: string) {
    this._kolorTworzywWew = value;
  }

  get roletyKolorOsprzetu(): string {
    return this._roletyKolorOsprzetu;
  }

  set roletyKolorOsprzetu(value: string) {
    this._roletyKolorOsprzetu = value;
  }

  get accessoryHorizontalSpacing(): number {
    return this._accessoryHorizontalSpacing;
  }

  set accessoryHorizontalSpacing(value: number) {
    this._accessoryHorizontalSpacing = value;
  }

  get otwieranie(): string {
    return this._otwieranie;
  }

  set otwieranie(value: string) {
    this._otwieranie = value;
  }

  get tabliczka(): string {
    return this._tabliczka;
  }

  set tabliczka(value: string) {
    this._tabliczka = value;
  }

  get CenaDetaliczna(): number {
    return this._CenaDetaliczna;
  }

  set CenaDetaliczna(value: number) {
    this._CenaDetaliczna = value;
  }

  get linkiDoZdjec(): string[] {
    return this._linkiDoZdjec;
  }

  set linkiDoZdjec(value: string[]) {
    this._linkiDoZdjec = value;
  }

  get dostepneRozmiary(): string[] {
    return this._dostepneRozmiary;
  }

  set dostepneRozmiary(value: string[]) {
    this._dostepneRozmiary = value;
  }

  get cennik(): string {
    return this._cennik;
  }

  set cennik(value: string) {
    this._cennik = value;
  }
}
