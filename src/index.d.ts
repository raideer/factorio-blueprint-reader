export type RawBlueprint = {
    label: string,
    entities: Object[],
    icons: Object[],
    version?: number
}

export type RawEntity = {
    name: string,
    position: Position,
    direction?: number
}

export type RawBlueprintBook = {
    blueprint_book: {
        blueprints: RawBlueprint[],
        item: string,
        active_index: number,
        version: number
    }
}

export type Bounds = {
    left: number,
    right: number,
    top: number,
    bottom: number
}

export type Position = {
    x: number,
    y: number
}

export class Entity {
    public constructor(entity: RawEntity, parent?: Blueprint);

    public blueprint: Blueprint | null;
    public name: string;
    public position: Position;
    public direction: number;
    public selection_box: number[][];
    public collision_box: number[][];
    public icon: string;
    public type: string;

    public data: any;
    public setSize(width: number, height: number): this;
    public getIngredients(expensive?: boolean): Object;
    public getRawIngredients(expensive?: boolean): Object;
    public getBounds(collision?: boolean): Bounds;
    public bounds: Bounds;
    public getWidth(collision?: boolean): number;
    public getHeight(collision?: boolean): number;
    public width: number;
    public height: number;
    public hasCollision(): boolean;
}

export module Utils {
    export function round(number: number, precision: number): number;
    export function sumObjects(a: Object, b: Object): Object;
    export function forEachObject(obj: Object, callback: (obj, i) => void, thisarg?: void): void;
    export function areOverlapping(boundsA: Bounds, boundsB: Bounds): boolean;
}

export class Reader {
    public static read(str: string, version?: number | string): BlueprintBook;
}

export class Recipe {
    public static getIngredients(item: string, expensive?: boolean): Object | null;
    public static getItemTree(item: string, expensive?: boolean): Object | null;
    public static getRawIngredients(item: string, expensive?: boolean, ignoreBase?: boolean): Object | null;
}

export class Grid {
    public constructor(blueprint?: Blueprint);

    public placedEntities: Entity[];

    public placeEntity(entity: Entity): void;
}

export class Decoder {
    public static decode(str: string, version?: number | string): RawBlueprint | RawBlueprintBook;
    public static encode(object: RawBlueprint | RawBlueprintBook, version?: number): string;
    private static _luaToJson(str: string): string;
}

export class Blueprint {
    public constructor(blueprint: RawBlueprint, parent?: BlueprintBook);

    public book: BlueprintBook | null;
    public label: string;
    public entities: Entity[];
    public icons: Object[];
    public version: number;
    public _grid: Grid | null;

    public getGrid(): Grid;
    public setBook(book: BlueprintBook): void;
    public getIngredients(expensive: boolean): Object;
    public getRequirements(): Object;
    public forEach(callback: (entity: Entity, index: number) => void, thisarg?: void): void;
    public first(): Blueprint;
    public last(): Blueprint;
}

export class BlueprintBook {
    public constructor(blueprints: Blueprint[] | Blueprint | null);

    public blueprints: Blueprint[];
    public label: string;
    public activeIndex: number;
    public version: number;
    public length: number;

    public add(blueprint: Blueprint): void;
    public first(): Blueprint;
    public last(): Blueprint;
    public forEach(callback: (blueprint: Blueprint, index: number) => void, thisarg?: void): void;
    public toObject(): RawBlueprintBook;
    public toString(version?: number | string): string;
}