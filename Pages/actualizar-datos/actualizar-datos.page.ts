import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";

@Component({
  selector: "app-actualizar-datos",
  templateUrl: "./actualizar-datos.page.html",
  styleUrls: ["./actualizar-datos.page.scss"],
})
export class ActualizarDatosPage implements OnInit {
  db: SQLiteObject;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: number;
  correo: string;
  run: string;
  constructor(private sqlite: SQLite, private router: Router) {}

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
          this.cargarInfo();
        })
        .catch((e) => alert(JSON.stringify(e)));
    } catch (err: any) {
      console.log(err);
    }
  }

  updateData() {
    if (this.nombre != "" && this.apellido != "" && this.direccion != "" && this.correo != "") {
      if (this.telefono <= 999999999 && this.telefono >= 900000000) {
        if (this.correo.includes("@") && this.correo.includes(".")) {
          this.db
            .executeSql("UPDATE paciente SET nombre=?,apellido=?,direccion=?,telefono=?,correo=? where run=?", [this.nombre,this.apellido,this.direccion,this.telefono,this.correo,this.run])
            .then((result) => alert("Datos Actualizados"))
            .catch((e) => console.log(JSON.stringify(e)));
        } else {
          alert("Formato Incorrecto de Correo");
        }
      } else {
        alert("Formato Incorrecto de Telefono");
      }
    } else {
      alert("Debe llenar todos los campos");
    }
  }

  cargarInfo() {
    this.db
      .executeSql("select * from usuario where active = 1", [])
      .then((result) => {
        if (result.rows.item(0).run != "") {
          this.db
            .executeSql("select * from paciente where run=?", [
              this.run=result.rows.item(0).run,
            ])
            .then((result) => {
              this.nombre = result.rows.item(0).Nombre;
              this.apellido = result.rows.item(0).Apellido;
              this.direccion = result.rows.item(0).Direccion;
              this.telefono = result.rows.item(0).Telefono;
              this.correo = result.rows.item(0).Correo;
            });
        } else {
          this.router.navigate(["login"]);
        }
      })
      .catch((e) => alert(JSON.stringify(e)));
  }
}
