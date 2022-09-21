import {Injectable} from '@angular/core';
import {SingleConfiguration} from '../models/single-configuration';
import {MdTranslateService} from './md-translate.service';
import {Company} from '../models/company';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../store/app/app.state';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {GetUserData} from '../store/user/user.actions';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PdfDataFormatterService {

  constructor(private translate: MdTranslateService, private store: Store, private http: HttpClient) {
    this.translate.get('PDF').subscribe(text => {
      this.addressText = text.addressText;
      this.emailText = text.emailText;
      this.phoneText = text.phoneText;
      this.productsText = text.productsText;
      this.commentsText = text.commentsText;
      this.dealerHeaderText = text.dealerHeaderText;
      this.dealerNameText = text.dealerNameText;
      this.dealerAddressText = text.dealerAddressText;
      this.dealerEmailText = text.dealerEmailText;
      this.dealerPhoneText = text.dealerPhoneText;
      this.nameProductText = text.nameProductText;
      this.widthProductText = text.widthProductText;
      this.heightProductText = text.heightProductText;
      this.materialProductText = text.materialProductText;
      this.glazingProductText = text.glazingProductText;
      this.quantityProductText = text.quantityProductText;
      this.priceProductText = text.priceProductText;
      this.amountConfigText = text.amountConfigText;
    });
    this.user$.pipe(take(1)).subscribe(user => this.store.dispatch(new GetUserData(user.currentUser, user.isLogged)).subscribe(userData => this.company = userData.company));
    this.http.get('/assets/img/logo-okpol-pdf.jpg', {responseType: 'blob'})
      .subscribe(res => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.logo = reader.result;
        };
        reader.readAsDataURL(res);
      });
  }

  @Select(AppState) user$: Observable<{ currentUser, isLogged }>;
  private logo;
  private addressText: string;
  private emailText: string;
  private phoneText: string;
  private productsText: string;
  private commentsText: string;
  private dealerHeaderText: string;
  private dealerNameText: string;
  private dealerAddressText: string;
  private dealerEmailText: string;
  private dealerPhoneText: string;
  private nameProductText: string;
  private widthProductText: string;
  private heightProductText: string;
  private materialProductText: string;
  private glazingProductText: string;
  private quantityProductText: string;
  private priceProductText: string;
  private amountConfigText: string;
  private company: Company;

  getConfigurationDefinition(configuration: SingleConfiguration) {
    return {
      content: [
        this.getLogoPicture(),
        {
          text: 'Nazwa konfiguracji',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 50, 0, 50]
        },
        // Początek sekcji z danymi klienta i logotypem
        {
          columns: [
            [{
              text: configuration.user,
              style: 'name'
            },
              {
                text: this.addressText + ' '
                  + this.emptyTextMaker(configuration.installationAddress?.firstName) + ' '
                  + this.emptyTextMaker(configuration.installationAddress?.lastName) + ', \n'
                  + this.emptyTextMaker(configuration.installationAddress?.street) + ' '
                  + this.emptyTextMaker(configuration.installationAddress?.localNumber) + ', '
                  + this.emptyTextMaker(configuration.installationAddress?.city) + ' '
                  + this.emptyTextMaker(configuration.installationAddress?.zipCode)
              },
              {
                text: this.emailText + ' ' + this.emptyTextMaker(configuration.emailToSend)
              },
              {
                text: this.phoneText + ' ' + this.emptyTextMaker(configuration.installationAddress?.phoneNumber)
              }
            ]
          ]
        },
        // Koniec sekcji z danymi klienta i logotypem

        // Początek sekcji z produktami
        {
          text: this.productsText,
          style: 'header'
        },
        this.getProductList(configuration),
        // Koniec sekcji z produktami

        // Początek sekcji z uwagami
        {
          text: this.commentsText,
          style: 'header2'
        },
        {
          text: configuration.comments,
          style: 'marginBottom'
        },
        // Koniec sekcji z uwagami

        // Początek sekcji z kodem QR i dany kontrahenta
        {
          columns: [
            {qr: 'link do konfiguracji', fit: 100},
            this.getDealerData(),
          ]
        },
        // Koniec sekcji z kodem QR i dany kontrahenta
      ],
      info: {
        title: configuration.name,
        author: configuration.user,
        subject: configuration.name + ' summary',
        keywords: 'CONFIGURATION, ROOF WINDOWS',
      },
      // Style dla pdf
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 50, 0, 10]
        },
        header2: {
          fontSize: 16,
          bold: true,
          margin: [0, 20, 0, 10]
        },
        name: {
          fontSize: 16,
          bold: true
        },
        marginBottom: {
          // lewa, góra, prawa, dół
          margin: [0, 0, 0, 70]
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: 'right',
          italics: true
        },
        tableHeader: {
          bold: true,
          alignment: 'center'
        },
        center: {
          alignment: 'center'
        }
      }
    };
  }

  private emptyTextMaker(value) {
    if (value === undefined) {
      return '......................';
    } else {
      return value;
    }
  }

  private getLogoPicture() {
    if (this.logo) {
      return {
        image: this.logo,
        width: 100,
        alignment: 'right'
      };
    }
    return null;
  }

  private getProductList(configuration: SingleConfiguration) {
    const products = [];

    if (configuration.products.windows) {
      configuration.products.windows.forEach(window => products.push(window));
    }
    if (configuration.products.flashings) {
      configuration.products.flashings.forEach(flashing => products.push(flashing));
    }
    if (configuration.products.accessories) {
      configuration.products.accessories.forEach(accessory => products.push(accessory));
    }
    if (configuration.products.flats) {
      configuration.products.flats.forEach(flat => products.push(flat));
    }
    if (configuration.products.verticals) {
      configuration.products.verticals.forEach(vertical => products.push(vertical));
    }
    products.push(
      {
        name: 'IGOV N22 78x118',
        szerokosc: 78,
        wysokosc: 118,
        stolarkaMaterial: 'PVC',
        pakietSzybowy: 'N22',
        ilosc: 7,
        CenaDetaliczna: 1158
      },
      {
        name: 'ISOV E2 78x140',
        szerokosc: 78,
        wysokosc: 140,
        stolarkaMaterial: 'Drewno',
        pakietSzybowy: 'E2',
        ilosc: 3,
        CenaDetaliczna: 1005
      }
    );

    return {
      table: {
        widths: ['*', '*', '*', '*', '*', '*', '*', '*'],
        body: [
          [{
            text: this.nameProductText,
            style: 'tableHeader',
            fillColor: '#E8E8E8'
          },
            {
              text: this.widthProductText,
              style: 'tableHeader',
              fillColor: '#E8E8E8'
            },
            {
              text: this.heightProductText,
              style: 'tableHeader',
              fillColor: '#E8E8E8'
            },
            {
              text: this.materialProductText,
              style: 'tableHeader',
              fillColor: '#E8E8E8'
            },
            {
              text: this.glazingProductText,
              style: 'tableHeader',
              fillColor: '#E8E8E8'
            },
            {
              text: this.quantityProductText,
              style: 'tableHeader',
              fillColor: '#E8E8E8'
            },
            {
              text: this.priceProductText,
              style: 'tableHeader',
              fillColor: '#E8E8E8'
            },
            {
              text: this.amountConfigText,
              style: 'tableHeader',
              fillColor: '#E8E8E8'
            }
          ],
          ...products.map(product => {
            return [
              {
                text: product.name,
                style: 'center'
              },
              {
                text: product.szerokosc,
                style: 'center'
              },
              {
                text: product.wysokosc,
                style: 'center'
              },
              {
                text: (product.typTkaniny + ' ' + product.kolorTkaniny) || (product.stolarkaMaterial + ' ' + product.stolarkaKolor) || (product.oblachowanieMaterial + ' ' + product.oblachowanieKolor),
                style: 'center'
              },
              {
                text: product.pakietSzybowy,
                style: 'center'
              },
              {
                text: product.ilosc,
                style: 'center'
              },
              {
                text: product.CenaDetaliczna,
                style: 'center'
              },
              {
                text: product.ilosc * product.CenaDetaliczna,
                style: 'center'
              }
            ];
          })
        ]
      }
    };
  }

  private getDealerData() {
    if (this.company) {
      return [{
        text: this.dealerHeaderText,
        style: 'name'
      },
        {
          text: this.dealerNameText + ' ' + this.emptyTextMaker(this.company?.name)
        },
        {
          text: this.dealerAddressText + ' '
            + this.emptyTextMaker(this.company?.address.street) + ' '
            + this.emptyTextMaker(this.company?.address.localNumber) + ', \n'
            + this.emptyTextMaker(this.company?.address.zipCode) + ' '
            + this.emptyTextMaker(this.company?.address.city)
        },
        {
          text: this.dealerEmailText + ' ' + this.emptyTextMaker(this.company?.email)
        },
        {
          text: this.dealerPhoneText + ' ' + this.emptyTextMaker(this.company?.address.phoneNumber)
        }
      ];
    } else {
      return [];
    }
  }
}
