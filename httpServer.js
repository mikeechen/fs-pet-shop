'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const port = process.env.PORT || 8000;
//.indexOf('/pets') !== -1
const server = http.createServer((req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    const pets = JSON.parse(data);
    const petRegExp = new RegExp(/^\/pets\/(.*)$/);
    if (req.method === 'GET' && req.url.indexOf('/pets') !== -1) {
      let indexNumber;

      if (petRegExp.test(req.url)) {
       indexNumber = parseInt(req.url.substring(req.url.lastIndexOf('/') + 1));
      }

      if (err) {
        console.error(err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Internal Server Error');
      }

      if (!indexNumber && indexNumber !== 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      } else if (indexNumber >= 0 && indexNumber < pets.length) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(pets[indexNumber]));
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
      }

    } else if (req.method === 'POST' && req.url === '/pets') {
      let obj = {};

      req.on('data', function(stuff) {
        const tempobj = JSON.parse(stuff.toString());
        obj.age = parseInt(tempobj.age);
        obj.kind = tempobj.kind;
        obj.name = tempobj.name;
      }).on('end', () => {
        if (!isNaN(obj.age) && obj.name !== '' && obj.kind !== '') {
          if (err) {
            console.error(err.stack);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            return res.end('Internal Server Error');
          }

          pets.push(obj);
          fs.writeFile(petsPath, JSON.stringify(pets), (writeErr) => {
            if (writeErr) {
              console.error(err.stack);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'text/plain');
              return res.end('Internal Server Error');
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(obj));
          });
        } else {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Bad Request');
        }
      });
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    }
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
module.exports = server;
