const Document = require('./Document');

module.exports = class HTMLDocument extends Document {
  get body() {
    return this.getElementsByTagName('body').shift();
  }
};
