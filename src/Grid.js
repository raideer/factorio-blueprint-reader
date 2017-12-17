module.exports = class Grid {
    constructor(blueprint = null) {
        this.placedEntities = [];

        if (blueprint) {
            blueprint.entities.forEach(entity => {
                this.placeEntity(entity);
            });
        }
    }

    placeEntity(entity) {
        const overlaps = this.placedEntities.reduce((overlapping, placed) => {
            if (this.areOverlapping(placed.bounds(), entity.bounds())) {
                overlapping.push(placed);
            }

            return overlapping;
        }, []);

        if (overlaps.length) {
            if (overlaps.length === 1) {
                throw new Error(`Can't place ${entity.name} at x: ${entity.position.x} y: ${entity.position.y}. \
                It overlaps ${overlaps[0].name} at x: ${overlaps[0].position.x} y: ${overlaps[0].position.y}`);
            } else {
                throw new Error(`Can't place ${entity.name} at x: ${entity.position.x} y: ${entity.position.y}. \
                It overlaps ${overlaps.length} entities`);
            }
        }

        this.placedEntities.push(entity);
    }

    areOverlapping(boundsA, boundsB) {
        if (
            boundsA.left >= boundsB.right
            || boundsA.bottom >= boundsB.top
            || boundsB.left >= boundsA.right
            || boundsB.bottom >= boundsA.top
        ) {
            return false;
        }

        return true;
    }
}
