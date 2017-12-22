module.exports = {
    round: (number, precision = 1) => {
        return Math.round(number * precision) / precision;
    },
    
    sumObjects(a, b) {
        return Object.keys(a).concat(Object.keys(b))
        .reduce((obj, k) => {
            obj[k] = (a[k] || 0) + (b[k] || 0);
            return obj;
        }, {});
    },

    forEachObject(obj, callback, thisarg = null) {
        for (const i in obj) {
            callback.call(thisarg, obj[i], i);
        }
    },

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
};
