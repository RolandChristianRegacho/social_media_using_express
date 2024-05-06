const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3001

const connection = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'social_media' // Use the name of the database you created
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
  }
    console.log('Connected to the database as ID ' + connection.threadId);
});

const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger)

class Database {
  constructor( config ) {
      this.connection = mysql.createConnection( config );
  }
  query( sql, args ) {
      return new Promise( ( resolve, reject ) => {
          this.connection.query( sql, args, ( err, rows ) => {
              if ( err )
                  return reject( err );
              resolve( rows );
          } );
      } );
  }
  close() {
      return new Promise( ( resolve, reject ) => {
          this.connection.end( err => {
              if ( err )
                  return reject( err );
              resolve();
          } );
      } );
  }
}

let database = new Database(connection)

app.get('/api/posts/:id', (req, res) => {
  let users, posts

  database.query('SELECT DISTINCT p.id, p.user, p.content, p.date FROM friend_list f INNER JOIN posts p ON f.friends = p.user WHERE f.owner = ? OR p.user = ? AND p.status = 1 ORDER BY date DESC', [req.params.id, req.params.id])
  .then(result => {
    posts = result
    return database.query(`SELECT id, profile_picture, first_name, middle_name, last_name, birthday FROM accounts WHERE id = ${req.params.id}`)
  })
  .then(result => {
    users = result
    return database.close()
  })
  .then(() => {
    const data = {
      users: users,
      posts: posts
    }
  
    res.send(data)
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})