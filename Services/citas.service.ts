import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  especialidad: string;
  fechaHora: string;
  medico: string;

  especialidades: string[] = ['Cardiología', 'Dermatología', 'Oftalmología', 'Ortopedia'];
  fechasHoras: string[] = ['2023-10-15 09:00 AM', '2023-10-16 02:30 PM', '2023-10-17 11:15 AM'];
  medicosPorEspecialidad: { [especialidad: string]: string[] } = {
    'Cardiología': ['Dr. Carlos González'],
    'Dermatología': ['Dra Laura Martínez'],
    'Oftalmología': ['Dr. Alejandro Sánchez'],
    'Ortopedia': ['Dra. María López']
  };

  constructor() {}

  guardarEspecialidad(especialidad: string) {
    this.especialidad = especialidad;
  }

  guardarFechaHora(fechaHora: string) {
    this.fechaHora = fechaHora;
  }

  guardarMedico(medico: string) {
    this.medico = medico;
  }

  obtenerEspecialidades(): string[] {
    return this.especialidades;
  }

  obtenerFechasHoras(): string[] {
    return this.fechasHoras;
  }

  obtenerMedicosPorEspecialidad(especialidad: string): string[] {
    return this.medicosPorEspecialidad[especialidad] || [];
  }

  obtenerEspecialidad(): string {
    return this.especialidad;
  }

  obtenerFechaHora(): string {
    return this.fechaHora;
  }

  obtenerMedico(): string {
    return this.medico;
  }
}
