'use strict';

//Application dependencies
const express = require('express');
// Load Environment Variables from the .env file
require('dotenv').config();
const cors = require('cors');
const pg = require('pg');


//Application setup
const app = express();
app.use(cors());
const PORT = process.env.PORT || 8000;
// const client = new pg.Client(process.env.DATABASE_URL);

const client = new pg.Client({ connectionString: process.env.DATABASE_URL,   ssl: { rejectUnauthorized: false } });
// let client;
// let DATABASE_URL = process.env.DATABASE_URL;
// let ENV =  process.env.ENV||'';
// if (ENV === 'DEV') {
//   client = new pg.Client({
//     connectionString: DATABASE_URL
//   });
// } else {
//   client = new pg.Client({
//     connectionString: DATABASE_URL,
//     ssl: {rejectUnauthorized: false }
//   });
// }

// ROUTES
//Error Handler



function dbget(req,res){
    let sql = `SELECT * FROM people;`
    client.query(sql).then(data =>{
      res.send(data.rows)
    })
  }
// Routes Handlerseeeee
//localhost:3000/add?first=Razan&last=Quran
function addDataHandler(req,res) {
    console.log(req.query);
    let firstName= req.query.first;
    let lastName= req.query.last;
    let SQL = `INSERT INTO people (firstName,lastName) VALUES ($1,$2) RETURNING *;`;
    let safeValues = [firstName,lastName];
    client.query(SQL,safeValues)
    .then(result=>{
        res.send(result.rows);
    })
    .catch(error=>{
        res.send(error);
    })
}

//localhost:3000/people
function getDataHandler(req,res) {
    let SQL = `SELECT * FROM people;`;
    client.query(SQL)
    .then (result=>{
        res.send(result.rows);
    })
    .catch(error=>{
        res.send(error);
    })
}

function testHandler(request, response) {
    response.status(200).send('ok');
}
function notFoundHandler(request, response) {
    response.status(404).send('huh????');
}

app.get('/test', testHandler);
app.get('/add',addDataHandler);
app.get('/people',getDataHandler);
app.get('/get', dbget);
app.get('*', notFoundHandler); 

client.connect()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`listening on ${PORT}`)
        );
    })


