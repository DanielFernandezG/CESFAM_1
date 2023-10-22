import { Component, OnInit, ViewChild } from "@angular/core";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";

@Component({
  selector: "app-ficha-medico",
  templateUrl: "./ficha-medico.page.html",
  styleUrls: ["./ficha-medico.page.scss"],
})
export class FichaMedicoPage implements OnInit {
  db: SQLiteObject;
  doctorData: doctor[];
  medicoData: medico[];
  esp: string;
  especialidades: especialidad[];

  constructor(private sqlite: SQLite) {}

  ngOnInit() {
    this.createOpenDatabase();
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
          this.mostrarEspecialidades();
          this.mostrarDoctores();
        })
        .catch((e) => alert(JSON.stringify(e)));
    } catch (err: any) {
      console.log(err);
    }
  }

  mostrarDoctores() {
    this.doctorData = [];

    this.db.executeSql("select * from Doctor", []).then((result) => {
      for (let i = 0; i < result.rows.length; i++) {
        this.obtenerEspecialidad(result.rows.item(i).ID_Especialidad)
          .then((especialidad: string) => {
            this.doctorData.push({
              id: result.rows.item(i).ID_Doctor,
              nombre: result.rows.item(i).Nombre,
              apellido: result.rows.item(i).Apellido,
              especialidad: especialidad,
            });
            this.esp="";
          })
          .catch((error) => {
            console.error("Error al obtener especialidad:", error);
          });
      }
    });
  }

  filtrar() {
    this.doctorData = [];
    if (this.esp != "") {
      this.obtenerIdEspecialidad(this.esp).then((idesp: number) => {
        this.db.executeSql("select * from Doctor where ID_Especialidad=?", [idesp]).then((result) => {
          for (let i = 0; i < result.rows.length; i++) {
            this.obtenerEspecialidad(result.rows.item(i).ID_Especialidad)
              .then((especialidad: string) => {
                this.doctorData.push({
                  id: result.rows.item(i).ID_Doctor,
                  nombre: result.rows.item(i).Nombre,
                  apellido: result.rows.item(i).Apellido,
                  especialidad: especialidad,
                });
              })
              .catch((error) => {
                console.error("Error al obtener especialidad:", error);
              });
          }
        });
      });
    }
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

  isModalOpen = false;

  setOpen(isOpen: boolean, idDoctor: string) {
    this.medicoData = [];

    this.db
      .executeSql("select * from Doctor where ID_Doctor=?", [idDoctor])
      .then((result) => {
        for (let i = 0; i < result.rows.length; i++) {
          this.obtenerEspecialidad(result.rows.item(i).ID_Especialidad)
            .then((especialidad: string) => {
              this.medicoData.push({
                id: result.rows.item(i).ID_Doctor,
                nombre: result.rows.item(i).Nombre,
                apellido: result.rows.item(i).Apellido,
                especialidad: especialidad,
                cesfam: result.rows.item(i).CESFAM,
                estudios: result.rows.item(i).Estudios,
                fecha: result.rows.item(i).FechaNacimiento,
                genero: result.rows.item(i).Genero,
              });
            })
            .catch((error) => {
              console.error("Error al obtener especialidad:", error);
            });
        }
      });
    this.isModalOpen = isOpen;
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
  public especialidad: string;
}

class medico {
  public id: string;
  public nombre: string;
  public apellido: string;
  public especialidad: string;
  public cesfam: string;
  public estudios: string;
  public fecha: string;
  public genero: string;
}
