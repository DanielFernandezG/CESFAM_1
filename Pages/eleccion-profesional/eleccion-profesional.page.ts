import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CitasService } from 'src/app/Services/citas.service';

@Component({
  selector: 'app-eleccion-profesional',
  templateUrl: 'eleccion-profesional.page.html',
  styleUrls: ['eleccion-profesional.page.scss']
})
export class EleccionProfesionalPage {
  medicos: string[];

  constructor(private citasService: CitasService, private router: Router) {
    this.medicos = this.citasService.medicosPorEspecialidad[this.citasService.obtenerEspecialidad()] || [];
  }

  seleccionarMedico(medico: string) {
    this.citasService.guardarMedico(medico);
  }

  ingresar() {
    this.router.navigateByUrl('/confirmacion-cita');
  }
}





/*class medico{
  public nombre:string;
  public apellido:string;
}
*/
