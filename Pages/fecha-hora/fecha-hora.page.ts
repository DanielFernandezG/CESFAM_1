import { Component } from '@angular/core';
// import * as moment from 'moment-timezone';

@Component({
  selector: 'app-fecha-hora',
  templateUrl: 'fecha-hora.page.html',
  styleUrls: ['fecha-hora.page.scss'],
})
export class FechaHoraPage {
  selectedDate: string; // Propiedad para almacenar la fecha seleccionada en formato ISO

  constructor() {
    // Obtén la fecha y hora actual en el huso horario de Chile
    // this.selectedDate = moment.tz('Chile/Continental').format();
  }
}






