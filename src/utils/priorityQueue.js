import { minHeap } from './minHeap.js';

export const priorityQueue = {
  priorityQueueInit: function () {
    this.minHeapInit();
  },

  enqueue: function (cost, element) {
    this.insert(cost, element);
  },

  dequeue: function () {
    return this.remove();
  },

  isEmpty: function () {
    if (this.heap.length) return false;

    return true;
  },
};

Object.setPrototypeOf(priorityQueue, minHeap);
