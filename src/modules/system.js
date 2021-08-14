import { Unit } from './Unit.js';
import { Building } from './Building.js';
import { Resource } from './Resource.js';

export const System = {
  systemInit: function (timer, abstractFactory) {
    this.units = [];
    this.buildings = [];
    this.resources = [];
    this.matrix = Array.from({ length: window.innerHeight }, () =>
      Array.from({ length: window.innerWidth }, () => 0)
    );
    this.timer = timer;
    this.abstractFactory = abstractFactory;
    this.selectedObjects = [];
    this.rightClickObject = {};

    this.numberForUnitID = 0;
    this.numberForBuildingID = 0;
    this.numberForResourceID = 0;
  },

  createUnit: function (positionX, positionY, type) {
    const createdUnit = this.abstractFactory.createObject(type);

    if (createdUnit === null) return;

    createdUnit[`${type.toLowerCase()}Init`](
      positionX,
      positionY,
      this.numberForUnitID,
      this
    );
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

  createResource: function (positionX, positionY) {
    const createdResource = Object.create(Resource);

    createdResource.resourceInit(
      positionX,
      positionY,
      this.numberForResourceID,
      this
    );

    this.resources.push(createdResource);

    this.numberForResourceID += 1;
  },

  updateUnits: function () {
    this.timer.capture();
    const diff = this.timer.getCapturedDiff();

    this.units.forEach(unit => {
      unit.updateStatus(diff);
    });
  },

  getMatrix: function () {
    return this.matrix;
  },

  getUnits: function () {
    return this.units;
  },

  getBuildings: function () {
    return this.buildings;
  },

  getResources: function () {
    return this.resources;
  },

  getSelectedObjects: function () {
    return this.selectedObjects;
  },

  getRightClickObject: function () {
    return this.rightClickObject;
  },

  setMatrix: function (x, y, value) {
    this.matrix[y][x] = value;
  },

  setRightClickObject: function (x, y) {
    const objectID = this.matrix[y][x];

    if (objectID === 0) {
      this.rightClickObject = {};

      return;
    }

    const objects = [...this.units, ...this.buildings, ...this.resources];

    objects.forEach(object => {
      if (objectID === object.id) {
        this.rightClickObject = object;

        return;
      }
    });
  },

  selectUnitsWithDrag: function (startX, startY, endX, endY) {
    const leftX = Math.min(startX, endX);
    const rightX = Math.max(startX, endX);
    const topY = Math.max(startY, endY);
    const bottomY = Math.min(startY, endY);
    const selectedUnits = [];

    this.units.forEach(unit => {
      const { positionX, positionY } = unit.getPositions();

      if (
        positionX >= leftX &&
        positionX <= rightX &&
        positionY <= topY &&
        positionY >= bottomY
      ) {
        unit.setIsSelected(true);
        selectedUnits.push(unit);

        return;
      }

      unit.setIsSelected(false);
    });

    this.selectedObjects = selectedUnits;

    this.buildings.forEach(building => {
      building.setIsSelected(false);
    });

    this.resources.forEach(resource => {
      resource.setIsSelected(false);
    });
  },

  selectObjectWithOneTouch(startX, startY) {
    const selectedObjectID = this.matrix[startY][startX];

    this.selectOneUnit(selectedObjectID);
    this.selectOneBuilding(selectedObjectID);
    this.selectOneResource(selectedObjectID);
  },

  selectOneUnit: function (selectedObjectID) {
    this.units.forEach(unit => {
      if (unit.getID() === selectedObjectID) {
        unit.setIsSelected(true);

        this.selectedObjects = [unit];

        return;
      }

      unit.setIsSelected(false);
    });
  },

  selectOneBuilding: function (selectedObjectID) {
    this.buildings.forEach(building => {
      if (building.getID() === selectedObjectID) {
        building.setIsSelected(true);

        this.selectedObjects = [building];

        return;
      }

      building.setIsSelected(false);
    });
  },

  selectOneResource: function (selectedObjectID) {
    this.resources.forEach(resource => {
      if (resource.getID() === selectedObjectID) {
        resource.setIsSelected(true);

        this.selectedObjects = [resource];

        return;
      }

      resource.setIsSelected(false);
    });
  },

  commandUnitToMove(unit, targetX, targetY) {
    unit.setTargetForMove(targetX, targetY);
  },

  commandUnitToMine(unit, targetX, targetY) {
    unit.setTargetForMining(this.rightClickObject, targetX, targetY);
  },

  commandUnit(unit, targetX, targetY) {
    if (Object.keys(this.rightClickObject).length === 0)
      this.commandUnitToMove(unit, targetX, targetY);

    if (this.rightClickObject.type === 'resource' && unit.subtype === 'workman')
      this.commandUnitToMine(unit, targetX, targetY);

    if (this.rightClickObject.type === 'unit')
      this.commandUnitToMove(unit, targetX, targetY);

    if (this.rightClickObject.type === 'building')
      this.commandUnitToMove(unit, targetX, targetY);
  },

  commandUnits(targetX, targetY) {
    console.log(this.rightClickObject);

    this.selectedObjects.forEach(object => {
      if (object.type === 'unit') {
        this.commandUnit(object, targetX, targetY);
      }
    });
  },
};
