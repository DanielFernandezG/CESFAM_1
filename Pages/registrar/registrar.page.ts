import { Component, OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  
  db:SQLiteObject;
  run:string;
  password:string;
  usuarioData: usuario[];

  constructor(
    private sqlite:SQLite
    ) { }

  ngOnInit() {
  }

  createOpenDatabase()
  {
    try{
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.db=db;
        alert('database create/opened')
      })
      .catch(e => alert(JSON.stringify(e)))
    }
    catch(err:any)
    {
      alert(err);
    }
  }

  createTable()
  {
    this.db.executeSql('create table IF NOT EXISTS usuario(run VARCHAR(10), password VARCHAR(20))',[])
    .then((result) => alert('table created'))
    .catch(e => alert(JSON.stringify(e)));
  }

  insertData()
  {
    let query:string='insert into usuario(run,password) values("'+this.run+'","'+this.password+'")';

    this.db.executeSql(query,[])
    .then(() => alert('Record inserted'))
    .catch(e => alert(JSON.stringify(e)));
  }

  selectData()
  {
    this.usuarioData=[];

    this.db.executeSql('select * from usuario',[])
    .then((result) => {
      for(let i=0;i<result.rows.length;i++)
      {
        this.usuarioData.push({run:result.rows.item(i).run,
        "password":result.rows.item(i).password});
      }
    })
    .catch(e => alert(JSON.stringify(e)));
  }
}

class usuario{
  public run:string;
  public password:string;
}
