import { Component, OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eleccion-cita',
  templateUrl: 'eleccion-cita.page.html',
  styleUrls: ['eleccion-cita.page.scss']
})
export class EleccionCitaPage implements OnInit {
  db: SQLiteObject;
  especialidades: any[] = [];
  especialidadSeleccionada: any;
  mostrarBotonSiguiente: boolean = false;

  constructor(private sqlite: SQLite, private router: Router) {}

  ngOnInit() {
    this.createOpenDatabase();
  }

  createOpenDatabase() {
    this.sqlite
      .create({
        name: 'data.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.db = db;
        console.log('Conectado a la base de datos');
        this.fetchEspecialidades();
      })
      .catch(e => console.log('Error al conectar a la base de datos: ', e));
  }

  fetchEspecialidades() {
    this.db
      .executeSql('SELECT Nombre FROM Especialidad', [])
      .then(data => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.especialidades.push(data.rows.item(i).Nombre);
          }
        }
      })
      .catch(e => console.log('Error al ejecutar la consulta: ', e));
  }

  seleccionarEspecialidad(especialidad: any) {
    this.especialidadSeleccionada = especialidad;
    this.mostrarBotonSiguiente = true;
  }

  irAEleccionFechaHora() {
    if (this.especialidadSeleccionada) {
      // Puedes pasar la especialidad seleccionada como parámetro si es necesario
      this.router.navigate(['/eleccion-fecha-hora']);
    }
  }
}
