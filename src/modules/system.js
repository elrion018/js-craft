import { unit } from './unit.js';

export const system = {
  init: function () {
    this.units = [];
  },

  createUnit: function (positionX, positionY) {
    const createdUnit = Object.create(unit);
    createdUnit.init(positionX, positionY);

    this.units.push(createdUnit);
  },
};
