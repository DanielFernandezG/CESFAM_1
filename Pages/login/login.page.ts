import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { validateRut } from '@fdograph/rut-utilities';

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  db: SQLiteObject;
  run: string;
  password: string;
  usuarioData: usuario[];

  constructor(private router: Router, private sqlite: SQLite) {}

  ngOnInit() {
    this.createOpenDatabase();
  }

  createTable() {
    try {
      let usu = `
    CREATE TABLE IF NOT EXISTS Usuario (
      run VARCHAR(10) PRIMARY KEY NOT NULL,
      password VARCHAR(12) NOT NULL,
      active INTEGER(1) NOT NULL
    );`;
      this.db
        .executeSql(usu)
        .then((result) => console.log("table Usuario created"))
        .catch((e) => console.log(JSON.stringify(e)));

      let pac = `
    CREATE TABLE IF NOT EXISTS Paciente (
      ID_Paciente INTEGER PRIMARY KEY,
      Run VARCHAR(12) NOT NULL,
      Nombre VARCHAR(50) NOT NULL,
      Apellido VARCHAR(50) NOT NULL,
      Edad INTEGER NOT NULL,
      FechaNacimiento DATE,
      Direccion VARCHAR(100),
      Telefono VARCHAR(20),
      Correo VARCHAR(100) NOT NULL,
      Genero VARCHAR(10)
    );`;
      this.db
        .executeSql(pac)
        .then((result) => console.log("table Paciente created"))
        .catch((e) => console.log(JSON.stringify(e)));

      let doc = `
    CREATE TABLE IF NOT EXISTS Doctor (
      ID_Doctor INTEGER PRIMARY KEY NOT NULL,
      Run VARCHAR(12) NOT NULL,
      Nombre VARCHAR(50) NOT NULL,
      Apellido VARCHAR(50) NOT NULL,
      Especialidad VARCHAR(50) NOT NULL,
      CESFAM VARCHAR(100) NOT NULL,
      Estudios VARCHAR(300) NOT NULL,
      FechaNacimiento DATE NOT NULL,
      Genero VARCHAR(10)
    );`;
      this.db
        .executeSql(doc)
        .then((result) => console.log("table Doctor created"))
        .catch((e) => console.log(JSON.stringify(e)));

      let sec = `
    CREATE TABLE IF NOT EXISTS Secretaria (
      ID_Secretaria INTEGER PRIMARY KEY NOT NULL,
      Run VARCHAR(12) NOT NULL,
      Nombre VARCHAR(50) NOT NULL,
      Apellido VARCHAR(50) NOT NULL,
      FechaNacimiento DATE NOT NULL,
      Correo VARCHAR(100) NOT NULL,
      Genero VARCHAR(10)
    );`;
      this.db
        .executeSql(sec)
        .then((result) => console.log("table Secretaria created"))
        .catch((e) => console.log(JSON.stringify(e)));

      let cita = `
    CREATE TABLE IF NOT EXISTS CitaMedica (
      ID_Cita INTEGER PRIMARY KEY,
      ID_Paciente INTEGER,
      ID_Doctor INTEGER,
      FechaHoraCita TIMESTAMP,
      EstadoCita VARCHAR(20),
      FOREIGN KEY (ID_Paciente) REFERENCES Paciente(ID_Paciente),
      FOREIGN KEY (ID_Doctor) REFERENCES Doctor(ID_Doctor)
    );`;
      this.db
        .executeSql(cita)
        .then((result) => console.log("table CitaMedica created"))
        .catch((e) => console.log(JSON.stringify(e)));

      let docs = `
    CREATE TABLE IF NOT EXISTS DocumentoMedico (
      ID_Documento INTEGER PRIMARY KEY,
      ID_Paciente INTEGER,
      TipoDocumento VARCHAR(50),
      NombreDocumento VARCHAR(100),
      ContenidoDocumento BLOB,
      FechaCreacion DATE,
      FOREIGN KEY (ID_Paciente) REFERENCES Paciente(ID_Paciente)
    );`;
      this.db
        .executeSql(docs)
        .then((result) => console.log("table DocumentoMedico created"))
        .catch((e) => console.log(JSON.stringify(e)));

      let med = `
    CREATE TABLE IF NOT EXISTS Medicamento (
      ID_Medicamento INTEGER PRIMARY KEY,
      NombreMedicamento VARCHAR(100),
      Descripcion VARCHAR(255),
      InstruccionesDosificacion VARCHAR(255)
    );`;
      this.db
        .executeSql(med)
        .then((result) => console.log("table Medicamento created"))
        .catch((e) => console.log(JSON.stringify(e)));

      let reg = `
    CREATE TABLE IF NOT EXISTS RegistroMedicacion (
      ID_RegistroMedicacion INTEGER PRIMARY KEY,
      ID_Paciente INTEGER,
      ID_Medicamento INTEGER,
      FechaInicio DATE,
      FechaFin DATE,
      HoraToma TIMESTAMP,
      EstadoToma VARCHAR(20),
      FOREIGN KEY (ID_Paciente) REFERENCES Paciente(ID_Paciente),
      FOREIGN KEY (ID_Medicamento) REFERENCES Medicamento(ID_Medicamento)
    );`;
      this.db
        .executeSql(reg)
        .then((result) => console.log("table RegistroMedicacion created"))
        .catch((e) => console.log(JSON.stringify(e)));

      let noti = `
    CREATE TABLE IF NOT EXISTS Notificacion (
      ID_Notificacion INTEGER PRIMARY KEY,
      ID_Paciente INTEGER,
      MensajeNotificacion VARCHAR(255),
      FechaHoraNotificacion TIMESTAMP,
      FOREIGN KEY (ID_Paciente) REFERENCES Paciente(ID_Paciente)
    );`;
      this.db
        .executeSql(noti)
        .then((result) => console.log("table Notificacion created"))
        .catch((e) => console.log(JSON.stringify(e)));

      alert("Tablas Creadas");
    } catch {
      alert("Error al crear tablas");
    }
  }

  dropTable() {
    this.db
      .executeSql("drop table IF EXISTS CitaMedica", [])
      .then((result) => console.log("Tabla CitaMedica Borrada"))
      .catch((e) => alert(JSON.stringify(e)));

    this.db
      .executeSql("drop table IF EXISTS DocumentoMedico", [])
      .then((result) => console.log("Tabla DocumentoMedico Borrada"))
      .catch((e) => alert(JSON.stringify(e)));

    this.db
      .executeSql("drop table IF EXISTS RegistroMedicacion", [])
      .then((result) => console.log("Tabla RegistroMedicacion Borrada"))
      .catch((e) => alert(JSON.stringify(e)));

    this.db
      .executeSql("drop table IF EXISTS Notificacion", [])
      .then((result) => console.log("Tabla Notificacion Borrada"))
      .catch((e) => alert(JSON.stringify(e)));

    this.db
      .executeSql("drop table IF EXISTS Medicamento", [])
      .then((result) => console.log("Tabla Medicamento Borrada"))
      .catch((e) => alert(JSON.stringify(e)));

    this.db
      .executeSql("drop table IF EXISTS Paciente", [])
      .then((result) => console.log("Tabla Paciente Borrada"))
      .catch((e) => alert(JSON.stringify(e)));

    this.db
      .executeSql("drop table IF EXISTS Doctor", [])
      .then((result) => console.log("Tabla Doctor Borrada"))
      .catch((e) => alert(JSON.stringify(e)));

    this.db
      .executeSql("drop table IF EXISTS Secretaria", [])
      .then((result) => console.log("Tabla Secretaria Borrada"))
      .catch((e) => alert(JSON.stringify(e)));

    this.db
      .executeSql("drop table IF EXISTS Usuario", [])
      .then((result) => console.log("Tabla Usuario Borrada"))
      .catch((e) => alert(JSON.stringify(e)));

    alert("Tablas Borradas");
  }

  limpiarRut(rut: string): string {
    // Eliminar puntos
    const rutSinPuntos = rut.replace(/\./g, "");

    // Eliminar guiones
    const rutSinGuion = rutSinPuntos.replace(/-/g, "");
    console.log(rutSinGuion);
    return rutSinGuion;
  }

  iniciarSesion() {
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
            this.router.navigate(["home"]);
          } else {
            alert("Contraseña Incorrecta");
          }
        });
    } else {
      alert("Run Inexistente")
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
          // alert('database create/opened')
          console.log("Conectado");
        })
        .catch((e) => alert(JSON.stringify(e)));
    } catch (err: any) {
      // alert(err);
      console.log(err);
    }
  }
}

class usuario {
  public run: string;
  public password: string;
}
