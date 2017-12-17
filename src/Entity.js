const raw = require('../data.json');
const utils = require('./Utils');
const Recipe = require('./Recipe');

module.exports = class Entity {
    constructor(data, blueprint) {
        this.blueprint = blueprint;

        if (data.name === 'straight-rail') {
            this.name = 'rail';
        } else {
            this.name = data.name;
        }

        this.position = data.position;
        this.direction = data.direction || 0;

        const rawData = raw[this.name] || {};
        this.selection_box = rawData.selection_box || [0, 0];
        this.collision_box = rawData.collision_box || [0, 0];
        this.icon = raw[this.name].icon || '';
        this.type = raw[this.name].type || 'unknown';
    }

    setSize(width, height) {
        const halfWidth = utils.round(width / 2, 10);
        const halfHeight = utils.round(height / 2, 10);
        this.selection_box = [[-halfHeight, -halfWidth], [halfHeight, halfWidth]];

        return this;
    }

    ingredients(expensive = false) {
        return Recipe.getIngredients(this.name, expensive);
    }

    ingredientsRaw(expensive = false) {
        return Recipe.getRawIngredients(this.name, expensive);
    }

    width() {
        return Math.abs(this.selection_box[0][1]) + Math.abs(this.selection_box[1][1]);
    }

    height() {
        return Math.abs(this.selection_box[0][0]) + Math.abs(this.selection_box[1][0]);
    }

    hasCollision() {
        return (Math.abs(this.collision_box[0][0]) + Math.abs(this.collision_box[1][0]) !== 0)
        && (Math.abs(this.collision_box[0][1]) + Math.abs(this.collision_box[1][1]) !== 0);
    }
};
