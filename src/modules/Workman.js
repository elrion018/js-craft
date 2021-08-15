import { Unit } from './Unit.js';

export const Workman = {
  workmanInit: function (positionX, positionY, id, gameSystem) {
    this.unitInit(positionX, positionY, id, gameSystem);
    this.subtype = 'workman';
    this.isMining = false;
    this.radius = 10;
    this.speed = 1000;
    this.targetResource = {};

    this.setUnitInMatrix(positionX, positionY, this.radius, this.id);
  },

  setTargetForMining: function (targetResource, targetX, targetY) {
    this.isMining = true;
    this.isMoving = true;
    this.startX = this.positionX;
    this.startY = this.positionY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.targetResource = targetResource;
  },
};

Object.setPrototypeOf(Workman, Unit);
