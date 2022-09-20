import {Injectable} from '@angular/core';
import {SingleConfiguration} from '../models/single-configuration';

@Injectable({
  providedIn: 'root'
})
export class PdfDataFormatterService {

  private logoLink = '';

  constructor() {
  }

  getDocumentDefinition(configuration: SingleConfiguration) {
    return {
      content: [
        {
          text: configuration.name,
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        // Początek sekcji z danymi klienta i logotypem
        {
          columns: [
            [{
              text: configuration.user,
              style: 'name'
            },
              {
                text: 'Adres Klienta - montażu'
              },
              {
                text: 'Email: .......'
              },
              {
                text: 'Numer telefonu .......'
              }
            ],
            [
              this.getLogoPicture()
            ]
          ]
        },
        // Koniec sekcji z danymi klienta i logotypem

        // Początek sekcji z produktami
        {
          text: 'Produkty',
          style: 'header'
        },
        this.getProductList(configuration),
        // Koniec sekcji z produktami

        // Początek sekcji z uwagami
        {
          text: 'Uwagi:',
          style: 'header2'
        },
        {
          text: 'Tekst uwag do konfiguracji ...',
          style: 'marginBottom'
        },
        // Koniec sekcji z uwagami

        // Początek sekcji z kodem QR i dany kontrahenta
        {
          columns: [
            {qr: 'link do konfiguracji', fit: 100},
            [{
              text: 'Dane kontrahenta:',
              style: 'name'
            },
              {
                text: 'Nazwa dealera'
              },
              {
                text: 'Email: .......'
              },
              {
                text: 'Numer telefonu .......'
              }
            ],
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

  private getLogoPicture() {
    if (this.logoLink) {
      return {
        image: this.logoLink,
        width: 75,
        alignment: 'right'
      };
    }
    return null;
  }

  private getProductList(configuration: SingleConfiguration) {
    const products = [];

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
            text: 'Nazwa produktu',
            style: 'tableHeader',
            fillColor: '#E8E8E8'
          },
            {
              text: 'Szerokość',
              style: 'tableHeader',
              fillColor: '#E8E8E8'
            },
            {
              text: 'Wysokość',
              style: 'tableHeader',
              fillColor: '#E8E8E8'
            },
            {
              text: 'Materiał wew./zew.',
              style: 'tableHeader',
              fillColor: '#E8E8E8'
            },
            {
              text: 'Szyba',
              style: 'tableHeader',
              fillColor: '#E8E8E8'
            },
            {
              text: 'Sztuk',
              style: 'tableHeader',
              fillColor: '#E8E8E8'
            },
            {
              text: 'Cena detal.',
              style: 'tableHeader',
              fillColor: '#E8E8E8'
            },
            {
              text: 'Wartość',
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
                text: product.materialColor || product.stolarkaMaterial || product.oblachowanieMaterial,
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
}
