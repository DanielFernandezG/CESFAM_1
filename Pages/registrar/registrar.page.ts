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
  confPassword:string;
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

  limpiarRut(rut: string): string {
    // Eliminar puntos
    const rutSinPuntos = rut.replace(/\./g, '');
  
    // Eliminar guiones
    const rutSinGuion = rutSinPuntos.replace(/-/g, '');
    console.log(rutSinGuion)
    return rutSinGuion;
  }

  async insertData() {
    if(this.run=="" || this.password=="" || this.nombre=="" || this.apellidos=="" || this.edad==null || this.fecha=="" || this.direccion=="" || this.telefono==null || this.correo=="" || this.genero==""){
      alert("Debe Llenar Todos los Campos")
    } else {
      const run_limpio = this.limpiarRut(this.run)
      const usuarioNoExiste = await this.verificarUsuario(run_limpio)
      if(usuarioNoExiste){
        if (validateRut(run_limpio)){
          if (this.password.length>=8) {
            if(this.password==this.confPassword){
              if (this.fecha.includes("/")) {
                if (this.telefono <= 999999999 && this.telefono >= 900000000) {
                  if (this.correo.includes("@") && this.correo.includes(".")) {
                    try{
                      let usu:string='insert into usuario(run,password,tipo,active) values("'+run_limpio+'","'+this.password+'","paciente",0)';
                      this.db.executeSql(usu,[])
                      .then(() => {
                        console.log('usuario creado')}
                        )
                      .catch(e => {
                        console.error(JSON.stringify(e));
                      });

                      let pac:string='insert into paciente (run,nombre,apellido,edad,fechaNacimiento,Direccion,Telefono,Correo,Genero) values("'+run_limpio+'","'+this.nombre+'","'+this.apellidos+'",'+this.edad+',\''+this.fecha+'\', "'+this.direccion+'", '+this.telefono+', "'+this.correo+'", "'+this.genero+'")';
                      this.db.executeSql(pac,[])
                      .then(() => console.log('paciente creado'))
                      .catch(e => alert(JSON.stringify(e)));

                      alert("Usuario creado exitosamente")
                      this.router.navigate(['login']);
                    } catch {
                      alert ("Error al crear usuarios")
                    }
                  } else {
                    alert ("Formato de Correo Incorrecto")
                  }
                } else {
                  alert ("Formato de Telefono Incorrecto")
                }
              } else {
                alert("Formato de Fecha Incorrecto")
              }
            } else {
              alert("Las contraseñas no coinciden")
            }
          } else {
            alert ("La contraseña debe tener al menos 8 caracteres")
          }
        } else {
          alert ("Run Invalido")
        }
      } else {
        alert ("El Run Indicado ya Posee Cuenta")
      }
    }
  }

  verificarUsuario(run: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.db
        .executeSql("SELECT * FROM usuario WHERE run=?", [run])
        .then((result) => {
          if (result.rows.length === 0) {
            // El usuario no existe
            resolve(true);
          } else {
            // El usuario existe
            resolve(false);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }  

}

class usuario{
  public run:string;
  public password:string;
}
