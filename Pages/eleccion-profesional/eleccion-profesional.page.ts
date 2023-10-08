import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Component({
  selector: 'eleccion-profesional',
  templateUrl: 'eleccion-profesional.page.html',
  styleUrls: ['eleccion-profesional.page.scss']
})
export class EleccionProfesionalPage {
  especialidades: { id: number, nombre: string }[];
  medicos: { id: number, nombre: string }[];
  especialidadSeleccionada: number;
  medicoSeleccionado: { id: number, nombre: string };

  constructor(private sqlite: SQLite) {}

  ionViewWillEnter() {
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT ID_Especialidad, Nombre FROM Especialidad', []).then((data) => {
        this.especialidades = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.especialidades.push({
              id: data.rows.item(i).ID_Especialidad,
              nombre: data.rows.item(i).Nombre
            });
          }
        }
      }).catch((error) => {
        console.error('Error al cargar especialidades desde la base de datos: ' + JSON.stringify(error));
      });
    }).catch((error) => {
      console.error('Error al abrir la base de datos: ' + JSON.stringify(error));
    });
  }

  cargarMedicos(idEspecialidad: number) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT ID_Doctor, Nombre FROM Doctor WHERE idEspecialidad = ?', [idEspecialidad])
        .then((data) => {
          this.medicos = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              this.medicos.push({
                id: data.rows.item(i).ID_Doctor,
                nombre: data.rows.item(i).Nombre
              });
            }
          }
        })
        .catch((error) => {
          console.error('Error al cargar médicos desde la base de datos: ' + JSON.stringify(error));
        });
    }).catch((error) => {
      console.error('Error al abrir la base de datos: ' + JSON.stringify(error));
    });
  }

  seleccionarMedico(medico: { id: number, nombre: string }) {
    this.medicoSeleccionado = medico;
  }

  ingresar() {
    if (this.especialidadSeleccionada && this.medicoSeleccionado) {
      // Aquí puedes usar this.especialidadSeleccionada y this.medicoSeleccionado para las operaciones necesarias.
      console.log('Especialidad seleccionada:', this.especialidadSeleccionada);
      console.log('Médico seleccionado:', this.medicoSeleccionado);
      // Continúa con tus operaciones aquí
    } else {
      alert('Por favor, seleccione una especialidad y un médico.');
    }
  }
}


