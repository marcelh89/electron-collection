exports.addArrItem = (arr, item) => {
    let found = arr.find(e => e.key === item.key);;
    if (!found)
        arr.push(item);
    return arr;
};

exports.removeArrItems = arr => {
    var what,
        a = arguments,
        L = a.length,
        ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
};