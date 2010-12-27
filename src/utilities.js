console.log("In utils.js");

exports.bind = function (obj, func) {
  return function() {
    func.apply(obj, arguments);
  };
}
