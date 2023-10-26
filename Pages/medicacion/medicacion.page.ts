import { Component, OnInit } from '@angular/core';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";

@Component({
  selector: 'app-medicacion',
  templateUrl: './medicacion.page.html',
  styleUrls: ['./medicacion.page.scss'],
})
export class MedicacionPage implements OnInit {
  selectedDate: string;
  selectedTime: string;
  db: SQLiteObject;

  constructor(private sqlite: SQLite) {
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
        })
        .catch((e) => console.error("Error al abrir la base de datos:", e));
    } catch (err: any) {
      console.error("Error al abrir la base de datos:", err);
    }
  }

  async scheduleNotification() {
    if (!this.selectedDate || !this.selectedTime) {
      alert('Por favor, seleccione una fecha y una hora.');
      return;
    }

    const scheduledDateTime = new Date(`${this.selectedDate}T${this.selectedTime}`);
    const now = new Date();
    if (scheduledDateTime <= now) {
      alert('La fecha y hora deben ser posteriores a la hora actual.');
      return;
    }

    const options: ScheduleOptions = {
      notifications: [
        {
          id: 111,
          title: 'Recordatorio de medicación',
          body: 'Es hora de tomar su medicamento',
          schedule: { at: scheduledDateTime },
        },
      ],
    };

    try {
      await LocalNotifications.schedule(options);
      alert('Notificación programada con éxito.');

      // Almacena los datos en la tabla de la base de datos
      this.insertMedicationData(scheduledDateTime);

    } catch (ex) {
      alert('Error al programar la notificación: ' + JSON.stringify(ex));
    }
  }

  insertMedicationData(scheduledDateTime: Date) {
    // Define los datos para insertar en la tabla
    const data = {
      ID_Paciente: 1, // ID del paciente (ajusta según la sesión)
      ID_Medicamento: 1, // ID del medicamento (ajusta según elección del paciente)
      FechaInicio: this.selectedDate,
      FechaFin: this.selectedDate,
      HoraToma: this.selectedTime,
      EstadoToma: 'Pendiente',
    };

    // Inserta los datos en la tabla de la base de datos
    this.db
      .executeSql(
        'INSERT INTO RegistroMedicacion (ID_Paciente, ID_Medicamento, FechaInicio, FechaFin, HoraToma, EstadoToma) VALUES (?, ?, ?, ?, ?, ?)',
        [
          data.ID_Paciente,
          data.ID_Medicamento,
          data.FechaInicio,
          data.FechaFin,
          data.HoraToma,
          data.EstadoToma,
        ]
      )
      .then(() => {
        console.log('Datos de medicación insertados en la base de datos.');
      })
      .catch((error) => {
        console.error('Error al insertar datos de medicación: ', error);
      });
  }
}
