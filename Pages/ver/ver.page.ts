import { Component } from "@angular/core";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";

@Component({
  selector: "app-ver",
  templateUrl: "./ver.page.html",
  styleUrls: ["./ver.page.scss"],
})
export class VerPage {
  db: SQLiteObject;
  id: number;
  documents: SafeResourceUrl[] = []; // Arreglo para almacenar los documentos
  documentVisible: boolean[] = []; // Arreglo para rastrear la visibilidad de los documentos
  nombresDocumentos: string[] = []; // Arreglo para almacenar los nombres de los documentos
  fechasCreacion: string[] = []; // Arreglo para almacenar las fechas de creación
  imageBase64: string | null; 

  constructor(
    private sqlite: SQLite,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.createOpenDatabase();
  }

  createOpenDatabase() {
    this.sqlite
      .create({
        name: "data.db",
        location: "default",
      })
      .then((db: SQLiteObject) => {
        this.db = db;
        console.log("Conectado a la base de datos");
        this.fetchAndDisplayDocuments(); // Llama a la función para cargar los documentos
      })
      .catch((e) => console.error("Error al abrir la base de datos:", e));
  }

  fetchAndDisplayDocuments() {
    this.db
      .executeSql("select * from usuario where active = 1", [])
      .then((result) => {
        if (result.rows.item(0).run != "") {
          this.db
            .executeSql("select * from paciente where run=?", [
              result.rows.item(0).run,
            ])
            .then((result) => {
              this.db
                .executeSql(
                  "SELECT ContenidoDocumento, NombreDocumento, FechaCreacion FROM DocumentoMedico WHERE ID_Paciente=?",
                  [result.rows.item(0).ID_Paciente]
                )
                .then((result) => {
                  const documents = [];
                  const nombresDocumentos = [];
                  const fechasCreacion = [];

                  for (let i = 0; i < result.rows.length; i++) {
                    const documentBase64 =
                      result.rows.item(i).ContenidoDocumento;
                    documents.push(
                      this.sanitizer.bypassSecurityTrustResourceUrl(
                        documentBase64
                      ) as string
                    );
                    nombresDocumentos.push(result.rows.item(i).NombreDocumento);
                    fechasCreacion.push(result.rows.item(i).FechaCreacion);
                  }

                  // Inicializa las matrices de visibilidad y almacena la lista de documentos junto con los nombres y fechas.
                  this.documentVisible = new Array(documents.length).fill(
                    false
                  );
                  this.documents = documents;
                  this.nombresDocumentos = nombresDocumentos;
                  this.fechasCreacion = fechasCreacion;
                })
                .catch((error) => {
                  console.error(
                    "Error al obtener los documentos desde la base de datos:",
                    error
                  );
                });
            });
        } else {
          this.router.navigate(["login"]);
        }
      })
      .catch((e) => alert(JSON.stringify(e)));
  }

  isModalOpen = false;

  setOpen(isOpen: boolean, index: number) {
    this.documentVisible[index] = !this.documentVisible[index];
    this.isModalOpen = isOpen;
    this.id=index
  }

  setClose(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.documentVisible[this.id] = !this.documentVisible[this.id];
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }
  showContent: boolean = false;

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
      this.fetchAndDisplayDocuments();
      this.toggleContent();
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
