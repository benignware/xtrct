const Math = require('../math');

const $data = Symbol('data');
const $indices = Symbol('indices');

const ColumnHandle = (data, [, indices ]) => {

  function* columnIterator() {
    const keys = [ ...indices.keys() ];

    for (let key of keys) {
      yield cellIterator(key);
    }
  };

  function* cellIterator(key) {
    const x = indices.get(key);
    const size = data.length;
    let y = 0;

    while (y < size) {
      yield data[y][x];
      y++;
    }
  };

  return Object.create({
    set(key, cells) {
      if (!indices.has(key)) {
        indices.set(key, indices.size);
      }

      const index = indices.get(key);
      const size = Math.max(cells.length, data.length);

      for (let y = 0; y < size; y++) {
        data[y] = data[y] || Array.from(Array(indices.size), () => null);
        data[y][index] = typeof cells[y] === 'undefined' ? null : cells[y];
      }
    },
    add(cells) {
      this.set(this.size, cells);
    },
    get(key) {
      return [ ...cellIterator(key) ];
    },
    keys() {
      return [ ...indices.keys() ];
    },
    values() {
      return [ ...this ];
    },
    entries() {
      return this.keys().map(key => [ key, this.get(key) ]);
    },
    [Symbol.iterator]() {
      return columnIterator();
    },
    get size() {
      return data[0] ? data[0].length : 0;
    }
  });
};

const RowHandle = (data, [ rowIndex, columnIndex ]) => {

  function* rowIterator() {
    const size = data.length;
    let y = 0;

    while (y < size) {
      yield cellIterator(y);
      y++;
    }
  };

  function* cellIterator(key) {
    const y = isNaN(parseInt(key)) ? rowIndex.get(key) : key;
    const size = data[y].length;
    let x = 0;

    while (x < size) {
      yield data[y][x];
      x++;
    }
  }

  return {
    set(key, cells) {
      let y = parseInt(key);
      let x;

      if (isNaN(y)) {
        if (!rowIndex.has(key)) {
          rowIndex.set(index, rowIndex.size);
        }
        y = rowIndex.get(index);
      }

      const newIndices = [];
      for (key in cells) {
        if (!columnIndex.has(key)) {
          columnIndex.set(key, columnIndex.size);
          newIndices.push(key);
        }
      }

      let size = data.length;
      data[y] = data[y] || [];

      // Fill up empty rows
      data.fill(Array(columnIndex.size).fill(null), size, y);

      // TODO: Fill up existing rows with new indices

      // Create new row
      for ([key, x] of columnIndex.entries()) {
        data[y][x] = typeof cells[key] === 'undefined' ? null : cells[key];
      }
    },
    add(cells) {
      this.set(data.length, cells);
    },
    [Symbol.iterator]() {
      return rowIterator();
    },
    get(key) {
      return [ ...cellIterator(key) ];
    },
    keys() {
      return [ ...(rowIndex.length ? rowIndex : data).keys() ];
    },
    values() {
      return [ ...this ].map(column => [ ...column ]);
    },
    entries() {
      return this.keys().map(key => [ key, this.get(key) ]);
    },
    get size() {
      return data.length;
    },
    get [Symbol.toStringTag]() {
      return 'RowHandle';
    }
  }
};

function* dataIterator(data) {
  for (let [ ...cells ] of data) {
    yield cells;
  }
}

class DataTable {
  static fromJson(data) {
    const dataTable = new DataTable();

    for (let y in data) {
      dataTable.rows.set(y, data[y]);
    }

    return dataTable;
  }

  constructor() {
    this[$indices] = Array.from(Array(2), () => new Map());
    this[$data] = [];
    this.columns = ColumnHandle(this[$data], this[$indices]);
    this.rows = RowHandle(this[$data], this[$indices]);
  }

  toJson() {
    const [ rowIndex, columnIndex ] = this[$indices];

    return Object.assign(
      rowIndex.size ? {} : [],
      ...this.rows.entries().map(([ key, cells ], y) => ({
        [key]: Object.assign(
          columnIndex.size ? {} : [],
          ...this.columns.keys().map((key, x) => ({
            [key]: cells[x]
          }))
        )
      }))
    );
  }

  get size() {
    return this[$data].length;
  }

  range(start = 0, end) {
    const dataTable = new DataTable();
    start = isNaN(parseInt(start)) ? rowIndex.get(start) : start;
    end = isNaN(parseInt(end)) ? rowIndex.get(end) : end >= 0 ? end : dataTable.rows.size;

    dataTable[$indices] = this[$indices].map(map => new Map(map));
    dataTable[$data] = this[$data].slice(start, end);

    return dataTable;
  }

  clone() {
    return this.range(0, this.size);
  }

  normalize() {
    const dataTable = this.clone();

    this.columns.entries().forEach(([ key, column ]) => {
      const scores = Math.scores(...[...column].filter(cell => cell !== null && parseFloat(cell)));

      // console.log('scores: ', scores);

      dataTable.columns.set(key, scores);
    });

    return dataTable;
  }

  [Symbol.iterator]() {
    return dataIterator(this[$data]);
  }
}

module.exports = DataTable;
