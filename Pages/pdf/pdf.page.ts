import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.page.html',
  styleUrls: ['./pdf.page.scss'],
})
export class PdfPage {
  db: SQLiteObject;
  imageUrl: string | ArrayBuffer | null;

  constructor(private sqlite: SQLite) {
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

  onFileSelected(event: any) {
    const file = event?.target?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e?.target?.result || null;
      };
      reader.readAsArrayBuffer(file);
    }
  }
  
  


  uploadDocument() {
    if (this.imageUrl) {
      if (typeof this.imageUrl === 'string') {
        console.log('Debes seleccionar un archivo válido.');
        return;
      }
      const fileContent = this.imageUrl as ArrayBuffer;
      this.saveDocumentToDatabase(fileContent);
      this.imageUrl = null; // Establece imageUrl nuevamente en nulo
    } else {
      console.log('Ningún archivo seleccionado para subir.');
    }
  }

  saveDocumentToDatabase(documentContent: ArrayBuffer) {
    // Primero, obtén el ID del paciente activo
    this.db
      .executeSql("SELECT ID_Paciente FROM paciente WHERE run = (SELECT run FROM usuario WHERE active = 1)", [])
      .then((result) => {
        if (result.rows.length > 0) {
          const pacienteID = result.rows.item(0).ID_Paciente;
  
          // Define los datos del documento
          const data = {
            ID_Paciente: pacienteID,
            TipoDocumento: 'PDF',
            NombreDocumento: 'Documento.pdf',
            ContenidoDocumento: new Blob([new Uint8Array(documentContent)]),
            FechaCreacion: new Date(),
          };
  
          // Inserta el documento en la tabla DocumentoMedico
          this.db
            .executeSql(
              'INSERT INTO DocumentoMedico (ID_Paciente, TipoDocumento, NombreDocumento, ContenidoDocumento, FechaCreacion) VALUES (?, ?, ?, ?, ?)',
              [data.ID_Paciente, data.TipoDocumento, data.NombreDocumento, data.ContenidoDocumento, data.FechaCreacion]
            )
            .then(() => {
              console.log('Documento guardado en la base de datos.');
            })
            .catch((error) => {
              console.error('Error al insertar el documento en la base de datos:', error);
            });
        } else {
          console.error('No se encontró un paciente activo en la base de datos.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener el ID del paciente activo:', error);
      });
  }
  
}