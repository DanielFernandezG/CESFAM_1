import { Component, OnInit } from "@angular/core";
import { LocalNotifications, ScheduleOptions } from "@capacitor/local-notifications";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { Router } from "@angular/router";
@Component({
  selector: "app-medicacion",
  templateUrl: "./medicacion.page.html",
  styleUrls: ["./medicacion.page.scss"],
})
export class MedicacionPage implements OnInit {
  selectedDate: string;
  med: string;
  selectedTime: string;
  db: SQLiteObject;
  medicamentos: medicamento[];

  constructor(
    private sqlite: SQLite,
    private router: Router
    ) {
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
          this.mostrarMedicamentos();
        })
        .catch((e) => console.error("Error al abrir la base de datos:", e));
    } catch (err: any) {
      console.error("Error al abrir la base de datos:", err);
    }
  }

  async scheduleNotification() {
    if (!this.selectedDate || !this.selectedTime) {
      alert("Por favor, seleccione una fecha y una hora.");
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
      notifications: [
        {
          id: 111,
          title: "Recordatorio de medicación",
          body: "Es hora de tomar su medicamento",
          schedule: { at: scheduledDateTime },
        },
      ],
    };

    try {
      await LocalNotifications.schedule(options);
      alert("Notificación programada con éxito.");

      // Almacena los datos en la tabla de la base de datos
      this.insertMedicationData(scheduledDateTime);
    } catch (ex) {
      alert("Error al programar la notificación: " + JSON.stringify(ex));
    }
  }

  insertMedicationData(scheduledDateTime: Date) {
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
                  ID_Paciente: result.rows.item(0).ID_Paciente, // ID del paciente (ajusta según la sesión)
                  ID_Medicamento: idesp, // ID del medicamento (ajusta según elección del paciente)
                  FechaInicio: this.selectedDate,
                  FechaFin: this.selectedDate,
                  HoraToma: this.selectedTime,
                  EstadoToma: "Pendiente",
                };

                // Inserta los datos en la tabla de la base de datos
                this.db
                  .executeSql("INSERT INTO RegistroMedicacion (ID_Paciente, ID_Medicamento, FechaInicio, FechaFin, HoraToma, EstadoToma) VALUES (?, ?, ?, ?, ?, ?)",[data.ID_Paciente,data.ID_Medicamento,data.FechaInicio,data.FechaFin,data.HoraToma,data.EstadoToma])
                  .then(() => {
                    console.log("Datos de medicación insertados en la base de datos.");
                  })
                  .catch((error) => {
                    console.error("Error al insertar datos de medicación: ",error);
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

    this.db
      .executeSql("select * from Medicamento ", [])
      .then((result) => {
        for (let i = 0; i < result.rows.length; i++) {
          this.medicamentos.push({
            id: result.rows.item(i).ID_Medicamento,
            descripcion: result.rows.item(i).NombreMedicamento,
          });
        }
      });
  }

  async obtenerIdMedicamento(nombreMedicamento: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.db
        .executeSql("SELECT ID_Medicamento FROM Medicamento WHERE NombreMedicamento=?", [
          nombreMedicamento,
        ])
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