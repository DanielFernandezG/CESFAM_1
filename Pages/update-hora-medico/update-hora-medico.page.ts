import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Component({
  selector: 'app-update-hora-medico',
  templateUrl: './update-hora-medico.page.html',
  styleUrls: ['./update-hora-medico.page.scss'],
})
export class UpdateHoraMedicoPage {
  citaId: string; // Cambiado a string
  cita: any = {
    FechaCita: '', // La fecha se mantiene como una cadena en formato 'YYYY-MM-DD'
    HoraCita: '', // La hora se mantiene como una cadena en formato 'HH:mm'
  };
  db: SQLiteObject;

  constructor(
    private route: ActivatedRoute,
    private sqlite: SQLite
  ) {
    const paramMap = this.route.snapshot.paramMap;
    if (paramMap) {
      const citaIdValue = paramMap.get('citaId');
      if (citaIdValue !== null) {
        this.citaId = citaIdValue;
      } else {
        // Manejar el caso en el que 'citaId' sea null, por ejemplo, mostrar un mensaje de error o redirigir.
      }
    }

    this.createDatabase();
    this.loadCita();
  }

  async createDatabase() {
    try {
      this.sqlite
        .create({
          name: 'data.db',
          location: 'default',
        })
        .then((db: SQLiteObject) => {
          this.db = db;
          console.log("Conectado a la base de datos 'data.db'");
        })
        .catch((e) => console.error(JSON.stringify(e)));
    } catch (error) {
      console.error(error);
    }
  }

  async loadCita() {
    try {
      const result = await this.db.executeSql('SELECT * FROM CitaMedica WHERE ID_Cita = ?', [this.citaId]);
      if (result.rows.length > 0) {
        this.cita = result.rows.item(0);
      }
    } catch (error) {
      console.error('Error al cargar la cita', error);
    }
  }

  async guardarCambios() {
    try {
      await this.db.executeSql('UPDATE CitaMedica SET FechaCita = ?, HoraCita = ? WHERE ID_Cita = ?',
        [this.cita.FechaCita, this.cita.HoraCita, this.citaId]);

      // Navega de regreso a la página anterior o realiza alguna acción adecuada después de guardar los cambios.
    } catch (error) {
      console.error('Error al guardar los cambios en la cita', error);
    }
  }
}
