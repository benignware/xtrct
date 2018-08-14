class LabelEncoder {
  encode(data) {
    let result;
    let keys = new Set();
    data = data.map(instance => {
      // Parse floats
      instance = Object.assign({}, ...Object.entries(instance).map(([ key, value ]) => {
        const float = parseFloat(value);

        return {
          [key]: !isNaN(float) ? float : value
        };
      }));

      // Categorial keys
      for (let [ key, value ] of Object.entries(instance)) {
        // TODO: Recursive
        // result[key] = this.encode(value, `${path}[${index}]`);
        if (typeof value === 'string') {
          // Categorial value
          key = `is_${key}_${value}`;
          instance[key] = 1;
        }
        keys.add(key);
      }

      return instance;
    })

    // Sort keys
    keys = [ ...keys ].slice().sort();

    result = data.map(instance => {
      return Object.assign({}, ...keys.map(key => {
        return {
          [key]: instance[key] || 0
        };
      }));
    });

    return result;
  }
}
