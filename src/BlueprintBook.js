const Blueprint = require('./Blueprint');
const Decoder = require('./Decoder');

module.exports = class BlueprintBook {
    constructor(blueprints, data = {}) {
        if (blueprints instanceof Array) {
            this.blueprints = blueprints;
        } else if (blueprints instanceof Blueprint) {
            this.blueprints = [blueprints];
        } else {
            this.blueprints = [];
        }

        this.forEach(blueprint => {
            blueprint.setBook(this);
        });

        this.label = data.label || '';
        this.activeIndex = data['active-index'] || 0;
        this.version = data.version || 0;
    }

    add(blueprint) {
        if (!(blueprint instanceof Blueprint)) {
            throw new Error(`"add" expects a Blueprint object! ${typeof blueprint} received`);
        }

        blueprint.book = this;
        this.blueprints.push(blueprint);
    }

    first() {
        return this.blueprints[0];
    }

    last() {
        return this.blueprints[this.blueprints.length - 1];
    }

    get length() {
        return this.blueprints.length;
    }

    forEach(callback, thisarg = null) {
        for (let i = 0; i < this.blueprints.length; i++) {
            if (i in this.blueprints) {
                callback.call(thisarg, this.blueprints[i], i);
            }
        }
    }

    toObject() {
        return {
            blueprint_book: {
                blueprints: this.blueprints.map(blueprint => blueprint.toObject()),
                item: 'blueprint-book',
                active_index: 0,
                version: 0
            }
        };
    }

    toString(version = 0) {
        return `${version}${Decoder.encode(this.toObject(), version)}`;
    }
};
