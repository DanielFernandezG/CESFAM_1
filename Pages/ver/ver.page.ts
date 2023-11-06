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
}
