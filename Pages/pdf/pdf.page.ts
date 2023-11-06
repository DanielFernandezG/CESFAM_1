import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Component({
  selector: 'app-pdf', 
  templateUrl: './pdf.page.html',
  styleUrls: ['./pdf.page.scss'],
})
export class PdfPage {
  db: SQLiteObject;
  imageBase64: string | null; 

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

  onImageSelected(event: any) { 
    const file = event?.target?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageBase64 = e?.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage() { 
    if (this.imageBase64) {
      this.saveImageToDatabase(this.imageBase64);
      this.imageBase64 = null;
    } else {
      console.log('Ninguna imagen seleccionada para subir.');
    }
  }

  saveImageToDatabase(imageContent: string) {
    // Primero, obtén el ID del paciente activo
    this.db
      .executeSql("SELECT ID_Paciente FROM paciente WHERE run = (SELECT run FROM usuario WHERE active = 1)", [])
      .then((result) => {
        if (result.rows.length > 0) {
          const pacienteID = result.rows.item(0).ID_Paciente;
  
          // Define los datos de la imagen
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().slice(0, 10); // Formato "YYYY-MM-DD"
          
          const data = {
            ID_Paciente: pacienteID,
            TipoDocumento: 'Imagen',
            NombreDocumento: 'Imagen.png', // Cambia el nombre del archivo de imagen
            ContenidoDocumento: imageContent, // Guarda la imagen en formato Base64 como una cadena
            FechaCreacion: formattedDate, // Fecha en formato "YYYY-MM-DD"
          };
  
          // Inserta la imagen en la tabla DocumentoMedico
          this.db
            .executeSql(
              'INSERT INTO DocumentoMedico (ID_Paciente, TipoDocumento, NombreDocumento, ContenidoDocumento, FechaCreacion) VALUES (?, ?, ?, ?, ?)',
              [data.ID_Paciente, data.TipoDocumento, data.NombreDocumento, data.ContenidoDocumento, data.FechaCreacion]
            )
            .then(() => {
              console.log('Imagen guardada en la base de datos.');
              alert("Imagen Médica Subida");
            })
            .catch((error) => {
              console.error('Error al insertar la imagen en la base de datos:', error);
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