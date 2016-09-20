#! /usr/local/bin/node
'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];

function createPet(ag, ki, na) {
  return {
    age: ag,
    kind: ki,
    name: na
  };
}

function writeFile(ps, pe) {
  fs.writeFile(petsPath, JSON.stringify(ps), (writeErr) => {
    if (writeErr) throw writeErr;

    console.log(pe);
  });
}

if (cmd === 'read' || cmd === 'destroy') {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) throw err;

    const pets = JSON.parse(data);
    const index = process.argv[3];

    if (cmd === 'read') {
      if (!index) {
        console.log(pets);
      } else if (index < pets.length) {
        console.log(pets[index]);
      } else {
        console.error(`There are only ${pets.length} pets! Read starts at 0!`);
      }
    } else {
      if (!index) {
        console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
        process.exit(1);
      }
      const splicedPet = pets[index];

      pets.splice(index, 1);
      writeFile(pets, splicedPet);
    }
  });
} else if (cmd === 'create' || cmd === 'update') {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) throw readErr;

    let i = 3;
    let indexNumber;
    if (cmd === 'update') {
      indexNumber = parseInt(process.argv[i]);
      i += 1;
    }

    const pets = JSON.parse(data);
    const age = parseInt(process.argv[i]);
    const kind = process.argv[i + 1];
    const name = process.argv[i + 2];

    if (cmd === 'create' && (!age || !kind || !name)) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    } else if (cmd === 'update' && (!indexNumber || !age || !kind || !name)) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    const pet = createPet(age, kind, name);

    if (cmd === 'create'){
      pets.push(pet);
    } else {
      if (indexNumber >= pets.length) {
        console.error(`There are only ${pets.length} pets! Index starts at 0!`);
        process.exit(1);
      }
      pets[indexNumber] = pet;
    }
    writeFile(pets, pet);
  });
} else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
