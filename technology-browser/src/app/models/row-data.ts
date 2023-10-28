export class RowData {
  public _nadrzedny: string;
  private _llc: number;
  private _produkt: string;
  private _matka: string;
  private _technologia: string;
  private _bom_wzorzec: string;
  private _bom_technologia: string;
  private _BOM_Final_Idn: string;
  private _BOM_Final_Name: string;
  private _id_tech: string;
  private _id_instr: string;
  private _wzorzec: string;
  private _fantom: string;
  private _normatyw: string;
  private _GrupaBranzowa: string;
  private _ilosc: number;

  constructor(nadrzedny: string, llc: number, produkt: string, matka: string, technologia: string, bom_wzorzec: string, bom_technologia: string, BOM_Final_Idn: string, BOM_Final_Name: string, id_tech: string, id_instr: string, wzorzec: string, fantom: string, normatyw: string, GrupaBranzowa: string, ilosc: number) {
    this._nadrzedny = nadrzedny;
    this._llc = llc;
    this._produkt = produkt;
    this._matka = matka;
    this._technologia = technologia;
    this._bom_wzorzec = bom_wzorzec;
    this._bom_technologia = bom_technologia;
    this._BOM_Final_Idn = BOM_Final_Idn;
    this._BOM_Final_Name = BOM_Final_Name;
    this._id_tech = id_tech;
    this._id_instr = id_instr;
    this._wzorzec = wzorzec;
    this._fantom = fantom;
    this._normatyw = normatyw;
    this._GrupaBranzowa = GrupaBranzowa;
    this._ilosc = ilosc;
  }


  get nadrzedny(): string {
    return this._nadrzedny;
  }

  set nadrzedny(value: string) {
    this._nadrzedny = value;
  }

  get llc(): number {
    return this._llc;
  }

  set llc(value: number) {
    this._llc = value;
  }

  get produkt(): string {
    return this._produkt;
  }

  set produkt(value: string) {
    this._produkt = value;
  }

  get matka(): string {
    return this._matka;
  }

  set matka(value: string) {
    this._matka = value;
  }

  get technologia(): string {
    return this._technologia;
  }

  set technologia(value: string) {
    this._technologia = value;
  }

  get bom_wzorzec(): string {
    return this._bom_wzorzec;
  }

  set bom_wzorzec(value: string) {
    this._bom_wzorzec = value;
  }

  get bom_technologia(): string {
    return this._bom_technologia;
  }

  set bom_technologia(value: string) {
    this._bom_technologia = value;
  }

  get BOM_Final_Idn(): string {
    return this._BOM_Final_Idn;
  }

  set BOM_Final_Idn(value: string) {
    this._BOM_Final_Idn = value;
  }

  get BOM_Final_Name(): string {
    return this._BOM_Final_Name;
  }

  set BOM_Final_Name(value: string) {
    this._BOM_Final_Name = value;
  }

  get id_tech(): string {
    return this._id_tech;
  }

  set id_tech(value: string) {
    this._id_tech = value;
  }

  get id_instr(): string {
    return this._id_instr;
  }

  set id_instr(value: string) {
    this._id_instr = value;
  }

  get wzorzec(): string {
    return this._wzorzec;
  }

  set wzorzec(value: string) {
    this._wzorzec = value;
  }

  get fantom(): string {
    return this._fantom;
  }

  set fantom(value: string) {
    this._fantom = value;
  }

  get normatyw(): string {
    return this._normatyw;
  }

  set normatyw(value: string) {
    this._normatyw = value;
  }

  get GrupaBranzowa(): string {
    return this._GrupaBranzowa;
  }

  set GrupaBranzowa(value: string) {
    this._GrupaBranzowa = value;
  }

  get ilosc(): number {
    return this._ilosc;
  }

  set ilosc(value: number) {
    this._ilosc = value;
  }
}
