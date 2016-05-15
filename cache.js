var c;
var lines = [];
var fallback = [];

function Cache() {
}

c = Cache;

c.prototype.setCache = function(line) {
    if (Array.isArray(line)) {
        console.log(123);
    } else {
        lines.push(line);
    }
};

c.prototype.setFallback = function(line) {
    fallback.push(line);
};

c.prototype.get = function() {
    var newLines = c.uniq(lines);
    var newFallback = c.uniq(fallback);
    var items = [];

    items.push('CACHE MANIFEST');
    items.push('# ' + new Date());
    items.push('CACHE:');
    Array.prototype.push.apply(items, newLines);
    items.push('NETWORK:');
    items.push('*');
    items.push('FALLBACK:');
    Array.prototype.push.apply(items, newFallback);
    return items.join('\n');
};

c.uniq = function(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = a[i];
        if (seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = item;
        }
    }
    return out;
};

module.exports = new Cache();
