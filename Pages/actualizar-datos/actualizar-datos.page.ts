import { Component, OnInit } from "@angular/core";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";

@Component({
  selector: "app-actualizar-datos",
  templateUrl: "./actualizar-datos.page.html",
  styleUrls: ["./actualizar-datos.page.scss"],
})
export class ActualizarDatosPage implements OnInit {
  db: SQLiteObject;
  pacienteData: paciente[];
  nombre:string;
  apellido:string;
  direccion:string;
  telefono:number;
  correo:string;
  run:string;
  constructor(private sqlite: SQLite) {}

  ngOnInit() {
    this.createOpenDatabase();
    // this.updateData();
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
          this.pacienteData = [];
          this.db
            .executeSql("select * from usuario where active=1", [])
            .then((result) => {
              this.run = result.rows.item(0).run;
              this.db
                .executeSql("select * from paciente where run=?", [this.run])
                .then((result) => {
                  this.pacienteData.push({
                    nombre: result.rows.item(0).nombre,
                    "apellido": result.rows.item(0).apellido,
                    "direccion": result.rows.item(0).direccion,
                    "telefono": result.rows.item(0).telefono,
                    "correo": result.rows.item(0).correo,
                  });
                })
                .catch((e) => alert(JSON.stringify(e)));
            })
            .catch((e) => alert(JSON.stringify(e)));
        })
        .catch((e) => alert(JSON.stringify(e)));
    } catch (err: any) {
      console.log(err);
    }
  }

  updateData() {
    this.db
      .executeSql("UPDATE paciente SET nombre=?,apellido=?,direccion=?,telefono=?,correo=? where run=?", [this.nombre,this.apellido,this.direccion,this.telefono,this.correo,this.run])
      .then((result) => console.log("Sesion Cambiada"))
      .catch((e) => console.log(JSON.stringify(e)));
  }
}

class paciente {
  public nombre: string;
  public apellido: string;
  public direccion: string;
  public telefono: string;
  public correo: string;
}
