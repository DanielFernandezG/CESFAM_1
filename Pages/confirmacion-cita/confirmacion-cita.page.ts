import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CitasService } from 'src/app/Services/citas.service';

@Component({
  selector: 'app-confirmacion-cita',
  templateUrl: 'confirmacion-cita.page.html',
  styleUrls: ['confirmacion-cita.page.scss']
})
export class ConfirmacionCitaPage {
  especialidad: string;
  fechaHora: string;
  medico: string;

  constructor(private citasService: CitasService, private router: Router) {
    this.especialidad = this.citasService.obtenerEspecialidad();
    this.fechaHora = this.citasService.obtenerFechaHora();
    this.medico = this.citasService.obtenerMedico();
  }

  confirmarCita() {
    // Realizar operaciones para confirmar la cita (guardar en la base de datos, enviar notificaciones, etc.)
    // Después de confirmar, puedes redirigir a la página de inicio y pasar los datos como parámetros de ruta
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



