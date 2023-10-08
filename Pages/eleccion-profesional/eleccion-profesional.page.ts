import { Component,OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';


@Component({
  selector: 'eleccion-profesional',
  templateUrl: 'eleccion-profesional.page.html',
  styleUrls: ['eleccion-profesional.page.scss']
})
export class EleccionProfesionalPage implements OnInit {
  db: SQLiteObject;
  // especialidades: { id: number, nombre: string }[];
  // medicos: { id: number, nombre: string }[];
  especialidadSeleccionada: number;
  medicoSeleccionado: { id: number, nombre: string };
  medicoData: medico[];

  constructor(private sqlite: SQLite) {}

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
          this.cargarEspecialidades();
        })
        .catch((e) => alert(JSON.stringify(e)));
    } catch (err: any) {
      console.log(err);
    }
  }

  ionViewWillEnter() {
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {
    this.medicoData=[];

    this.db
      .executeSql("select * from Especialidad where Nombre='Cardiología'", [])

      .then((result) => {
        let med:string='select * from Doctor where ID_Especialidad='+result.rows.item(0).ID_Especialidad;
        this.db
          .executeSql(med,[])
          .then((result) => {
            for(let i=0;i<result.rows.length;i++) {
              this.medicoData.push({nombre:result.rows.item(i).Nombre,
                "apellido":result.rows.item(i).Apellido});
            }
            console.log("------------------------------------------------"+result.rows.item(0).Nombre);
          })
          .catch(e => alert(JSON.stringify(e)));



        });




  }

  seleccionarMedico(medico: { id: number, nombre: string }) {
    this.medicoSeleccionado = medico;
  }
 /*
    ingresar() {
    if (this.especialidadSeleccionada && this.medicoSeleccionado) {
      // Aquí puedes usar this.especialidadSeleccionada y this.medicoSeleccionado para las operaciones necesarias.
      console.log('Especialidad seleccionada:', this.especialidadSeleccionada);
      console.log('Médico seleccionado:', this.medicoSeleccionado);
      // Continúa con tus operaciones aquí
    } else {
      alert('Por favor, seleccione una especialidad y un médico.');
    }
  }*/




}

class medico{
  public nombre:string;
  public apellido:string;
}
