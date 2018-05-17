import uniqid from 'uniqid';

export default class List {
  constructor() {
    this.items = [];
  }

  addItem(count, ingredient, unit) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    };

    this.items.push(item);

    // Save the data in local storage
    this.persitData();

    return item;
  }

  removeItem(id) {
    const index = this.items.findIndex(el => el.id === id);
    // [2, 4, 8] splice(1, 1) --> returns 4 original array is [2, 8]
    // [2, 4, 8] slice(1, 2) --> returns 4 original array is [2, 4, 8]
    this.items.splice(index, 1);

    // Save the data in local storage
    this.persitData();
  }

  updateCount(id, newCount) {
    this.items.find(el => el.id === id).count = newCount;
  }

  persitData() {
    localStorage.setItem('list', JSON.stringify(this.items));
  }

  loadData() {
    const data = JSON.parse(localStorage.getItem('list'));

    // Restore the likes from localStorage
    if (data) {
      this.items = data;
    }
  }
}