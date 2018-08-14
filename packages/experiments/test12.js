const fs = require('fs');
const Papa = require('papaparse');
const synaptic = require('synaptic');

const Perceptron = require('./perceptron');
const DataTable = require('./datatable');
const { default: normalize } = require('./normalization');
const Math = require('./math');
const AsciiEncoder = require('./features/AsciiEncoder');

// fully random by @BetonMAN
const shuffleArray = arr => arr
  .map(a => [Math.random(), a])
  .sort((a, b) => a[0] - b[0])
  .map(a => a[1]);

const INPUT_LENGTH = 7;

function convertNameToInput(name) {
   name = name.toLowerCase();
   if(name.length > INPUT_LENGTH)
       name = name.substring(INPUT_LENGTH);
   while(name.length < INPUT_LENGTH)
       name = " " + name;
   var characters = name.split("");
   return characters.map(
      (c) => c == " " ? 0 : c.charCodeAt(0)/1000
   );
}

// const asciiEncoder = new AsciiEncoder();
// const convertNameToInput = name => asciiEncoder.encode(name);

const source = [
  [ 1, fs.readFileSync('./test/fixtures/male_names.csv', 'utf-8') ],
  [ 0, fs.readFileSync('./test/fixtures/female_names.csv', 'utf-8') ]
];

let data = source.reduce((result, [ key, source ]) => ([
  ...result,
  ...Papa.parse(source).data.map(([ name ]) => ({
    name,
    value: key,
    input: convertNameToInput(name),
    output: key === 1 ? [ 1, 0 ] : [ 0, 1 ]
  }))
]), []);


data = shuffleArray(data);

// Parse local CSV file
// let { data: maleNames } = Papa.parse(source);
//
// const names = [
//   ...maleNames.map(name => ({ name, gender: 0 })),
//   ...femaleNames.map(name => ({ name, gender: 1 }))
// ];
//
// console.log('names: ', names);
//
const trainingData = data.slice(0, parseInt(data.length * 0.99));
const testSet = data.slice(parseInt(data.length * 0.99));

const myNetwork = new synaptic.Architect.Perceptron(INPUT_LENGTH, 6, 2);
const trainer = new synaptic.Trainer(myNetwork);

function getGender(name) {
  const result = myNetwork.activate(convertNameToInput(name));
  if (result[0] > result[1]) {
    return {
      message: "Male (" + (result[0] * 100).toFixed() + "% sure)",
      value: 1
    };
  } else {
    return {
      message: "Female (" + (result[1] * 100).toFixed() + "% sure)",
      value: 0
    };
  }
}

for(var i = 0 ; i < 30 ; i++) {
    trainer.train(trainingData, {
      rate: 0.01,
      iterations: 400,
      shuffle: true,
      cost: synaptic.Trainer.cost.MSE
    });
    var error = trainer.test(trainingData)["error"];
    console.log(
       "Iteration " + ((i + 1) * 400) + " --> Error: " + error
    );
}

//
// const p = new Perceptron({
//   // activate: Math.sigmoid
// });
// //
// for (let [ name, gender ] of trainingSet) {
//   const expected = 1;
//   console.log('train...', name, convertNameToInput(name), gen<der);
//   p.train(convertNameToInput(name), gender);
// }
// //
// console.log('learn...');
// const startTime = new Date().getTime();
// p.learn(1000);
// const endTime = new Date().getTime();
// console.log('time...', (endTime - startTime));
// // //
// // let pass = 0;
// // for (let [ name, gender ] of testSet) {
// //   const inputs = convertNameToInput(name);
// //   const result = p.predict(inputs);
// //   // console.log('predict...', name, inputs, result, gender);
// //   if (result === gender) {
// //     pass++;
// //   }
// // }
// //
// // console.log('pass...', pass, testSet.length );
//
// console.log('Forrest: ', getGender('Forrest'), 1);
// console.log('Elisabeth: ', getGender('Elisabeth'), 0);
// console.log('Julian: ', getGender('Julian'), 1);
// console.log('Lina: ', getGender('Lina'), 0);

let pass = 0;
for (let entry of testSet) {
  const result = getGender(entry.name);
  console.log('ENTRY...', entry.name, result.message, result.value, entry.value, ' === ', result.value === entry.value ? 'pass' : 'fail');
  if (result.value === entry.value) {
    pass++;
  }
}
console.log('PASS: ', `${pass / testSet.length * 100}%`);

console.log('Catherine: ', getGender('Catherine').message, 1);
console.log('Martha: ', getGender('Martha').message, 0);
console.log('Ronald: ', getGender('Ronald').message, 1);
console.log('Elisabeth: ', getGender('Elisabeth').message, 0);
console.log('Rafael: ', getGender('Rafael').message, 1);
console.log('Jessica: ', getGender('Jessica').message, 0);
console.log('Julian: ', getGender('Julian').message, 1);
console.log('Lina: ', getGender('Lina').message, 0);
