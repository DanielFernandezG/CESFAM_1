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
  nombresDocumentos: string[] = []; // Arreglo para almacenar los nombres de los documentos
  fechasCreacion: string[] = []; // Arreglo para almacenar las fechas de creación
  TipoDocumento: string[] = []; // Arreglo para almacenar las fechas de creación
  imageBase64: string | null;
  nombreArchivo: string;
  nombreArchivoValido: boolean = false;

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

  validarNombreArchivo() {
    this.nombreArchivoValido = this.nombreArchivo.trim() !== "";
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
                  "SELECT NombreDocumento, FechaCreacion, TipoDocumento FROM DocumentoMedico WHERE ID_Paciente=?",
                  [result.rows.item(0).ID_Paciente]
                )
                .then((result) => {
                  const nombresDocumentos = [];
                  const fechasCreacion = [];
                  const TipoDocumento = [];

                  for (let i = 0; i < result.rows.length; i++) {
                    nombresDocumentos.push(result.rows.item(i).NombreDocumento);
                    fechasCreacion.push(result.rows.item(i).FechaCreacion);
                    TipoDocumento.push(result.rows.item(i).TipoDocumento);
                  }
                  this.nombresDocumentos = nombresDocumentos;
                  this.fechasCreacion = fechasCreacion;
                  this.TipoDocumento = TipoDocumento;
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
    this.isModalOpen = isOpen;
    this.id = index + 1;

    this.db
      .executeSql(
        "SELECT ContenidoDocumento FROM DocumentoMedico WHERE ID_Documento=?",
        [this.id]
      )
      .then((result) => {
        const documents = [];

        for (let i = 0; i < result.rows.length; i++) {
          const documentBase64 = result.rows.item(i).ContenidoDocumento;
          documents.push(
            this.sanitizer.bypassSecurityTrustResourceUrl(
              documentBase64
            ) as string
          );
        }

        // Inicializa las matrices de visibilidad y almacena la lista de documentos junto con los nombres y fechas.
        this.documents = documents;
      })
      .catch((error) => {
        console.error(
          "Error al obtener los documentos desde la base de datos:",
          error
        );
      });
  }

  setClose(isOpen: boolean) {
    this.isModalOpen = isOpen;
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
    if (!this.nombreArchivoValido) {
      alert("Por favor, ingrese el nombre del archivo.")
    } else {
      if (this.imageBase64) {
        this.saveImageToDatabase(this.imageBase64);
        this.imageBase64 = null;
        this.fetchAndDisplayDocuments();
        this.toggleContent();
      } else {
        console.log("Ningun documento seleccionado para subir.");
      }
    }
  }

  saveImageToDatabase(imageContent: string) {
    // Primero, obtén el ID del paciente activo
    this.db
      .executeSql(
        "SELECT ID_Paciente FROM paciente WHERE run = (SELECT run FROM usuario WHERE active = 1)",
        []
      )
      .then((result) => {
        if (result.rows.length > 0) {
          const pacienteID = result.rows.item(0).ID_Paciente;

          // Define los datos de la imagen
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().slice(0, 10); // Formato "YYYY-MM-DD"

          const data = {
            ID_Paciente: pacienteID,
            TipoDocumento: "Pdf",
            NombreDocumento: this.nombreArchivo, // Cambia el nombre del archivo de imagen
            ContenidoDocumento: imageContent, // Guarda la imagen en formato Base64 como una cadena
            FechaCreacion: formattedDate, // Fecha en formato "YYYY-MM-DD"
          };

          // Inserta la imagen en la tabla DocumentoMedico
          this.db
            .executeSql(
              "INSERT INTO DocumentoMedico (ID_Paciente, TipoDocumento, NombreDocumento, ContenidoDocumento, FechaCreacion) VALUES (?, ?, ?, ?, ?)",
              [
                data.ID_Paciente,
                data.TipoDocumento,
                data.NombreDocumento,
                data.ContenidoDocumento,
                data.FechaCreacion,
              ]
            )
            .then(() => {
              console.log("Documento guardado en la base de datos.");
              alert("Documento Médico Subido");
            })
            .catch((error) => {
              console.error(
                "Error al insertar el documento en la base de datos:",
                error
              );
            });
        } else {
          console.error(
            "No se encontró un paciente activo en la base de datos."
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener el ID del paciente activo:", error);
      });
  }
}
