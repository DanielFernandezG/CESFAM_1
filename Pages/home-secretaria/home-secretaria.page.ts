import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-home-secretaria",
  templateUrl: "./home-secretaria.page.html",
  styleUrls: ["./home-secretaria.page.scss"],
})
export class HomeSecretariaPage {
  db: SQLiteObject;
  citaEditada: any = null;
  especialidad: string;
  idEsp: number;
  citaData: cita[];
  esp: string;
  est: string;
  id: string;
  doc: string;
  pac: string;
  pacientes: paciente[];
  especialidades: especialidad[];
  doctores: doctor[];
  estados: estado[];

  constructor(
    private router: Router,
    private sqlite: SQLite,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.createOpenDatabase();
  }

  cerrarSesion() {
    this.db
      .executeSql("UPDATE Usuario SET active=0 where active=1", [])
      .then((result) => console.log("Sesión Cambiada"))
      .catch((e) => console.log(JSON.stringify(e)));
    this.router.navigate([""]);
  }

  async createOpenDatabase() {
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
          this.mostrarEspecialidades();
          this.mostrarDoctores();
          this.mostrarEstados();
        })
        .catch((e) => alert(JSON.stringify(e)));
    } catch (err: any) {
      console.log(err);
    }
  }

  mostrarCita() {
    this.citaData = [];

    this.db
      .executeSql(
        "select * from citaMedica join Doctor on citaMedica.ID_Doctor=Doctor.ID_Doctor",
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
                estado: result.rows.item(i).EstadoCita,
                esp: this.especialidad,
              });
              this.esp = "";
              this.doc = "";
              this.est = "";
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
            "select * from citaMedica join Doctor on citaMedica.ID_Doctor=Doctor.ID_Doctor where EstadoCita=? or (Doctor.Nombre||' '||Doctor.Apellido=? or ID_Especialidad=?)",
            [this.est, this.doc, this.idEsp]
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
                    estado: result.rows.item(i).EstadoCita,
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
          "select * from citaMedica join Doctor on citaMedica.ID_Doctor=Doctor.ID_Doctor where EstadoCita=? or (Doctor.Nombre||' '||Doctor.Apellido=? or ID_Especialidad=?)",
          [this.est, this.doc, this.idEsp]
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
                  estado: result.rows.item(i).EstadoCita,
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

  // corregir
  editarCita(cita: any) {
    this.citaEditada = {
      ID_Cita: cita.id_cita,
      FechaCita: cita.FechaCita,
      HoraCita: cita.HoraCita,
    };
  }

  async guardarCambios() {
    if (this.citaEditada) {
      if (!this.citaEditada.FechaCita || !this.citaEditada.HoraCita) {
        alert("Por favor, llene todos los campos.");
        return;
      }

      const fechaActual = new Date();
      const fechaCita = new Date(
        this.citaEditada.FechaCita + "T" + this.citaEditada.HoraCita
      );

      if (fechaCita <= fechaActual) {
        alert(
          "La fecha y hora de la cita deben ser posteriores a la fecha y hora actual."
        );
        return;
      }

      const result = await this.db.executeSql(
        "SELECT * FROM CitaMedica WHERE FechaCita = ? AND HoraCita = ? AND ID_Cita != ?",
        [
          this.citaEditada.FechaCita,
          this.citaEditada.HoraCita,
          this.citaEditada.ID_Cita,
        ]
      );

      if (result.rows.length > 0) {
        alert("Ya existe una cita programada para la misma fecha y hora.");
        return;
      }

      try {
        await this.db.executeSql(
          "UPDATE CitaMedica SET FechaCita = ?, HoraCita = ? WHERE ID_Cita = ?",
          [
            this.citaEditada.FechaCita,
            this.citaEditada.HoraCita,
            this.citaEditada.ID_Cita,
          ]
        );
        this.citaEditada = null;
        this.mostrarCita();
      } catch (error) {
        console.error("Error al guardar los cambios en la cita", error);
      }
    }
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

  async eliminarCita(idCita: string) {
    const confirmacion = await this.mostrarConfirmacion();

    if (confirmacion) {
      try {
        await this.db.executeSql("DELETE FROM CitaMedica WHERE ID_Cita = ?", [
          idCita,
        ]);
        this.mostrarCita();
      } catch (error) {
        console.error("Error al eliminar la cita médica", error);
      }
    }
  }

  async mostrarConfirmacion(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: "Confirmación",
        message: "¿Seguro que deseas eliminar esta cita médica?",
        buttons: [
          {
            text: "Cancelar",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              resolve(false);
            },
          },
          {
            text: "Eliminar",
            handler: () => {
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  tomarHora(idCita: string, idPac: string) {
    this.db
      .executeSql(
        "update citaMedica set ID_Paciente=?,EstadoCita='Ocupada' where ID_Cita=?",
        [idPac, idCita]
      )
      .then((result) => {
        this.mostrarCita();
        alert("Hora Tomada");
        this.router.navigate(["home-secretaria"]).then(() => {
          // Recarga la página actual
          window.location.reload();
        });
      });
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

  mostrarEstados() {
    this.estados = [];

    this.db
      .executeSql("select DISTINCT(EstadoCita) AS Estado from CitaMedica ", [])
      .then((result) => {
        for (let i = 0; i < result.rows.length; i++) {
          this.estados.push({
            descripcion: result.rows.item(i).Estado,
          });
        }
      });
  }

  mostrarPacientes() {
    this.pacientes = [];

    this.db.executeSql("select * from paciente ", []).then((result) => {
      for (let i = 0; i < result.rows.length; i++) {
        this.pacientes.push({
          id: result.rows.item(i).ID_Paciente,
          nombre: result.rows.item(i).Nombre,
          apellido: result.rows.item(i).Apellido,
        });
      }
    });
  }

  confirmarToma() {
    this.db
      .executeSql("select * from paciente where Nombre||' '||Apellido=?", [
        this.pac,
      ])
      .then((result) => {
        this.tomarHora(this.id, result.rows.item(0).ID_Paciente);
      });
  }

  modalVisible = false;

  abrirModal(id: string, estado: string) {
    if (estado == "Disponible") {
      this.id = id;
      this.mostrarPacientes();
      this.modalVisible = true;
    } else {
      alert("La Cita no se Encuentra Disponible");
      this.modalVisible = false;
    }
  }

  cerrarModal() {
    this.modalVisible = false;
  }
}

class especialidad {
  public id: string;
  public descripcion: string;
}

class estado {
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
  public estado: string;
  public esp: string;
}

class paciente {
  public id: string;
  public nombre: string;
  public apellido: string;
}
