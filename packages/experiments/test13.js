const fs = require('fs');
const Papa = require('papaparse');
const { camelizeKeys } = require('humps');
const synaptic = require('synaptic');

// const Perceptron = require('./perceptron');
// const DataTable = require('./datatable');
// const { default: normalize } = require('./normalization');
// const Math = require('./math');

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

const csvOptions = {
  header: true,
  dynamicTyping: true
};

let source = [
  './test/fixtures/white_male_names.csv',
  './test/fixtures/white_female_names.csv'
];

let data = source.reduce((result, src) => ([
  ...result,
  ...Papa.parse(fs.readFileSync(src, 'utf-8'), csvOptions).data
]), []);

console.log('data');
data = data.map((entry) => camelizeKeys(entry));

data = data.map(({ firstName = '', ...entry }) => ({
  ...entry,
  firstName: firstName.trim().replace(/\s+.*$/, '').replace(/\/.*$/, '')
}));

const males = data.filter(({ gender }) => gender === 'm').slice(0, 3000);
const females = data.filter(({ gender }) => gender === 'f').slice(0, 3000);

data = [ ...males, ...females ];

data = shuffleArray(data);

let trainingData = data.map(({ firstName, gender }, index) => {
  return ({
    input: convertNameToInput(firstName),
    output: gender === 'm' ? [ 1, 0 ] : [ 0, 1 ]
  });
});


const myNetwork = new synaptic.Architect.Perceptron(INPUT_LENGTH, 6, 2);
const trainer = new synaptic.Trainer(myNetwork);
//
const iterations = 200;

for(var i = 0 ; i < 25 ; i++) {
  trainer.train(trainingData, {
    rate: 0.01,
    iterations,
    shuffle: true,
    cost: synaptic.Trainer.cost.MSE
  });
  var error = trainer.test(trainingData)["error"];
  console.log(
     "Iteration " + ((i + 1) * iterations) + " --> Error: " + error
  );
}

const predict = (firstName) => {
  const [ m, f ] = myNetwork.activate(convertNameToInput(firstName));

  return m > f ? 'm' : 'f';
};

const results = data.map(({ firstName, gender }, index) => {
  return predict(firstName) === gender;
});

console.log('results', results.filter(res => true).length, results.length);

console.log('Julian -> ', predict('Julian'));
console.log('Lina -> ', predict('Lina'));
console.log('Rafael -> ', predict('Rafael'));
console.log('Jessica -> ', predict('Jessica'));
console.log('Brigitte -> ', predict('Brigitte'));
console.log('Zoe -> ', predict('Zoe'));
