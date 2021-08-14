export const AbstractFactory = {
  factoryInit: function () {
    this.objects = {};
  },

  addObject: function (type, object) {
    this.objects[type] = object;
  },

  createObject: function (type) {
    const object = this.objects[type];

    return object ? Object.create(object) : null;
  },
};
