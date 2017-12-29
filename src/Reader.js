const Decoder = require('./Decoder');
const Blueprint = require('./Blueprint');
const BlueprintBook = require('./BlueprintBook');

class Reader {
    read(str, version) {
        const obj = Decoder.decode(str, version);

        let blueprintBook = null;

        if ('blueprint' in obj) {
            const blueprint = new Blueprint(obj.blueprint);

            blueprintBook = new BlueprintBook(blueprint);
        } else if ('blueprint_book' in obj) {
            blueprintBook = new BlueprintBook([], obj.blueprint_book);

            obj.blueprint_book.blueprints.forEach(blueprint => {
                blueprintBook.add(new Blueprint(blueprint.blueprint));
            });
        }

        return blueprintBook;
    }
}

module.exports = new Reader();
