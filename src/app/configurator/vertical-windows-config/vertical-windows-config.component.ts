import {Component, OnInit} from '@angular/core';
import {PdfDataFormatterService} from '../../services/pdf-data-formatter.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-vertical-windows-config',
  templateUrl: './vertical-windows-config.component.html',
  styleUrls: ['./vertical-windows-config.component.scss']
})
export class VerticalWindowsConfigComponent implements OnInit {

  constructor(private pdfFormatter: PdfDataFormatterService) { }

  ngOnInit(): void {
  }

  saveToPDF(configuration) {
    const doc = this.pdfFormatter.getConfigurationDefinition(configuration);
    pdfMake.createPdf(doc).open();
  }
}
