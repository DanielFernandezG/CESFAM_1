import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CitasService } from 'src/app/Services/citas.service';

@Component({
  selector: 'app-eleccion-cita',
  templateUrl: 'eleccion-cita.page.html',
  styleUrls: ['eleccion-cita.page.scss']
})
export class EleccionCitaPage {
  especialidades: string[];
  especialidadSeleccionada: string;

  constructor(private citasService: CitasService, private router: Router) {
    this.especialidades = this.citasService.especialidades;
  }

  ingresar() {
    if (this.especialidadSeleccionada) {
      this.citasService.guardarEspecialidad(this.especialidadSeleccionada);
      this.router.navigateByUrl('/eleccion-fecha-hora');
    } else {
      alert('Por favor, seleccione una especialidad.');
    }
  }
}
