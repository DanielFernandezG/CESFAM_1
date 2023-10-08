import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Component({
  selector: 'app-eleccion-cita',
  templateUrl: 'eleccion-cita.page.html',
  styleUrls: ['eleccion-cita.page.scss']
})
export class EleccionCitaPage {
  especialidades: string[];
  especialidadSeleccionada: string;

  constructor(private router: Router, private sqlite: SQLite) {}

  // Cargar especialidades desde la base de datos SQLite
  cargarEspecialidades() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT Nombre FROM Especialidad', []).then((data) => {
        this.especialidades = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.especialidades.push(data.rows.item(i).Nombre);
          }
        }
      }).catch((error) => {
        console.log('Error al ejecutar la consulta: ' + JSON.stringify(error));
      });
    }).catch((error) => {
      console.log('Error al abrir la base de datos: ' + JSON.stringify(error));
    });
  }

  ionViewWillEnter() {
    this.cargarEspecialidades();
  }

  ingresar() {
    if (this.especialidadSeleccionada) {
      // Aquí puedes realizar las acciones necesarias al seleccionar una especialidad
      console.log('Especialidad seleccionada:', this.especialidadSeleccionada);
      this.router.navigateByUrl('/eleccion-fecha-hora');
    } else {
      alert('Por favor, seleccione una especialidad.');
    }
  }
}

