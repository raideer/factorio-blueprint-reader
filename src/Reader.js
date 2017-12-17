const Decoder = require('./Decoder');
const Blueprint = require('./Blueprint');
const BlueprintBook = require('./BlueprintBook');

class Reader {
    read(str, version) {
        const obj = Decoder.decode(str, version);

        if ('blueprint' in obj) {
            const blueprint = new Blueprint(obj.blueprint);
            return new BlueprintBook(blueprint);
        } else if ('blueprint_book' in obj) {
            const book = new BlueprintBook([], obj.blueprint_book);

            for (const blueprint of obj.blueprint_book.blueprints) {
                book.add(new Blueprint(blueprint.blueprint));
            }

            return book;
        }

        return null;
    }
}

module.exports = new Reader();
