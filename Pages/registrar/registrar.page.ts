import { Component, OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  
  db:SQLiteObject;
  run:string;
  password:string;
  nombre:string;
  apellidos:string;
  edad:number;
  fecha:string;
  direccion:string;
  telefono:number;
  correo:string;
  genero:string;
  usuarioData: usuario[];

  constructor(
    private sqlite:SQLite
    ) { }

  ngOnInit() {
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
        alert('database create/opened')
      })
      .catch(e => alert(JSON.stringify(e)))
    }
    catch(err:any)
    {
      alert(err);
    }
  }

  insertData()
  {
    try{
      let usu:string='insert into usuario(run,password,active) values("'+this.run+'","'+this.password+'",0)';
      this.db.executeSql(usu,[])
      .then(() => console.log('usuario creado'))
      .catch(e => alert(JSON.stringify(e)));

      let pac:string='insert into paciente (run,nombre,apellido,edad,fechaNacimiento,Direccion,Telefono,Correo,Genero) values("'+this.run+'","'+this.nombre+'","'+this.apellidos+'",'+this.edad+',\''+this.fecha+'\', "'+this.direccion+'", "'+this.telefono+'", "'+this.correo+'", "'+this.genero+'")';
      this.db.executeSql(pac,[])
      .then(() => console.log('paciente creado'))
      .catch(e => alert(JSON.stringify(e)));

      alert("Usuario creado exitosamente")
    } catch {
      alert ("Error al crear usuarios")
    }
  }

  selectData()
  {
    this.usuarioData=[];

    this.db.executeSql('select * from usuario',[])
    .then((result) => {
      for(let i=0;i<result.rows.length;i++)
      {
        this.usuarioData.push({run:result.rows.item(i).run,
        "password":result.rows.item(i).password});
      }
    })
    .catch(e => alert(JSON.stringify(e)));
  }
}

class usuario{
  public run:string;
  public password:string;
}
