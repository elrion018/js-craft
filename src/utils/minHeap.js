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

  insert: function (cost, value) {
    const node = { cost, value };

    this.heap.push(node);
    this.heapifyUp();
  },

  heapifyUp: function () {
    let index = this.heap.length - 1;
    const lastInsertedNode = this.heap[index];

    while (index > 0) {
      const parentIndex = this.getParentIndex(index);

      if (this.heap[parentIndex].cost > lastInsertedNode.cost) {
        this.heap[index] = this.heap[parentIndex];
        index = parentIndex;
      } else break;
    }

    this.heap[index] = lastInsertedNode;
  },

  remove: function () {
    const { length } = this.heap;
    const rootNode = this.heap[0];

    if (length <= 0) return null;
    if (length === 1) this.heap = [];
    else {
      this.heap[0] = this.heap.pop();
      this.heapifyDown();
    }

    return rootNode;
  },

  heapifyDown: function () {
    let index = 0;
    const { length } = this.heap;
    const rootNode = this.heap[index];

    while (this.getLeftChildIndex(index) < length) {
      const leftChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);

      const smallerChildIndex =
        rightChildIndex < length &&
        this.heap[rightChildIndex].cost < this.heap[leftChildIndex].cost
          ? rightChildIndex
          : leftChildIndex;

      if (this.heap[smallerChildIndex].cost <= rootNode.cost) {
        this.heap[index] = this.heap[smallerChildIndex];
        index = smallerChildIndex;
      } else break;
    }

    this.heap[index] = rootNode;
  },
};
