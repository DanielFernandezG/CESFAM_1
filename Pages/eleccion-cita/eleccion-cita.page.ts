import { Component, OnInit } from "@angular/core";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { Router } from "@angular/router";

@Component({
  selector: "app-eleccion-cita",
  templateUrl: "eleccion-cita.page.html",
  styleUrls: ["eleccion-cita.page.scss"],
})
export class EleccionCitaPage implements OnInit {
  db: SQLiteObject;
  citaData: cita[];
  especialidades: especialidad[];
  doctores: doctor[];
  especialidad: string;
  idEsp: number;
  genero: string;
  esp: string;
  doc: string;
  // especialidades: any[] = [];
  // especialidadSeleccionada: any;
  // mostrarBotonSiguiente: boolean = false;

  constructor(private sqlite: SQLite, private router: Router) {}

  ngOnInit() {
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
        this.mostrarCita();
        this.mostrarEspecialidades();
        this.mostrarDoctores();
      })
      .catch((e) => console.log("Error al conectar a la base de datos: ", e));
  }

  mostrarCita() {
    this.citaData = [];

    this.db
      .executeSql(
        "select * from citaMedica join Doctor on citaMedica.ID_Doctor=Doctor.ID_Doctor where EstadoCita='Disponible'",
        []
      )
      .then((result) => {
        for (let i = 0; i < result.rows.length; i++) {
          this.obtenerEspecialidad(result.rows.item(i).ID_Especialidad)
            .then((especialidad: string) => {
              this.especialidad = especialidad;
              this.citaData.push({
                id_cita: result.rows.item(i).ID_Cita,
                nombre: result.rows.item(i).Nombre,
                apellido: result.rows.item(i).Apellido,
                FechaCita: result.rows.item(i).FechaCita,
                HoraCita: result.rows.item(i).HoraCita,
                esp: this.especialidad,
              });
              this.esp = "";
              this.doc = "";
              this.idEsp = 0;
            })
            .catch((error) => {
              console.error("Error al obtener especialidad:", error);
            });
        }
      })
      .catch((e) => alert(JSON.stringify(e)));
  }

  filtrar() {
    this.citaData = [];
    if (this.esp != "") {
      this.obtenerIdEspecialidad(this.esp).then((idesp: number) => {
        this.idEsp = idesp;
        this.db
          .executeSql(
            "select * from citaMedica join Doctor on citaMedica.ID_Doctor=Doctor.ID_Doctor where EstadoCita='Disponible' and (Doctor.Nombre||' '||Doctor.Apellido=? or ID_Especialidad=?)",
            [this.doc, this.idEsp]
          )
          .then((result) => {
            for (let i = 0; i < result.rows.length; i++) {
              this.obtenerEspecialidad(result.rows.item(i).ID_Especialidad)
                .then((especialidad: string) => {
                  this.especialidad = especialidad;
                  this.citaData.push({
                    id_cita: result.rows.item(i).ID_Cita,
                    nombre: result.rows.item(i).Nombre,
                    apellido: result.rows.item(i).Apellido,
                    FechaCita: result.rows.item(i).FechaCita,
                    HoraCita: result.rows.item(i).HoraCita,
                    esp: this.especialidad,
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
      this.db
          .executeSql(
            "select * from citaMedica join Doctor on citaMedica.ID_Doctor=Doctor.ID_Doctor where EstadoCita='Disponible' and (Doctor.Nombre||' '||Doctor.Apellido=? or ID_Especialidad=?)",
            [this.doc, this.idEsp]
          )
          .then((result) => {
            for (let i = 0; i < result.rows.length; i++) {
              this.obtenerEspecialidad(result.rows.item(i).ID_Especialidad)
                .then((especialidad: string) => {
                  this.especialidad = especialidad;
                  this.citaData.push({
                    id_cita: result.rows.item(i).ID_Cita,
                    nombre: result.rows.item(i).Nombre,
                    apellido: result.rows.item(i).Apellido,
                    FechaCita: result.rows.item(i).FechaCita,
                    HoraCita: result.rows.item(i).HoraCita,
                    esp: this.especialidad,
                  });
                })
                .catch((error) => {
                  console.error("Error al obtener especialidad:", error);
                });
            }
          })
          .catch((e) => alert(JSON.stringify(e)));
    }
  }

  mostrarDoctores() {
    this.doctores = [];

    this.db.executeSql("select * from Doctor", []).then((result) => {
      for (let i = 0; i < result.rows.length; i++) {
        this.doctores.push({
          id: result.rows.item(i).ID_Doctor,
          nombre: result.rows.item(i).Nombre,
          apellido: result.rows.item(i).Apellido,
        });
      }
    });
  }

  mostrarEspecialidades() {
    this.especialidades = [];

    this.db.executeSql("select * from especialidad", []).then((result) => {
      for (let i = 0; i < result.rows.length; i++) {
        this.especialidades.push({
          id: result.rows.item(i).ID_Especialidad,
          descripcion: result.rows.item(i).Nombre,
        });
      }
    });
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

  async obtenerIdEspecialidad(nombreEspecialidad: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.db
        .executeSql("SELECT ID_Especialidad FROM especialidad WHERE Nombre=?", [
          nombreEspecialidad,
        ])
        .then((result) => {
          if (result.rows.length > 0) {
            const idEspecialidad = result.rows.item(0).ID_Especialidad;
            resolve(idEspecialidad);
          } else {
            reject(new Error("Especialidad no encontrada"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  tomarHora(idCita: string) {
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
                  "update citaMedica set ID_Paciente=?,EstadoCita='Ocupada' where ID_Cita=?",
                  [result.rows.item(0).ID_Paciente, idCita]
                )
                .then((result) => {
                  this.mostrarCita();
                  alert("Hora Tomada");
                  this.router.navigate(["home"]).then(() => {
                    // Recarga la página actual
                    window.location.reload();
                  });
                });
            });
        } else {
          this.router.navigate(["login"]);
        }
      })
      .catch((e) => alert(JSON.stringify(e)));
  }

}
class especialidad {
  public id: string;
  public descripcion: string;
}

class doctor {
  public id: string;
  public nombre: string;
  public apellido: string;
}

class cita {
  public id_cita: string;
  public nombre: string;
  public apellido: string;
  public FechaCita: string;
  public HoraCita: string;
  public esp: string;
}
