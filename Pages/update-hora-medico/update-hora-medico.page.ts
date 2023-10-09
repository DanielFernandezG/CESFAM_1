import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Component({
  selector: 'app-update-hora-medico',
  templateUrl: './update-hora-medico.page.html',
  styleUrls: ['./update-hora-medico.page.scss'],
})
export class UpdateHoraMedicoPage {
  citaId: number;
  cita: any = {
    FechaCita: '',
    HoraCita: '',
  };
  db: SQLiteObject;

  constructor(
    private route: ActivatedRoute,
    private sqlite: SQLite
  ) {
    // Obtenemos el valor de 'citaId' de la URL de manera segura
    const paramMap = this.route.snapshot.paramMap;
    if (paramMap) {
      const citaIdString = paramMap.get('citaId');
      if (citaIdString !== null) {
        this.citaId = +citaIdString;
      }
    }

    this.createOpenDatabase();
    this.loadCita();
  }

  ngOnInit() {
    this.createOpenDatabase();
  }
createOpenDatabase()
{
  try{
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.db=db;
      console.log("Conectado")
      // alert('database create/opened')
    })
    .catch(e => alert(JSON.stringify(e)))
  }
  catch(err:any)
  {
    console.log(err);
    // alert(err);
  }
}

  async loadCita() {
    try {
      const result = await this.db.executeSql('SELECT * FROM CitaMedica WHERE ID_Cita = ?', [this.citaId]);
      if (result.rows.length > 0) {
        this.cita = result.rows.item(0);
      }
    } catch (error) {
      console.error('Error al cargar la cita', error);
    }
  }

  async guardarCambios() {
    try {
      await this.db.executeSql('UPDATE CitaMedica SET FechaCita = ?, HoraCita = ? WHERE ID_Cita = ?',
        [this.cita.FechaCita, this.cita.HoraCita, this.citaId]);

      // Navega de regreso a la página anterior o realiza alguna acción adecuada después de guardar los cambios.
    } catch (error) {
      console.error('Error al guardar los cambios en la cita', error);
    }
  }
}
