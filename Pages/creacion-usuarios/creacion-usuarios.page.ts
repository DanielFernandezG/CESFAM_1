import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { validateRut } from "@fdograph/rut-utilities";

@Component({
  selector: "app-creacion-usuarios",
  templateUrl: "./creacion-usuarios.page.html",
  styleUrls: ["./creacion-usuarios.page.scss"],
})
export class CreacionUsuariosPage implements OnInit {
  db: SQLiteObject;
  run: string;
  password: string;
  confPassword: string;
  nombre: string;
  apellidos: string;
  fecha: string;
  correo: string;
  genero: string;
  rol: string;
  esp: string;
  cesfam: string;
  estudios: string;
  usuarioData: usuario[];
  especialidades: especialidad[];
  isDoctor: boolean = false;

  constructor(private router: Router, private sqlite:SQLite) {}

  ngOnInit() {
    this.createOpenDatabase();
  }

  async insertData() {
    if(this.rol=="" || this.run=="" || this.password=="" || this.nombre=="" || this.apellidos=="" || this.fecha=="" || this.correo=="" || this.genero==""){
      alert("Debe Llenar Todos los Campos")
    } else {
      const run_limpio = this.limpiarRut(this.run)
      const usuarioNoExiste = await this.verificarUsuario(run_limpio)
      if(usuarioNoExiste){
        if (validateRut(run_limpio)){
          if (this.password.length>=8) {
            if(this.password==this.confPassword){
              if (this.fecha.includes("/")) {
                if (this.correo.includes("@") && this.correo.includes(".")) {
                  try{
                    
                    let usu:string='insert into usuario(run,password,tipo,active) values("'+run_limpio+'","'+this.password+'","'+this.rol+'",0)';
                    this.db.executeSql(usu,[])
                    .then(() => {
                      console.log('usuario creado')}
                      )
                    .catch(e => {
                      console.error(JSON.stringify(e));
                    });

                    if(this.rol == "doctor"){
                      this.obtenerIdEspecialidad(this.esp).then((idesp: number) => {
                      let doc:string='insert into Doctor (Run, Nombre, Apellido, ID_Especialidad, CESFAM, Estudios, FechaNacimiento, Genero, Correo) values("'+run_limpio+'","'+this.nombre+'","'+this.apellidos+'", '+idesp+', "'+this.cesfam+'","'+this.estudios+'",\''+this.fecha+'\', "'+this.genero+'","'+this.correo+'")';
                      this.db.executeSql(doc,[])
                      .then(() => console.log('usuario creado'))
                      .catch(e => alert(JSON.stringify(e)));

                      alert("Doctor creado exitosamente")
                      this.run = "";
                      this.password = "";
                      this.confPassword = "";
                      this.nombre = "";
                      this.apellidos = "";
                      this.fecha = "";
                      this.correo = "";
                      this.genero = "";
                      this.rol = "";
                      this.esp = "";
                      this.cesfam = "";
                      this.estudios = "";
                    })
                    .catch((error) => {
                      console.error("Error al obtener especialidad:", error);
                    });
                    } else if(this.rol == "secretaria") {
                      let sec:string='insert into Secretaria (Run, Nombre, Apellido, FechaNacimiento, Correo, Genero) values("'+run_limpio+'","'+this.nombre+'","'+this.apellidos+'",\''+this.fecha+'\',"'+this.correo+'", "'+this.genero+'")';
                      this.db.executeSql(sec,[])
                      .then(() => console.log('usuario creado'))
                      .catch(e => alert(JSON.stringify(e)));

                      alert("Secretaria creada exitosamente")
                      this.run = "";
                      this.password = "";
                      this.confPassword = "";
                      this.nombre = "";
                      this.apellidos = "";
                      this.fecha = "";
                      this.correo = "";
                      this.genero = "";
                      this.rol = "";
                    } else {
                      alert("Ingrese Rol")
                    }
                  } catch {
                    alert ("Error al agregar usuarios")
                  }
                } else {
                  alert ("Formato de Correo Incorrecto")
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

  onRolChange() {
    this.isDoctor = this.rol === 'doctor';
  }

  limpiarRut(rut: string): string {
    // Eliminar puntos
    const rutSinPuntos = rut.replace(/\./g, '');
  
    // Eliminar guiones
    const rutSinGuion = rutSinPuntos.replace(/-/g, '');
    console.log(rutSinGuion)
    return rutSinGuion;
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

  mostrarEspecialidades() {
    this.especialidades = [];

    this.db.executeSql("select * from especialidad", []).then((result) => {
      for (let i = 0; i < result.rows.length; i++) {
        this.especialidades.push({
          id: result.rows.item(i).ID_Especialidad,
          descripcion: result.rows.item(i).Nombre,
        });
      }
    });
  }

  async obtenerIdEspecialidad(nombreEspecialidad: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.db
        .executeSql("SELECT ID_Especialidad FROM especialidad WHERE Nombre=?", [
          nombreEspecialidad,
        ])
        .then((result) => {
          if (result.rows.length > 0) {
            const idEspecialidad = result.rows.item(0).ID_Especialidad;
            resolve(idEspecialidad);
          } else {
            reject(new Error("Especialidad no encontrada"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  createOpenDatabase() {
    this.sqlite
      .create({
        name: "data.db",
        location: "default",
      })
      .then((db: SQLiteObject) => {
        this.db = db;
        console.log("Conectado a la base de datos");
        this.mostrarEspecialidades();
      })
      .catch((e) => console.log("Error al conectar a la base de datos: ", e));
  }
}

class usuario{
  public run:string;
  public password:string;
}

class especialidad {
  public id: string;
  public descripcion: string;
}