const fs = require('fs');
const Papa = require('papaparse');

const file = './test/fixtures/Salary_Data.csv';
const data = fs.readFileSync(file, 'utf-8');

const Perceptron = require('./perceptron');
const FeatureEncoder = require('./FeatureEncoder');
const normalize = require('./normalization');

const perceptron = new Perceptron({
  activate: value => value
});
const inputEncoder = new FeatureEncoder();

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Parse local CSV file
Papa.parse(data, {
  header: true,
  dynamicTyping: true,
	complete: function(results) {
    results.data.pop();
    let data = results.data
    data = normalize(data);

    console.log('data: ', data);

    data = data
      .map(({ Salary: output, ...features }) => ([
        features, output
      ]))
      // .map(([ features, output ]) => ([
      //   inputEncoder.encode(features), output
      // ]));

    shuffle(data);

    const m = parseInt(data.length / 2);
    const trainingData = data.slice(0, m);
    const testData = data.slice(m);

    trainingData.forEach(([ features, output]) => {
      features = Object.values(features);
      console.log('train...', features, output);
      perceptron.train(features, output)
    });

    const c = perceptron.learn();
    console.log('learned after ', c);

    const r = testData.map(([ features, output ]) => {
      features = Object.values(features);
      const result = perceptron.predict(features, output);
      console.log('predict...', features, result, 'expected: ', output);
      return result;
    });
	}
});
