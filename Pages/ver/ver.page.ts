import { Component, OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.page.html',
  styleUrls: ['./ver.page.scss'],
})
export class VerPage implements OnInit {
  db: SQLiteObject;
  documentosData: any[] = [];

  constructor(private sqlite: SQLite) {}

  ngOnInit() {
    this.createOpenDatabase();
    this.selectDocumentos();
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

  selectDocumentos() {
    this.documentosData = [];

    this.db.executeSql('SELECT * FROM DocumentoMedico', []).then((result) => {
      if (result.rows.length > 0) {
        for (let i = 0; i < result.rows.length; i++) {
          this.documentosData.push({
            ID_Documento: result.rows.item(i).ID_Documento,
            ID_Paciente: result.rows.item(i).ID_Paciente,
            TipoDocumento: result.rows.item(i).TipoDocumento,
            NombreDocumento: result.rows.item(i).NombreDocumento,
            ContenidoDocumento: result.rows.item(i).ContenidoDocumento,
            FechaCreacion: result.rows.item(i).FechaCreacion,
          });
        }
      } else {
        console.error('No se encontraron documentos en la base de datos.');
      }
    }).catch((error) => {
      console.error('Error al recuperar documentos de la base de datos:', error);
    });
  }
}
