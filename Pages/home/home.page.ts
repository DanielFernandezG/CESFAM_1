import { Component, OnInit } from "@angular/core";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { Router } from "@angular/router";


@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  db: SQLiteObject;
  citaData: cita[];
  especialidad: string;

  constructor(
    private sqlite: SQLite,
    private router: Router,
  ) {}

  ngOnInit() {
    this.createOpenDatabase();
  }

  medicos() {
    this.router.navigateByUrl("/ficha-medico");
  }

  recordatorio() {
    this.router.navigateByUrl("/medicacion");
  }

  uploadPdf() {
    this.router.navigateByUrl("/pdf");
  }

  createOpenDatabase() {
    try {
      this.sqlite
        .create({
          name: "data.db",
          location: "default",
        })
        .then((db: SQLiteObject) => {
          this.db = db;
          console.log("Conectado");
          this.mostrarCita();
        })
        .catch((e) => alert(JSON.stringify(e)));
    } catch (err: any) {
      console.log(err);
    }
  }

  cerrarSesion() {
    this.db
      .executeSql("UPDATE Usuario SET active=0 where active=1", [])
      .then((result) => console.log("Sesión Cambiada"))
      .catch((e) => console.log(JSON.stringify(e)));
      window.location.href = "/login";
  }

  eleccionCita() {
    this.router.navigateByUrl("/eleccion-cita");
  }

  updateData() {
    this.router.navigateByUrl("/actualizar-datos");
  }

  async mostrarCita() {
    this.citaData = [];

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
                  "select * from CitaMedica join Doctor on CitaMedica.ID_Doctor=Doctor.ID_Doctor where ID_Paciente=?",
                  [result.rows.item(0).ID_Paciente]
                )
                .then((result) => {
                  for (let i = 0; i < result.rows.length; i++) {
                    this.obtenerEspecialidad(
                      result.rows.item(i).ID_Especialidad
                    )
                      .then((especialidad: string) => {
                        this.especialidad = especialidad;
                        this.citaData.push({
                          id_cita: result.rows.item(i).ID_Cita,
                          nombre: result.rows.item(i).Nombre,
                          apellido: result.rows.item(i).Apellido,
                          FechaCita: result.rows.item(i).FechaCita,
                          HoraCita: result.rows.item(i).HoraCita,
                          especialidad: this.especialidad,
                        });
                      })
                      .catch((error) => {
                        console.error("Error al obtener especialidad:", error);
                      });
                  }
                })
                .catch((e) => alert(JSON.stringify(e)));
            });
        } else {
          this.router.navigate(["login"]);
        }
      })
      .catch((e) => alert(JSON.stringify(e)));
  }

  async obtenerEspecialidad(idEsp: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.db
        .executeSql("SELECT * FROM especialidad WHERE ID_Especialidad=?", [
          idEsp,
        ])
        .then((result) => {
          if (result.rows.length > 0) {
            const especialidad = result.rows.item(0).Nombre;
            resolve(especialidad);
          } else {
            reject(new Error("Especialidad no encontrada"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  cancelarCita(idCita: string) {
    try {
      this.db.executeSql(
        "update CitaMedica set ID_Paciente=null, EstadoCita='Disponible' where ID_Cita=?",
        [idCita]
      );
      this.mostrarCita();
    } catch (error) {
      console.error("Error al eliminar la cita médica", error);
    }
  }
}

class cita {
  public id_cita: string;
  public nombre: string;
  public apellido: string;
  public FechaCita: string;
  public HoraCita: string;
  public especialidad: string;
}
