// To be run in browser.

const getCookies = function () {
    var pairs = document.cookie.split(";");
    var cookies = {};
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=");
        cookies[(pair[0] + "").trim()] = unescape(pair.slice(1).join("="));
    }
    return Object.keys(cookies).map((key) => {
        return {
            name: key,
            value: cookies[key],
        };
    });
};

console.log(getCookies());
