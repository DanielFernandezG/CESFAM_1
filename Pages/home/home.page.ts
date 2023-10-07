import { Component, OnInit } from "@angular/core";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { ActivatedRoute, Router } from "@angular/router";
import { CitasService } from 'src/app/Services/citas.service';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  db: SQLiteObject;
  especialidad: string;
  fechaHora: string;
  medico: string;
  especialidades: string[] = [];
  fechasHoras: string[] = [];
  medicos: string[] = [];

  constructor(
    private sqlite: SQLite,
    private router: Router,
    private route: ActivatedRoute,
    private citasService: CitasService
  ) {}

  ngOnInit() {
    // Obtén las especialidades, fechas y horas del servicio
    this.especialidades = this.citasService.obtenerEspecialidades();
    this.fechasHoras = this.citasService.obtenerFechasHoras();

    this.createOpenDatabase();
    // Lee los datos de los parámetros de la ruta cuando la página se carga
    this.route.queryParams.subscribe(params => {
      if (params && params['especialidad'] && params['fechaHora'] && params['medico']) {
        this.especialidad = params['especialidad'];
        this.fechaHora = params['fechaHora'];
        this.medico = params['medico'];
      }
    });
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


