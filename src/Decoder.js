const zlib = require('zlib');
const { Buffer } = require('buffer');

class Decoder {
    /**
     * Decodes a blueprint string
     * v0 string is an inflated + base64 encoded JSON object
     * @param  {string} str Blueprint string
     * @param  {integer|string} version
     * @return {Object}
     */
    decode(str, version = null) {
        str = str.replace(/\s+/g, '');
        const stringVersion = version ? version : str.startsWith('H4sIAAAAAAAA') ? 'legacy' : parseInt(str.slice(0, 1));

        switch (stringVersion) {
        case 0: {
            try {
                const decodedBuffer = Buffer.from(str.slice(1), 'base64');
                const rawData = zlib.unzipSync(decodedBuffer);
                return JSON.parse(rawData.toString('utf8'));
            } catch (e) {
                throw new Error('Failed to decode blueprint string. Invalid string format');
            }
        }
        case 'legacy': {
            const decodedBuffer = new Buffer(str, 'base64');

            const rawData = zlib.unzipSync(decodedBuffer);
            const rawLua = rawData.toString();

            const match = rawLua.match(/do local _={entities={(.+?)}(,icons={(.+?)})?(,name="(.+?)")?};return _;end/);

            if (!match) {
                throw new Error('Invalid legacy blueprint string');
            }

            return {
                blueprint: {
                    entities: this._luaToJson(match[1]),
                    icons: this._luaToJson(match[3]),
                    version: 'legacy',
                    label: match[5] || ''
                }
            };
        }
        default:
            throw new Error(`Unknown blueprint string version: ${stringVersion}`);
        }
    }

    encode(object, version = 0) {
        switch (version) {
        case 0: {
            try {
                const json = JSON.stringify(object);
                return `0${zlib.deflateSync(json).toString('base64')}`;
            } catch (e) {
                throw new Error('Failed to decode blueprint string. Invalid string format');
            }
        }
        default:
            throw new Error(`Unknown blueprint string version: ${version}`);
        }
    }

    _luaToJson(str) {
        // Remove all linebreaks
        // str = str.replace(/\r?\n|\r/g, '');
        // Remove whitespace
        str = str.replace(/\s+/g, '');
        // Swap eaqual signs with colons
        str = str.replace(/=/g, ':');
        // Surrround all keys with doublequotes
        str = str.replace(/([a-zA-Z0-9_-]+)\s*:/g, '"$1":');

        let output = '';
        const openArrays = [];
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char === '{') {
                if (str[i + 1] === '{') {
                    output += '[';
                    openArrays.push(true);
                } else {
                    output += '{';
                    openArrays.push(false);
                }
            } else if (char === '}') {
                if (openArrays.pop()) {
                    output += ']';
                } else {
                    output += '}';
                }
            } else {
                output += char;
            }
        }

        str = output;

        str = str.replace(/{(( *((-?\d+\.?\d*((e|e)(-|\+)\d+)?)|("[^"]+")),? *)+)}/g, '[$1]');
        str = str.replace(/\[("[^"]+")\] *:/g, '$1:');
        str = str.replace(/nil/g, 'null');

        try {
            const json = JSON.parse(`[${str}]`);
            return json;
        } catch (e) {
            throw new Error('Could not convert lua to json object');
        }
    }
}

module.exports = new Decoder();
