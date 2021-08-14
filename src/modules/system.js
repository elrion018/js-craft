import { Unit } from './Unit.js';
import { Building } from './Building.js';

export const System = {
  systemInit: function (timer) {
    this.units = [];
    this.buildings = [];
    this.matrix = Array.from({ length: window.innerHeight }, () =>
      Array.from({ length: window.innerWidth }, () => 0)
    );
    this.timer = timer;

    this.numberForUnitID = 0;
    this.numberForBuildingID = 0;
  },

  setMatrix: function (y, x, value) {
    this.matrix[y][x] = value;
  },

  getMatrix: function () {
    return this.matrix;
  },

  createUnit: function (positionX, positionY) {
    const createdUnit = Object.create(Unit);

    createdUnit.unitInit(positionX, positionY, this.numberForUnitID, this);
    this.units.push(createdUnit);

    this.numberForUnitID += 1;
  },

  createBuilding: function (positionX, positionY) {
    const createdBuilding = Object.create(Building);

    createdBuilding.buildingInit(
      positionX,
      positionY,
      this.numberForBuildingID,
      this
    );
    this.buildings.push(createdBuilding);

    this.numberForBuildingID += 1;
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

  getBuildings: function () {
    return this.buildings;
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

    this.buildings.forEach(building => {
      building.setIsSelected(false);
    });
  },

  selectObjectWithOneTouch(startX, startY) {
    const selectedObjectID = this.matrix[startY][startX];

    this.units.forEach(unit => {
      if (unit.getUnitID() === selectedObjectID) {
        unit.setIsSelected(true);

        return;
      }

      unit.setIsSelected(false);
    });

    this.buildings.forEach(building => {
      if (building.getBuildingID() === selectedObjectID) {
        building.setIsSelected(true);

        return;
      }

      building.setIsSelected(false);
    });
  },

  commandUnitsToMove(targetX, targetY) {
    const selectedUnits = this.getSelectedUnits();

    selectedUnits.forEach(unit => {
      unit.setTargetForMove(targetX, targetY);
    });
  },
};
