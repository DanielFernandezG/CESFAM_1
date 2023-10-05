import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CitasService } from 'src/app/Services/citas.service';

@Component({
  selector: 'app-eleccion-fecha-hora',
  templateUrl: 'eleccion-fecha-hora.page.html',
  styleUrls: ['eleccion-fecha-hora.page.scss']
})
export class EleccionFechaHoraPage {
  fechaHoraSeleccionada: string;

  constructor(private citasService: CitasService, private router: Router) {}

  ingresar() {
    if (this.fechaHoraSeleccionada) {
      this.citasService.guardarFechaHora(this.fechaHoraSeleccionada);
      this.router.navigateByUrl('/eleccion-profesional');
    } else {
      alert('Por favor, seleccione una fecha y hora.');
    }
  }
}

