export const timer = {
  init: function () {
    this.prev = 0;
    this.now = 0;
    this.capturedNow = 0;
    this.capturedDiff = 0;
  },

  start: function () {
    this.interval = setInterval(() => {
      this.prev = this.now;
      this.now += 0.01;
    }, 10);
  },

  stop: function () {
    this.interval = null;
  },

  capture: function () {
    this.capturedDiff = this.now - this.capturedNow;
    this.capturedNow = this.now;
  },

  getCapturedDiff: function () {
    return this.capturedDiff;
  },
};
