import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.page.html',
  styleUrls: ['./ver.page.scss'],
})
export class VerPage {
  db: SQLiteObject;
  pdfBase64: string | null;
  pdfBlobUrl: string | null; // Modificamos el tipo de pdfBlobUrl

  constructor(private sqlite: SQLite, private sanitizer: DomSanitizer) {
    this.createOpenDatabase();
  }

  createOpenDatabase() {
    this.sqlite
      .create({
        name: 'data.db',
        location: 'default',
      })
      .then((db: SQLiteObject) => {
        this.db = db;
        console.log('Conectado a la base de datos');
      })
      .catch((e) => console.error('Error al abrir la base de datos:', e));
  }

  fetchAndDisplayDocument() {
    // Supongamos que tienes una forma de obtener el ID del documento que deseas ver
    const documentoID = 1; // Reemplaza esto con el ID correcto

    // Realiza una consulta para obtener el documento en Base64
    this.db
      .executeSql('SELECT ContenidoDocumento FROM DocumentoMedico WHERE ID_Documento = ?', [documentoID])
      .then((result) => {
        if (result.rows.length > 0) {
          const documentBase64 = result.rows.item(0).ContenidoDocumento;
          this.pdfBase64 = documentBase64;

          // Convierte el Base64 a una URL segura para mostrar el PDF
          this.pdfBlobUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + documentBase64) as string; // Conversión explícita
        } else {
          console.error('No se encontró el documento en la base de datos.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener el documento desde la base de datos:', error);
      });
  }
}
