const raw = require('../data.json');

class Recipe {
    /**
     * Returns an object of ingredients(items) neccessary to craft 1 item
     * @param {string} item Item name in snake case
     * @param {boolean} expensive Should it look up expensive recipies
     */
    getIngredients(item, expensive = false) {
        const recipeObj = raw.recipe[item];

        if (recipeObj) {
            const materials = {};

            let recipe = null;

            if (expensive && 'expensive' in recipeObj) {
                recipe = recipeObj.expensive;
            } else if ('normal' in recipeObj) {
                recipe = recipeObj.normal;
            } else {
                recipe = recipeObj;
            }
            
            recipe.ingredients.forEach(ingredient => {
                if (ingredient instanceof Array) {
                    if ('result_count' in recipe) {
                        materials[ingredient[0]] = ingredient[1] / recipe.result_count;
                    } else {
                        materials[ingredient[0]] = ingredient[1];
                    }
                } else if (ingredient instanceof Object) {
                    if ('result_count' in recipe) {
                        materials[ingredient.name] = ingredient.amount / recipe.result_count;
                    } else {
                        if ('results' in recipe) {
                            const i = recipe.results.find(val => {
                                return val.name === item;
                            });
    
                            if (i) {
                                materials[ingredient.name] = ingredient.amount / i.amount;
                                return;
                            }
                        }

                        materials[ingredient.name] = ingredient.amount;
                    }
                }
            });

            return materials;
        }

        return null;
    }

    /**
     * Returns a tree of ingredients neccessary to craft 1 item
     * @param {item} item Item name in snake case
     * @param {boolean} expensive Should it look up expensive recipies
     */
    getItemTree(item, expensive = false) {
        const expandTree = tree => {
            for (const ingredient in tree) {
                const node = tree[ingredient];

                if (!node.ingredients) {
                    node.ingredients = {};

                    const recipe = this.getIngredients(ingredient, expensive);

                    for (const subIngredient in recipe) {
                        node.ingredients[subIngredient] = {
                            count: recipe[subIngredient],
                            ingredients: null
                        };

                        if (raw.recipe[subIngredient]) {
                            node.ingredients[subIngredient].category = raw.recipe[subIngredient].category || 'crafting';
                        }
                    }

                    node.ingredients = expandTree(node.ingredients);
                }
            }

            return tree;
        };

        const root = {};
        root[item] = {
            count: 1,
            ingredients: null,
            category: raw.recipe[item].category || 'crafting'
        };

        return expandTree(root);
    }

    /**
     * Returns an object of raw ingredients neccessary to craft 1 item
     * @param {string} item Item name in snake case
     * @param {boolean} expensive Should it look up expensive recipies
     * @param {boolean} ignoreBase If true, getRaw will not break down plates and
     *                             chemistry items to their base ingredients.
     *                             For example, plastic-bar will not be broken down
     *                             into 10 petroleum-gas and 0.5 coal, and iron-plate into
     *                             iron-ore etc.
     */
    getRawIngredients(item, expensive = false, ignoreBase = true) {
        const ingredients = this.getItemTree(item, expensive);
        const accumulator = {};

        const dontBreakdown = ignoreBase ? ['iron-plate', 'copper-plate', 'plastic-bar', 'chemistry'] : [];

        const count = (tree, multiplier = 1) => {
            for (const i in tree) {
                const node = tree[i];

                if (
                    Object.keys(node.ingredients).length === 0
                    || dontBreakdown.indexOf(i) !== -1
                    || dontBreakdown.indexOf(node.category) !== -1
                ) {
                    if (accumulator[i]) {
                        accumulator[i] += multiplier * node.count;
                    } else {
                        accumulator[i] = multiplier * node.count;
                    }
                } else {
                    count(node.ingredients, multiplier * node.count);
                }
            }
        };

        count(ingredients);

        return accumulator;
    }
}

module.exports = new Recipe();
