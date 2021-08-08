export const timer = {
  init: function () {
    this.now = 0;
    this.captureNow = 0;
  },

  start: function () {
    this.interval = setInterval(() => {
      this.now += 1;

      console.log(this.now);
    }, 1000);
  },

  capture: function () {
    this.captureNow = this.now;
  },
};
