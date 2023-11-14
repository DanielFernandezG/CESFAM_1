import { Component, OnInit } from "@angular/core";
import {
  LocalNotifications,
  ScheduleOptions,
} from "@capacitor/local-notifications";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { Router } from "@angular/router";

@Component({
  selector: "app-medicacion",
  templateUrl: "./medicacion.page.html",
  styleUrls: ["./medicacion.page.scss"],
})
export class MedicacionPage implements OnInit {
  selectedDate: string;
  selectedEndDate: string; // Agrega esta línea
  med: string;
  selectedTime: string;
  notificationInterval: number; // Nuevo campo para el intervalo
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
                  "select * from RegistroMedicacion where ID_Paciente=?",
                  [result.rows.item(0).ID_Paciente]
                )
                .then((result) => {
                  for (let i = 0; i < result.rows.length; i++) {
                    this.obtenerNombreMedicamento(
                      result.rows.item(i).ID_Medicamento
                    )
                      .then((Medicamento: string) => {
                        this.medicamentoData.push({
                          id: result.rows.item(i).ID_RegistroMedicacion,
                          descripcion: Medicamento,
                          fechainicio: result.rows.item(i).FechaInicio,
                          hora: result.rows.item(i).HoraToma,
                          fechatermino: result.rows.item(i).FechaFin,
                          intervalo: result.rows.item(i).IntervaloToma,
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
    this.db.executeSql("DELETE FROM RegistroMedicacion WHERE ID_RegistroMedicacion = ?", [id]);
    this.mostrarInfo();
  }

  msotrarAgregar(){

  }

  toggleContent() {
    this.showContent = !this.showContent;
  }
  showContent: boolean = false;

  async scheduleNotification() {
    if (
      !this.selectedDate ||
      !this.selectedTime ||
      !this.notificationInterval
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const scheduledDateTime = new Date(
      `${this.selectedDate}T${this.selectedTime}`
    );
    const now = new Date();
    if (scheduledDateTime <= now) {
      alert("La fecha y hora deben ser posteriores a la hora actual.");
      return;
    }

    const options: ScheduleOptions = {
      notifications: [],
    };

    const numberOfNotifications = Math.floor(24 / this.notificationInterval); // Calcula el número de notificaciones en un día

    for (let i = 0; i < numberOfNotifications; i++) {
      const currentDateTime = new Date(scheduledDateTime);
      currentDateTime.setHours(
        scheduledDateTime.getHours() + i * this.notificationInterval
      );

      if (currentDateTime <= now) {
        // No progresa notificaciones pasadas
        continue;
      }

      options.notifications.push({
        id: i + 1,
        title: this.med,
        body: "Es hora de tomar su medicamento!!",
        schedule: { at: currentDateTime },
      });
    }

    if (options.notifications.length === 0) {
      alert("No hay notificaciones futuras programadas.");
      return;
    }

    try {
      await LocalNotifications.schedule(options);
      alert("Notificacion programada con éxito.");

      // Formatea la fecha de finalización en el formato deseado (YYYY-MM-DD)
      const formattedEndDate = this.formatDate(new Date(this.selectedEndDate));

      // Almacena los datos en la tabla de la base de datos
      this.insertMedicationData(formattedEndDate);
      this.toggleContent();
    } catch (ex) {
      alert("Error al programar la notificacion: " + JSON.stringify(ex));
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  insertMedicationData(formattedEndDate: string) {
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
                // Define los datos para insertar en la tabla
                const data = {
                  ID_Paciente: result.rows.item(0).ID_Paciente,
                  ID_Medicamento: idesp,
                  FechaInicio: this.selectedDate,
                  FechaFin: formattedEndDate, // Usamos la fecha formateada
                  HoraToma: this.selectedTime,
                  IntervaloToma: this.notificationInterval
                };

                // Inserta los datos en la tabla de la base de datos
                this.db
                  .executeSql(
                    "INSERT INTO RegistroMedicacion (ID_Paciente, ID_Medicamento, FechaInicio, FechaFin, HoraToma, IntervaloToma) VALUES (?, ?, ?, ?, ?, ?)",
                    [
                      data.ID_Paciente,
                      data.ID_Medicamento,
                      data.FechaInicio,
                      data.FechaFin,
                      data.HoraToma,
                      data.IntervaloToma
                    ]
                  )
                  .then(() => {
                    console.log(
                      "Datos de medicación insertados en la base de datos."
                    );
                    this.mostrarInfo();
                    this.selectedDate = "";
                    this.selectedEndDate = "";
                    this.selectedTime = "";
                    this.med = "";
                    this.notificationInterval = 0;
                  })
                  .catch((error) => {
                    console.error(
                      "Error al insertar datos de medicación: ",
                      error
                    );
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
  public fechatermino: string;
  public intervalo: string;
}