import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';


@Component({
  selector: 'app-home-doctor',
  templateUrl: './home-doctor.page.html',
  styleUrls: ['./home-doctor.page.scss'],
})
export class HomeDoctorPage implements OnInit {
  db:SQLiteObject;
  FechaCita:string;
  HoraCita:string;
  ID_Cita:string;
  idDoctor:string;
  doctorData:doctor[];
  mostrarFormularioDeEdicion: boolean = false;
  cita:any;
  citas: any[] = [];
  citaEditada: any = {
    ID_Cita: 0,
    FechaCita: '',
    HoraCita: '',};

  constructor(private router: Router,
    private sqlite:SQLite) {
      this.cita = {};
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



  cerrarSesion() {
    this.db
      .executeSql("UPDATE Usuario SET active=0 where active=1", [])
      .then((result) => console.log("Sesion Cambiada"))
      .catch((e) => console.log(JSON.stringify(e)));
    this.router.navigate(["login"]);
  }

  insertData()  
  {
    try{
    let cita:string='insert into CitaMedica(FechaCita,HoraCita) values("'+this.FechaCita+'","'+this.HoraCita+'")';
    this.db.executeSql(cita,[])
    .then(() => alert('datos incertados'))
              .catch(e => alert(JSON.stringify(e)));
    }catch {
      alert ("no incertados")
    }

  }

  async editarCita(cita: any) {
    // Mostrar el formulario de edición y cargar los datos de la cita
    this.citaEditada.ID_Cita = cita.ID_Cita;
    this.citaEditada.FechaCita = cita.FechaCita;
    this.citaEditada.HoraCita = cita.HoraCita;
  
    // Configurar mostrarFormularioDeEdicion en true
    this.mostrarFormularioDeEdicion = true;
  }
  
  async guardarCambios() {
    try {
      await this.db.executeSql(
        'UPDATE CitaMedica SET FechaCita = ?, HoraCita = ? WHERE ID_Cita = ?',
        [this.citaEditada.FechaCita, this.citaEditada.HoraCita, this.citaEditada.ID_Cita]
      );
  
      // Limpiar el objeto de edición y ocultar el formulario
      this.citaEditada = {
        ID_Cita: 0,
        FechaCita: '',
        HoraCita: '',
      };
      this.mostrarFormularioDeEdicion = false;
  
      // Recargar la lista de citas
      this.selectData();
    } catch (error) {
      console.error('Error al guardar los cambios en la cita', error);
    }
  }
  



  // async updateData(cita: any) {
  //   this.router.navigate(['/update-hora-medico', { idCita: cita.ID_Cita }]);
  // }
  

  // deleteRecord()
  // {
    
  //     this.db.executeSql('delete from CitaMedica where ID_Cita=?',[])
  //     .then((result) => {
  //       alert('Hora Eliminada')
  //     })
  //     .catch(e => alert(JSON.stringify(e)));
    
    
  // }

  async deleteRecord(idCita: string) {
    try {
      await this.db.executeSql('DELETE FROM CitaMedica WHERE ID_Cita = ?', [idCita]);
      this.selectData();
    } catch (error) {
      console.error('Error al eliminar la cita médica', error);
    }
  }
  
  

  selectData()
  {
    this.doctorData=[];

    this.db.executeSql('select * from CitaMedica',[])
    .then((result) => {
      for(let i=0;i<result.rows.length;i++)
      {
        this.doctorData.push({ID_Cita:result.rows.item(i).ID_Cita, "HoraCita":result.rows.item(i).HoraCita,
        "FechaCita":result.rows.item(i).FechaCita});
      }
    })
    .catch(e => alert(JSON.stringify(e)));
  }

  

}

class doctor{
  public ID_Cita:string;
  public HoraCita:string;
  public FechaCita:string;
}