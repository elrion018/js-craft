import { Workman } from './Workman.js';

export const AbstractFactory = {
  abstractFactoryInit: function () {
    this.objects = { Workman };
  },

  addObject: function (type, object) {
    this.objects[type] = object;
  },

  createObject: function (type) {
    const object = this.objects[type];

    return object ? Object.create(object) : null;
  },
};
