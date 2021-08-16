export const minHeap = {
  minHeapInit: function () {
    this.heap = [];
  },

  getLeftChildIndex: function (parentIndex) {
    return parentIndex * 2 + 1;
  },

  getRightChildIndex: function (parentIndex) {
    return parentIndex * 2 + 2;
  },

  getParentIndex: function (childIndex) {
    return Math.floor((childIndex - 1) / 2);
  },
};
