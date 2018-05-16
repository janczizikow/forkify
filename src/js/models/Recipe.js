import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch(err) {
      console.error(err);
      alert('Ups... Something went wrong :( please try again');
    }
  }

  calcTime() {
    // Assuming that we need 15 mins for each 3 ingredients
    const numOfIng = this.ingredients.length;
    const periods = Math.ceil(numOfIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'punds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

    const newIngredients = this.ingredients.map(el => {
      // 1 Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      // 2 Remove prantheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // 3 Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.trim().split(' ');
      const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

      let objIng;
      if ( unitIndex > -1 ) {
        // There is a unit
        // Example 4 1/2 cup, arrCount = [4, 1/2] => eval("4 + 1/2") => 4.5
        // Example 4 cup, arrCount = [4];
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        };

      } else if (parseInt(arrIng[0], 10)) {
        // no unit, but 1st element is a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        };
      } else if ( unitIndex === -1 ) {
        // no units and no number in 1st position
        objIng = {
          count: 1,
          unit: '',
          ingredient
        };
      }

      return objIng;
    });

    this.ingredients = newIngredients;
  }
}