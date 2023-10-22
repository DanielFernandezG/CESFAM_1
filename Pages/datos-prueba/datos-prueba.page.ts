import { Component, OnInit } from "@angular/core";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { Router } from "@angular/router";

@Component({
  selector: "app-datos-prueba",
  templateUrl: "./datos-prueba.page.html",
  styleUrls: ["./datos-prueba.page.scss"],
})
export class DatosPruebaPage implements OnInit {
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
      // alert(err);
      console.log(err);
    }
  }

  createTables() {
    try {
      let usu = `
    CREATE TABLE IF NOT EXISTS Usuario (
      run VARCHAR(12) PRIMARY KEY NOT NULL,
      password VARCHAR(12) NOT NULL,
      tipo VARCHAR(15) NOT NULL,
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
      FechaNacimiento DATE NOT NULL,
      Direccion VARCHAR(100) NOT NULL,
      Telefono integer(9) NOT NULL,
      Correo VARCHAR(100) NOT NULL,
      Genero VARCHAR(10) NOT NULL,
      FOREIGN KEY (Run) REFERENCES Usuario(run)
    );`;
      this.db
        .executeSql(pac)
        .then((result) => console.log("table Paciente created"))
        .catch((e) => console.log(JSON.stringify(e)));
      let esp = `
    CREATE TABLE IF NOT EXISTS Especialidad (
      ID_Especialidad INTEGER PRIMARY KEY,
      Nombre VARCHAR(255) NOT NULL
    );`;
      this.db
        .executeSql(esp)
        .then((result) => console.log("table Especialidad created"))
        .catch((e) => console.log(JSON.stringify(e)));

      let doc = `
    CREATE TABLE IF NOT EXISTS Doctor (
      ID_Doctor INTEGER PRIMARY KEY NOT NULL,
      Run VARCHAR(12) NOT NULL,
      Nombre VARCHAR(50) NOT NULL,
      Apellido VARCHAR(50) NOT NULL,
      ID_Especialidad INTEGER NOT NULL,
      CESFAM VARCHAR(100) NOT NULL,
      Estudios VARCHAR(300) NOT NULL,
      FechaNacimiento DATE NOT NULL,
      Genero VARCHAR(10) NOT NULL,
      FOREIGN KEY (ID_Especialidad) REFERENCES Especialidad(ID_Especialidad),
      FOREIGN KEY (Run) REFERENCES Usuario(run)
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
      Genero VARCHAR(10),
      FOREIGN KEY (Run) REFERENCES Usuario(run)
    );`;
      this.db
        .executeSql(sec)
        .then((result) => console.log("table Secretaria created"))
        .catch((e) => console.log(JSON.stringify(e)));

      let cita = `
    CREATE TABLE IF NOT EXISTS CitaMedica (
      ID_Cita INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_Paciente INTEGER,
      ID_Doctor INTEGER,
      FechaCita DATE,
      HoraCita TIME,
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
      FechaNotificacion DATE,
      HoraNotificacion TIME,
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

  dropTables() {
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
      .executeSql("drop table IF EXISTS Especialidad", [])
      .then((result) => console.log("Tabla Especialidad Borrada"))
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

  ingresarDatos() {
    try {
      // Ingreso de usuarios
      let usu = `INSERT INTO Usuario(run,password,tipo,active) VALUES ('209052172', '12345678', 'paciente', '0'),('218789234', '12345678', 'paciente', '0'),('13210980k', '12345678', 'paciente', '0'),('154386750', '12345678', 'doctor', '0'),('193067808', '12345678', 'doctor', '0'),('249910392', '12345678', 'doctor', '0'),('204836302', '12345678', 'doctor', '0'),('203307349', '12345678', 'secretaria', '0'),('146529704', '12345678', 'secretaria', '0'),('148366284', '12345678', 'secretaria', '0'),('217532302', '12345678', 'secretaria', '0'),('209645971', '12345678', 'paciente', '0');`;
      this.db.executeSql(usu);

      // Ingreso de Pacientes
      let pac = `INSERT INTO Paciente (ID_Paciente,Run,Nombre,Apellido,Edad,FechaNacimiento,Direccion,Telefono,Correo,Genero) VALUES (1, '209052172', 'Julio', 'Baeza', 21, '25/10/2001', 'Apotheca Company', 984168125, 'j.baeza@duocuc.cl', 'Masculino'),(2, '218789234', 'Sean', 'Feasley', 43, '07/10/1980', 'PD-Rx Pharmaceuticals, Inc.', 948888409, 'sfeasley2@gnu.org', 'Femenino'),(3, '13210980k', 'Christie', 'MacGuiness', 51, '17/04/1972', 'Sandoz Inc', 986037732, 'cmacguiness3@washington.edu', 'Femenino'),(4, '209645971', 'Jose', 'Torres', 21, '06/02/2002', 'La Prairie, Inc.', 997993773, 'josi.torres@duocuc.cl', 'Masculino');`;
      this.db.executeSql(pac);

      // Ingreso Especialidad
      let esp = `INSERT INTO especialidad (ID_Especialidad, Nombre) VALUES (1, 'Cardiología'),(2, 'Dermatología'),(3, 'Oftalmología'),(4, 'Ortopedia');`;
      this.db.executeSql(esp);

      // Ingreso Doctor
      let doc = `INSERT INTO Doctor (ID_Doctor, Run, Nombre, Apellido, ID_Especialidad, CESFAM, Estudios, FechaNacimiento, Genero) VALUES (1, '154386750', 'Dr. Carlos', 'González', 1, 'CESFAM Central', 'Graduado en Medicina Interna en la Universidad Nacional', '1980-03-15', 'Masculino'),(2, '193067808', 'Dr. Laura', 'Martínez', 2, 'CESFAM Norte', 'Especialización en Dermatología en la Universidad Nacional', '1975-07-20', 'Femenino'),(3, '204836302', 'Dr. Alejandro', 'Sánchez', 3, 'CESFAM Sur', 'Doctorado en Oftalmología en la Universidad Nacional', '1978-11-10', 'Masculino'),(4, '249910392', 'Dra. María', 'López', 4, 'CESFAM Este', 'Máster en Cirugía Ortopédica en la Universidad Nacional', '1972-05-05', 'Femenino');`;
      this.db.executeSql(doc);

      // Ingreso Secretaria
      let sec = `INSERT INTO Secretaria (ID_Secretaria, Run, Nombre, Apellido, FechaNacimiento, Correo, Genero) VALUES (1, '217532302', 'Ana', 'García', '1990-05-20', 'ana@gmail.com', 'Femenino'),(2, '148366284', 'Carlos', 'Martínez', '1988-12-15', 'carlos@gmail.com', 'Masculino'),(3, '146529704', 'Elena', 'López', '1995-07-10', 'elena@gmail.com', 'Femenino'),(4, '203307349', 'David', 'Rodríguez', '1992-03-25', 'david@gmail.com', 'Masculino');`;
      this.db.executeSql(sec);

      // Ingreso Cita Medica
      let cita = `INSERT INTO CitaMedica (ID_Cita, ID_Doctor, FechaCita, HoraCita, EstadoCita) VALUES (1, 1, '2023-10-16', '10:00', 'Disponible'),(2, 1, '2023-10-17', '15:30', 'Disponible'),(3, 1, '2023-10-18', '11:45', 'Disponible'),(4, 1, '2023-10-19', '14:15', 'Disponible'),(5, 1, '2023-10-20', '09:30', 'Disponible'),(6, 1, '2023-10-21', '16:00', 'Disponible'),(7, 2, '2023-10-22', '16:00', 'Disponible'),(8, 2, '2023-10-23', '17:00', 'Disponible'),(9, 2, '2023-10-24', '18:00', 'Disponible'),(10, 2, '2023-10-25', '19:00', 'Disponible');`;
      this.db.executeSql(cita);

      // Ingreso Cita Medica para Pacientes
      let citapac = `INSERT INTO CitaMedica (ID_Cita, ID_Paciente, ID_Doctor, FechaCita, HoraCita, EstadoCita) VALUES (11, 4, 1, '2023-10-16', '14:00', 'Ocupada'),(12, 4, 2, '2023-10-17', '14:30', 'Ocupada'),(13, 4, 3, '2023-10-18', '10:00', 'Ocupada'),(14, 4, 4, '2023-10-19', '10:00', 'Ocupada');`;
      this.db.executeSql(citapac);

      // Ingreso Documento Medico

      // Ingreso Medicamento
      let med = `INSERT INTO Medicamento (ID_Medicamento, NombreMedicamento, Descripcion, InstruccionesDosificacion) VALUES (1, 'Paracetamol', 'Medicamento para aliviar el dolor y reducir la fiebre.', 'Tomar 1 tableta cada 6 horas con un vaso de agua.'),(2, 'Ibuprofeno', 'Antiinflamatorio no esteroideo (AINE) para aliviar el dolor y reducir la inflamación.', 'Tomar 1 tableta cada 8 horas después de comer.'),(3, 'Amoxicilina', 'Antibiótico utilizado para tratar diversas infecciones bacterianas.', 'Tomar 1 cápsula cada 12 horas con alimentos.'),(4, 'Loratadina', 'Antihistamínico utilizado para aliviar los síntomas de las alergias.', 'Tomar 1 tableta diaria con o sin alimentos.');`;
      this.db.executeSql(med);

      // Ingreso Registro Medicacion
      let regmed = `INSERT INTO RegistroMedicacion (ID_RegistroMedicacion, ID_Paciente, ID_Medicamento, FechaInicio, FechaFin, HoraToma, EstadoToma) VALUES (1, 1, 1, '2023-10-01', '2023-10-10', '2023-10-01 08:00:00', 'Tomado'),(2, 2, 2, '2023-10-02', '2023-10-12', '2023-10-02 14:30:00', 'Pendiente'),(3, 3, 3, '2023-10-03', '2023-10-13', '2023-10-03 10:45:00', 'Tomado'),(4, 4, 4, '2023-10-04', '2023-10-14', '2023-10-04 19:20:00', 'Pendiente');`;
      this.db.executeSql(regmed);

      // Ingreso Notificacion
      let not = `INSERT INTO Notificacion (ID_Notificacion, ID_Paciente, MensajeNotificacion, FechaNotificacion, HoraNotificacion) VALUES (1, 1, 'Tome Medicamento', '07/10/2023','10:00:00'),(2, 2, 'Tome Medicamento', '07/10/2023','10:00:00'),(3, 3, 'Tome Medicamento', '07/10/2023','10:00:00'),(4, 4, 'Tome Medicamento', '07/10/2023','10:00:00');`;
      this.db.executeSql(not);

      alert("Datos Insertados");
    } catch {
      alert("Error al crear tablas");
    }
  }

  cerrarSesion(){
    this.router.navigate(['login'])
  }
}
