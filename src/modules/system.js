import { unit } from './unit.js';

export const system = {
  init: function () {
    this.units = [];
    this.matrix = [];
  },

  createUnit: function (positionX, positionY) {
    const createdUnit = Object.create(unit);
    this.matrix[positionY][positionX] = 1;

    createdUnit.init(positionX, positionY);
    this.units.push(createdUnit);
  },

  getUnits: function () {
    return this.units;
  },

  selectUnits: function (startX, startY, endX, endY) {
    const leftX = Math.min(startX, endX);
    const rightX = Math.max(startX, endX);
    const topY = Math.max(startY, endY);
    const bottomY = Math.min(startY, endY);

    console.log(leftX, rightX, topY, bottomY);

    this.units.forEach(unit => {
      const { positionX, positionY } = unit.getPositions();

      if (
        positionX >= leftX &&
        positionX <= rightX &&
        positionY <= topY &&
        positionY >= bottomY
      ) {
        unit.setIsSelected(true);
        return;
      }

      unit.setIsSelected(false);
    });

    console.log(this.units);
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
