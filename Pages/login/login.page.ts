import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { validateRut } from "@fdograph/rut-utilities";
import { IonModal } from "@ionic/angular";
import { OverlayEventDetail } from "@ionic/core/components";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  rut: string;
  db: SQLiteObject;
  run: string;
  password: string;
  usuarioData: usuario[];

  constructor(private router: Router, private sqlite: SQLite) {}

  ngOnInit() {
    this.createOpenDatabase();
  }

  limpiarRut(rut: string): string {
    // Eliminar puntos
    const rutSinPuntos = rut.replace(/\./g, "");

    // Eliminar guiones
    const rutSinGuion = rutSinPuntos.replace(/-/g, "");
    return rutSinGuion;
  }

  iniciarSesion() {
    if (this.run == "Admin") {
      if (this.password == "Admin@123") {
        this.router.navigate(["datos-prueba"]);
      } else {
        alert("Contraseña Incorrecta");
      }
    } else {
      if (validateRut(this.run)) {
        const run_limpio = this.limpiarRut(this.run);
        this.db
          .executeSql("select * from usuario where run=?", [run_limpio])

          .then((result) => {
            if (result.rows.item(0).password == this.password) {
              this.db
                .executeSql("UPDATE Usuario SET active=1 where run=?", [
                  run_limpio,
                ])
                .then((result) => console.log("Sesion Cambiada"))
                .catch((e) => console.log(JSON.stringify(e)));
              if (result.rows.item(0).tipo == "paciente") {
                this.router.navigate(["home"]);
              } else if (result.rows.item(0).tipo == "doctor") {
                this.router.navigate(["home-doctor"]);
              } else {
                this.router.navigate(["home-secretaria"]);
              }
            } else {
              alert("Contraseña Incorrecta");
            }
          });
      } else {
        alert("Run Inexistente");
      }
    }
  }
  registrar() {
    this.router.navigate(["registrar"]);
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
          this.sesionData();
        })
        .catch((e) => alert(JSON.stringify(e)));
    } catch (err: any) {
      console.log(err);
    }
  }

  sesionData() {
    this.db
      .executeSql("select * from usuario where active=1", [])
      .then((result) => {
        if (result.rows.item(0).active == 1) {
          if (result.rows.item(0).tipo == "paciente") {
            this.router.navigate(["home"]);
          } else if (result.rows.item(0).tipo == "doctor") {
            this.router.navigate(["home-doctor"]);
          } else if (result.rows.item(0).tipo == "secretaria") {
            this.router.navigate(["home-secretaria"]);
          } else if (result.rows.item(0).tipo == "admin") {
            this.router.navigate(["datos-prueba"]);
          } else {
            this.router.navigate(["home"]);
          }
        }
      });
  }

  cancel() {
    this.modal.dismiss(null, "cancel");
  }

  confirm() {
    const rut_limpio = this.limpiarRut(this.rut);
    if (validateRut(rut_limpio)) {
      this.db
        .executeSql("select * from Usuario where run=?", [rut_limpio])
        .then((result) => {
          if (result.rows.item(0).run == rut_limpio) {
            this.db
              .executeSql("UPDATE Usuario SET active=1 where run=?", [
                rut_limpio,
              ])
              .then((result) => {
                this.modal.dismiss(null, "cancel");
                this.router.navigate(["recuperar"]);
              })
              .catch((e) => alert(JSON.stringify(e)));
          } else {
            alert("El run indicado no posee cuenta");
          }
        })
        .catch((e) => alert("El run indicado no posee cuenta"));
    } else {
      alert("Run no Valido");
    }
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === "confirm") {
      this.rut = `Hello, ${ev.detail.data}!`;
    }
  }
}

class usuario {
  public run: string;
  public password: string;
}
