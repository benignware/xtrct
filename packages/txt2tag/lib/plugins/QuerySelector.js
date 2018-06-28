class QuerySelector {
  constructor(options) {
    this.options = options;
  }
  load(document) {
    const element = document.documentElement;
    const hot = new Map();
    Object.entries(this.options).forEach(([ selector, score ]) => {
      const elements = element.querySelectorAll(selector);
      for (let element of elements) {
        hot.set(element, score);
      }
    });
    this.hot = hot;
  }
  match(element) {
    return this.hot.get(element) || 0;
  }
}

module.exports = QuerySelector;
