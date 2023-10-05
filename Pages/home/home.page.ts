import { Component } from "@angular/core";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  db: SQLiteObject;
  constructor(private sqlite: SQLite, private router: Router) {}

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
        })
        .catch((e) => alert(JSON.stringify(e)));
    } catch (err: any) {
      console.log(err);
    }
  }

  cerrarSesion() {
    this.db
      .executeSql("UPDATE Usuario SET active=0 where active=1", [])
      .then((result) => console.log("Sesion Cambiada"))
      .catch((e) => console.log(JSON.stringify(e)));
    this.router.navigate(["login"]);
  }


  eleccionCita() {
    this.router.navigateByUrl('/eleccion-cita');
  }

  updateData() {
    this.router.navigateByUrl('/actualizar-datos');
  }
}
