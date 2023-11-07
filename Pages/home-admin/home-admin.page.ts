import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";

@Component({
  selector: "app-home-admin",
  templateUrl: "./home-admin.page.html",
  styleUrls: ["./home-admin.page.scss"],
})
export class HomeAdminPage implements OnInit {
  db: SQLiteObject;

  constructor(private sqlite: SQLite, private router: Router) {}

  ngOnInit() {}

  baseDatos() {
    this.router.navigateByUrl("/datos-prueba");
  }

  usuarios() {
    this.router.navigateByUrl("/creacion-usuarios");
  }
  
  cerrarSesion() {
    window.location.href = "/login";
  }
}
