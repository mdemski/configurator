export class ExclusionsModel {
  private _selectedOption: string;
  private _DrewnoSosna: boolean;
  private _PVC: boolean;
  private _OknoObrotowe: boolean;
  private _OknoUchylnoPrzesuwne: boolean;
  private _OknoNieotwieraneFIP: boolean;
  private _KolankoDrewnoNieotwieraneFIP: boolean;
  private _KolankoDrewnoUchylne: boolean;
  private _KolankoPVCNieotwieraneFIX: boolean;
  private _KolankoPVCUchylne: boolean;
  private _KolankoPVCUchylnoRozwierneLewe: boolean;
  private _KolankoPVCUchylnoRozwiernePrawe: boolean;
  private _OknoElektrycznePrzelacznik: boolean;
  private _OknoElektrycznePilot: boolean;
  private _OknoWysokoosiowe: boolean;
  private _DrewnoBezbarwne: boolean;
  private _DrewnoBialy9003: boolean;
  private _PVCBialy9016: boolean;
  private _Aluminium: boolean;
  private _Miedz: boolean;
  private _TytanCynk: boolean;
  private _AluminiumPolmat: boolean;
  private _AluminiumMat: boolean;
  private _AluminiumPolysk: boolean;
  private _MiedzITytanCynkNatur: boolean;
  private _AluminiumRAL7022: boolean;
  private _MiedzNatur: boolean;
  private _TytanCynkNatur: boolean;
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
  private _OknoExtraSecure: boolean;
  private _OknoUno: boolean;
  private _OknoSilownikSolarny: boolean;
  private _OknoRAL7048: number;
  private _OknoRAL9016: string;
  private _NawiewnikNeoVent: string;
  private _MaskownicaNeoVent: string;
  private _Brak: string;
  private _OknoZasuwka: string;

  // tslint:disable-next-line:max-line-length
  constructor(selectedOption: string, DrewnoSosna: boolean, PVC: boolean, OknoObrotowe: boolean, OknoUchylnoPrzesuwne: boolean, OknoNieotwieraneFIP: boolean, KolankoDrewnoNieotwieraneFIP: boolean, KolankoDrewnoUchylne: boolean, KolankoPVCNieotwieraneFIX: boolean, KolankoPVCUchylne: boolean, KolankoPVCUchylnoRozwierneLewe: boolean, KolankoPVCUchylnoRozwiernePrawe: boolean, OknoElektrycznePrzelacznik: boolean, OknoElektrycznePilot: boolean, OknoWysokoosiowe: boolean, DrewnoBezbarwne: boolean, DrewnoBialy9003: boolean, PVCBialy9016: boolean, Aluminium: boolean, Miedz: boolean, TytanCynk: boolean, AluminiumPolmat: boolean, AluminiumMat: boolean, AluminiumPolysk: boolean, MiedzITytanCynkNatur: boolean, AluminiumRAL7022: boolean, MiedzNatur: boolean, TytanCynkNatur: boolean, dwuszybowy: boolean, trzyszybowy: boolean, trzyszybowyKrypton: boolean, zewnetrznaHartowana: boolean, wewnetrznaHartowana: boolean, sunGuard: boolean, bioClean: boolean, matowa: boolean, redukcjaHalasu: boolean, laminowanaP1: boolean, laminowanaP2: boolean, laminowanaP4: boolean, OknoExtraSecure: boolean, OknoUno: boolean, OknoSilownikSolarny: boolean, OknoRAL7048: number, OknoRAL9016: string, NawiewnikNeoVent: string, MaskownicaNeoVent: string, Brak: string, OknoZasuwka: string) {
    this._selectedOption = selectedOption;
    this._DrewnoSosna = DrewnoSosna;
    this._PVC = PVC;
    this._OknoObrotowe = OknoObrotowe;
    this._OknoUchylnoPrzesuwne = OknoUchylnoPrzesuwne;
    this._OknoNieotwieraneFIP = OknoNieotwieraneFIP;
    this._KolankoDrewnoNieotwieraneFIP = KolankoDrewnoNieotwieraneFIP;
    this._KolankoDrewnoUchylne = KolankoDrewnoUchylne;
    this._KolankoPVCNieotwieraneFIX = KolankoPVCNieotwieraneFIX;
    this._KolankoPVCUchylne = KolankoPVCUchylne;
    this._KolankoPVCUchylnoRozwierneLewe = KolankoPVCUchylnoRozwierneLewe;
    this._KolankoPVCUchylnoRozwiernePrawe = KolankoPVCUchylnoRozwiernePrawe;
    this._OknoElektrycznePrzelacznik = OknoElektrycznePrzelacznik;
    this._OknoElektrycznePilot = OknoElektrycznePilot;
    this._OknoWysokoosiowe = OknoWysokoosiowe;
    this._DrewnoBezbarwne = DrewnoBezbarwne;
    this._DrewnoBialy9003 = DrewnoBialy9003;
    this._PVCBialy9016 = PVCBialy9016;
    this._Aluminium = Aluminium;
    this._Miedz = Miedz;
    this._TytanCynk = TytanCynk;
    this._AluminiumPolmat = AluminiumPolmat;
    this._AluminiumMat = AluminiumMat;
    this._AluminiumPolysk = AluminiumPolysk;
    this._MiedzITytanCynkNatur = MiedzITytanCynkNatur;
    this._AluminiumRAL7022 = AluminiumRAL7022;
    this._MiedzNatur = MiedzNatur;
    this._TytanCynkNatur = TytanCynkNatur;
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
    this._OknoExtraSecure = OknoExtraSecure;
    this._OknoUno = OknoUno;
    this._OknoSilownikSolarny = OknoSilownikSolarny;
    this._OknoRAL7048 = OknoRAL7048;
    this._OknoRAL9016 = OknoRAL9016;
    this._NawiewnikNeoVent = NawiewnikNeoVent;
    this._MaskownicaNeoVent = MaskownicaNeoVent;
    this._Brak = Brak;
    this._OknoZasuwka = OknoZasuwka;
  }

  get selectedOption(): string {
    return this._selectedOption;
  }

  set selectedOption(value: string) {
    this._selectedOption = value;
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

  get OknoObrotowe(): boolean {
    return this._OknoObrotowe;
  }

  set OknoObrotowe(value: boolean) {
    this._OknoObrotowe = value;
  }

  get OknoUchylnoPrzesuwne(): boolean {
    return this._OknoUchylnoPrzesuwne;
  }

  set OknoUchylnoPrzesuwne(value: boolean) {
    this._OknoUchylnoPrzesuwne = value;
  }

  get OknoNieotwieraneFIP(): boolean {
    return this._OknoNieotwieraneFIP;
  }

  set OknoNieotwieraneFIP(value: boolean) {
    this._OknoNieotwieraneFIP = value;
  }

  get KolankoDrewnoNieotwieraneFIP(): boolean {
    return this._KolankoDrewnoNieotwieraneFIP;
  }

  set KolankoDrewnoNieotwieraneFIP(value: boolean) {
    this._KolankoDrewnoNieotwieraneFIP = value;
  }

  get KolankoDrewnoUchylne(): boolean {
    return this._KolankoDrewnoUchylne;
  }

  set KolankoDrewnoUchylne(value: boolean) {
    this._KolankoDrewnoUchylne = value;
  }

  get KolankoPVCNieotwieraneFIX(): boolean {
    return this._KolankoPVCNieotwieraneFIX;
  }

  set KolankoPVCNieotwieraneFIX(value: boolean) {
    this._KolankoPVCNieotwieraneFIX = value;
  }

  get KolankoPVCUchylne(): boolean {
    return this._KolankoPVCUchylne;
  }

  set KolankoPVCUchylne(value: boolean) {
    this._KolankoPVCUchylne = value;
  }

  get KolankoPVCUchylnoRozwierneLewe(): boolean {
    return this._KolankoPVCUchylnoRozwierneLewe;
  }

  set KolankoPVCUchylnoRozwierneLewe(value: boolean) {
    this._KolankoPVCUchylnoRozwierneLewe = value;
  }

  get KolankoPVCUchylnoRozwiernePrawe(): boolean {
    return this._KolankoPVCUchylnoRozwiernePrawe;
  }

  set KolankoPVCUchylnoRozwiernePrawe(value: boolean) {
    this._KolankoPVCUchylnoRozwiernePrawe = value;
  }

  get OknoElektrycznePrzelacznik(): boolean {
    return this._OknoElektrycznePrzelacznik;
  }

  set OknoElektrycznePrzelacznik(value: boolean) {
    this._OknoElektrycznePrzelacznik = value;
  }

  get OknoElektrycznePilot(): boolean {
    return this._OknoElektrycznePilot;
  }

  set OknoElektrycznePilot(value: boolean) {
    this._OknoElektrycznePilot = value;
  }

  get OknoWysokoosiowe(): boolean {
    return this._OknoWysokoosiowe;
  }

  set OknoWysokoosiowe(value: boolean) {
    this._OknoWysokoosiowe = value;
  }

  get DrewnoBezbarwne(): boolean {
    return this._DrewnoBezbarwne;
  }

  set DrewnoBezbarwne(value: boolean) {
    this._DrewnoBezbarwne = value;
  }

  get DrewnoBialy9003(): boolean {
    return this._DrewnoBialy9003;
  }

  set DrewnoBialy9003(value: boolean) {
    this._DrewnoBialy9003 = value;
  }

  get PVCBialy9016(): boolean {
    return this._PVCBialy9016;
  }

  set PVCBialy9016(value: boolean) {
    this._PVCBialy9016 = value;
  }

  get Aluminium(): boolean {
    return this._Aluminium;
  }

  set Aluminium(value: boolean) {
    this._Aluminium = value;
  }

  get Miedz(): boolean {
    return this._Miedz;
  }

  set Miedz(value: boolean) {
    this._Miedz = value;
  }

  get TytanCynk(): boolean {
    return this._TytanCynk;
  }

  set TytanCynk(value: boolean) {
    this._TytanCynk = value;
  }

  get AluminiumPolmat(): boolean {
    return this._AluminiumPolmat;
  }

  set AluminiumPolmat(value: boolean) {
    this._AluminiumPolmat = value;
  }

  get AluminiumMat(): boolean {
    return this._AluminiumMat;
  }

  set AluminiumMat(value: boolean) {
    this._AluminiumMat = value;
  }

  get AluminiumPolysk(): boolean {
    return this._AluminiumPolysk;
  }

  set AluminiumPolysk(value: boolean) {
    this._AluminiumPolysk = value;
  }

  get MiedzITytanCynkNatur(): boolean {
    return this._MiedzITytanCynkNatur;
  }

  set MiedzITytanCynkNatur(value: boolean) {
    this._MiedzITytanCynkNatur = value;
  }

  get AluminiumRAL7022(): boolean {
    return this._AluminiumRAL7022;
  }

  set AluminiumRAL7022(value: boolean) {
    this._AluminiumRAL7022 = value;
  }

  get MiedzNatur(): boolean {
    return this._MiedzNatur;
  }

  set MiedzNatur(value: boolean) {
    this._MiedzNatur = value;
  }

  get TytanCynkNatur(): boolean {
    return this._TytanCynkNatur;
  }

  set TytanCynkNatur(value: boolean) {
    this._TytanCynkNatur = value;
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

  get OknoExtraSecure(): boolean {
    return this._OknoExtraSecure;
  }

  set OknoExtraSecure(value: boolean) {
    this._OknoExtraSecure = value;
  }

  get OknoUno(): boolean {
    return this._OknoUno;
  }

  set OknoUno(value: boolean) {
    this._OknoUno = value;
  }

  get OknoSilownikSolarny(): boolean {
    return this._OknoSilownikSolarny;
  }

  set OknoSilownikSolarny(value: boolean) {
    this._OknoSilownikSolarny = value;
  }

  get OknoRAL7048(): number {
    return this._OknoRAL7048;
  }

  set OknoRAL7048(value: number) {
    this._OknoRAL7048 = value;
  }

  get OknoRAL9016(): string {
    return this._OknoRAL9016;
  }

  set OknoRAL9016(value: string) {
    this._OknoRAL9016 = value;
  }

  get NawiewnikNeoVent(): string {
    return this._NawiewnikNeoVent;
  }

  set NawiewnikNeoVent(value: string) {
    this._NawiewnikNeoVent = value;
  }

  get MaskownicaNeoVent(): string {
    return this._MaskownicaNeoVent;
  }

  set MaskownicaNeoVent(value: string) {
    this._MaskownicaNeoVent = value;
  }

  get Brak(): string {
    return this._Brak;
  }

  set Brak(value: string) {
    this._Brak = value;
  }

  get OknoZasuwka(): string {
    return this._OknoZasuwka;
  }

  set OknoZasuwka(value: string) {
    this._OknoZasuwka = value;
  }
}
