**UNDER CONSTRUCTION**

# Factorio blueprint reader
**Factorio blueprint reader** is a library that can read, create and manipulate factorio blueprints. It works both on node.js and browser.

## Examples
```js
const { Reader } = require('factorio-blueprint-reader');

// Reader also accepts legacy blueprints (prior to 0.15)
// To be consistent, Reader will always return a BlueprintBook
const blueprintBook = Reader.read(`
0eNqd0+FqwyAQAOB3ud8G1GZt5quMMUx7G4Ia8exoCHn3mqSUQV3b9Jeo5+cdxw3Q2iOGaHwCNYDZd55AfQxA5sdrO52lPiAoMAkdMPDaTTs8hYhEVYraU+hiqlq0CUYGxh/wBEqMnwzQJ5MMLuK86b/80bUYc8DVIqetrax2Ifuho/yk89PPmalyWJ8XOY7shpBPEfeEzaOCbhOSM8dLWv2qJkra23pNXDQGBxNxv1xtC/b2an9rSg9h/n/Nu9VZFpOUBbpZTfNn639fTd9pu+AvarnteUjmwVJ/5pDBL0Zacq9ruRMb3jT55zPpqj52
`);

console.log('Blueprint object:', blueprintBook.toObject());
console.log('Blueprint string:', blueprintBook.toString());

blueprintBook.forEach(blueprint => {
    // do something with the blueprint
});

const blueprint = blueprintBook.first();

console.log('Item requirements:', blueprint.requirements());
console.log('Raw ingredients:', blueprint.ingredients());
/**
 * More soon
 * /
```

```js
const { Recipe } = require('factorio-blueprint-reader');

// Return the expensive recipe if possible
const expensive = true;

console.log(
    'Ingredients:', 
    Recipe.getIngredients('assembling-machine-2', expensive)
)

console.log(
    'Raw ingredients:', 
    Recipe.getRawIngredients('assembling-machine-2', expensive)
)

console.log(
    'Tree of required ingredients:',
    Recipe.getItemTree('assembling-machine-2', expensive)
)

```
## Using in browser
If you're planning on using factorio blueprint reader in browser, all neccessary classes will be available under `FBR` variable.
```js
    var Recipe = FBR.Recipe;
    var Reader = FBR.Reader;
    // etc ...
```


## Installation
This library will be published on npm when the first stable version gets released. *(soon tm)*

## Contributing
Pull requests and issues are welcome.  
Before commiting or making pull requests, make sure the run the linter with `npm run lint`