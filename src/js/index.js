import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
/* Global State of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();

  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);

    // 3) Prepare the UI for results
    searchView.clearInput(); // clear input
    searchView.clearResults(); // clear results
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipes;
      await state.search.getResults();

      // 5) Render results in UI
      clearLoader();
      searchView.renderResults(state.search.result);

    } catch(err) {
      console.error(err);
      alert('Ups... Something went wrong!');
    } finally {
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const target = e.target || e.srcElement;
  const btn = target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  // Get the ID from url
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {

    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if (state.search) {
      searchView.highlightSelected(id);
    }

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get the recipe data
      await state.recipe.getRecipe();
      console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render the recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);

    } catch(err) {
      console.error(err);
      alert('Error processing recipe!');
    }
  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', e => {
  const target = e.target || e.srcElement;

  if (target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if ( target.matches('.btn-increase, .btn-increase *') ) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  }

  console.log(state.recipe);
});