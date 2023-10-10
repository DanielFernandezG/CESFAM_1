import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { CitasService } from 'src/app/Services/citas.service';

@Component({
  selector: 'app-confirmacion-cita',
  templateUrl: 'confirmacion-cita.page.html',
  styleUrls: ['confirmacion-cita.page.scss']
})
export class ConfirmacionCitaPage  implements OnInit {
  db:SQLiteObject;
  especialidad: string;
  fechaHora: string;
  medico: string;

  constructor(
    private citasService: CitasService,
    private router: Router,
    private sqlite: SQLite
  ) {
    this.especialidad = this.citasService.obtenerEspecialidad();
    this.fechaHora = this.citasService.obtenerFechaHora();
    this.medico = this.citasService.obtenerMedico();
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
        })
        .catch((e) => alert(JSON.stringify(e)));
    } catch (err: any) {
      console.log(err);
    }
  }

  confirmarCita() {
    // Realizar operaciones para confirmar la cita (guardar en la base de datos, enviar notificaciones, etc.)

    // Abrir la base de datos SQLite y guardar la cita
    // this.sqlite.create({
    //   name: 'data.db',
    //   location: 'default'
    // }).then((db: SQLiteObject) => {
    //   db.executeSql('CREATE TABLE IF NOT EXISTS citas (id INTEGER PRIMARY KEY AUTOINCREMENT, especialidad TEXT, fechaHora TEXT, medico TEXT)', [])
    //     .then(() => {
    //       // Insertar datos en la tabla citas
    //       db.executeSql('INSERT INTO citas (especialidad, fechaHora, medico) VALUES (?, ?, ?)',
    //         [this.especialidad, this.fechaHora, this.medico])
    //         .then(() => {
    //           console.log('Cita almacenada en la base de datos SQLite.');
    //         })
    //         .catch(error => {
    //           console.error('Error al guardar la cita en la base de datos SQLite:', error);
    //         });
    //     })
    //     .catch(error => {
    //       console.error('Error al crear la tabla en la base de datos SQLite:', error);
    //     });
    // }).catch(error => {
    //   console.error('Error al abrir la base de datos SQLite:', error);
    // });

    // Después de confirmar, redirigir a la página de inicio y pasar los datos como parámetros de ruta
    this.router.navigate(['/home'], {
      queryParams: {
        especialidad: this.especialidad,
        fechaHora: this.fechaHora,
        medico: this.medico
      }
    });
  }

  cancelarCita() {
    // Operaciones para cancelar la cita si es necesario
    // Después de cancelar, puedes redirigir al usuario de nuevo a la página de inicio o a una página de cancelación
    this.router.navigateByUrl('/home');
  }
}
