import { Component, OnInit } from "@angular/core";
import { LocalNotifications, ScheduleOptions } from "@capacitor/local-notifications";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { Router } from "@angular/router";

@Component({
  selector: "app-retiro",
  templateUrl: "./retiro.page.html",
  styleUrls: ["./retiro.page.scss"],
})
export class RetiroPage implements OnInit {
  selectedDate: string;
  med: string;
  selectedTime: string;
  db: SQLiteObject;
  medicamentos: medicamento[];
  medicamentoData: med[];

  constructor(private sqlite: SQLite, private router: Router) {
    this.createOpenDatabase();
  }

  ngOnInit() {}

  createOpenDatabase() {
    try {
      this.sqlite
        .create({
          name: "data.db",
          location: "default",
        })
        .then((db: SQLiteObject) => {
          this.db = db;
          console.log("Conectado a la base de datos");
          this.mostrarInfo();
          this.mostrarMedicamentos();
        })
        .catch((e) => console.error("Error al abrir la base de datos:", e));
    } catch (err: any) {
      console.error("Error al abrir la base de datos:", err);
    }
  }

  mostrarInfo() {
    this.medicamentoData = [];

    this.db
      .executeSql("SELECT * FROM usuario WHERE active = 1", [])
      .then((result) => {
        if (result.rows.item(0).run != "") {
          this.db
            .executeSql("SELECT * FROM Paciente WHERE Run = ?", [
              result.rows.item(0).run,
            ])
            .then((result) => {
              this.db
                .executeSql(
                  "select * from RecordatorioMedicacion where ID_Paciente=?",
                  [result.rows.item(0).ID_Paciente]
                )
                .then((result) => {
                  for (let i = 0; i < result.rows.length; i++) {
                    this.obtenerNombreMedicamento(
                      result.rows.item(i).ID_Medicamento
                    )
                      .then((Medicamento: string) => {
                        this.medicamentoData.push({
                          id: result.rows.item(i).ID_RecordatorioMedicacion,
                          descripcion: Medicamento,
                          fechainicio: result.rows.item(i).FechaRetiro,
                          hora: result.rows.item(i).HoraRetiro,
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

  eliminarMed(id: string) {
    this.db.executeSql("DELETE FROM RecordatorioMedicacion WHERE ID_RecordatorioMedicacion = ?", [id]);
    this.mostrarInfo();
  }

  async scheduleNotification() {
    if (!this.selectedDate || !this.selectedTime) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const scheduledDateTime = new Date(`${this.selectedDate}T${this.selectedTime}`);
    const now = new Date();
    if (scheduledDateTime <= now) {
      alert("La fecha y hora deben ser posteriores a la hora actual.");
      return;
    }

    const options: ScheduleOptions = {
      notifications: [
        {
          id: 1,
          title: this.med,
          body: "Llegó el día de retirar su medicamento",
          schedule: { at: scheduledDateTime },
        },
      ],
    };

    try {
      await LocalNotifications.schedule(options);
      alert("Notificación programada con éxito.");

      // Almacena los datos en la tabla de la base de datos
      this.insertMedicationData();
    } catch (ex) {
      alert("Error al programar la notificación: " + JSON.stringify(ex));
    }
  }

  insertMedicationData() {
    this.obtenerIdMedicamento(this.med).then((idesp: string) => {
      this.db
        .executeSql("select * from usuario where active = 1", [])
        .then((result) => {
          if (result.rows.item(0).run != "") {
            this.db
              .executeSql("select * from paciente where run=?", [
                result.rows.item(0).run,
              ])
              .then((result) => {
                const data = {
                  ID_Paciente: result.rows.item(0).ID_Paciente,
                  ID_Medicamento: idesp,
                  FechaRetiro: this.selectedDate,
                  HoraRetiro: this.selectedTime,
                };

                this.db
                  .executeSql(
                    "INSERT INTO RecordatorioMedicacion (ID_Paciente, ID_Medicamento, FechaRetiro, HoraRetiro) VALUES (?, ?, ?, ?)",
                    [data.ID_Paciente, data.ID_Medicamento, data.FechaRetiro, data.HoraRetiro]
                  )
                  .then(() => {
                    console.log("Datos de medicación insertados en la base de datos.");
                    this.mostrarInfo();
                    this.selectedDate = "";
                    this.selectedTime = "";
                    this.med = "";
                  })
                  .catch((error) => {
                    console.error("Error al insertar datos de medicación: ", error);
                  });
              });
          } else {
            this.router.navigate(["login"]);
          }
        })
        .catch((e) => alert(JSON.stringify(e)));
    });
  }

  mostrarMedicamentos() {
    this.medicamentos = [];

    this.db.executeSql("select * from Medicamento ", []).then((result) => {
      for (let i = 0; i < result.rows.length; i++) {
        this.medicamentos.push({
          id: result.rows.item(i).ID_Medicamento,
          descripcion: result.rows.item(i).NombreMedicamento,
        });
      }
    });
  }

  async obtenerNombreMedicamento(idMedicamento: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const result = await this.db.executeSql(
          "SELECT NombreMedicamento FROM Medicamento WHERE ID_Medicamento=?",
          [idMedicamento]
        );

        if (result.rows.length > 0) {
          const nombreMedicamento = result.rows.item(0).NombreMedicamento;
          resolve(nombreMedicamento);
        } else {
          reject(new Error("Medicamento no encontrado"));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }
  showContent: boolean = false;

  async obtenerIdMedicamento(nombreMedicamento: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.db
        .executeSql(
          "SELECT ID_Medicamento FROM Medicamento WHERE NombreMedicamento=?",
          [nombreMedicamento]
        )
        .then((result) => {
          if (result.rows.length > 0) {
            const idMedicamento = result.rows.item(0).ID_Medicamento;
            resolve(idMedicamento);
          } else {
            reject(new Error("Medicamento no encontrado"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

class medicamento {
  public id: string;
  public descripcion: string;
}

class med {
  public id: string;
  public descripcion: string;
  public fechainicio: string;
  public hora: string;
 
}
