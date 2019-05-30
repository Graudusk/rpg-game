"use strict";

let funcs = {};

funcs.bind = function(el, action, method) {
  let element = null;

  if (typeof el == "string") {
    element = document.getElementById(el);
  } else {
    element = el;
  }
  element.addEventListener(action, method);
};

String.prototype.toCamelCase = function() {
  return this.valueOf()
    .replace(/\s(.)/g, function($1) {
      return $1.toUpperCase();
    })
    .replace(/\s/g, "")
    .replace(/^(.)/, function($1) {
      return $1.toLowerCase();
    });
};

funcs.isCollide = function(a, b) {
  return !(
    a.y + a.height < b.y ||
    a.y > b.y + b.height ||
    a.x + a.width < b.x ||
    a.x > b.x + b.width
  );
};

funcs.clone = function(obj) {
  if (null == obj || "object" != typeof obj) {
    return obj;
  }
  var copy = new obj.constructor();

  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      copy[attr] = obj[attr];
    }
  }
  return copy;
};

// funcs.prototype.binds = function(el, action, method) {
//     let element = null;

//     if (typeof el == 'string') {
//         element = document.getElementById(el);
//     }
//     element.addEventListener(action, method);
// };

export { funcs };
