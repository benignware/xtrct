const brain = require('brain.js');
const net = new brain.NeuralNetwork();

// [ R, G, B ]
net.train([
  // Red (255, 0, 0)
  { input: [ 1, 0, 0 ], output: { light: 1 } },
  // Yellow (255, 255, 0)
  { input: [ 1, 1, 0 ], output: { dark: 1 } },
  // Dark grey (51, 51, 51)
  { input: [ 0.2, 0.2, 0.2 ], output: { light: 1 } }
]);

// Dark Blue (0, 0, 128)
net.run([ 0, 0, 0.5 ]);
// {"light":0.9852000787823519,"dark":0.014587141745708729}
