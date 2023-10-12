import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home-secretaria',
  templateUrl: './home-secretaria.page.html',
  styleUrls: ['./home-secretaria.page.scss'],
})
export class HomeSecretariaPage {
  db: SQLiteObject;
  citasFiltradas: any[] = [];
  selectedDate: string = ''; 
  citaEditada: any = null;

  constructor(
    private router: Router,
    private sqlite: SQLite,
    private alertController: AlertController
  ) {
    this.createOpenDatabase();
  }

  ngOnInit() {
    
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
          this.mostrarCitasDelDiaActual(); 
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

  async filtrarCitasOcupadas() {
    if (this.selectedDate !== '') {
      try {
        const result = await this.db.executeSql(
          'SELECT c.ID_Cita, d.Nombre AS NombreDoctor, d.Apellido AS ApellidoDoctor, c.FechaCita, c.HoraCita ' +
          'FROM CitaMedica c ' +
          'INNER JOIN Doctor d ON c.ID_Doctor = d.ID_Doctor ' +
          'WHERE c.FechaCita = ? AND c.EstadoCita = "Ocupada"',
          [this.selectedDate]
        );
  
        if (result.rows.length > 0) {
          this.citasFiltradas = [];
          for (let i = 0; i < result.rows.length; i++) {
            this.citasFiltradas.push(result.rows.item(i));
          }
        } else {
          this.citasFiltradas = [];
          console.log('No se encontraron citas ocupadas para la fecha seleccionada.');
        }
      } catch (error) {
        console.error('Error al filtrar las citas', error);
      }
    } else {
      this.citasFiltradas = [];
      console.log('No se ha seleccionado una fecha.');
    }
  }
  
  async filtrarCitasDisponibles() {
    if (this.selectedDate !== '') {
      try {
        const result = await this.db.executeSql(
          'SELECT c.ID_Cita, d.Nombre AS NombreDoctor, d.Apellido AS ApellidoDoctor, c.FechaCita, c.HoraCita ' +
          'FROM CitaMedica c ' +
          'INNER JOIN Doctor d ON c.ID_Doctor = d.ID_Doctor ' +
          'WHERE c.FechaCita = ? AND c.EstadoCita = "Disponible"',
          [this.selectedDate]
        );
  
        if (result.rows.length > 0) {
          this.citasFiltradas = [];
          for (let i = 0; i < result.rows.length; i++) {
            this.citasFiltradas.push(result.rows.item(i));
          }
        } else {
          this.citasFiltradas = [];
          console.log('No se encontraron citas disponibles para la fecha seleccionada.');
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
    this.citaEditada = {
      ID_Cita: cita.ID_Cita,
      FechaCita: cita.FechaCita,
      HoraCita: cita.HoraCita,
    };
  }

  async guardarCambios() {
    if (this.citaEditada) {
      if (!this.citaEditada.FechaCita || !this.citaEditada.HoraCita) {
        
        alert('Por favor, llene todos los campos.');
        return;
      }
  
      const fechaActual = new Date();
      const fechaCita = new Date(this.citaEditada.FechaCita + 'T' + this.citaEditada.HoraCita);
  
      if (fechaCita <= fechaActual) {
        
        alert('La fecha y hora de la cita deben ser posteriores a la fecha y hora actual.');
        return;
      }
  
      
      const result = await this.db.executeSql(
        'SELECT * FROM CitaMedica WHERE FechaCita = ? AND HoraCita = ? AND ID_Cita != ?',
        [this.citaEditada.FechaCita, this.citaEditada.HoraCita, this.citaEditada.ID_Cita]
      );
  
      if (result.rows.length > 0) {
        
        alert('Ya existe una cita programada para la misma fecha y hora.');
        return;
      }
  
      
      try {
        await this.db.executeSql(
          'UPDATE CitaMedica SET FechaCita = ?, HoraCita = ? WHERE ID_Cita = ?',
          [this.citaEditada.FechaCita, this.citaEditada.HoraCita, this.citaEditada.ID_Cita]
        );
        this.citaEditada = null; 
        this.filtrarCitas(); 
      } catch (error) {
        console.error('Error al guardar los cambios en la cita', error);
      }
    }
  }
  
  

  async eliminarCita(idCita: number) {
    
    const confirmacion = await this.mostrarConfirmacion();
    
    if (confirmacion) {
      try {
        await this.db.executeSql('DELETE FROM CitaMedica WHERE ID_Cita = ?', [idCita]);
        this.filtrarCitas(); 
      } catch (error) {
        console.error('Error al eliminar la cita médica', error);
      }
    }
  }

  async mostrarConfirmacion(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Seguro que deseas eliminar esta cita médica?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve(false); 
            },
          },
          {
            text: 'Eliminar',
            handler: () => {
              resolve(true); 
            },
          },
        ],
      });

      await alert.present();
    });
  }

  mostrarCitasDelDiaActual() {
    
    const fechaActual = new Date();
    const fechaFormatted = fechaActual.toISOString().slice(0, 10); 

    this.selectedDate = fechaFormatted; 
    this.filtrarCitas(); 
  }

  cerrarSesion() {
    this.db
      .executeSql("UPDATE Usuario SET active=0 where active=1", [])
      .then((result) => console.log("Sesion Cambiada"))
      .catch((e) => console.log(JSON.stringify(e)));
    this.router.navigate(["login"]);
  }
}
