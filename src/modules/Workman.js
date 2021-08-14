import { Unit } from './Unit.js';

export const Workman = {
  workmanInit: function (positionX, positionY, id, gameSystem) {
    this.unitInit(positionX, positionY, id, gameSystem);
    this.subtype = 'workman';
    this.isMining = false;
    this.radius = 10;
    this.speed = 1000;

    this.setUnitInMatrix(positionX, positionY, this.radius, this.id);
  },
};

Object.setPrototypeOf(Workman, Unit);
