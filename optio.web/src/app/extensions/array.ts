interface Array<T> {
  // move(oldIndex: number, newIndex: number): Array<T>;
  // sortBy(sortKey: string): Array<T>;
  // last(): boolean;
}

// Array.prototype.last = function(){
//   return this[this.length - 1];
// };

// Array.prototype.move = function (oldIndex, newIndex) {
//   if (newIndex >= this.length) {
//     let k = newIndex - this.length;
//     while ((k--) + 1) this.push(undefined);
//   }
//   this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
//   return this; // for testing purposes
// };

// Object.defineProperty(Array.prototype, 'sortBy', {
//   value: function (sortKey) {
//     return this.sort(function (a, b) {
//       if (a[sortKey] < b[sortKey]) { return -1; }
//       if (a[sortKey] > b[sortKey]) { return 1; }
//       return 0;
//     });
//   }
// });

// Array.prototype.sortBy = function(sortKey) {
//   return this.sort(function (a, b) {
//     if (a[sortKey] < b[sortKey]) return -1;
//     if (a[sortKey] > b[sortKey]) return 1;
//     return 0;
//   });
// };


