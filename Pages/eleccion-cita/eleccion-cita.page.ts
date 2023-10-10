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
  especialidad: string;

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
            })
            .catch((error) => {
              console.error("Error al obtener especialidad:", error);
            });
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

  tomarHora(idCita: string) {
    this.db
      .executeSql("select * from usuario where active = 1", [])
      .then((result) => {
        if (result.rows.item(0).run != "") {
          this.db
            .executeSql("select * from paciente where run=?", [
              (result.rows.item(0).run)
            ])
            .then((result) => {
              this.db.executeSql("update citaMedica set ID_Paciente=?,EstadoCita='Ocupada' where ID_Cita=?",[result.rows.item(0).ID_Paciente,idCita])
              .then((result) => {
                this.mostrarCita();
                alert("Hora Tomada");
                this.router.navigate(["home"]).then(() => {
                  // Recarga la página actual
                  window.location.reload();
                });;
              })
            });
        } else {
          this.router.navigate(["login"]);
        }
      })
      .catch((e) => alert(JSON.stringify(e)));
  }
  // fetchEspecialidades() {
  //   this.db
  //     .executeSql('SELECT Nombre FROM Especialidad', [])
  //     .then(data => {
  //       if (data.rows.length > 0) {
  //         for (let i = 0; i < data.rows.length; i++) {
  //           this.especialidades.push(data.rows.item(i).Nombre);
  //         }
  //       }
  //     })
  //     .catch(e => console.log('Error al ejecutar la consulta: ', e));
  // }
}

class cita {
  public id_cita: string;
  public nombre: string;
  public apellido: string;
  public FechaCita: string;
  public HoraCita: string;
  public esp: string;
}
