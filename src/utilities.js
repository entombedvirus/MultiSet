exports.bind = function (obj, func) {
  return function() {
    func.apply(obj, arguments);
  };
}
