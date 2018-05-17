export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = {id, title, author, img};
    this.likes.push(like);

    // Persist data in localStorage
    this.persitData();

    return like;
  }

  removeLike(id) {
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index, 1);

    // Persist data in localStorage
    this.persitData();
  }

  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }

  persitData() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  loadData() {
    const data = JSON.parse(localStorage.getItem('likes'));

    // Restore the likes from localStorage
    if (data) {
      this.likes = data;
    }
  }
}