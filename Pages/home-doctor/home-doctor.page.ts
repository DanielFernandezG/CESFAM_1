import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-home-doctor",
  templateUrl: "./home-doctor.page.html",
  styleUrls: ["./home-doctor.page.scss"],
})
export class HomeDoctorPage implements OnInit {
  db: SQLiteObject;
  FechaCita: string;
  HoraCita: string;
  ID_Cita: string;
  idDoctor: string;
  doctorData: doctor[];
  mostrarFormularioDeEdicion: boolean = false;
  est: string;
  estados: estado[];
  cita: any;
  citas: any[] = [];
  citaEditada: any = {
    ID_Cita: 0,
    FechaCita: "",
    HoraCita: "",
  };

  constructor(
    private router: Router,
    private sqlite: SQLite,
    private alertController: AlertController
  ) {
    this.cita = {};
  }

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
          this.selectData();
          this.mostrarEstados();
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

  insertData() {
    if (!this.FechaCita || !this.HoraCita) {
      alert("Por favor, ingrese una fecha y una hora válida.");
      return;
    }

    const fechaActual = new Date();
    const fechaCita = new Date(this.FechaCita + "T" + this.HoraCita);

    if (fechaCita <= fechaActual) {
      alert(
        "La fecha y hora de la cita deben ser posteriores a la fecha y hora actual."
      );
      return;
    }

    this.db
      .executeSql("SELECT * FROM usuario WHERE active = 1", [])
      .then((result) => {
        if (result.rows.item(0).run != "") {
          this.db
            .executeSql("SELECT * FROM Doctor WHERE Run = ?", [
              result.rows.item(0).run,
            ])
            .then((result) => {
              this.db
                .executeSql(
                  "SELECT * FROM CitaMedica WHERE FechaCita = ? AND HoraCita = ? AND ID_Doctor=?",
                  [this.FechaCita, this.HoraCita, result.rows.item(0).ID_Doctor]
                )
                .then((result) => {
                  if (result.rows.length > 0) {
                    alert(
                      "Ya existe una cita programada para la misma fecha y hora."
                    );
                  } else {
                    this.db
                      .executeSql("SELECT * FROM usuario WHERE active = 1", [])
                      .then((result) => {
                        if (result.rows.item(0).run != "") {
                          this.db
                            .executeSql("SELECT * FROM Doctor WHERE Run = ?", [
                              result.rows.item(0).run,
                            ])
                            .then((result) => {
                              try {
                                let cita: string =
                                  "INSERT INTO CitaMedica(ID_Doctor, FechaCita, HoraCita, EstadoCita) VALUES(" +
                                  result.rows.item(0).ID_Doctor +
                                  ',"' +
                                  this.FechaCita +
                                  '","' +
                                  this.HoraCita +
                                  '","Disponible");';
                                this.db
                                  .executeSql(cita, [])
                                  .then(() => {
                                    this.selectData();
                                    alert("Datos insertados");
                                  })
                                  .catch((e) => alert(JSON.stringify(e)));
                              } catch {
                                alert("No se pudieron insertar los datos.");
                              }
                            });
                        } else {
                          this.router.navigate(["login"]);
                        }
                      })
                      .catch((e) => alert(JSON.stringify(e)));
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

  async editarCita(cita: any) {
    this.citaEditada.ID_Cita = cita.ID_Cita;
    this.citaEditada.FechaCita = cita.FechaCita;
    this.citaEditada.HoraCita = cita.HoraCita;

    this.mostrarFormularioDeEdicion = true;
  }

  async guardarCambios() {
    if (!this.citaEditada.FechaCita || !this.citaEditada.HoraCita) {
      alert("Por favor, complete tanto la fecha como la hora de la cita.");
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

      this.citaEditada = {
        ID_Cita: 0,
        FechaCita: "",
        HoraCita: "",
      };
      this.mostrarFormularioDeEdicion = false;

      this.selectData();
    } catch (error) {
      alert(
        "Error al guardar los cambios en la cita. Por favor, inténtalo de nuevo."
      );
      console.error(error);
    }
  }

  async confirmacionDelete(idCita: string) {
    const alert = await this.alertController.create({
      header: "Confirmación",
      message: "¿Seguro que deseas eliminar esta cita médica?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {},
        },
        {
          text: "Eliminar",
          handler: () => {
            this.deleteRecord(idCita);
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteRecord(idCita: string) {
    try {
      await this.db.executeSql("DELETE FROM CitaMedica WHERE ID_Cita = ?", [
        idCita,
      ]);
      this.selectData();
    } catch (error) {
      console.error("Error al eliminar la cita médica", error);
    }
  }

  selectData() {
    this.doctorData = [];
    const currentDate = new Date();

    this.db
      .executeSql("SELECT * FROM usuario WHERE active = 1", [])
      .then((result) => {
        if (result.rows.item(0).run != "") {
          this.db
            .executeSql("SELECT * FROM Doctor WHERE Run = ?", [
              result.rows.item(0).run,
            ])
            .then((result) => {
              this.db
                .executeSql("select * from CitaMedica where ID_Doctor=? AND FechaCita >= ?", [
                  result.rows.item(0).ID_Doctor, currentDate.toISOString()
                ])
                .then((result) => {
                  for (let i = 0; i < result.rows.length; i++) {
                    this.doctorData.push({
                      ID_Cita: result.rows.item(i).ID_Cita,
                      HoraCita: result.rows.item(i).HoraCita,
                      FechaCita: result.rows.item(i).FechaCita,
                      EstadoCita: result.rows.item(i).EstadoCita,
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

  async selectDataOcupadas() {
    this.doctorData = [];

    const currentDate = new Date();

    this.db
      .executeSql("SELECT * FROM usuario WHERE active = 1", [])
      .then((result) => {
        if (result.rows.item(0).run != "") {
          this.db
            .executeSql("SELECT * FROM Doctor WHERE Run = ?", [
              result.rows.item(0).run,
            ])
            .then((result) => {
              this.db
                .executeSql(
                  "select * from CitaMedica where EstadoCita = ? and ID_Doctor=? AND FechaCita >= ?",
                  [this.est, result.rows.item(0).ID_Doctor, currentDate.toISOString()]
                )
                .then((result) => {
                  for (let i = 0; i < result.rows.length; i++) {
                    this.doctorData.push({
                      ID_Cita: result.rows.item(i).ID_Cita,
                      HoraCita: result.rows.item(i).HoraCita,
                      FechaCita: result.rows.item(i).FechaCita,
                      EstadoCita: result.rows.item(i).EstadoCita,
                    });
                  }
                });
            });
        } else {
          this.router.navigate(["login"]);
        }
      })
      .catch((e) => alert(JSON.stringify(e)));
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
}

class doctor {
  public ID_Cita: string;
  public HoraCita: string;
  public FechaCita: string;
  public EstadoCita: string;
}

class estado {
  public descripcion: string;
}
