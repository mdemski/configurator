export class Flashing {
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
  private _oblachowanieMaterial: string;
  private _oblachowanieKolor: string;
  private _oblachowanieFinisz: string;
  private _typKolnierza: string;
  private _wiatrownicaDlugosc: number;
  private _typFartucha: string;
  private _flashingTileHeight: number;
  private _rozstawPoziom: number;
  private _rozstawPion: number;
  private _CenaDetaliczna: number;
  private _dostepneRozmiary: string[];
  private _linkiDoZdjec: string[];
  private _cennik: string;
  private _flashingCombination: boolean;
  private _flashingCombinationCode: string | null; // pomocnicze oznaczenie zestawu nie przesyłać do ERP
  private _roofing: string[];

  // tslint:disable-next-line:max-line-length
  constructor(kod: string, nazwaPozycjiPL: string, productName: string, indeksAlgorytm: string, nazwaPLAlgorytm: string, status: string, model: string, szerokosc: number, wysokosc: number, grupaAsortymentowa: string, typ: string, geometria: string, rodzaj: string, rodzina: string, oblachowanieMaterial: string, oblachowanieKolor: string, oblachowanieFinisz: string, typKolnierza: string, wiatrownicaDlugosc: number, typFartucha: string, flashingTileHeight: number, rozstawPoziom: number, rozstawPion: number, CenaDetaliczna: number, dostepneRozmiary: string[], linkiDoZdjec: string[], cennik: string, flashingCombination: boolean, flashingCombinationCode: string | null, roofing: string[]) {
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
    this._oblachowanieMaterial = oblachowanieMaterial;
    this._oblachowanieKolor = oblachowanieKolor;
    this._oblachowanieFinisz = oblachowanieFinisz;
    this._typKolnierza = typKolnierza;
    this._wiatrownicaDlugosc = wiatrownicaDlugosc;
    this._typFartucha = typFartucha;
    this._flashingTileHeight = flashingTileHeight;
    this._rozstawPoziom = rozstawPoziom;
    this._rozstawPion = rozstawPion;
    this._CenaDetaliczna = CenaDetaliczna;
    this._dostepneRozmiary = dostepneRozmiary;
    this._linkiDoZdjec = linkiDoZdjec;
    this._cennik = cennik;
    this._flashingCombination = flashingCombination;
    this._flashingCombinationCode = flashingCombinationCode;
    this._roofing = roofing;
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

  get rozstawPoziom(): number {
    return this._rozstawPoziom;
  }

  set rozstawPoziom(value: number) {
    this._rozstawPoziom = value;
  }

  get rozstawPion(): number {
    return this._rozstawPion;
  }

  set rozstawPion(value: number) {
    this._rozstawPion = value;
  }

  get CenaDetaliczna(): number {
    return this._CenaDetaliczna;
  }

  set CenaDetaliczna(value: number) {
    this._CenaDetaliczna = value;
  }

  get dostepneRozmiary(): string[] {
    return this._dostepneRozmiary;
  }

  set dostepneRozmiary(value: string[]) {
    this._dostepneRozmiary = value;
  }

  get linkiDoZdjec(): string[] {
    return this._linkiDoZdjec;
  }

  set linkiDoZdjec(value: string[]) {
    this._linkiDoZdjec = value;
  }

  get cennik(): string {
    return this._cennik;
  }

  set cennik(value: string) {
    this._cennik = value;
  }

  get flashingCombination(): boolean {
    return this._flashingCombination;
  }

  set flashingCombination(value: boolean) {
    this._flashingCombination = value;
  }

  get flashingCombinationCode(): string | null {
    return this._flashingCombinationCode;
  }

  set flashingCombinationCode(value: string | null) {
    this._flashingCombinationCode = value;
  }

  get roofing(): string[] {
    return this._roofing;
  }

  set roofing(value: string[]) {
    this._roofing = value;
  }
}
