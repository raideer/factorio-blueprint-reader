const raw = require('../data.json');
const utils = require('./Utils');
const Recipe = require('./Recipe');
const { direction } = require('./types');

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

        this.selection_box = this.data.selection_box || [[0, 0], [0, 0]];
        this.collision_box = this.data.collision_box || [[0, 0], [0, 0]];
        this.icon = this.data.icon || '';
        this.type = this.data.type || 'unknown';
    }

    get data() {
        return raw[this.name] || {};
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

    /**
     * Returns either selection or collision bounds of this entity
     * @param {boolean} collision Returns collision bounds if true
     */
    bounds(collision = false) {
        const bounds = {
            left: this.position.x - (this.width(collision) / 2),
            right: this.position.x + (this.width(collision) / 2),
            top: this.position.y - (this.height(collision) / 2),
            bottom: this.position.y + (this.height(collision) / 2)
        };

        if (this.direction !== direction.NORTH && this.direction !== direction.SOUTH) {
            const clone = Object.assign({}, bounds);

            if (this.direction === direction.EAST || this.direction === direction.WEST) {
                bounds.left = clone.top;
                bounds.right = clone.bottom;
                bounds.top = clone.right;
                bounds.bottom = clone.left;
            }
        }
        
        return bounds;
    }
    
    /**
     * Returns the width of selection or collision box
     * @param {boolean} collision Returns collision box width if true
     */
    width(collision = false) {
        const box = collision ? this.collision_box : this.selection_box;
        return Math.abs(box[0][1]) + Math.abs(box[1][1]);
    }

    /**
     * Returns the height of selection or collision box
     * @param {boolean} collision Returns collision box width if true
     */
    height(collision = false) {
        const box = collision ? this.collision_box : this.selection_box;
        return Math.abs(box[0][0]) + Math.abs(box[1][0]);
    }

    hasCollision() {
        return (Math.abs(this.collision_box[0][0]) + Math.abs(this.collision_box[1][0]) !== 0)
        && (Math.abs(this.collision_box[0][1]) + Math.abs(this.collision_box[1][1]) !== 0);
    }
};
