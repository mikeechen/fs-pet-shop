'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');

app.disable('x-powered-by');

function writeFile(petswr, petwr, reswr) {
  fs.writeFile(petsPath, JSON.stringify(petswr), (writeErr) => {
    if (writeErr) {
      console.error(writeErr.stack);

      return reswr.sendStatus(500);
    }
    reswr.send(petwr);
  });
}

fs.readFile(petsPath, 'utf8', (err, data) => {
  const pets = JSON.parse(data);

  if (err) {
    console.error(err.stack);
    app.use((req, res) => {
      res.sendStatus(500);
    });
  }

  app.use(bodyParser.json());

  app.get('/pets', (req, res) => {
    res.send(pets);
  });

  app.get('/pets/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (id >= 0 && id < pets.length) {
      res.send(pets[id]);
    } else {
      res.sendStatus(404);
    }
  });

  app.post('/pets', (req, res) => {
    const pet = {
      age: parseInt(req.body.age),
      kind: req.body.kind,
      name: req.body.name
    };

    if (!isNaN(pet.age) && (pet.name !== undefined || pet.name !== '') && (pet.kind !== undefined || pet.kind !== '')) {
      pets.push(pet);
      writeFile(pets, pet, res);
    } else {
      return res.sendStatus(400);
    }
  });

  app.use((req, res) => {
    res.sendStatus(404);
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
