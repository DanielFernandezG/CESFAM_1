import { Component, OnInit } from "@angular/core";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { Router } from "@angular/router";

@Component({
  selector: "app-recuperar",
  templateUrl: "./recuperar.page.html",
  styleUrls: ["./recuperar.page.scss"],
})
export class RecuperarPage implements OnInit {
  db: SQLiteObject;
  confPassword: string;
  password: string;

  constructor(private sqlite: SQLite, private router: Router) {}

  ngOnInit() {
    this.createOpenDatabase();
  }

  cambiarClave() {
    if (this.password.length >= 8) {
      if (this.password == this.confPassword) {
        this.db
          .executeSql("select * from usuario where active = 1", [])
          .then((result) => {
            if (result.rows.item(0).run != "") {
              this.db
                .executeSql("UPDATE Usuario SET active=0,password=? where run=?",[this.password, result.rows.item(0).run])
                .then((result) => {
                  alert("Contraseña Cambiada");
                  this.router.navigate(["login"]);
                });
            }
          })
          .catch((e) => alert(JSON.stringify(e)));
      } else {
        alert("las Contraseñas no Son Iguales");
      }
    } else {
      alert("La clave debe tener al menos 8 caracteres");
    }
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
        })
        .catch((e) => alert(JSON.stringify(e)));
    } catch (err: any) {
      console.log(err);
    }
  }
}
