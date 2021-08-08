import { unit } from './unit.js';

export const system = {
  init: function () {
    this.units = [];
    this.matrix = [];
  },

  createUnit: function (positionX, positionY) {
    const createdUnit = Object.create(unit);
    createdUnit.init(positionX, positionY);

    this.units.push(createdUnit);
  },

  setMatrix: function (height, width) {
    this.matrix = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => 0)
    );
  },

  getMatrix: function () {
    return this.matrix;
  },
};
