import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { validateRut } from '@fdograph/rut-utilities';

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
    private router: Router,
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
    if (validateRut(this.run)){
      if (this.password.length>=8) {
        if (this.telefono <= 999999999 && this.telefono >= 900000000) {
          if (this.correo.includes("@") && this.correo.includes(".")) {
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
              this.router.navigate(['login']);
            } catch {
              alert ("Error al crear usuarios")
            }
          } else {
            alert ("Formato de correo incorrecto")
          }
        } else {
          alert ("Formato de telefono incorrecto")
        }
      } else {
        alert ("La contraseña debe tener al menos 8 caracteres")
      }
    } else {
      alert ("Run Invalido")
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
