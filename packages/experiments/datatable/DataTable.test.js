const path = require('path');
const fs = require('fs');
const { strict: assert } = require('assert');

const DataTable = require('./DataTable');

const createData = (rows = 3, cols = 2, type = 'number', chars = 'abcdefghijklm') => {
  return Array.from(Array(rows), (...[, y ]) => {
    return Object.assign({}, ...Array.from(Array(cols), (...[, x ]) => ({
      [chars.charAt(x).toLowerCase()]: type === 'number' ? y + (x * 100) : chars.charAt(x) + (y + 1)
    })));
  });
};

const transpose = data => {
  return Object.entries(data).reduce((result, [ key, cells ], y) => ({
    ...result,
    ...Object.entries(data[y]).reduce((result, [ key, cell ], x) => ({
      ...result,
      [key]: [ ...(result[key] || []), cell ]
    }), result)
  }), {});
}

describe('DataTable', function() {
  describe('fromJson', () => {
    it('creates an instance from array of arrays', () => {
      const data = createData(2, 3, 'number');
      const dataTable = DataTable.fromJson(data);

      assert.deepEqual(data.map(cells => Object.values(cells)), [ ...dataTable.rows.values() ]);
    });

    it('creates an instance from array of objects', () => {
      const data = createData(2, 3, 'number');
      const dataTable = DataTable.fromJson(data);

      assert.deepEqual(data.map(cells => Object.values(cells)), [ ...dataTable.rows.values() ]);
    });
  });

  describe('toJson', () => {
    it('exports data to json', () => {
      const data = createData(2, 3, 'number');
      const dataTable = DataTable.fromJson(data);

      assert.deepEqual(data, dataTable.toJson());
    });
  });

  describe('rows', () => {
    const data = createData(2, 3, 'number');

    it('adds a row', () => {
      const dataTable = new DataTable();

      data.forEach(cells => dataTable.rows.add(cells));

      assert.deepEqual(data.map(cells => Object.values(cells)), [ ...dataTable.rows.values() ]);
    });
  });

  describe('columns', () => {
    const data = transpose(createData(2, 3, 'number'));

    it('adds a column', () => {
      const dataTable = new DataTable();

      Object.values(data).forEach(cells => dataTable.columns.add(cells));

      assert.deepEqual(Object.values(data).map(cells => Object.values(cells)), [ ...dataTable.columns.values() ]);
    });

    it('sets a column', () => {
      const dataTable = new DataTable();

      Object.entries(data).forEach(([ key, cells ]) => dataTable.columns.set(key, cells));

      assert.deepEqual(Object.values(data).map(cells => Object.values(cells)), [ ...dataTable.columns.values() ]);
    });
  });
});


// const d = new DataTable();
// d.rows.add({ x: 'x1', y: 'y1' });
// d.rows.add({ x: 'x2', y: 'y2' });
// d.rows.set(4, { x: 'x5', y: 'y5' });
//
// d.columns.set('z', [ 'z1',,,, 'z5', 'z6' ]);
// d.columns.set('x', [ 'xx1',,,, 'xx5', 'xx6' ]);
//
// console.log(`Columns ${d.columns.size}`);
// for (let [ key, cells ] of d.columns.entries()) {
//   console.log(`${key} - [ ${cells.join(', ')} ] (${cells.length})`);
// }
//
// console.log(`Rows ${d.rows.size}`);
// for (let [ key, cells ] of d.rows.entries()) {
//   console.log(`${key} - [ ${cells.join(', ')} ] (${cells.length})`);
// }

// const transposed = Object.assign({}, ...dataTable.columns.entries().map(([ key, cells ]) => ({
//   [key]: cells
// })));
//
// console.log('json...', dataTable.toJson());
//
// console.log('array...', [ ...dataTable.columns ].map(cells => Math.max(...cells)));

// for (let row of dataTable) {
//   console.log('row...', row);
// }


// const test1 = DataTable.fromJson([
//   [ 'a1', 'b1' ],
//   [ 'a2', 'b2' ],
//   [ 'a3', 'b3' ],
// ]);
//
// const test2 = DataTable.fromJson([
//   { x: 'x1', y: 'y1' },
//   { x: 'x2', y: 'y2' },
//   { x: 'x3', y: 'y3' }
// ]);

// const test3 = DataTable.fromJson({
//   x: [
//     'x1',
//     'x2',
//     'x3'
//   ],
//   y: [
//     'y1',
//     'y2',
//     'y3'
//   ]
// });
// // //
// const test4 = DataTable.fromJson({
//   x: {
//     a: 'xa', b: 'xb', c: 'xc'
//   },
//   y: {
//     a: 'ya', b: 'yb', c: 'yc'
//   }
// });
