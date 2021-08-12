import { unit } from './unit.js';

export const system = {
  systemInit: function (timer) {
    this.units = [];
    this.matrix = [];
    this.timer = timer;

    this.numberForUnitID = 10;
  },

  createUnit: function (positionX, positionY) {
    const createdUnit = Object.create(unit);

    createdUnit.unitInit(positionX, positionY, this.numberForUnitID, this);
    this.units.push(createdUnit);

    this.numberForUnitID += 1;
  },

  updateUnits: function () {
    this.timer.capture();
    const diff = this.timer.getCapturedDiff();

    this.units.forEach(unit => {
      unit.updateStatus(diff);
    });
  },

  getUnits: function () {
    return this.units;
  },

  getSelectedUnits: function () {
    return this.units.filter(unit => {
      return unit.getIsSelected();
    });
  },

  selectUnitsWithDrag: function (startX, startY, endX, endY) {
    const leftX = Math.min(startX, endX);
    const rightX = Math.max(startX, endX);
    const topY = Math.max(startY, endY);
    const bottomY = Math.min(startY, endY);

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
  },

  selectUnitWithOneTouch(startX, startY) {
    const selectedUnitID = this.matrix[startY][startX];

    this.units.forEach(unit => {
      if (unit.getUnitID() === selectedUnitID) {
        unit.setIsSelected(true);

        return;
      }

      unit.setIsSelected(false);
    });
  },

  commandUnitsToMove(targetX, targetY) {
    const selectedUnits = this.getSelectedUnits();

    selectedUnits.forEach(unit => {
      unit.setTargetForMove(targetX, targetY);
    });
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
