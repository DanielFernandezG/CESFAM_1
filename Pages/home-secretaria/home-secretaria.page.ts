import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Component({
  selector: 'app-home-secretaria',
  templateUrl: './home-secretaria.page.html',
  styleUrls: ['./home-secretaria.page.scss'],
})
export class HomeSecretariaPage {
  db: SQLiteObject;
  citasFiltradas: any[] = [];
  selectedDate: string = ''; // Fecha seleccionada por el usuario
  citaEditada: any = null;

  constructor(private sqlite: SQLite) {
    // Inicializa la base de datos
    this.createOpenDatabase();
  }

  ngOnInit() {
    // No se requiere cargar datos en la inicialización, ya que se hace al filtrar citas.
  }

  async createOpenDatabase() {
    try {
      this.sqlite
        .create({
          name: 'data.db',
          location: 'default',
        })
        .then((db: SQLiteObject) => {
          this.db = db;
          console.log('Conectado');
        })
        .catch((e) => alert(JSON.stringify(e)));
    } catch (err: any) {
      console.log(err);
    }
  }

  async filtrarCitas() {
    if (this.selectedDate !== '') {
      try {
        const result = await this.db.executeSql(
          'SELECT c.ID_Cita, d.Nombre AS NombreDoctor, d.Apellido AS ApellidoDoctor, c.FechaCita, c.HoraCita ' +
          'FROM CitaMedica c ' +
          'INNER JOIN Doctor d ON c.ID_Doctor = d.ID_Doctor ' +
          'WHERE c.FechaCita = ?',
          [this.selectedDate]
        );
        if (result.rows.length > 0) {
          this.citasFiltradas = [];
          for (let i = 0; i < result.rows.length; i++) {
            this.citasFiltradas.push(result.rows.item(i));
          }
        } else {
          this.citasFiltradas = [];
          console.log('No se encontraron citas para la fecha seleccionada.');
        }
      } catch (error) {
        console.error('Error al filtrar las citas', error);
      }
    } else {
      this.citasFiltradas = [];
      console.log('No se ha seleccionado una fecha.');
    }
  }

  editarCita(cita: any) {
    // Mostrar el formulario de edición y cargar los datos de la cita
    this.citaEditada = {
      ID_Cita: cita.ID_Cita,
      FechaCita: cita.FechaCita,
      HoraCita: cita.HoraCita,
    };
  }

  async guardarCambios() {
    if (this.citaEditada) {
      try {
        await this.db.executeSql(
          'UPDATE CitaMedica SET FechaCita = ?, HoraCita = ? WHERE ID_Cita = ?',
          [this.citaEditada.FechaCita, this.citaEditada.HoraCita, this.citaEditada.ID_Cita]
        );
        this.citaEditada = null; // Limpiar el objeto de edición
        this.filtrarCitas(); // Actualizar la lista de citas después de editar
      } catch (error) {
        console.error('Error al guardar los cambios en la cita', error);
      }
    }
  }

  async eliminarCita(idCita: number) {
    try {
      await this.db.executeSql('DELETE FROM CitaMedica WHERE ID_Cita = ?', [idCita]);
      this.filtrarCitas(); // Actualizar la lista de citas después de eliminar
    } catch (error) {
      console.error('Error al eliminar la cita médica', error);
    }
  }
}
