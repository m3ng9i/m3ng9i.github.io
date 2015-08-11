var JUTILS = JUTILS || {};

/*
 * Build a query string base on given data.
 *
 * Usage:
 *     var data = {"url": "http://127.0.0.1", token="123"}
 *     var querystring = JUTILS.buildQueryString(data); // url=http%3A%2F%2F127.0.0.1&token=123
 *
 */
JUTILS.buildQueryString = function(data) {
    var result = [];
    for (var d in data) {
        result.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
    }
   return result.join("&");
};

/*
 * Get a value from query string.
 * Code from: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 *
 * Example：
 *      url：http://127.0.0.1/index.html?t=20151031180000
 *      getParameterByName("t"); // 20151031180000
 */
JUTILS.queryValue = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

