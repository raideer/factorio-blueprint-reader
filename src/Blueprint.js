const Entity = require('./Entity');
const Grid = require('./Grid');
const { sumObjects } = require('./Utils');

module.exports = class Blueprint {
    constructor(blueprint, book = null) {
        this.book = book;
        this.label = blueprint.label;
        this.entities = blueprint.entities.map(entity => {
            return new Entity(entity, this);
        });
        this.icons = blueprint.icons;
        this.version = blueprint.version;
        this._grid = null;
    }

    getGrid() {
        if (!this._grid) {
            this._grid = new Grid(this);
        }

        return this._grid;
    }

    setBook(book) {
        if (!this.book) {
            this.book = book;
        } else {
            throw new Error('Blueprint is already in a BlueprintBook');
        }
    }

    getIngredients(expensive = false) {
        return this.entities.reduce((accumulator, entity) => {
            const ingredients = entity.getRawIngredients(expensive);
            return ingredients ? sumObjects(accumulator, ingredients) : accumulator;
        }, {});
    }

    forEach(callback, thisarg = null) {
        for (let i = 0; i < this.entities.length; i++) {
            if (i in this.entities) {
                callback.call(thisarg, this.entities[i], i);
            }
        }
    }

    first() {
        return this.entities[0];
    }

    last() {
        return this.entities[this.entities.length - 1];
    }

    /**
     * Returns an object of required item count
     * @return {Object}
     */
    getRequirements() {
        return this.entities.reduce((accumulator, entity) => {
            if (!accumulator[entity.name]) {
                accumulator[entity.name] = 0;
            }

            if (!accumulator.total) {
                accumulator.total = 0;
            }

            accumulator[entity.name]++;
            accumulator.total++;

            return accumulator;
        }, {});
    }
};
