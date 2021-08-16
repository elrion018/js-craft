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
    return this.heap.length <= 0;
  },
};

Object.setPrototypeOf(priorityQueue, minHeap);
