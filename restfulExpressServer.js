'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');

app.disable('x-powered-by');
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);
      res.sendStatus(500);
    } else {
      next();
    }
  });
});

function writeFile(petswr, petwr, reswr) {
  fs.writeFile(petsPath, JSON.stringify(petswr), (writeErr) => {
    if (writeErr) {
      console.error(writeErr.stack);

      return reswr.sendStatus(500);
    }
    reswr.send(petwr);
  });
}

app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    const pets = JSON.parse(petsJSON);

    res.send(pets);
  });
});

app.get('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    const pets = JSON.parse(petsJSON);
    const id = parseInt(req.params.id);

    if (id >= 0 && id < pets.length) {
      res.send(pets[id]);
    } else {
      res.sendStatus(404);
    }
  });
});

app.post('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    const pets = JSON.parse(petsJSON);

    const pet = {
      age: parseInt(req.body.age),
      kind: req.body.kind,
      name: req.body.name
    };

    if (!isNaN(pet.age) && (!pet.name || pet.name !== '') && (!pet.kind || pet.kind !== '')) {
      pets.push(pet);
      writeFile(pets, pet, res);
    } else {
      return res.sendStatus(400);
    }
  });
});

app.put('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    const pets = JSON.parse(petsJSON);
    const id = parseInt(req.params.id);
    const pet = {
      age: parseInt(req.body.age),
      kind: req.body.kind,
      name: req.body.name
    };
    if (id < 0 || id > pets.length) {
      return res.sendStatus(400);
    }
    if (!isNaN(pet.age) && (!pet.name || pet.name !== '') && (!pet.kind || pet.kind !== '')) {
      pets[id] = pet;
      writeFile(pets, pet, res);
    } else {
      return res.sendStatus(400);
    }
  });
});

app.delete('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    const pets = JSON.parse(petsJSON);
    const id = parseInt(req.params.id);
    if (id >= 0 && id < pets.length) {
      const pet = pets.splice(id, 1)[0];

      writeFile(pets, pet, res);
    } else {
      res.sendStatus(400);
    }
  });
});

app.patch('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    const pets = JSON.parse(petsJSON);
    const id = parseInt(req.params.id);
    if (id >= 0 && id < pets.length) {
      if (!isNaN(parseInt(req.body.age))) {
        pets[id].age = parseInt(req.body.age);
      }
      if (req.body.name && req.body.name !== '') {
        pets[id].name = req.body.name;
      }
      if (req.body.kind && req.body.kind !== '') {
        pets[id].kind = req.body.kind;
      }
      const pet = pets[id];

      writeFile(pets, pet, res);
    } else {
      res.sendStatus(400);
    }
  });
});

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
