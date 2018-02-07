!function() {
  var genie = {
    version: "3.5.17"
  };
  var genie_arraySlice = [].slice, genie_array = function(list) {
    return genie_arraySlice.call(list);
  };
  var genie_document = this.document;
  function genie_documentElement(node) {
    return node && (node.ownerDocument || node.document || node).documentElement;
  }
  function genie_window(node) {
    return node && (node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView);
  }
  if (genie_document) {
    try {
      genie_array(genie_document.documentElement.childNodes)[0].nodeType;
    } catch (e) {
      genie_array = function(list) {
        var i = list.length, array = new Array(i);
        while (i--) array[i] = list[i];
        return array;
      };
    }
  }
  if (!Date.now) Date.now = function() {
    return +new Date();
  };
  if (genie_document) {
    try {
      genie_document.createElement("DIV").style.setProperty("opacity", 0, "");
    } catch (error) {
      var genie_element_prototype = this.Element.prototype, genie_element_setAttribute = genie_element_prototype.setAttribute, genie_element_setAttributeNS = genie_element_prototype.setAttributeNS, genie_style_prototype = this.CSSStyleDeclaration.prototype, genie_style_setProperty = genie_style_prototype.setProperty;
      genie_element_prototype.setAttribute = function(name, value) {
        genie_element_setAttribute.call(this, name, value + "");
      };
      genie_element_prototype.setAttributeNS = function(space, local, value) {
        genie_element_setAttributeNS.call(this, space, local, value + "");
      };
      genie_style_prototype.setProperty = function(name, value, priority) {
        genie_style_setProperty.call(this, name, value + "", priority);
      };
    }
  }
  genie.ascending = genie_ascending;
  function genie_ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }
  genie.descending = function(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  };
  genie.min = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;
    }
    return a;
  };
  genie.max = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
    }
    return a;
  };
  genie.extent = function(array, f) {
    var i = -1, n = array.length, a, b, c;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = c = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = c = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }
    return [ a, c ];
  };
  function genie_number(x) {
    return x === null ? NaN : +x;
  }
  function genie_numeric(x) {
    return !isNaN(x);
  }
  genie.sum = function(array, f) {
    var s = 0, n = array.length, a, i = -1;
    if (arguments.length === 1) {
      while (++i < n) if (genie_numeric(a = +array[i])) s += a;
    } else {
      while (++i < n) if (genie_numeric(a = +f.call(array, array[i], i))) s += a;
    }
    return s;
  };
  genie.mean = function(array, f) {
    var s = 0, n = array.length, a, i = -1, j = n;
    if (arguments.length === 1) {
      while (++i < n) if (genie_numeric(a = genie_number(array[i]))) s += a; else --j;
    } else {
      while (++i < n) if (genie_numeric(a = genie_number(f.call(array, array[i], i)))) s += a; else --j;
    }
    if (j) return s / j;
  };
  genie.quantile = function(values, p) {
    var H = (values.length - 1) * p + 1, h = Math.floor(H), v = +values[h - 1], e = H - h;
    return e ? v + e * (values[h] - v) : v;
  };
  genie.median = function(array, f) {
    var numbers = [], n = array.length, a, i = -1;
    if (arguments.length === 1) {
      while (++i < n) if (genie_numeric(a = genie_number(array[i]))) numbers.push(a);
    } else {
      while (++i < n) if (genie_numeric(a = genie_number(f.call(array, array[i], i)))) numbers.push(a);
    }
    if (numbers.length) return genie.quantile(numbers.sort(genie_ascending), .5);
  };
  genie.variance = function(array, f) {
    var n = array.length, m = 0, a, d, s = 0, i = -1, j = 0;
    if (arguments.length === 1) {
      while (++i < n) {
        if (genie_numeric(a = genie_number(array[i]))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    } else {
      while (++i < n) {
        if (genie_numeric(a = genie_number(f.call(array, array[i], i)))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    }
    if (j > 1) return s / (j - 1);
  };
  genie.deviation = function() {
    var v = genie.variance.apply(this, arguments);
    return v ? Math.sqrt(v) : v;
  };
  function genie_bisector(compare) {
    return {
      left: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1; else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid; else lo = mid + 1;
        }
        return lo;
      }
    };
  }
  var genie_bisect = genie_bisector(genie_ascending);
  genie.bisectLeft = genie_bisect.left;
  genie.bisect = genie.bisectRight = genie_bisect.right;
  genie.bisector = function(f) {
    return genie_bisector(f.length === 1 ? function(d, x) {
      return genie_ascending(f(d), x);
    } : f);
  };
  genie.shuffle = function(array, i0, i1) {
    if ((m = arguments.length) < 3) {
      i1 = array.length;
      if (m < 2) i0 = 0;
    }
    var m = i1 - i0, t, i;
    while (m) {
      i = Math.random() * m-- | 0;
      t = array[m + i0], array[m + i0] = array[i + i0], array[i + i0] = t;
    }
    return array;
  };
  genie.permute = function(array, indexes) {
    var i = indexes.length, permutes = new Array(i);
    while (i--) permutes[i] = array[indexes[i]];
    return permutes;
  };
  genie.pairs = function(array) {
    var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n);
    while (i < n) pairs[i] = [ p0 = p1, p1 = array[++i] ];
    return pairs;
  };
  genie.transpose = function(matrix) {
    if (!(n = matrix.length)) return [];
    for (var i = -1, m = genie.min(matrix, genie_transposeLength), transpose = new Array(m); ++i < m; ) {
      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n; ) {
        row[j] = matrix[j][i];
      }
    }
    return transpose;
  };
  function genie_transposeLength(d) {
    return d.length;
  }
  genie.zip = function() {
    return genie.transpose(arguments);
  };
  genie.keys = function(map) {
    var keys = [];
    for (var key in map) keys.push(key);
    return keys;
  };
  genie.values = function(map) {
    var values = [];
    for (var key in map) values.push(map[key]);
    return values;
  };
  genie.entries = function(map) {
    var entries = [];
    for (var key in map) entries.push({
      key: key,
      value: map[key]
    });
    return entries;
  };
  genie.merge = function(arrays) {
    var n = arrays.length, m, i = -1, j = 0, merged, array;
    while (++i < n) j += arrays[i].length;
    merged = new Array(j);
    while (--n >= 0) {
      array = arrays[n];
      m = array.length;
      while (--m >= 0) {
        merged[--j] = array[m];
      }
    }
    return merged;
  };
  var abs = Math.abs;
  genie.range = function(start, stop, step) {
    if (arguments.length < 3) {
      step = 1;
      if (arguments.length < 2) {
        stop = start;
        start = 0;
      }
    }
    if ((stop - start) / step === Infinity) throw new Error("infinite range");
    var range = [], k = genie_range_integerScale(abs(step)), i = -1, j;
    start *= k, stop *= k, step *= k;
    if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k);
    return range;
  };
  function genie_range_integerScale(x) {
    var k = 1;
    while (x * k % 1) k *= 10;
    return k;
  }
  function genie_class(ctor, properties) {
    for (var key in properties) {
      Object.defineProperty(ctor.prototype, key, {
        value: properties[key],
        enumerable: false
      });
    }
  }
  genie.map = function(object, f) {
    var map = new genie_Map();
    if (object instanceof genie_Map) {
      object.forEach(function(key, value) {
        map.set(key, value);
      });
    } else if (Array.isArray(object)) {
      var i = -1, n = object.length, o;
      if (arguments.length === 1) while (++i < n) map.set(i, object[i]); else while (++i < n) map.set(f.call(object, o = object[i], i), o);
    } else {
      for (var key in object) map.set(key, object[key]);
    }
    return map;
  };
  function genie_Map() {
    this._ = Object.create(null);
  }
  var genie_map_proto = "__proto__", genie_map_zero = "\x00";
  genie_class(genie_Map, {
    has: genie_map_has,
    get: function(key) {
      return this._[genie_map_escape(key)];
    },
    set: function(key, value) {
      return this._[genie_map_escape(key)] = value;
    },
    remove: genie_map_remove,
    keys: genie_map_keys,
    values: function() {
      var values = [];
      for (var key in this._) values.push(this._[key]);
      return values;
    },
    entries: function() {
      var entries = [];
      for (var key in this._) entries.push({
        key: genie_map_unescape(key),
        value: this._[key]
      });
      return entries;
    },
    size: genie_map_size,
    empty: genie_map_empty,
    forEach: function(f) {
      for (var key in this._) f.call(this, genie_map_unescape(key), this._[key]);
    }
  });
  function genie_map_escape(key) {
    return (key += "") === genie_map_proto || key[0] === genie_map_zero ? genie_map_zero + key : key;
  }
  function genie_map_unescape(key) {
    return (key += "")[0] === genie_map_zero ? key.slice(1) : key;
  }
  function genie_map_has(key) {
    return genie_map_escape(key) in this._;
  }
  function genie_map_remove(key) {
    return (key = genie_map_escape(key)) in this._ && delete this._[key];
  }
  function genie_map_keys() {
    var keys = [];
    for (var key in this._) keys.push(genie_map_unescape(key));
    return keys;
  }
  function genie_map_size() {
    var size = 0;
    for (var key in this._) ++size;
    return size;
  }
  function genie_map_empty() {
    for (var key in this._) return false;
    return true;
  }
  genie.nest = function() {
    var nest = {}, keys = [], sortKeys = [], sortValues, rollup;
    function map(mapType, array, depth) {
      if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;
      var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new genie_Map(), values;
      while (++i < n) {
        if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
          values.push(object);
        } else {
          valuesByKey.set(keyValue, [ object ]);
        }
      }
      if (mapType) {
        object = mapType();
        setter = function(keyValue, values) {
          object.set(keyValue, map(mapType, values, depth));
        };
      } else {
        object = {};
        setter = function(keyValue, values) {
          object[keyValue] = map(mapType, values, depth);
        };
      }
      valuesByKey.forEach(setter);
      return object;
    }
    function entries(map, depth) {
      if (depth >= keys.length) return map;
      var array = [], sortKey = sortKeys[depth++];
      map.forEach(function(key, keyMap) {
        array.push({
          key: key,
          values: entries(keyMap, depth)
        });
      });
      return sortKey ? array.sort(function(a, b) {
        return sortKey(a.key, b.key);
      }) : array;
    }
    nest.map = function(array, mapType) {
      return map(mapType, array, 0);
    };
    nest.entries = function(array) {
      return entries(map(genie.map, array, 0), 0);
    };
    nest.key = function(d) {
      keys.push(d);
      return nest;
    };
    nest.sortKeys = function(order) {
      sortKeys[keys.length - 1] = order;
      return nest;
    };
    nest.sortValues = function(order) {
      sortValues = order;
      return nest;
    };
    nest.rollup = function(f) {
      rollup = f;
      return nest;
    };
    return nest;
  };
  genie.set = function(array) {
    var set = new genie_Set();
    if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);
    return set;
  };
  function genie_Set() {
    this._ = Object.create(null);
  }
  genie_class(genie_Set, {
    has: genie_map_has,
    add: function(key) {
      this._[genie_map_escape(key += "")] = true;
      return key;
    },
    remove: genie_map_remove,
    values: genie_map_keys,
    size: genie_map_size,
    empty: genie_map_empty,
    forEach: function(f) {
      for (var key in this._) f.call(this, genie_map_unescape(key));
    }
  });
  genie.behavior = {};
  function genie_identity(d) {
    return d;
  }
  genie.rebind = function(target, source) {
    var i = 1, n = arguments.length, method;
    while (++i < n) target[method = arguments[i]] = genie_rebind(target, source, source[method]);
    return target;
  };
  function genie_rebind(target, source, method) {
    return function() {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    };
  }
  function genie_vendorSymbol(object, name) {
    if (name in object) return name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    for (var i = 0, n = genie_vendorPrefixes.length; i < n; ++i) {
      var prefixName = genie_vendorPrefixes[i] + name;
      if (prefixName in object) return prefixName;
    }
  }
  var genie_vendorPrefixes = [ "webkit", "ms", "moz", "Moz", "o", "O" ];
  function genie_noop() {}
  genie.dispatch = function() {
    var dispatch = new genie_dispatch(), i = -1, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = genie_dispatch_event(dispatch);
    return dispatch;
  };
  function genie_dispatch() {}
  genie_dispatch.prototype.on = function(type, listener) {
    var i = type.indexOf("."), name = "";
    if (i >= 0) {
      name = type.slice(i + 1);
      type = type.slice(0, i);
    }
    if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
    if (arguments.length === 2) {
      if (listener == null) for (type in this) {
        if (this.hasOwnProperty(type)) this[type].on(name, null);
      }
      return this;
    }
  };
  function genie_dispatch_event(dispatch) {
    var listeners = [], listenerByName = new genie_Map();
    function event() {
      var z = listeners, i = -1, n = z.length, l;
      while (++i < n) if (l = z[i].on) l.apply(this, arguments);
      return dispatch;
    }
    event.on = function(name, listener) {
      var l = listenerByName.get(name), i;
      if (arguments.length < 2) return l && l.on;
      if (l) {
        l.on = null;
        listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
        listenerByName.remove(name);
      }
      if (listener) listeners.push(listenerByName.set(name, {
        on: listener
      }));
      return dispatch;
    };
    return event;
  }
  genie.event = null;
  function genie_eventPreventDefault() {
    genie.event.preventDefault();
  }
  function genie_eventSource() {
    var e = genie.event, s;
    while (s = e.sourceEvent) e = s;
    return e;
  }
  function genie_eventDispatch(target) {
    var dispatch = new genie_dispatch(), i = 0, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = genie_dispatch_event(dispatch);
    dispatch.of = function(thiz, argumentz) {
      return function(e1) {
        try {
          var e0 = e1.sourceEvent = genie.event;
          e1.target = target;
          genie.event = e1;
          dispatch[e1.type].apply(thiz, argumentz);
        } finally {
          genie.event = e0;
        }
      };
    };
    return dispatch;
  }
  genie.requote = function(s) {
    return s.replace(genie_requote_re, "\\$&");
  };
  var genie_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
  var genie_subclass = {}.__proto__ ? function(object, prototype) {
    object.__proto__ = prototype;
  } : function(object, prototype) {
    for (var property in prototype) object[property] = prototype[property];
  };
  function genie_selection(groups) {
    genie_subclass(groups, genie_selectionPrototype);
    return groups;
  }
  var genie_select = function(s, n) {
    return n.querySelector(s);
  }, genie_selectAll = function(s, n) {
    return n.querySelectorAll(s);
  }, genie_selectMatches = function(n, s) {
    var genie_selectMatcher = n.matches || n[genie_vendorSymbol(n, "matchesSelector")];
    genie_selectMatches = function(n, s) {
      return genie_selectMatcher.call(n, s);
    };
    return genie_selectMatches(n, s);
  };
  if (typeof Sizzle === "function") {
    genie_select = function(s, n) {
      return Sizzle(s, n)[0] || null;
    };
    genie_selectAll = Sizzle;
    genie_selectMatches = Sizzle.matchesSelector;
  }
  genie.selection = function() {
    return genie.select(genie_document.documentElement);
  };
  var genie_selectionPrototype = genie.selection.prototype = [];
  genie_selectionPrototype.select = function(selector) {
    var subgroups = [], subgroup, subnode, group, node;
    selector = genie_selection_selector(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroup.push(subnode = selector.call(node, node.__data__, i, j));
          if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }
    return genie_selection(subgroups);
  };
  function genie_selection_selector(selector) {
    return typeof selector === "function" ? selector : function() {
      return genie_select(selector, this);
    };
  }
  genie_selectionPrototype.selectAll = function(selector) {
    var subgroups = [], subgroup, node;
    selector = genie_selection_selectorAll(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroups.push(subgroup = genie_array(selector.call(node, node.__data__, i, j)));
          subgroup.parentNode = node;
        }
      }
    }
    return genie_selection(subgroups);
  };
  function genie_selection_selectorAll(selector) {
    return typeof selector === "function" ? selector : function() {
      return genie_selectAll(selector, this);
    };
  }
  var genie_nsXhtml = "http://www.w3.org/1999/xhtml";
  var genie_nsPrefix = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: genie_nsXhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };
  genie.ns = {
    prefix: genie_nsPrefix,
    qualify: function(name) {
      var i = name.indexOf(":"), prefix = name;
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return genie_nsPrefix.hasOwnProperty(prefix) ? {
        space: genie_nsPrefix[prefix],
        local: name
      } : name;
    }
  };
  genie_selectionPrototype.attr = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") {
        var node = this.node();
        name = genie.ns.qualify(name);
        return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);
      }
      for (value in name) this.each(genie_selection_attr(value, name[value]));
      return this;
    }
    return this.each(genie_selection_attr(name, value));
  };
  function genie_selection_attr(name, value) {
    name = genie.ns.qualify(name);
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }
    function attrConstant() {
      this.setAttribute(name, value);
    }
    function attrConstantNS() {
      this.setAttributeNS(name.space, name.local, value);
    }
    function attrFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);
    }
    function attrFunctionNS() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);
    }
    return value == null ? name.local ? attrNullNS : attrNull : typeof value === "function" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;
  }
  function genie_collapse(s) {
    return s.trim().replace(/\s+/g, " ");
  }
  genie_selectionPrototype.classed = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") {
        var node = this.node(), n = (name = genie_selection_classes(name)).length, i = -1;
        if (value = node.classList) {
          while (++i < n) if (!value.contains(name[i])) return false;
        } else {
          value = node.getAttribute("class");
          while (++i < n) if (!genie_selection_classedRe(name[i]).test(value)) return false;
        }
        return true;
      }
      for (value in name) this.each(genie_selection_classed(value, name[value]));
      return this;
    }
    return this.each(genie_selection_classed(name, value));
  };
  function genie_selection_classedRe(name) {
    return new RegExp("(?:^|\\s+)" + genie.requote(name) + "(?:\\s+|$)", "g");
  }
  function genie_selection_classes(name) {
    return (name + "").trim().split(/^|\s+/);
  }
  function genie_selection_classed(name, value) {
    name = genie_selection_classes(name).map(genie_selection_classedName);
    var n = name.length;
    function classedConstant() {
      var i = -1;
      while (++i < n) name[i](this, value);
    }
    function classedFunction() {
      var i = -1, x = value.apply(this, arguments);
      while (++i < n) name[i](this, x);
    }
    return typeof value === "function" ? classedFunction : classedConstant;
  }
  function genie_selection_classedName(name) {
    var re = genie_selection_classedRe(name);
    return function(node, value) {
      if (c = node.classList) return value ? c.add(name) : c.remove(name);
      var c = node.getAttribute("class") || "";
      if (value) {
        re.lastIndex = 0;
        if (!re.test(c)) node.setAttribute("class", genie_collapse(c + " " + name));
      } else {
        node.setAttribute("class", genie_collapse(c.replace(re, " ")));
      }
    };
  }
  genie_selectionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.each(genie_selection_style(priority, name[priority], value));
        return this;
      }
      if (n < 2) {
        var node = this.node();
        return genie_window(node).getComputedStyle(node, null).getPropertyValue(name);
      }
      priority = "";
    }
    return this.each(genie_selection_style(name, value, priority));
  };
  function genie_selection_style(name, value, priority) {
    function styleNull() {
      this.style.removeProperty(name);
    }
    function styleConstant() {
      this.style.setProperty(name, value, priority);
    }
    function styleFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);
    }
    return value == null ? styleNull : typeof value === "function" ? styleFunction : styleConstant;
  }
  genie_selectionPrototype.property = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") return this.node()[name];
      for (value in name) this.each(genie_selection_property(value, name[value]));
      return this;
    }
    return this.each(genie_selection_property(name, value));
  };
  function genie_selection_property(name, value) {
    function propertyNull() {
      delete this[name];
    }
    function propertyConstant() {
      this[name] = value;
    }
    function propertyFunction() {
      var x = value.apply(this, arguments);
      if (x == null) delete this[name]; else this[name] = x;
    }
    return value == null ? propertyNull : typeof value === "function" ? propertyFunction : propertyConstant;
  }
  genie_selectionPrototype.text = function(value) {
    return arguments.length ? this.each(typeof value === "function" ? function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    } : value == null ? function() {
      this.textContent = "";
    } : function() {
      this.textContent = value;
    }) : this.node().textContent;
  };
  genie_selectionPrototype.html = function(value) {
    return arguments.length ? this.each(typeof value === "function" ? function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    } : value == null ? function() {
      this.innerHTML = "";
    } : function() {
      this.innerHTML = value;
    }) : this.node().innerHTML;
  };
  genie_selectionPrototype.append = function(name) {
    name = genie_selection_creator(name);
    return this.select(function() {
      return this.appendChild(name.apply(this, arguments));
    });
  };
  function genie_selection_creator(name) {
    function create() {
      var document = this.ownerDocument, namespace = this.namespaceURI;
      return namespace === genie_nsXhtml && document.documentElement.namespaceURI === genie_nsXhtml ? document.createElement(name) : document.createElementNS(namespace, name);
    }
    function createNS() {
      return this.ownerDocument.createElementNS(name.space, name.local);
    }
    return typeof name === "function" ? name : (name = genie.ns.qualify(name)).local ? createNS : create;
  }
  genie_selectionPrototype.insert = function(name, before) {
    name = genie_selection_creator(name);
    before = genie_selection_selector(before);
    return this.select(function() {
      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
    });
  };
  genie_selectionPrototype.remove = function() {
    return this.each(genie_selectionRemove);
  };
  function genie_selectionRemove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }
  genie_selectionPrototype.data = function(value, key) {
    var i = -1, n = this.length, group, node;
    if (!arguments.length) {
      value = new Array(n = (group = this[0]).length);
      while (++i < n) {
        if (node = group[i]) {
          value[i] = node.__data__;
        }
      }
      return value;
    }
    function bind(group, groupData) {
      var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData;
      if (key) {
        var nodeByKeyValue = new genie_Map(), keyValues = new Array(n), keyValue;
        for (i = -1; ++i < n; ) {
          if (node = group[i]) {
            if (nodeByKeyValue.has(keyValue = key.call(node, node.__data__, i))) {
              exitNodes[i] = node;
            } else {
              nodeByKeyValue.set(keyValue, node);
            }
            keyValues[i] = keyValue;
          }
        }
        for (i = -1; ++i < m; ) {
          if (!(node = nodeByKeyValue.get(keyValue = key.call(groupData, nodeData = groupData[i], i)))) {
            enterNodes[i] = genie_selection_dataNode(nodeData);
          } else if (node !== true) {
            updateNodes[i] = node;
            node.__data__ = nodeData;
          }
          nodeByKeyValue.set(keyValue, true);
        }
        for (i = -1; ++i < n; ) {
          if (i in keyValues && nodeByKeyValue.get(keyValues[i]) !== true) {
            exitNodes[i] = group[i];
          }
        }
      } else {
        for (i = -1; ++i < n0; ) {
          node = group[i];
          nodeData = groupData[i];
          if (node) {
            node.__data__ = nodeData;
            updateNodes[i] = node;
          } else {
            enterNodes[i] = genie_selection_dataNode(nodeData);
          }
        }
        for (;i < m; ++i) {
          enterNodes[i] = genie_selection_dataNode(groupData[i]);
        }
        for (;i < n; ++i) {
          exitNodes[i] = group[i];
        }
      }
      enterNodes.update = updateNodes;
      enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;
      enter.push(enterNodes);
      update.push(updateNodes);
      exit.push(exitNodes);
    }
    var enter = genie_selection_enter([]), update = genie_selection([]), exit = genie_selection([]);
    if (typeof value === "function") {
      while (++i < n) {
        bind(group = this[i], value.call(group, group.parentNode.__data__, i));
      }
    } else {
      while (++i < n) {
        bind(group = this[i], value);
      }
    }
    update.enter = function() {
      return enter;
    };
    update.exit = function() {
      return exit;
    };
    return update;
  };
  function genie_selection_dataNode(data) {
    return {
      __data__: data
    };
  }
  genie_selectionPrototype.datum = function(value) {
    return arguments.length ? this.property("__data__", value) : this.property("__data__");
  };
  genie_selectionPrototype.filter = function(filter) {
    var subgroups = [], subgroup, group, node;
    if (typeof filter !== "function") filter = genie_selection_filter(filter);
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
          subgroup.push(node);
        }
      }
    }
    return genie_selection(subgroups);
  };
  function genie_selection_filter(selector) {
    return function() {
      return genie_selectMatches(this, selector);
    };
  }
  genie_selectionPrototype.order = function() {
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
        if (node = group[i]) {
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
    return this;
  };
  genie_selectionPrototype.sort = function(comparator) {
    comparator = genie_selection_sortComparator.apply(this, arguments);
    for (var j = -1, m = this.length; ++j < m; ) this[j].sort(comparator);
    return this.order();
  };
  function genie_selection_sortComparator(comparator) {
    if (!arguments.length) comparator = genie_ascending;
    return function(a, b) {
      return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
    };
  }
  genie_selectionPrototype.each = function(callback) {
    return genie_selection_each(this, function(node, i, j) {
      callback.call(node, node.__data__, i, j);
    });
  };
  function genie_selection_each(groups, callback) {
    for (var j = 0, m = groups.length; j < m; j++) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
        if (node = group[i]) callback(node, i, j);
      }
    }
    return groups;
  }
  genie_selectionPrototype.call = function(callback) {
    var args = genie_array(arguments);
    callback.apply(args[0] = this, args);
    return this;
  };
  genie_selectionPrototype.empty = function() {
    return !this.node();
  };
  genie_selectionPrototype.node = function() {
    for (var j = 0, m = this.length; j < m; j++) {
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        var node = group[i];
        if (node) return node;
      }
    }
    return null;
  };
  genie_selectionPrototype.size = function() {
    var n = 0;
    genie_selection_each(this, function() {
      ++n;
    });
    return n;
  };
  function genie_selection_enter(selection) {
    genie_subclass(selection, genie_selection_enterPrototype);
    return selection;
  }
  var genie_selection_enterPrototype = [];
  genie.selection.enter = genie_selection_enter;
  genie.selection.enter.prototype = genie_selection_enterPrototype;
  genie_selection_enterPrototype.append = genie_selectionPrototype.append;
  genie_selection_enterPrototype.empty = genie_selectionPrototype.empty;
  genie_selection_enterPrototype.node = genie_selectionPrototype.node;
  genie_selection_enterPrototype.call = genie_selectionPrototype.call;
  genie_selection_enterPrototype.size = genie_selectionPrototype.size;
  genie_selection_enterPrototype.select = function(selector) {
    var subgroups = [], subgroup, subnode, upgroup, group, node;
    for (var j = -1, m = this.length; ++j < m; ) {
      upgroup = (group = this[j]).update;
      subgroups.push(subgroup = []);
      subgroup.parentNode = group.parentNode;
      for (var i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
          subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }
    return genie_selection(subgroups);
  };
  genie_selection_enterPrototype.insert = function(name, before) {
    if (arguments.length < 2) before = genie_selection_enterInsertBefore(this);
    return genie_selectionPrototype.insert.call(this, name, before);
  };
  function genie_selection_enterInsertBefore(enter) {
    var i0, j0;
    return function(d, i, j) {
      var group = enter[j].update, n = group.length, node;
      if (j != j0) j0 = j, i0 = 0;
      if (i >= i0) i0 = i + 1;
      while (!(node = group[i0]) && ++i0 < n) ;
      return node;
    };
  }
  genie.select = function(node) {
    var group;
    if (typeof node === "string") {
      group = [ genie_select(node, genie_document) ];
      group.parentNode = genie_document.documentElement;
    } else {
      group = [ node ];
      group.parentNode = genie_documentElement(node);
    }
    return genie_selection([ group ]);
  };
  genie.selectAll = function(nodes) {
    var group;
    if (typeof nodes === "string") {
      group = genie_array(genie_selectAll(nodes, genie_document));
      group.parentNode = genie_document.documentElement;
    } else {
      group = genie_array(nodes);
      group.parentNode = null;
    }
    return genie_selection([ group ]);
  };
  genie_selectionPrototype.on = function(type, listener, capture) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof type !== "string") {
        if (n < 2) listener = false;
        for (capture in type) this.each(genie_selection_on(capture, type[capture], listener));
        return this;
      }
      if (n < 2) return (n = this.node()["__on" + type]) && n._;
      capture = false;
    }
    return this.each(genie_selection_on(type, listener, capture));
  };
  function genie_selection_on(type, listener, capture) {
    var name = "__on" + type, i = type.indexOf("."), wrap = genie_selection_onListener;
    if (i > 0) type = type.slice(0, i);
    var filter = genie_selection_onFilters.get(type);
    if (filter) type = filter, wrap = genie_selection_onFilter;
    function onRemove() {
      var l = this[name];
      if (l) {
        this.removeEventListener(type, l, l.$);
        delete this[name];
      }
    }
    function onAdd() {
      var l = wrap(listener, genie_array(arguments));
      onRemove.call(this);
      this.addEventListener(type, this[name] = l, l.$ = capture);
      l._ = listener;
    }
    function removeAll() {
      var re = new RegExp("^__on([^.]+)" + genie.requote(type) + "$"), match;
      for (var name in this) {
        if (match = name.match(re)) {
          var l = this[name];
          this.removeEventListener(match[1], l, l.$);
          delete this[name];
        }
      }
    }
    return i ? listener ? onAdd : onRemove : listener ? genie_noop : removeAll;
  }
  var genie_selection_onFilters = genie.map({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  });
  if (genie_document) {
    genie_selection_onFilters.forEach(function(k) {
      if ("on" + k in genie_document) genie_selection_onFilters.remove(k);
    });
  }
  function genie_selection_onListener(listener, argumentz) {
    return function(e) {
      var o = genie.event;
      genie.event = e;
      argumentz[0] = this.__data__;
      try {
        listener.apply(this, argumentz);
      } finally {
        genie.event = o;
      }
    };
  }
  function genie_selection_onFilter(listener, argumentz) {
    var l = genie_selection_onListener(listener, argumentz);
    return function(e) {
      var target = this, related = e.relatedTarget;
      if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {
        l.call(target, e);
      }
    };
  }
  var genie_event_dragSelect, genie_event_dragId = 0;
  function genie_event_dragSuppress(node) {
    var name = ".dragsuppress-" + ++genie_event_dragId, click = "click" + name, w = genie.select(genie_window(node)).on("touchmove" + name, genie_eventPreventDefault).on("dragstart" + name, genie_eventPreventDefault).on("selectstart" + name, genie_eventPreventDefault);
    if (genie_event_dragSelect == null) {
      genie_event_dragSelect = "onselectstart" in node ? false : genie_vendorSymbol(node.style, "userSelect");
    }
    if (genie_event_dragSelect) {
      var style = genie_documentElement(node).style, select = style[genie_event_dragSelect];
      style[genie_event_dragSelect] = "none";
    }
    return function(suppressClick) {
      w.on(name, null);
      if (genie_event_dragSelect) style[genie_event_dragSelect] = select;
      if (suppressClick) {
        var off = function() {
          w.on(click, null);
        };
        w.on(click, function() {
          genie_eventPreventDefault();
          off();
        }, true);
        setTimeout(off, 0);
      }
    };
  }
  genie.mouse = function(container) {
    return genie_mousePoint(container, genie_eventSource());
  };
  var genie_mouse_bug44083 = this.navigator && /WebKit/.test(this.navigator.userAgent) ? -1 : 0;
  function genie_mousePoint(container, e) {
    if (e.changedTouches) e = e.changedTouches[0];
    var svg = container.ownerSVGElement || container;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      if (genie_mouse_bug44083 < 0) {
        var window = genie_window(container);
        if (window.scrollX || window.scrollY) {
          svg = genie.select("body").append("svg").style({
            position: "absolute",
            top: 0,
            left: 0,
            margin: 0,
            padding: 0,
            border: "none"
          }, "important");
          var ctm = svg[0][0].getScreenCTM();
          genie_mouse_bug44083 = !(ctm.f || ctm.e);
          svg.remove();
        }
      }
      if (genie_mouse_bug44083) point.x = e.pageX, point.y = e.pageY; else point.x = e.clientX, 
      point.y = e.clientY;
      point = point.matrixTransform(container.getScreenCTM().inverse());
      return [ point.x, point.y ];
    }
    var rect = container.getBoundingClientRect();
    return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];
  }
  genie.touch = function(container, touches, identifier) {
    if (arguments.length < 3) identifier = touches, touches = genie_eventSource().changedTouches;
    if (touches) for (var i = 0, n = touches.length, touch; i < n; ++i) {
      if ((touch = touches[i]).identifier === identifier) {
        return genie_mousePoint(container, touch);
      }
    }
  };
  genie.behavior.drag = function() {
    var event = genie_eventDispatch(drag, "drag", "dragstart", "dragend"), origin = null, mousedown = dragstart(genie_noop, genie.mouse, genie_window, "mousemove", "mouseup"), touchstart = dragstart(genie_behavior_dragTouchId, genie.touch, genie_identity, "touchmove", "touchend");
    function drag() {
      this.on("mousedown.drag", mousedown).on("touchstart.drag", touchstart);
    }
    function dragstart(id, position, subject, move, end) {
      return function() {
        var that = this, target = genie.event.target.correspondingElement || genie.event.target, parent = that.parentNode, dispatch = event.of(that, arguments), dragged = 0, dragId = id(), dragName = ".drag" + (dragId == null ? "" : "-" + dragId), dragOffset, dragSubject = genie.select(subject(target)).on(move + dragName, moved).on(end + dragName, ended), dragRestore = genie_event_dragSuppress(target), position0 = position(parent, dragId);
        if (origin) {
          dragOffset = origin.apply(that, arguments);
          dragOffset = [ dragOffset.x - position0[0], dragOffset.y - position0[1] ];
        } else {
          dragOffset = [ 0, 0 ];
        }
        dispatch({
          type: "dragstart"
        });
        function moved() {
          var position1 = position(parent, dragId), dx, dy;
          if (!position1) return;
          dx = position1[0] - position0[0];
          dy = position1[1] - position0[1];
          dragged |= dx | dy;
          position0 = position1;
          dispatch({
            type: "drag",
            x: position1[0] + dragOffset[0],
            y: position1[1] + dragOffset[1],
            dx: dx,
            dy: dy
          });
        }
        function ended() {
          if (!position(parent, dragId)) return;
          dragSubject.on(move + dragName, null).on(end + dragName, null);
          dragRestore(dragged);
          dispatch({
            type: "dragend"
          });
        }
      };
    }
    drag.origin = function(x) {
      if (!arguments.length) return origin;
      origin = x;
      return drag;
    };
    return genie.rebind(drag, event, "on");
  };
  function genie_behavior_dragTouchId() {
    return genie.event.changedTouches[0].identifier;
  }
  genie.touches = function(container, touches) {
    if (arguments.length < 2) touches = genie_eventSource().touches;
    return touches ? genie_array(touches).map(function(touch) {
      var point = genie_mousePoint(container, touch);
      point.identifier = touch.identifier;
      return point;
    }) : [];
  };
  var ε = 1e-6, ε2 = ε * ε, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2, genie_radians = π / 180, genie_degrees = 180 / π;
  function genie_sgn(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  }
  function genie_cross2d(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  }
  function genie_acos(x) {
    return x > 1 ? 0 : x < -1 ? π : Math.acos(x);
  }
  function genie_asin(x) {
    return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
  }
  function genie_sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
  }
  function genie_cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
  }
  function genie_tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
  }
  function genie_haversin(x) {
    return (x = Math.sin(x / 2)) * x;
  }
  var ρ = Math.SQRT2, ρ2 = 2, ρ4 = 4;
  genie.interpolateZoom = function(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
    if (d2 < ε2) {
      S = Math.log(w1 / w0) / ρ;
      i = function(t) {
        return [ ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(ρ * t * S) ];
      };
    } else {
      var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1), b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / ρ;
      i = function(t) {
        var s = t * S, coshr0 = genie_cosh(r0), u = w0 / (ρ2 * d1) * (coshr0 * genie_tanh(ρ * s + r0) - genie_sinh(r0));
        return [ ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / genie_cosh(ρ * s + r0) ];
      };
    }
    i.duration = S * 1e3;
    return i;
  };
  genie.behavior.zoom = function() {
    var view = {
      x: 0,
      y: 0,
      k: 1
    }, translate0, center0, center, size = [ 960, 500 ], scaleExtent = genie_behavior_zoomInfinity, duration = 250, zooming = 0, mousedown = "mousedown.zoom", mousemove = "mousemove.zoom", mouseup = "mouseup.zoom", mousewheelTimer, touchstart = "touchstart.zoom", touchtime, event = genie_eventDispatch(zoom, "zoomstart", "zoom", "zoomend"), x0, x1, y0, y1;
    if (!genie_behavior_zoomWheel) {
      genie_behavior_zoomWheel = "onwheel" in genie_document ? (genie_behavior_zoomDelta = function() {
        return -genie.event.deltaY * (genie.event.deltaMode ? 120 : 1);
      }, "wheel") : "onmousewheel" in genie_document ? (genie_behavior_zoomDelta = function() {
        return genie.event.wheelDelta;
      }, "mousewheel") : (genie_behavior_zoomDelta = function() {
        return -genie.event.detail;
      }, "MozMousePixelScroll");
    }
    function zoom(g) {
      g.on(mousedown, mousedowned).on(genie_behavior_zoomWheel + ".zoom", mousewheeled).on("dblclick.zoom", dblclicked).on(touchstart, touchstarted);
    }
    zoom.event = function(g) {
      g.each(function() {
        var dispatch = event.of(this, arguments), view1 = view;
        if (genie_transitionInheritId) {
          genie.select(this).transition().each("start.zoom", function() {
            view = this.__chart__ || {
              x: 0,
              y: 0,
              k: 1
            };
            zoomstarted(dispatch);
          }).tween("zoom:zoom", function() {
            var dx = size[0], dy = size[1], cx = center0 ? center0[0] : dx / 2, cy = center0 ? center0[1] : dy / 2, i = genie.interpolateZoom([ (cx - view.x) / view.k, (cy - view.y) / view.k, dx / view.k ], [ (cx - view1.x) / view1.k, (cy - view1.y) / view1.k, dx / view1.k ]);
            return function(t) {
              var l = i(t), k = dx / l[2];
              this.__chart__ = view = {
                x: cx - l[0] * k,
                y: cy - l[1] * k,
                k: k
              };
              zoomed(dispatch);
            };
          }).each("interrupt.zoom", function() {
            zoomended(dispatch);
          }).each("end.zoom", function() {
            zoomended(dispatch);
          });
        } else {
          this.__chart__ = view;
          zoomstarted(dispatch);
          zoomed(dispatch);
          zoomended(dispatch);
        }
      });
    };
    zoom.translate = function(_) {
      if (!arguments.length) return [ view.x, view.y ];
      view = {
        x: +_[0],
        y: +_[1],
        k: view.k
      };
      rescale();
      return zoom;
    };
    zoom.scale = function(_) {
      if (!arguments.length) return view.k;
      view = {
        x: view.x,
        y: view.y,
        k: null
      };
      scaleTo(+_);
      rescale();
      return zoom;
    };
    zoom.scaleExtent = function(_) {
      if (!arguments.length) return scaleExtent;
      scaleExtent = _ == null ? genie_behavior_zoomInfinity : [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.center = function(_) {
      if (!arguments.length) return center;
      center = _ && [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.size = function(_) {
      if (!arguments.length) return size;
      size = _ && [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.duration = function(_) {
      if (!arguments.length) return duration;
      duration = +_;
      return zoom;
    };
    zoom.x = function(z) {
      if (!arguments.length) return x1;
      x1 = z;
      x0 = z.copy();
      view = {
        x: 0,
        y: 0,
        k: 1
      };
      return zoom;
    };
    zoom.y = function(z) {
      if (!arguments.length) return y1;
      y1 = z;
      y0 = z.copy();
      view = {
        x: 0,
        y: 0,
        k: 1
      };
      return zoom;
    };
    function location(p) {
      return [ (p[0] - view.x) / view.k, (p[1] - view.y) / view.k ];
    }
    function point(l) {
      return [ l[0] * view.k + view.x, l[1] * view.k + view.y ];
    }
    function scaleTo(s) {
      view.k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));
    }
    function translateTo(p, l) {
      l = point(l);
      view.x += p[0] - l[0];
      view.y += p[1] - l[1];
    }
    function zoomTo(that, p, l, k) {
      that.__chart__ = {
        x: view.x,
        y: view.y,
        k: view.k
      };
      scaleTo(Math.pow(2, k));
      translateTo(center0 = p, l);
      that = genie.select(that);
      if (duration > 0) that = that.transition().duration(duration);
      that.call(zoom.event);
    }
    function rescale() {
      if (x1) x1.domain(x0.range().map(function(x) {
        return (x - view.x) / view.k;
      }).map(x0.invert));
      if (y1) y1.domain(y0.range().map(function(y) {
        return (y - view.y) / view.k;
      }).map(y0.invert));
    }
    function zoomstarted(dispatch) {
      if (!zooming++) dispatch({
        type: "zoomstart"
      });
    }
    function zoomed(dispatch) {
      rescale();
      dispatch({
        type: "zoom",
        scale: view.k,
        translate: [ view.x, view.y ]
      });
    }
    function zoomended(dispatch) {
      if (!--zooming) dispatch({
        type: "zoomend"
      }), center0 = null;
    }
    function mousedowned() {
      var that = this, dispatch = event.of(that, arguments), dragged = 0, subject = genie.select(genie_window(that)).on(mousemove, moved).on(mouseup, ended), location0 = location(genie.mouse(that)), dragRestore = genie_event_dragSuppress(that);
      genie_selection_interrupt.call(that);
      zoomstarted(dispatch);
      function moved() {
        dragged = 1;
        translateTo(genie.mouse(that), location0);
        zoomed(dispatch);
      }
      function ended() {
        subject.on(mousemove, null).on(mouseup, null);
        dragRestore(dragged);
        zoomended(dispatch);
      }
    }
    function touchstarted() {
      var that = this, dispatch = event.of(that, arguments), locations0 = {}, distance0 = 0, scale0, zoomName = ".zoom-" + genie.event.changedTouches[0].identifier, touchmove = "touchmove" + zoomName, touchend = "touchend" + zoomName, targets = [], subject = genie.select(that), dragRestore = genie_event_dragSuppress(that);
      started();
      zoomstarted(dispatch);
      subject.on(mousedown, null).on(touchstart, started);
      function relocate() {
        var touches = genie.touches(that);
        scale0 = view.k;
        touches.forEach(function(t) {
          if (t.identifier in locations0) locations0[t.identifier] = location(t);
        });
        return touches;
      }
      function started() {
        var target = genie.event.target;
        genie.select(target).on(touchmove, moved).on(touchend, ended);
        targets.push(target);
        var changed = genie.event.changedTouches;
        for (var i = 0, n = changed.length; i < n; ++i) {
          locations0[changed[i].identifier] = null;
        }
        var touches = relocate(), now = Date.now();
        if (touches.length === 1) {
          if (now - touchtime < 500) {
            var p = touches[0];
            zoomTo(that, p, locations0[p.identifier], Math.floor(Math.log(view.k) / Math.LN2) + 1);
            genie_eventPreventDefault();
          }
          touchtime = now;
        } else if (touches.length > 1) {
          var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1];
          distance0 = dx * dx + dy * dy;
        }
      }
      function moved() {
        var touches = genie.touches(that), p0, l0, p1, l1;
        genie_selection_interrupt.call(that);
        for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {
          p1 = touches[i];
          if (l1 = locations0[p1.identifier]) {
            if (l0) break;
            p0 = p1, l0 = l1;
          }
        }
        if (l1) {
          var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1, scale1 = distance0 && Math.sqrt(distance1 / distance0);
          p0 = [ (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 ];
          l0 = [ (l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2 ];
          scaleTo(scale1 * scale0);
        }
        touchtime = null;
        translateTo(p0, l0);
        zoomed(dispatch);
      }
      function ended() {
        if (genie.event.touches.length) {
          var changed = genie.event.changedTouches;
          for (var i = 0, n = changed.length; i < n; ++i) {
            delete locations0[changed[i].identifier];
          }
          for (var identifier in locations0) {
            return void relocate();
          }
        }
        genie.selectAll(targets).on(zoomName, null);
        subject.on(mousedown, mousedowned).on(touchstart, touchstarted);
        dragRestore();
        zoomended(dispatch);
      }
    }
    function mousewheeled() {
      var dispatch = event.of(this, arguments);
      if (mousewheelTimer) clearTimeout(mousewheelTimer); else genie_selection_interrupt.call(this), 
      translate0 = location(center0 = center || genie.mouse(this)), zoomstarted(dispatch);
      mousewheelTimer = setTimeout(function() {
        mousewheelTimer = null;
        zoomended(dispatch);
      }, 50);
      genie_eventPreventDefault();
      scaleTo(Math.pow(2, genie_behavior_zoomDelta() * .002) * view.k);
      translateTo(center0, translate0);
      zoomed(dispatch);
    }
    function dblclicked() {
      var p = genie.mouse(this), k = Math.log(view.k) / Math.LN2;
      zoomTo(this, p, location(p), genie.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1);
    }
    return genie.rebind(zoom, event, "on");
  };
  var genie_behavior_zoomInfinity = [ 0, Infinity ], genie_behavior_zoomDelta, genie_behavior_zoomWheel;
  genie.color = genie_color;
  function genie_color() {}
  genie_color.prototype.toString = function() {
    return this.rgb() + "";
  };
  genie.hsl = genie_hsl;
  function genie_hsl(h, s, l) {
    return this instanceof genie_hsl ? void (this.h = +h, this.s = +s, this.l = +l) : arguments.length < 2 ? h instanceof genie_hsl ? new genie_hsl(h.h, h.s, h.l) : genie_rgb_parse("" + h, genie_rgb_hsl, genie_hsl) : new genie_hsl(h, s, l);
  }
  var genie_hslPrototype = genie_hsl.prototype = new genie_color();
  genie_hslPrototype.brighter = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new genie_hsl(this.h, this.s, this.l / k);
  };
  genie_hslPrototype.darker = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new genie_hsl(this.h, this.s, k * this.l);
  };
  genie_hslPrototype.rgb = function() {
    return genie_hsl_rgb(this.h, this.s, this.l);
  };
  function genie_hsl_rgb(h, s, l) {
    var m1, m2;
    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
    l = l < 0 ? 0 : l > 1 ? 1 : l;
    m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
    m1 = 2 * l - m2;
    function v(h) {
      if (h > 360) h -= 360; else if (h < 0) h += 360;
      if (h < 60) return m1 + (m2 - m1) * h / 60;
      if (h < 180) return m2;
      if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
      return m1;
    }
    function vv(h) {
      return Math.round(v(h) * 255);
    }
    return new genie_rgb(vv(h + 120), vv(h), vv(h - 120));
  }
  genie.hcl = genie_hcl;
  function genie_hcl(h, c, l) {
    return this instanceof genie_hcl ? void (this.h = +h, this.c = +c, this.l = +l) : arguments.length < 2 ? h instanceof genie_hcl ? new genie_hcl(h.h, h.c, h.l) : h instanceof genie_lab ? genie_lab_hcl(h.l, h.a, h.b) : genie_lab_hcl((h = genie_rgb_lab((h = genie.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : new genie_hcl(h, c, l);
  }
  var genie_hclPrototype = genie_hcl.prototype = new genie_color();
  genie_hclPrototype.brighter = function(k) {
    return new genie_hcl(this.h, this.c, Math.min(100, this.l + genie_lab_K * (arguments.length ? k : 1)));
  };
  genie_hclPrototype.darker = function(k) {
    return new genie_hcl(this.h, this.c, Math.max(0, this.l - genie_lab_K * (arguments.length ? k : 1)));
  };
  genie_hclPrototype.rgb = function() {
    return genie_hcl_lab(this.h, this.c, this.l).rgb();
  };
  function genie_hcl_lab(h, c, l) {
    if (isNaN(h)) h = 0;
    if (isNaN(c)) c = 0;
    return new genie_lab(l, Math.cos(h *= genie_radians) * c, Math.sin(h) * c);
  }
  genie.lab = genie_lab;
  function genie_lab(l, a, b) {
    return this instanceof genie_lab ? void (this.l = +l, this.a = +a, this.b = +b) : arguments.length < 2 ? l instanceof genie_lab ? new genie_lab(l.l, l.a, l.b) : l instanceof genie_hcl ? genie_hcl_lab(l.h, l.c, l.l) : genie_rgb_lab((l = genie_rgb(l)).r, l.g, l.b) : new genie_lab(l, a, b);
  }
  var genie_lab_K = 18;
  var genie_lab_X = .95047, genie_lab_Y = 1, genie_lab_Z = 1.08883;
  var genie_labPrototype = genie_lab.prototype = new genie_color();
  genie_labPrototype.brighter = function(k) {
    return new genie_lab(Math.min(100, this.l + genie_lab_K * (arguments.length ? k : 1)), this.a, this.b);
  };
  genie_labPrototype.darker = function(k) {
    return new genie_lab(Math.max(0, this.l - genie_lab_K * (arguments.length ? k : 1)), this.a, this.b);
  };
  genie_labPrototype.rgb = function() {
    return genie_lab_rgb(this.l, this.a, this.b);
  };
  function genie_lab_rgb(l, a, b) {
    var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;
    x = genie_lab_xyz(x) * genie_lab_X;
    y = genie_lab_xyz(y) * genie_lab_Y;
    z = genie_lab_xyz(z) * genie_lab_Z;
    return new genie_rgb(genie_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), genie_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), genie_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));
  }
  function genie_lab_hcl(l, a, b) {
    return l > 0 ? new genie_hcl(Math.atan2(b, a) * genie_degrees, Math.sqrt(a * a + b * b), l) : new genie_hcl(NaN, NaN, l);
  }
  function genie_lab_xyz(x) {
    return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;
  }
  function genie_xyz_lab(x) {
    return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;
  }
  function genie_xyz_rgb(r) {
    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));
  }
  genie.rgb = genie_rgb;
  function genie_rgb(r, g, b) {
    return this instanceof genie_rgb ? void (this.r = ~~r, this.g = ~~g, this.b = ~~b) : arguments.length < 2 ? r instanceof genie_rgb ? new genie_rgb(r.r, r.g, r.b) : genie_rgb_parse("" + r, genie_rgb, genie_hsl_rgb) : new genie_rgb(r, g, b);
  }
  function genie_rgbNumber(value) {
    return new genie_rgb(value >> 16, value >> 8 & 255, value & 255);
  }
  function genie_rgbString(value) {
    return genie_rgbNumber(value) + "";
  }
  var genie_rgbPrototype = genie_rgb.prototype = new genie_color();
  genie_rgbPrototype.brighter = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    var r = this.r, g = this.g, b = this.b, i = 30;
    if (!r && !g && !b) return new genie_rgb(i, i, i);
    if (r && r < i) r = i;
    if (g && g < i) g = i;
    if (b && b < i) b = i;
    return new genie_rgb(Math.min(255, r / k), Math.min(255, g / k), Math.min(255, b / k));
  };
  genie_rgbPrototype.darker = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new genie_rgb(k * this.r, k * this.g, k * this.b);
  };
  genie_rgbPrototype.hsl = function() {
    return genie_rgb_hsl(this.r, this.g, this.b);
  };
  genie_rgbPrototype.toString = function() {
    return "#" + genie_rgb_hex(this.r) + genie_rgb_hex(this.g) + genie_rgb_hex(this.b);
  };
  function genie_rgb_hex(v) {
    return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
  }
  function genie_rgb_parse(format, rgb, hsl) {
    var r = 0, g = 0, b = 0, m1, m2, color;
    m1 = /([a-z]+)\((.*)\)/.exec(format = format.toLowerCase());
    if (m1) {
      m2 = m1[2].split(",");
      switch (m1[1]) {
       case "hsl":
        {
          return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
        }

       case "rgb":
        {
          return rgb(genie_rgb_parseNumber(m2[0]), genie_rgb_parseNumber(m2[1]), genie_rgb_parseNumber(m2[2]));
        }
      }
    }
    if (color = genie_rgb_names.get(format)) {
      return rgb(color.r, color.g, color.b);
    }
    if (format != null && format.charAt(0) === "#" && !isNaN(color = parseInt(format.slice(1), 16))) {
      if (format.length === 4) {
        r = (color & 3840) >> 4;
        r = r >> 4 | r;
        g = color & 240;
        g = g >> 4 | g;
        b = color & 15;
        b = b << 4 | b;
      } else if (format.length === 7) {
        r = (color & 16711680) >> 16;
        g = (color & 65280) >> 8;
        b = color & 255;
      }
    }
    return rgb(r, g, b);
  }
  function genie_rgb_hsl(r, g, b) {
    var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2;
    if (d) {
      s = l < .5 ? d / (max + min) : d / (2 - max - min);
      if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60;
    } else {
      h = NaN;
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new genie_hsl(h, s, l);
  }
  function genie_rgb_lab(r, g, b) {
    r = genie_rgb_xyz(r);
    g = genie_rgb_xyz(g);
    b = genie_rgb_xyz(b);
    var x = genie_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / genie_lab_X), y = genie_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / genie_lab_Y), z = genie_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / genie_lab_Z);
    return genie_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));
  }
  function genie_rgb_xyz(r) {
    return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);
  }
  function genie_rgb_parseNumber(c) {
    var f = parseFloat(c);
    return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
  }
  var genie_rgb_names = genie.map({
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  });
  genie_rgb_names.forEach(function(key, value) {
    genie_rgb_names.set(key, genie_rgbNumber(value));
  });
  function genie_functor(v) {
    return typeof v === "function" ? v : function() {
      return v;
    };
  }
  
  var genie_timer_queueHead, genie_timer_queueTail, genie_timer_interval, genie_timer_timeout, genie_timer_frame = this[genie_vendorSymbol(this, "requestAnimationFrame")] || function(callback) {
    setTimeout(callback, 17);
  };
  genie.timer = function() {
    genie_timer.apply(this, arguments);
  };
  function genie_timer(callback, delay, then) {
    var n = arguments.length;
    if (n < 2) delay = 0;
    if (n < 3) then = Date.now();
    var time = then + delay, timer = {
      c: callback,
      t: time,
      n: null
    };
    if (genie_timer_queueTail) genie_timer_queueTail.n = timer; else genie_timer_queueHead = timer;
    genie_timer_queueTail = timer;
    if (!genie_timer_interval) {
      genie_timer_timeout = clearTimeout(genie_timer_timeout);
      genie_timer_interval = 1;
      genie_timer_frame(genie_timer_step);
    }
    return timer;
  }
  function genie_timer_step() {
    var now = genie_timer_mark(), delay = genie_timer_sweep() - now;
    if (delay > 24) {
      if (isFinite(delay)) {
        clearTimeout(genie_timer_timeout);
        genie_timer_timeout = setTimeout(genie_timer_step, delay);
      }
      genie_timer_interval = 0;
    } else {
      genie_timer_interval = 1;
      genie_timer_frame(genie_timer_step);
    }
  }
  genie.timer.flush = function() {
    genie_timer_mark();
    genie_timer_sweep();
  };
  function genie_timer_mark() {
    var now = Date.now(), timer = genie_timer_queueHead;
    while (timer) {
      if (now >= timer.t && timer.c(now - timer.t)) timer.c = null;
      timer = timer.n;
    }
    return now;
  }
  function genie_timer_sweep() {
    var t0, t1 = genie_timer_queueHead, time = Infinity;
    while (t1) {
      if (t1.c) {
        if (t1.t < time) time = t1.t;
        t1 = (t0 = t1).n;
      } else {
        t1 = t0 ? t0.n = t1.n : genie_timer_queueHead = t1.n;
      }
    }
    genie_timer_queueTail = t0;
    return time;
  }
  function genie_format_precision(x, p) {
    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);
  }
  genie.round = function(x, n) {
    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
  };
  var genie_formatPrefixes = [ "y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y" ].map(genie_formatPrefix);
  genie.formatPrefix = function(value, precision) {
    var i = 0;
    if (value = +value) {
      if (value < 0) value *= -1;
      if (precision) value = genie.round(value, genie_format_precision(value, precision));
      i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
      i = Math.max(-24, Math.min(24, Math.floor((i - 1) / 3) * 3));
    }
    return genie_formatPrefixes[8 + i / 3];
  };
  function genie_formatPrefix(d, i) {
    var k = Math.pow(10, abs(8 - i) * 3);
    return {
      scale: i > 8 ? function(d) {
        return d / k;
      } : function(d) {
        return d * k;
      },
      symbol: d
    };
  }
  function genie_locale_numberFormat(locale) {
    var locale_decimal = locale.decimal, locale_thousands = locale.thousands, locale_grouping = locale.grouping, locale_currency = locale.currency, formatGroup = locale_grouping && locale_thousands ? function(value, width) {
      var i = value.length, t = [], j = 0, g = locale_grouping[0], length = 0;
      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = locale_grouping[j = (j + 1) % locale_grouping.length];
      }
      return t.reverse().join(locale_thousands);
    } : genie_identity;
    return function(specifier) {
      var match = genie_format_re.exec(specifier), fill = match[1] || " ", align = match[2] || ">", sign = match[3] || "-", symbol = match[4] || "", zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, prefix = "", suffix = "", integer = false, exponent = true;
      if (precision) precision = +precision.substring(1);
      if (zfill || fill === "0" && align === "=") {
        zfill = fill = "0";
        align = "=";
      }
      switch (type) {
       case "n":
        comma = true;
        type = "g";
        break;

       case "%":
        scale = 100;
        suffix = "%";
        type = "f";
        break;

       case "p":
        scale = 100;
        suffix = "%";
        type = "r";
        break;

       case "b":
       case "o":
       case "x":
       case "X":
        if (symbol === "#") prefix = "0" + type.toLowerCase();

       case "c":
        exponent = false;

       case "d":
        integer = true;
        precision = 0;
        break;

       case "s":
        scale = -1;
        type = "r";
        break;
      }
      if (symbol === "$") prefix = locale_currency[0], suffix = locale_currency[1];
      if (type == "r" && !precision) type = "g";
      if (precision != null) {
        if (type == "g") precision = Math.max(1, Math.min(21, precision)); else if (type == "e" || type == "f") precision = Math.max(0, Math.min(20, precision));
      }
      type = genie_format_types.get(type) || genie_format_typeDefault;
      var zcomma = zfill && comma;
      return function(value) {
        var fullSuffix = suffix;
        if (integer && value % 1) return "";
        var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, "-") : sign === "-" ? "" : sign;
        if (scale < 0) {
          var unit = genie.formatPrefix(value, precision);
          value = unit.scale(value);
          fullSuffix = unit.symbol + suffix;
        } else {
          value *= scale;
        }
        value = type(value, precision);
        var i = value.lastIndexOf("."), before, after;
        if (i < 0) {
          var j = exponent ? value.lastIndexOf("e") : -1;
          if (j < 0) before = value, after = ""; else before = value.substring(0, j), after = value.substring(j);
        } else {
          before = value.substring(0, i);
          after = locale_decimal + value.substring(i + 1);
        }
        if (!zfill && comma) before = formatGroup(before, Infinity);
        var length = prefix.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = length < width ? new Array(length = width - length + 1).join(fill) : "";
        if (zcomma) before = formatGroup(padding + before, padding.length ? width - after.length : Infinity);
        negative += prefix;
        value = before + after;
        return (align === "<" ? negative + value + padding : align === ">" ? padding + negative + value : align === "^" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + fullSuffix;
      };
    };
  }
  var genie_format_re = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i;
  var genie_format_types = genie.map({
    b: function(x) {
      return x.toString(2);
    },
    c: function(x) {
      return String.fromCharCode(x);
    },
    o: function(x) {
      return x.toString(8);
    },
    x: function(x) {
      return x.toString(16);
    },
    X: function(x) {
      return x.toString(16).toUpperCase();
    },
    g: function(x, p) {
      return x.toPrecision(p);
    },
    e: function(x, p) {
      return x.toExponential(p);
    },
    f: function(x, p) {
      return x.toFixed(p);
    },
    r: function(x, p) {
      return (x = genie.round(x, genie_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, genie_format_precision(x * (1 + 1e-15), p))));
    }
  });
  function genie_format_typeDefault(x) {
    return x + "";
  }
  var genie_time = genie.time = {}, genie_date = Date;
  function genie_date_utc() {
    this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]);
  }
  genie_date_utc.prototype = {
    getDate: function() {
      return this._.getUTCDate();
    },
    getDay: function() {
      return this._.getUTCDay();
    },
    getFullYear: function() {
      return this._.getUTCFullYear();
    },
    getHours: function() {
      return this._.getUTCHours();
    },
    getMilliseconds: function() {
      return this._.getUTCMilliseconds();
    },
    getMinutes: function() {
      return this._.getUTCMinutes();
    },
    getMonth: function() {
      return this._.getUTCMonth();
    },
    getSeconds: function() {
      return this._.getUTCSeconds();
    },
    getTime: function() {
      return this._.getTime();
    },
    getTimezoneOffset: function() {
      return 0;
    },
    valueOf: function() {
      return this._.valueOf();
    },
    setDate: function() {
      genie_time_prototype.setUTCDate.apply(this._, arguments);
    },
    setDay: function() {
      genie_time_prototype.setUTCDay.apply(this._, arguments);
    },
    setFullYear: function() {
      genie_time_prototype.setUTCFullYear.apply(this._, arguments);
    },
    setHours: function() {
      genie_time_prototype.setUTCHours.apply(this._, arguments);
    },
    setMilliseconds: function() {
      genie_time_prototype.setUTCMilliseconds.apply(this._, arguments);
    },
    setMinutes: function() {
      genie_time_prototype.setUTCMinutes.apply(this._, arguments);
    },
    setMonth: function() {
      genie_time_prototype.setUTCMonth.apply(this._, arguments);
    },
    setSeconds: function() {
      genie_time_prototype.setUTCSeconds.apply(this._, arguments);
    },
    setTime: function() {
      genie_time_prototype.setTime.apply(this._, arguments);
    }
  };
  var genie_time_prototype = Date.prototype;
  function genie_time_interval(local, step, number) {
    function round(date) {
      var d0 = local(date), d1 = offset(d0, 1);
      return date - d0 < d1 - date ? d0 : d1;
    }
    function ceil(date) {
      step(date = local(new genie_date(date - 1)), 1);
      return date;
    }
    function offset(date, k) {
      step(date = new genie_date(+date), k);
      return date;
    }
    function range(t0, t1, dt) {
      var time = ceil(t0), times = [];
      if (dt > 1) {
        while (time < t1) {
          if (!(number(time) % dt)) times.push(new Date(+time));
          step(time, 1);
        }
      } else {
        while (time < t1) times.push(new Date(+time)), step(time, 1);
      }
      return times;
    }
    function range_utc(t0, t1, dt) {
      try {
        genie_date = genie_date_utc;
        var utc = new genie_date_utc();
        utc._ = t0;
        return range(utc, t1, dt);
      } finally {
        genie_date = Date;
      }
    }
    local.floor = local;
    local.round = round;
    local.ceil = ceil;
    local.offset = offset;
    local.range = range;
    var utc = local.utc = genie_time_interval_utc(local);
    utc.floor = utc;
    utc.round = genie_time_interval_utc(round);
    utc.ceil = genie_time_interval_utc(ceil);
    utc.offset = genie_time_interval_utc(offset);
    utc.range = range_utc;
    return local;
  }
  function genie_time_interval_utc(method) {
    return function(date, k) {
      try {
        genie_date = genie_date_utc;
        var utc = new genie_date_utc();
        utc._ = date;
        return method(utc, k)._;
      } finally {
        genie_date = Date;
      }
    };
  }
  genie_time.year = genie_time_interval(function(date) {
    date = genie_time.day(date);
    date.setMonth(0, 1);
    return date;
  }, function(date, offset) {
    date.setFullYear(date.getFullYear() + offset);
  }, function(date) {
    return date.getFullYear();
  });
  genie_time.years = genie_time.year.range;
  genie_time.years.utc = genie_time.year.utc.range;
  genie_time.day = genie_time_interval(function(date) {
    var day = new genie_date(2e3, 0);
    day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    return day;
  }, function(date, offset) {
    date.setDate(date.getDate() + offset);
  }, function(date) {
    return date.getDate() - 1;
  });
  genie_time.days = genie_time.day.range;
  genie_time.days.utc = genie_time.day.utc.range;
  genie_time.dayOfYear = function(date) {
    var year = genie_time.year(date);
    return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
  };
  [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ].forEach(function(day, i) {
    i = 7 - i;
    var interval = genie_time[day] = genie_time_interval(function(date) {
      (date = genie_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);
      return date;
    }, function(date, offset) {
      date.setDate(date.getDate() + Math.floor(offset) * 7);
    }, function(date) {
      var day = genie_time.year(date).getDay();
      return Math.floor((genie_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);
    });
    genie_time[day + "s"] = interval.range;
    genie_time[day + "s"].utc = interval.utc.range;
    genie_time[day + "OfYear"] = function(date) {
      var day = genie_time.year(date).getDay();
      return Math.floor((genie_time.dayOfYear(date) + (day + i) % 7) / 7);
    };
  });
  genie_time.week = genie_time.sunday;
  genie_time.weeks = genie_time.sunday.range;
  genie_time.weeks.utc = genie_time.sunday.utc.range;
  genie_time.weekOfYear = genie_time.sundayOfYear;
  function genie_locale_timeFormat(locale) {
    var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_days = locale.days, locale_shortDays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths;
    function genie_time_format(template) {
      var n = template.length;
      function format(date) {
        var string = [], i = -1, j = 0, c, p, f;
        while (++i < n) {
          if (template.charCodeAt(i) === 37) {
            string.push(template.slice(j, i));
            if ((p = genie_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);
            if (f = genie_time_formats[c]) c = f(date, p == null ? c === "e" ? " " : "0" : p);
            string.push(c);
            j = i + 1;
          }
        }
        string.push(template.slice(j, i));
        return string.join("");
      }
      format.parse = function(string) {
        var d = {
          y: 1900,
          m: 0,
          d: 1,
          H: 0,
          M: 0,
          S: 0,
          L: 0,
          Z: null
        }, i = genie_time_parse(d, template, string, 0);
        if (i != string.length) return null;
        if ("p" in d) d.H = d.H % 12 + d.p * 12;
        var localZ = d.Z != null && genie_date !== genie_date_utc, date = new (localZ ? genie_date_utc : genie_date)();
        if ("j" in d) date.setFullYear(d.y, 0, d.j); else if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "W" in d ? 1 : 0;
          date.setFullYear(d.y, 0, 1);
          date.setFullYear(d.y, 0, "W" in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7);
        } else date.setFullYear(d.y, d.m, d.d);
        date.setHours(d.H + (d.Z / 100 | 0), d.M + d.Z % 100, d.S, d.L);
        return localZ ? date._ : date;
      };
      format.toString = function() {
        return template;
      };
      return format;
    }
    function genie_time_parse(date, template, string, j) {
      var c, p, t, i = 0, n = template.length, m = string.length;
      while (i < n) {
        if (j >= m) return -1;
        c = template.charCodeAt(i++);
        if (c === 37) {
          t = template.charAt(i++);
          p = genie_time_parsers[t in genie_time_formatPads ? template.charAt(i++) : t];
          if (!p || (j = p(date, string, j)) < 0) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }
      return j;
    }
    genie_time_format.utc = function(template) {
      var local = genie_time_format(template);
      function format(date) {
        try {
          genie_date = genie_date_utc;
          var utc = new genie_date();
          utc._ = date;
          return local(utc);
        } finally {
          genie_date = Date;
        }
      }
      format.parse = function(string) {
        try {
          genie_date = genie_date_utc;
          var date = local.parse(string);
          return date && date._;
        } finally {
          genie_date = Date;
        }
      };
      format.toString = local.toString;
      return format;
    };
    genie_time_format.multi = genie_time_format.utc.multi = genie_time_formatMulti;
    var genie_time_periodLookup = genie.map(), genie_time_dayRe = genie_time_formatRe(locale_days), genie_time_dayLookup = genie_time_formatLookup(locale_days), genie_time_dayAbbrevRe = genie_time_formatRe(locale_shortDays), genie_time_dayAbbrevLookup = genie_time_formatLookup(locale_shortDays), genie_time_monthRe = genie_time_formatRe(locale_months), genie_time_monthLookup = genie_time_formatLookup(locale_months), genie_time_monthAbbrevRe = genie_time_formatRe(locale_shortMonths), genie_time_monthAbbrevLookup = genie_time_formatLookup(locale_shortMonths);
    locale_periods.forEach(function(p, i) {
      genie_time_periodLookup.set(p.toLowerCase(), i);
    });
    var genie_time_formats = {
      a: function(d) {
        return locale_shortDays[d.getDay()];
      },
      A: function(d) {
        return locale_days[d.getDay()];
      },
      b: function(d) {
        return locale_shortMonths[d.getMonth()];
      },
      B: function(d) {
        return locale_months[d.getMonth()];
      },
      c: genie_time_format(locale_dateTime),
      d: function(d, p) {
        return genie_time_formatPad(d.getDate(), p, 2);
      },
      e: function(d, p) {
        return genie_time_formatPad(d.getDate(), p, 2);
      },
      H: function(d, p) {
        return genie_time_formatPad(d.getHours(), p, 2);
      },
      I: function(d, p) {
        return genie_time_formatPad(d.getHours() % 12 || 12, p, 2);
      },
      j: function(d, p) {
        return genie_time_formatPad(1 + genie_time.dayOfYear(d), p, 3);
      },
      L: function(d, p) {
        return genie_time_formatPad(d.getMilliseconds(), p, 3);
      },
      m: function(d, p) {
        return genie_time_formatPad(d.getMonth() + 1, p, 2);
      },
      M: function(d, p) {
        return genie_time_formatPad(d.getMinutes(), p, 2);
      },
      p: function(d) {
        return locale_periods[+(d.getHours() >= 12)];
      },
      S: function(d, p) {
        return genie_time_formatPad(d.getSeconds(), p, 2);
      },
      U: function(d, p) {
        return genie_time_formatPad(genie_time.sundayOfYear(d), p, 2);
      },
      w: function(d) {
        return d.getDay();
      },
      W: function(d, p) {
        return genie_time_formatPad(genie_time.mondayOfYear(d), p, 2);
      },
      x: genie_time_format(locale_date),
      X: genie_time_format(locale_time),
      y: function(d, p) {
        return genie_time_formatPad(d.getFullYear() % 100, p, 2);
      },
      Y: function(d, p) {
        return genie_time_formatPad(d.getFullYear() % 1e4, p, 4);
      },
      Z: genie_time_zone,
      "%": function() {
        return "%";
      }
    };
    var genie_time_parsers = {
      a: genie_time_parseWeekdayAbbrev,
      A: genie_time_parseWeekday,
      b: genie_time_parseMonthAbbrev,
      B: genie_time_parseMonth,
      c: genie_time_parseLocaleFull,
      d: genie_time_parseDay,
      e: genie_time_parseDay,
      H: genie_time_parseHour24,
      I: genie_time_parseHour24,
      j: genie_time_parseDayOfYear,
      L: genie_time_parseMilliseconds,
      m: genie_time_parseMonthNumber,
      M: genie_time_parseMinutes,
      p: genie_time_parseAmPm,
      S: genie_time_parseSeconds,
      U: genie_time_parseWeekNumberSunday,
      w: genie_time_parseWeekdayNumber,
      W: genie_time_parseWeekNumberMonday,
      x: genie_time_parseLocaleDate,
      X: genie_time_parseLocaleTime,
      y: genie_time_parseYear,
      Y: genie_time_parseFullYear,
      Z: genie_time_parseZone,
      "%": genie_time_parseLiteralPercent
    };
    function genie_time_parseWeekdayAbbrev(date, string, i) {
      genie_time_dayAbbrevRe.lastIndex = 0;
      var n = genie_time_dayAbbrevRe.exec(string.slice(i));
      return n ? (date.w = genie_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function genie_time_parseWeekday(date, string, i) {
      genie_time_dayRe.lastIndex = 0;
      var n = genie_time_dayRe.exec(string.slice(i));
      return n ? (date.w = genie_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function genie_time_parseMonthAbbrev(date, string, i) {
      genie_time_monthAbbrevRe.lastIndex = 0;
      var n = genie_time_monthAbbrevRe.exec(string.slice(i));
      return n ? (date.m = genie_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function genie_time_parseMonth(date, string, i) {
      genie_time_monthRe.lastIndex = 0;
      var n = genie_time_monthRe.exec(string.slice(i));
      return n ? (date.m = genie_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function genie_time_parseLocaleFull(date, string, i) {
      return genie_time_parse(date, genie_time_formats.c.toString(), string, i);
    }
    function genie_time_parseLocaleDate(date, string, i) {
      return genie_time_parse(date, genie_time_formats.x.toString(), string, i);
    }
    function genie_time_parseLocaleTime(date, string, i) {
      return genie_time_parse(date, genie_time_formats.X.toString(), string, i);
    }
    function genie_time_parseAmPm(date, string, i) {
      var n = genie_time_periodLookup.get(string.slice(i, i += 2).toLowerCase());
      return n == null ? -1 : (date.p = n, i);
    }
    return genie_time_format;
  }
  var genie_time_formatPads = {
    "-": "",
    _: " ",
    "0": "0"
  }, genie_time_numberRe = /^\s*\d+/, genie_time_percentRe = /^%/;
  function genie_time_formatPad(value, fill, width) {
    var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }
  function genie_time_formatRe(names) {
    return new RegExp("^(?:" + names.map(genie.requote).join("|") + ")", "i");
  }
  function genie_time_formatLookup(names) {
    var map = new genie_Map(), i = -1, n = names.length;
    while (++i < n) map.set(names[i].toLowerCase(), i);
    return map;
  }
  function genie_time_parseWeekdayNumber(date, string, i) {
    genie_time_numberRe.lastIndex = 0;
    var n = genie_time_numberRe.exec(string.slice(i, i + 1));
    return n ? (date.w = +n[0], i + n[0].length) : -1;
  }
  function genie_time_parseWeekNumberSunday(date, string, i) {
    genie_time_numberRe.lastIndex = 0;
    var n = genie_time_numberRe.exec(string.slice(i));
    return n ? (date.U = +n[0], i + n[0].length) : -1;
  }
  function genie_time_parseWeekNumberMonday(date, string, i) {
    genie_time_numberRe.lastIndex = 0;
    var n = genie_time_numberRe.exec(string.slice(i));
    return n ? (date.W = +n[0], i + n[0].length) : -1;
  }
  function genie_time_parseFullYear(date, string, i) {
    genie_time_numberRe.lastIndex = 0;
    var n = genie_time_numberRe.exec(string.slice(i, i + 4));
    return n ? (date.y = +n[0], i + n[0].length) : -1;
  }
  function genie_time_parseYear(date, string, i) {
    genie_time_numberRe.lastIndex = 0;
    var n = genie_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.y = genie_time_expandYear(+n[0]), i + n[0].length) : -1;
  }
  function genie_time_parseZone(date, string, i) {
    return /^[+-]\d{4}$/.test(string = string.slice(i, i + 5)) ? (date.Z = -string, 
    i + 5) : -1;
  }
  function genie_time_expandYear(d) {
    return d + (d > 68 ? 1900 : 2e3);
  }
  function genie_time_parseMonthNumber(date, string, i) {
    genie_time_numberRe.lastIndex = 0;
    var n = genie_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.m = n[0] - 1, i + n[0].length) : -1;
  }
  function genie_time_parseDay(date, string, i) {
    genie_time_numberRe.lastIndex = 0;
    var n = genie_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.d = +n[0], i + n[0].length) : -1;
  }
  function genie_time_parseDayOfYear(date, string, i) {
    genie_time_numberRe.lastIndex = 0;
    var n = genie_time_numberRe.exec(string.slice(i, i + 3));
    return n ? (date.j = +n[0], i + n[0].length) : -1;
  }
  function genie_time_parseHour24(date, string, i) {
    genie_time_numberRe.lastIndex = 0;
    var n = genie_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.H = +n[0], i + n[0].length) : -1;
  }
  function genie_time_parseMinutes(date, string, i) {
    genie_time_numberRe.lastIndex = 0;
    var n = genie_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.M = +n[0], i + n[0].length) : -1;
  }
  function genie_time_parseSeconds(date, string, i) {
    genie_time_numberRe.lastIndex = 0;
    var n = genie_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.S = +n[0], i + n[0].length) : -1;
  }
  function genie_time_parseMilliseconds(date, string, i) {
    genie_time_numberRe.lastIndex = 0;
    var n = genie_time_numberRe.exec(string.slice(i, i + 3));
    return n ? (date.L = +n[0], i + n[0].length) : -1;
  }
  function genie_time_zone(d) {
    var z = d.getTimezoneOffset(), zs = z > 0 ? "-" : "+", zh = abs(z) / 60 | 0, zm = abs(z) % 60;
    return zs + genie_time_formatPad(zh, "0", 2) + genie_time_formatPad(zm, "0", 2);
  }
  function genie_time_parseLiteralPercent(date, string, i) {
    genie_time_percentRe.lastIndex = 0;
    var n = genie_time_percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }
  function genie_time_formatMulti(formats) {
    var n = formats.length, i = -1;
    while (++i < n) formats[i][0] = this(formats[i][0]);
    return function(date) {
      var i = 0, f = formats[i];
      while (!f[1](date)) f = formats[++i];
      return f[0](date);
    };
  }
  genie.locale = function(locale) {
    return {
      numberFormat: genie_locale_numberFormat(locale),
      timeFormat: genie_locale_timeFormat(locale)
    };
  };
  var genie_locale_enUS = genie.locale({
    decimal: ".",
    thousands: ",",
    grouping: [ 3 ],
    currency: [ "$", "" ],
    dateTime: "%a %b %e %X %Y",
    date: "%m/%d/%Y",
    time: "%H:%M:%S",
    periods: [ "AM", "PM" ],
    days: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
    shortDays: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
    months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
    shortMonths: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
  });
  genie.format = genie_locale_enUS.numberFormat;
  genie.geo = {};
  
  function genie_true() {
    return true;
  }
  genie.geo.length = function(object) {
    genie_geo_lengthSum = 0;
    genie.geo.stream(object, genie_geo_length);
    return genie_geo_lengthSum;
  };
  var genie_geo_lengthSum;
  var genie_geo_length = {
    sphere: genie_noop,
    point: genie_noop,
    lineStart: genie_geo_lengthLineStart,
    lineEnd: genie_noop,
    polygonStart: genie_noop,
    polygonEnd: genie_noop
  };
  function genie_geo_lengthLineStart() {
    var λ0, sinφ0, cosφ0;
    genie_geo_length.point = function(λ, φ) {
      λ0 = λ * genie_radians, sinφ0 = Math.sin(φ *= genie_radians), cosφ0 = Math.cos(φ);
      genie_geo_length.point = nextPoint;
    };
    genie_geo_length.lineEnd = function() {
      genie_geo_length.point = genie_geo_length.lineEnd = genie_noop;
    };
    function nextPoint(λ, φ) {
      var sinφ = Math.sin(φ *= genie_radians), cosφ = Math.cos(φ), t = abs((λ *= genie_radians) - λ0), cosΔλ = Math.cos(t);
      genie_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);
      λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ;
    }
  }
  function genie_geo_azimuthal(scale, angle) {
    function azimuthal(λ, φ) {
      var cosλ = Math.cos(λ), cosφ = Math.cos(φ), k = scale(cosλ * cosφ);
      return [ k * cosφ * Math.sin(λ), k * Math.sin(φ) ];
    }
    azimuthal.invert = function(x, y) {
      var ρ = Math.sqrt(x * x + y * y), c = angle(ρ), sinc = Math.sin(c), cosc = Math.cos(c);
      return [ Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ) ];
    };
    return azimuthal;
  }
  var genie_geo_azimuthalEqualArea = genie_geo_azimuthal(function(cosλcosφ) {
    return Math.sqrt(2 / (1 + cosλcosφ));
  }, function(ρ) {
    return 2 * Math.asin(ρ / 2);
  });
  (genie.geo.azimuthalEqualArea = function() {
    return genie_geo_projection(genie_geo_azimuthalEqualArea);
  }).raw = genie_geo_azimuthalEqualArea;
  var genie_geo_azimuthalEquidistant = genie_geo_azimuthal(function(cosλcosφ) {
    var c = Math.acos(cosλcosφ);
    return c && c / Math.sin(c);
  }, genie_identity);
  (genie.geo.azimuthalEquidistant = function() {
    return genie_geo_projection(genie_geo_azimuthalEquidistant);
  }).raw = genie_geo_azimuthalEquidistant;
  function genie_geo_conicConformal(φ0, φ1) {
    var cosφ0 = Math.cos(φ0), t = function(φ) {
      return Math.tan(π / 4 + φ / 2);
    }, n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)), F = cosφ0 * Math.pow(t(φ0), n) / n;
    if (!n) return genie_geo_mercator;
    function forward(λ, φ) {
      if (F > 0) {
        if (φ < -halfπ + ε) φ = -halfπ + ε;
      } else {
        if (φ > halfπ - ε) φ = halfπ - ε;
      }
      var ρ = F / Math.pow(t(φ), n);
      return [ ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = F - y, ρ = genie_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);
      return [ Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - halfπ ];
    };
    return forward;
  }
  (genie.geo.conicConformal = function() {
    return genie_geo_conic(genie_geo_conicConformal);
  }).raw = genie_geo_conicConformal;
  function genie_geo_conicEquidistant(φ0, φ1) {
    var cosφ0 = Math.cos(φ0), n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0), G = cosφ0 / n + φ0;
    if (abs(n) < ε) return genie_geo_equirectangular;
    function forward(λ, φ) {
      var ρ = G - φ;
      return [ ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = G - y;
      return [ Math.atan2(x, ρ0_y) / n, G - genie_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y) ];
    };
    return forward;
  }
  (genie.geo.conicEquidistant = function() {
    return genie_geo_conic(genie_geo_conicEquidistant);
  }).raw = genie_geo_conicEquidistant;
  var genie_geo_gnomonic = genie_geo_azimuthal(function(cosλcosφ) {
    return 1 / cosλcosφ;
  }, Math.atan);
  (genie.geo.gnomonic = function() {
    return genie_geo_projection(genie_geo_gnomonic);
  }).raw = genie_geo_gnomonic;
  function genie_geo_mercator(λ, φ) {
    return [ λ, Math.log(Math.tan(π / 4 + φ / 2)) ];
  }
  genie_geo_mercator.invert = function(x, y) {
    return [ x, 2 * Math.atan(Math.exp(y)) - halfπ ];
  };
  function genie_geo_mercatorProjection(project) {
    var m = genie_geo_projection(project), scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, clipAuto;
    m.scale = function() {
      var v = scale.apply(m, arguments);
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
    };
    m.translate = function() {
      var v = translate.apply(m, arguments);
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
    };
    m.clipExtent = function(_) {
      var v = clipExtent.apply(m, arguments);
      if (v === m) {
        if (clipAuto = _ == null) {
          var k = π * scale(), t = translate();
          clipExtent([ [ t[0] - k, t[1] - k ], [ t[0] + k, t[1] + k ] ]);
        }
      } else if (clipAuto) {
        v = null;
      }
      return v;
    };
    return m.clipExtent(null);
  }
  (genie.geo.mercator = function() {
    return genie_geo_mercatorProjection(genie_geo_mercator);
  }).raw = genie_geo_mercator;
  var genie_geo_orthographic = genie_geo_azimuthal(function() {
    return 1;
  }, Math.asin);
  (genie.geo.orthographic = function() {
    return genie_geo_projection(genie_geo_orthographic);
  }).raw = genie_geo_orthographic;
  var genie_geo_stereographic = genie_geo_azimuthal(function(cosλcosφ) {
    return 1 / (1 + cosλcosφ);
  }, function(ρ) {
    return 2 * Math.atan(ρ);
  });
  (genie.geo.stereographic = function() {
    return genie_geo_projection(genie_geo_stereographic);
  }).raw = genie_geo_stereographic;
  function genie_geo_transverseMercator(λ, φ) {
    return [ Math.log(Math.tan(π / 4 + φ / 2)), -λ ];
  }
  genie_geo_transverseMercator.invert = function(x, y) {
    return [ -y, 2 * Math.atan(Math.exp(x)) - halfπ ];
  };
  (genie.geo.transverseMercator = function() {
    var projection = genie_geo_mercatorProjection(genie_geo_transverseMercator), center = projection.center, rotate = projection.rotate;
    projection.center = function(_) {
      return _ ? center([ -_[1], _[0] ]) : (_ = center(), [ _[1], -_[0] ]);
    };
    projection.rotate = function(_) {
      return _ ? rotate([ _[0], _[1], _.length > 2 ? _[2] + 90 : 90 ]) : (_ = rotate(), 
      [ _[0], _[1], _[2] - 90 ]);
    };
    return rotate([ 0, 0, 90 ]);
  }).raw = genie_geo_transverseMercator;
  genie.geom = {};
  function genie_geom_pointX(d) {
    return d[0];
  }
  function genie_geom_pointY(d) {
    return d[1];
  }
  genie.geom.hull = function(vertices) {
    var x = genie_geom_pointX, y = genie_geom_pointY;
    if (arguments.length) return hull(vertices);
    function hull(data) {
      if (data.length < 3) return [];
      var fx = genie_functor(x), fy = genie_functor(y), i, n = data.length, points = [], flippedPoints = [];
      for (i = 0; i < n; i++) {
        points.push([ +fx.call(this, data[i], i), +fy.call(this, data[i], i), i ]);
      }
      points.sort(genie_geom_hullOrder);
      for (i = 0; i < n; i++) flippedPoints.push([ points[i][0], -points[i][1] ]);
      var upper = genie_geom_hullUpper(points), lower = genie_geom_hullUpper(flippedPoints);
      var skipLeft = lower[0] === upper[0], skipRight = lower[lower.length - 1] === upper[upper.length - 1], polygon = [];
      for (i = upper.length - 1; i >= 0; --i) polygon.push(data[points[upper[i]][2]]);
      for (i = +skipLeft; i < lower.length - skipRight; ++i) polygon.push(data[points[lower[i]][2]]);
      return polygon;
    }
    hull.x = function(_) {
      return arguments.length ? (x = _, hull) : x;
    };
    hull.y = function(_) {
      return arguments.length ? (y = _, hull) : y;
    };
    return hull;
  };
 
  genie.geom.quadtree = function(points, x1, y1, x2, y2) {
    var x = genie_geom_pointX, y = genie_geom_pointY, compat;
    if (compat = arguments.length) {
      x = genie_geom_quadtreeCompatX;
      y = genie_geom_quadtreeCompatY;
      if (compat === 3) {
        y2 = y1;
        x2 = x1;
        y1 = x1 = 0;
      }
      return quadtree(points);
    }
    function quadtree(data) {
      var d, fx = genie_functor(x), fy = genie_functor(y), xs, ys, i, n, x1_, y1_, x2_, y2_;
      if (x1 != null) {
        x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2;
      } else {
        x2_ = y2_ = -(x1_ = y1_ = Infinity);
        xs = [], ys = [];
        n = data.length;
        if (compat) for (i = 0; i < n; ++i) {
          d = data[i];
          if (d.x < x1_) x1_ = d.x;
          if (d.y < y1_) y1_ = d.y;
          if (d.x > x2_) x2_ = d.x;
          if (d.y > y2_) y2_ = d.y;
          xs.push(d.x);
          ys.push(d.y);
        } else for (i = 0; i < n; ++i) {
          var x_ = +fx(d = data[i], i), y_ = +fy(d, i);
          if (x_ < x1_) x1_ = x_;
          if (y_ < y1_) y1_ = y_;
          if (x_ > x2_) x2_ = x_;
          if (y_ > y2_) y2_ = y_;
          xs.push(x_);
          ys.push(y_);
        }
      }
      var dx = x2_ - x1_, dy = y2_ - y1_;
      if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy;
      function insert(n, d, x, y, x1, y1, x2, y2) {
        if (isNaN(x) || isNaN(y)) return;
        if (n.leaf) {
          var nx = n.x, ny = n.y;
          if (nx != null) {
            if (abs(nx - x) + abs(ny - y) < .01) {
              insertChild(n, d, x, y, x1, y1, x2, y2);
            } else {
              var nPoint = n.point;
              n.x = n.y = n.point = null;
              insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);
              insertChild(n, d, x, y, x1, y1, x2, y2);
            }
          } else {
            n.x = x, n.y = y, n.point = d;
          }
        } else {
          insertChild(n, d, x, y, x1, y1, x2, y2);
        }
      }
      function insertChild(n, d, x, y, x1, y1, x2, y2) {
        var xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym, i = below << 1 | right;
        n.leaf = false;
        n = n.nodes[i] || (n.nodes[i] = genie_geom_quadtreeNode());
        if (right) x1 = xm; else x2 = xm;
        if (below) y1 = ym; else y2 = ym;
        insert(n, d, x, y, x1, y1, x2, y2);
      }
      var root = genie_geom_quadtreeNode();
      root.add = function(d) {
        insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_);
      };
      root.visit = function(f) {
        genie_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);
      };
      root.find = function(point) {
        return genie_geom_quadtreeFind(root, point[0], point[1], x1_, y1_, x2_, y2_);
      };
      i = -1;
      if (x1 == null) {
        while (++i < n) {
          insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);
        }
        --i;
      } else data.forEach(root.add);
      xs = ys = data = d = null;
      return root;
    }
    quadtree.x = function(_) {
      return arguments.length ? (x = _, quadtree) : x;
    };
    quadtree.y = function(_) {
      return arguments.length ? (y = _, quadtree) : y;
    };
    quadtree.extent = function(_) {
      if (!arguments.length) return x1 == null ? null : [ [ x1, y1 ], [ x2, y2 ] ];
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], 
      y2 = +_[1][1];
      return quadtree;
    };
    quadtree.size = function(_) {
      if (!arguments.length) return x1 == null ? null : [ x2 - x1, y2 - y1 ];
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = y1 = 0, x2 = +_[0], y2 = +_[1];
      return quadtree;
    };
    return quadtree;
  };
  function genie_geom_quadtreeCompatX(d) {
    return d.x;
  }
  function genie_geom_quadtreeCompatY(d) {
    return d.y;
  }
  function genie_geom_quadtreeNode() {
    return {
      leaf: true,
      nodes: [],
      point: null,
      x: null,
      y: null
    };
  }
  function genie_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {
    if (!f(node, x1, y1, x2, y2)) {
      var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, children = node.nodes;
      if (children[0]) genie_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);
      if (children[1]) genie_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);
      if (children[2]) genie_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);
      if (children[3]) genie_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);
    }
  }
  
  var genie_ease_default = function() {
    return genie_identity;
  };
  var genie_ease = genie.map({
    linear: genie_ease_default,
    poly: genie_ease_poly,
    quad: function() {
      return genie_ease_quad;
    },
    cubic: function() {
      return genie_ease_cubic;
    },
    sin: function() {
      return genie_ease_sin;
    },
    exp: function() {
      return genie_ease_exp;
    },
    circle: function() {
      return genie_ease_circle;
    },
    elastic: genie_ease_elastic,
    back: genie_ease_back,
    bounce: function() {
      return genie_ease_bounce;
    }
  });
  var genie_ease_mode = genie.map({
    "in": genie_identity,
    out: genie_ease_reverse,
    "in-out": genie_ease_reflect,
    "out-in": function(f) {
      return genie_ease_reflect(genie_ease_reverse(f));
    }
  });
  genie.ease = function(name) {
    var i = name.indexOf("-"), t = i >= 0 ? name.slice(0, i) : name, m = i >= 0 ? name.slice(i + 1) : "in";
    t = genie_ease.get(t) || genie_ease_default;
    m = genie_ease_mode.get(m) || genie_identity;
    return genie_ease_clamp(m(t.apply(null, genie_arraySlice.call(arguments, 1))));
  };
  function genie_ease_clamp(f) {
    return function(t) {
      return t <= 0 ? 0 : t >= 1 ? 1 : f(t);
    };
  }
  function genie_ease_reverse(f) {
    return function(t) {
      return 1 - f(1 - t);
    };
  }
  function genie_ease_reflect(f) {
    return function(t) {
      return .5 * (t < .5 ? f(2 * t) : 2 - f(2 - 2 * t));
    };
  }
  function genie_ease_quad(t) {
    return t * t;
  }
  function genie_ease_cubic(t) {
    return t * t * t;
  }
  function genie_ease_cubicInOut(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    var t2 = t * t, t3 = t2 * t;
    return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
  }
  function genie_ease_poly(e) {
    return function(t) {
      return Math.pow(t, e);
    };
  }
  function genie_ease_sin(t) {
    return 1 - Math.cos(t * halfπ);
  }
  function genie_ease_exp(t) {
    return Math.pow(2, 10 * (t - 1));
  }
  function genie_ease_circle(t) {
    return 1 - Math.sqrt(1 - t * t);
  }
  function genie_ease_elastic(a, p) {
    var s;
    if (arguments.length < 2) p = .45;
    if (arguments.length) s = p / τ * Math.asin(1 / a); else a = 1, s = p / 4;
    return function(t) {
      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p);
    };
  }
  function genie_ease_back(s) {
    if (!s) s = 1.70158;
    return function(t) {
      return t * t * ((s + 1) * t - s);
    };
  }
  function genie_ease_bounce(t) {
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
  }
 
  genie.layout = {};
  genie.layout.bundle = function() {
    return function(links) {
      var paths = [], i = -1, n = links.length;
      while (++i < n) paths.push(genie_layout_bundlePath(links[i]));
      return paths;
    };
  };
  function genie_layout_bundlePath(link) {
    var start = link.source, end = link.target, lca = genie_layout_bundleLeastCommonAncestor(start, end), points = [ start ];
    while (start !== lca) {
      start = start.parent;
      points.push(start);
    }
    var k = points.length;
    while (end !== lca) {
      points.splice(k, 0, end);
      end = end.parent;
    }
    return points;
  }
  function genie_layout_bundleAncestors(node) {
    var ancestors = [], parent = node.parent;
    while (parent != null) {
      ancestors.push(node);
      node = parent;
      parent = parent.parent;
    }
    ancestors.push(node);
    return ancestors;
  }
  function genie_layout_bundleLeastCommonAncestor(a, b) {
    if (a === b) return a;
    var aNodes = genie_layout_bundleAncestors(a), bNodes = genie_layout_bundleAncestors(b), aNode = aNodes.pop(), bNode = bNodes.pop(), sharedNode = null;
    while (aNode === bNode) {
      sharedNode = aNode;
      aNode = aNodes.pop();
      bNode = bNodes.pop();
    }
    return sharedNode;
  }
 
  genie.layout.force = function() {
    var force = {}, event = genie.dispatch("start", "change", "end"), timer, size = [ 1, 1 ], drag, alpha, friction = .9, linkDistance = genie_layout_forceLinkDistance, linkStrength = genie_layout_forceLinkStrength, charge = -30, chargeDistance2 = genie_layout_forceChargeDistance2, gravity = .1, theta2 = .64, nodes = [], links = [], distances, strengths, charges;
    function repulse(node) {
      return function(quad, x1, _, x2) {
        if (quad.point !== node) {
          var dx = quad.cx - node.x, dy = quad.cy - node.y, dw = x2 - x1, dn = dx * dx + dy * dy;
          if (dw * dw / theta2 < dn) {
            if (dn < chargeDistance2) {
              var k = quad.charge / dn;
              node.px -= dx * k;
              node.py -= dy * k;
            }
            return true;
          }
          if (quad.point && dn && dn < chargeDistance2) {
            var k = quad.pointCharge / dn;
            node.px -= dx * k;
            node.py -= dy * k;
          }
        }
        return !quad.charge;
      };
    }
    force.change = function() {
      if ((alpha *= .99) < .005) {
        timer = null;
        event.end({
          type: "end",
          alpha: alpha = 0
        });
        return true;
      }
      var n = nodes.length, m = links.length, q, i, o, s, t, l, k, x, y;
      for (i = 0; i < m; ++i) {
        o = links[i];
        s = o.source;
        t = o.target;
        x = t.x - s.x;
        y = t.y - s.y;
        if (l = x * x + y * y) {
          l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
          x *= l;
          y *= l;
          t.x -= x * (k = s.weight + t.weight ? s.weight / (s.weight + t.weight) : .5);
          t.y -= y * k;
          s.x += x * (k = 1 - k);
          s.y += y * k;
        }
      }
      if (k = alpha * gravity) {
        x = size[0] / 2;
        y = size[1] / 2;
        i = -1;
        if (k) while (++i < n) {
          o = nodes[i];
          o.x += (x - o.x) * k;
          o.y += (y - o.y) * k;
        }
      }
      if (charge) {
        genie_layout_forceAccumulate(q = genie.geom.quadtree(nodes), alpha, charges);
        i = -1;
        while (++i < n) {
          if (!(o = nodes[i]).fixed) {
            q.visit(repulse(o));
          }
        }
      }
      i = -1;
      while (++i < n) {
        o = nodes[i];
        if (o.fixed) {
          o.x = o.px;
          o.y = o.py;
        } else {
          o.x -= (o.px - (o.px = o.x)) * friction;
          o.y -= (o.py - (o.py = o.y)) * friction;
        }
      }
      event.change({
        type: "change",
        alpha: alpha
      });
    };
    force.nodes = function(x) {
      if (!arguments.length) return nodes;
      nodes = x;
      return force;
    };
    force.links = function(x) {
      if (!arguments.length) return links;
      links = x;
      return force;
    };
    force.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return force;
    };
    force.linkDistance = function(x) {
      if (!arguments.length) return linkDistance;
      linkDistance = typeof x === "function" ? x : +x;
      return force;
    };
    force.distance = force.linkDistance;
    force.linkStrength = function(x) {
      if (!arguments.length) return linkStrength;
      linkStrength = typeof x === "function" ? x : +x;
      return force;
    };
    force.friction = function(x) {
      if (!arguments.length) return friction;
      friction = +x;
      return force;
    };
    force.charge = function(x) {
      if (!arguments.length) return charge;
      charge = typeof x === "function" ? x : +x;
      return force;
    };
    force.chargeDistance = function(x) {
      if (!arguments.length) return Math.sqrt(chargeDistance2);
      chargeDistance2 = x * x;
      return force;
    };
    force.gravity = function(x) {
      if (!arguments.length) return gravity;
      gravity = +x;
      return force;
    };
    force.theta = function(x) {
      if (!arguments.length) return Math.sqrt(theta2);
      theta2 = x * x;
      return force;
    };
    force.alpha = function(x) {
      if (!arguments.length) return alpha;
      x = +x;
      if (alpha) {
        if (x > 0) {
          alpha = x;
        } else {
          timer.c = null, timer.t = NaN, timer = null;
          event.end({
            type: "end",
            alpha: alpha = 0
          });
        }
      } else if (x > 0) {
        event.start({
          type: "start",
          alpha: alpha = x
        });
        timer = genie_timer(force.change);
      }
      return force;
    };
    force.start = function() {
      var i, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o;
      for (i = 0; i < n; ++i) {
        (o = nodes[i]).index = i;
        o.weight = 0;
      }
      for (i = 0; i < m; ++i) {
        o = links[i];
        if (typeof o.source == "number") o.source = nodes[o.source];
        if (typeof o.target == "number") o.target = nodes[o.target];
        ++o.source.weight;
        ++o.target.weight;
      }
      for (i = 0; i < n; ++i) {
        o = nodes[i];
        if (isNaN(o.x)) o.x = position("x", w);
        if (isNaN(o.y)) o.y = position("y", h);
        if (isNaN(o.px)) o.px = o.x;
        if (isNaN(o.py)) o.py = o.y;
      }
      distances = [];
      if (typeof linkDistance === "function") for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; i < m; ++i) distances[i] = linkDistance;
      strengths = [];
      if (typeof linkStrength === "function") for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; i < m; ++i) strengths[i] = linkStrength;
      charges = [];
      if (typeof charge === "function") for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; i < n; ++i) charges[i] = charge;
      function position(dimension, size) {
        if (!neighbors) {
          neighbors = new Array(n);
          for (j = 0; j < n; ++j) {
            neighbors[j] = [];
          }
          for (j = 0; j < m; ++j) {
            var o = links[j];
            neighbors[o.source.index].push(o.target);
            neighbors[o.target.index].push(o.source);
          }
        }
        var candidates = neighbors[i], j = -1, l = candidates.length, x;
        while (++j < l) if (!isNaN(x = candidates[j][dimension])) return x;
        return Math.random() * size;
      }
      return force.resume();
    };
    force.resume = function() {
      return force.alpha(.1);
    };
    force.stop = function() {
      return force.alpha(0);
    };
    force.drag = function() {
      if (!drag) drag = genie.behavior.drag().origin(genie_identity).on("dragstart.force", genie_layout_forceDragstart).on("drag.force", dragmove).on("dragend.force", genie_layout_forceDragend);
      if (!arguments.length) return drag;
      this.on("mouseover.force", genie_layout_forceMouseover).on("mouseout.force", genie_layout_forceMouseout).call(drag);
    };
    function dragmove(d) {
      d.px = genie.event.x, d.py = genie.event.y;
      force.resume();
    }
    return genie.rebind(force, event, "on");
  };
  function genie_layout_forceDragstart(d) {
    d.fixed |= 2;
  }
  function genie_layout_forceDragend(d) {
    d.fixed &= ~6;
  }
  function genie_layout_forceMouseover(d) {
    d.fixed |= 4;
    d.px = d.x, d.py = d.y;
  }
  function genie_layout_forceMouseout(d) {
    d.fixed &= ~4;
  }
  function genie_layout_forceAccumulate(quad, alpha, charges) {
    var cx = 0, cy = 0;
    quad.charge = 0;
    if (!quad.leaf) {
      var nodes = quad.nodes, n = nodes.length, i = -1, c;
      while (++i < n) {
        c = nodes[i];
        if (c == null) continue;
        genie_layout_forceAccumulate(c, alpha, charges);
        quad.charge += c.charge;
        cx += c.charge * c.cx;
        cy += c.charge * c.cy;
      }
    }
    if (quad.point) {
      if (!quad.leaf) {
        quad.point.x += Math.random() - .5;
        quad.point.y += Math.random() - .5;
      }
      var k = alpha * charges[quad.point.index];
      quad.charge += quad.pointCharge = k;
      cx += k * quad.point.x;
      cy += k * quad.point.y;
    }
    quad.cx = cx / quad.charge;
    quad.cy = cy / quad.charge;
  }
  var genie_layout_forceLinkDistance = 20, genie_layout_forceLinkStrength = 1, genie_layout_forceChargeDistance2 = Infinity;
  genie.layout.hierarchy = function() {
    var sort = genie_layout_hierarchySort, children = genie_layout_hierarchyChildren, value = genie_layout_hierarchyValue;
    function hierarchy(root) {
      var stack = [ root ], nodes = [], node;
      root.depth = 0;
      while ((node = stack.pop()) != null) {
        nodes.push(node);
        if ((childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {
          var n, childs, child;
          while (--n >= 0) {
            stack.push(child = childs[n]);
            child.parent = node;
            child.depth = node.depth + 1;
          }
          if (value) node.value = 0;
          node.children = childs;
        } else {
          if (value) node.value = +value.call(hierarchy, node, node.depth) || 0;
          delete node.children;
        }
      }
      genie_layout_hierarchyVisitAfter(root, function(node) {
        var childs, parent;
        if (sort && (childs = node.children)) childs.sort(sort);
        if (value && (parent = node.parent)) parent.value += node.value;
      });
      return nodes;
    }
    hierarchy.sort = function(x) {
      if (!arguments.length) return sort;
      sort = x;
      return hierarchy;
    };
    hierarchy.children = function(x) {
      if (!arguments.length) return children;
      children = x;
      return hierarchy;
    };
    hierarchy.value = function(x) {
      if (!arguments.length) return value;
      value = x;
      return hierarchy;
    };
    hierarchy.revalue = function(root) {
      if (value) {
        genie_layout_hierarchyVisitBefore(root, function(node) {
          if (node.children) node.value = 0;
        });
        genie_layout_hierarchyVisitAfter(root, function(node) {
          var parent;
          if (!node.children) node.value = +value.call(hierarchy, node, node.depth) || 0;
          if (parent = node.parent) parent.value += node.value;
        });
      }
      return root;
    };
    return hierarchy;
  };
  function genie_layout_hierarchyRebind(object, hierarchy) {
    genie.rebind(object, hierarchy, "sort", "children", "value");
    object.nodes = object;
    object.links = genie_layout_hierarchyLinks;
    return object;
  }
  function genie_layout_hierarchyVisitBefore(node, callback) {
    var nodes = [ node ];
    while ((node = nodes.pop()) != null) {
      callback(node);
      if ((children = node.children) && (n = children.length)) {
        var n, children;
        while (--n >= 0) nodes.push(children[n]);
      }
    }
  }
  function genie_layout_hierarchyVisitAfter(node, callback) {
    var nodes = [ node ], nodes2 = [];
    while ((node = nodes.pop()) != null) {
      nodes2.push(node);
      if ((children = node.children) && (n = children.length)) {
        var i = -1, n, children;
        while (++i < n) nodes.push(children[i]);
      }
    }
    while ((node = nodes2.pop()) != null) {
      callback(node);
    }
  }
  function genie_layout_hierarchyChildren(d) {
    return d.children;
  }
  function genie_layout_hierarchyValue(d) {
    return d.value;
  }
  function genie_layout_hierarchySort(a, b) {
    return b.value - a.value;
  }
  function genie_layout_hierarchyLinks(nodes) {
    return genie.merge(nodes.map(function(parent) {
      return (parent.children || []).map(function(child) {
        return {
          source: parent,
          target: child
        };
      });
    }));
  }
  genie.layout.partition = function() {
    var hierarchy = genie.layout.hierarchy(), size = [ 1, 1 ];
    function position(node, x, dx, dy) {
      var children = node.children;
      node.x = x;
      node.y = node.depth * dy;
      node.dx = dx;
      node.dy = dy;
      if (children && (n = children.length)) {
        var i = -1, n, c, d;
        dx = node.value ? dx / node.value : 0;
        while (++i < n) {
          position(c = children[i], x, d = c.value * dx, dy);
          x += d;
        }
      }
    }
    function depth(node) {
      var children = node.children, d = 0;
      if (children && (n = children.length)) {
        var i = -1, n;
        while (++i < n) d = Math.max(d, depth(children[i]));
      }
      return 1 + d;
    }
    function partition(d, i) {
      var nodes = hierarchy.call(this, d, i);
      position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));
      return nodes;
    }
    partition.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return partition;
    };
    return genie_layout_hierarchyRebind(partition, hierarchy);
  };
  genie.layout.pie = function() {
    var value = Number, sort = genie_layout_pieSortByValue, startAngle = 0, endAngle = τ, padAngle = 0;
    function pie(data) {
      var n = data.length, values = data.map(function(d, i) {
        return +value.call(pie, d, i);
      }), a = +(typeof startAngle === "function" ? startAngle.apply(this, arguments) : startAngle), da = (typeof endAngle === "function" ? endAngle.apply(this, arguments) : endAngle) - a, p = Math.min(Math.abs(da) / n, +(typeof padAngle === "function" ? padAngle.apply(this, arguments) : padAngle)), pa = p * (da < 0 ? -1 : 1), sum = genie.sum(values), k = sum ? (da - n * pa) / sum : 0, index = genie.range(n), arcs = [], v;
      if (sort != null) index.sort(sort === genie_layout_pieSortByValue ? function(i, j) {
        return values[j] - values[i];
      } : function(i, j) {
        return sort(data[i], data[j]);
      });
      index.forEach(function(i) {
        arcs[i] = {
          data: data[i],
          value: v = values[i],
          startAngle: a,
          endAngle: a += v * k + pa,
          padAngle: p
        };
      });
      return arcs;
    }
    pie.value = function(_) {
      if (!arguments.length) return value;
      value = _;
      return pie;
    };
    pie.sort = function(_) {
      if (!arguments.length) return sort;
      sort = _;
      return pie;
    };
    pie.startAngle = function(_) {
      if (!arguments.length) return startAngle;
      startAngle = _;
      return pie;
    };
    pie.endAngle = function(_) {
      if (!arguments.length) return endAngle;
      endAngle = _;
      return pie;
    };
    pie.padAngle = function(_) {
      if (!arguments.length) return padAngle;
      padAngle = _;
      return pie;
    };
    return pie;
  };
  var genie_layout_pieSortByValue = {};
  genie.layout.stack = function() {
    var values = genie_identity, order = genie_layout_stackOrderDefault, offset = genie_layout_stackOffsetZero, out = genie_layout_stackOut, x = genie_layout_stackX, y = genie_layout_stackY;
    function stack(data, index) {
      if (!(n = data.length)) return data;
      var series = data.map(function(d, i) {
        return values.call(stack, d, i);
      });
      var points = series.map(function(d) {
        return d.map(function(v, i) {
          return [ x.call(stack, v, i), y.call(stack, v, i) ];
        });
      });
      var orders = order.call(stack, points, index);
      series = genie.permute(series, orders);
      points = genie.permute(points, orders);
      var offsets = offset.call(stack, points, index);
      var m = series[0].length, n, i, j, o;
      for (j = 0; j < m; ++j) {
        out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);
        for (i = 1; i < n; ++i) {
          out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);
        }
      }
      return data;
    }
    stack.values = function(x) {
      if (!arguments.length) return values;
      values = x;
      return stack;
    };
    stack.order = function(x) {
      if (!arguments.length) return order;
      order = typeof x === "function" ? x : genie_layout_stackOrders.get(x) || genie_layout_stackOrderDefault;
      return stack;
    };
    stack.offset = function(x) {
      if (!arguments.length) return offset;
      offset = typeof x === "function" ? x : genie_layout_stackOffsets.get(x) || genie_layout_stackOffsetZero;
      return stack;
    };
    stack.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      return stack;
    };
    stack.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      return stack;
    };
    stack.out = function(z) {
      if (!arguments.length) return out;
      out = z;
      return stack;
    };
    return stack;
  };
  function genie_layout_stackX(d) {
    return d.x;
  }
  function genie_layout_stackY(d) {
    return d.y;
  }
  function genie_layout_stackOut(d, y0, y) {
    d.y0 = y0;
    d.y = y;
  }
  var genie_layout_stackOrders = genie.map({
    "inside-out": function(data) {
      var n = data.length, i, j, max = data.map(genie_layout_stackMaxIndex), sums = data.map(genie_layout_stackReduceSum), index = genie.range(n).sort(function(a, b) {
        return max[a] - max[b];
      }), top = 0, bottom = 0, tops = [], bottoms = [];
      for (i = 0; i < n; ++i) {
        j = index[i];
        if (top < bottom) {
          top += sums[j];
          tops.push(j);
        } else {
          bottom += sums[j];
          bottoms.push(j);
        }
      }
      return bottoms.reverse().concat(tops);
    },
    reverse: function(data) {
      return genie.range(data.length).reverse();
    },
    "default": genie_layout_stackOrderDefault
  });
  var genie_layout_stackOffsets = genie.map({
    silhouette: function(data) {
      var n = data.length, m = data[0].length, sums = [], max = 0, i, j, o, y0 = [];
      for (j = 0; j < m; ++j) {
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
        if (o > max) max = o;
        sums.push(o);
      }
      for (j = 0; j < m; ++j) {
        y0[j] = (max - sums[j]) / 2;
      }
      return y0;
    },
    wiggle: function(data) {
      var n = data.length, x = data[0], m = x.length, i, j, k, s1, s2, s3, dx, o, o0, y0 = [];
      y0[0] = o = o0 = 0;
      for (j = 1; j < m; ++j) {
        for (i = 0, s1 = 0; i < n; ++i) s1 += data[i][j][1];
        for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {
          for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {
            s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;
          }
          s2 += s3 * data[i][j][1];
        }
        y0[j] = o -= s1 ? s2 / s1 * dx : 0;
        if (o < o0) o0 = o;
      }
      for (j = 0; j < m; ++j) y0[j] -= o0;
      return y0;
    },
    expand: function(data) {
      var n = data.length, m = data[0].length, k = 1 / n, i, j, o, y0 = [];
      for (j = 0; j < m; ++j) {
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
        if (o) for (i = 0; i < n; i++) data[i][j][1] /= o; else for (i = 0; i < n; i++) data[i][j][1] = k;
      }
      for (j = 0; j < m; ++j) y0[j] = 0;
      return y0;
    },
    zero: genie_layout_stackOffsetZero
  });
  function genie_layout_stackOrderDefault(data) {
    return genie.range(data.length);
  }
  function genie_layout_stackOffsetZero(data) {
    var j = -1, m = data[0].length, y0 = [];
    while (++j < m) y0[j] = 0;
    return y0;
  }
  function genie_layout_stackMaxIndex(array) {
    var i = 1, j = 0, v = array[0][1], k, n = array.length;
    for (;i < n; ++i) {
      if ((k = array[i][1]) > v) {
        j = i;
        v = k;
      }
    }
    return j;
  }
  function genie_layout_stackReduceSum(d) {
    return d.reduce(genie_layout_stackSum, 0);
  }
  function genie_layout_stackSum(p, d) {
    return p + d[1];
  }

  genie.svg = {};
  function genie_zero() {
    return 0;
  }
  genie.svg.arc = function() {
    var innerRadius = genie_svg_arcInnerRadius, outerRadius = genie_svg_arcOuterRadius, cornerRadius = genie_zero, padRadius = genie_svg_arcAuto, startAngle = genie_svg_arcStartAngle, endAngle = genie_svg_arcEndAngle, padAngle = genie_svg_arcPadAngle;
    function arc() {
      var r0 = Math.max(0, +innerRadius.apply(this, arguments)), r1 = Math.max(0, +outerRadius.apply(this, arguments)), a0 = startAngle.apply(this, arguments) - halfπ, a1 = endAngle.apply(this, arguments) - halfπ, da = Math.abs(a1 - a0), cw = a0 > a1 ? 0 : 1;
      if (r1 < r0) rc = r1, r1 = r0, r0 = rc;
      if (da >= τε) return circleSegment(r1, cw) + (r0 ? circleSegment(r0, 1 - cw) : "") + "Z";
      var rc, cr, rp, ap, p0 = 0, p1 = 0, x0, y0, x1, y1, x2, y2, x3, y3, path = [];
      if (ap = (+padAngle.apply(this, arguments) || 0) / 2) {
        rp = padRadius === genie_svg_arcAuto ? Math.sqrt(r0 * r0 + r1 * r1) : +padRadius.apply(this, arguments);
        if (!cw) p1 *= -1;
        if (r1) p1 = genie_asin(rp / r1 * Math.sin(ap));
        if (r0) p0 = genie_asin(rp / r0 * Math.sin(ap));
      }
      if (r1) {
        x0 = r1 * Math.cos(a0 + p1);
        y0 = r1 * Math.sin(a0 + p1);
        x1 = r1 * Math.cos(a1 - p1);
        y1 = r1 * Math.sin(a1 - p1);
        var l1 = Math.abs(a1 - a0 - 2 * p1) <= π ? 0 : 1;
        if (p1 && genie_svg_arcSweep(x0, y0, x1, y1) === cw ^ l1) {
          var h1 = (a0 + a1) / 2;
          x0 = r1 * Math.cos(h1);
          y0 = r1 * Math.sin(h1);
          x1 = y1 = null;
        }
      } else {
        x0 = y0 = 0;
      }
      if (r0) {
        x2 = r0 * Math.cos(a1 - p0);
        y2 = r0 * Math.sin(a1 - p0);
        x3 = r0 * Math.cos(a0 + p0);
        y3 = r0 * Math.sin(a0 + p0);
        var l0 = Math.abs(a0 - a1 + 2 * p0) <= π ? 0 : 1;
        if (p0 && genie_svg_arcSweep(x2, y2, x3, y3) === 1 - cw ^ l0) {
          var h0 = (a0 + a1) / 2;
          x2 = r0 * Math.cos(h0);
          y2 = r0 * Math.sin(h0);
          x3 = y3 = null;
        }
      } else {
        x2 = y2 = 0;
      }
      if (da > ε && (rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments))) > .001) {
        cr = r0 < r1 ^ cw ? 0 : 1;
        var rc1 = rc, rc0 = rc;
        if (da < π) {
          var oc = x3 == null ? [ x2, y2 ] : x1 == null ? [ x0, y0 ] : genie_geom_polygonIntersect([ x0, y0 ], [ x3, y3 ], [ x1, y1 ], [ x2, y2 ]), ax = x0 - oc[0], ay = y0 - oc[1], bx = x1 - oc[0], by = y1 - oc[1], kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2), lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
          rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
          rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
        }
        if (x1 != null) {
          var t30 = genie_svg_arcCornerTangents(x3 == null ? [ x2, y2 ] : [ x3, y3 ], [ x0, y0 ], r1, rc1, cw), t12 = genie_svg_arcCornerTangents([ x1, y1 ], [ x2, y2 ], r1, rc1, cw);
          if (rc === rc1) {
            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 0,", cr, " ", t30[1], "A", r1, ",", r1, " 0 ", 1 - cw ^ genie_svg_arcSweep(t30[1][0], t30[1][1], t12[1][0], t12[1][1]), ",", cw, " ", t12[1], "A", rc1, ",", rc1, " 0 0,", cr, " ", t12[0]);
          } else {
            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 1,", cr, " ", t12[0]);
          }
        } else {
          path.push("M", x0, ",", y0);
        }
        if (x3 != null) {
          var t03 = genie_svg_arcCornerTangents([ x0, y0 ], [ x3, y3 ], r0, -rc0, cw), t21 = genie_svg_arcCornerTangents([ x2, y2 ], x1 == null ? [ x0, y0 ] : [ x1, y1 ], r0, -rc0, cw);
          if (rc === rc0) {
            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t21[1], "A", r0, ",", r0, " 0 ", cw ^ genie_svg_arcSweep(t21[1][0], t21[1][1], t03[1][0], t03[1][1]), ",", 1 - cw, " ", t03[1], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
          } else {
            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
          }
        } else {
          path.push("L", x2, ",", y2);
        }
      } else {
        path.push("M", x0, ",", y0);
        if (x1 != null) path.push("A", r1, ",", r1, " 0 ", l1, ",", cw, " ", x1, ",", y1);
        path.push("L", x2, ",", y2);
        if (x3 != null) path.push("A", r0, ",", r0, " 0 ", l0, ",", 1 - cw, " ", x3, ",", y3);
      }
      path.push("Z");
      return path.join("");
    }
    function circleSegment(r1, cw) {
      return "M0," + r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + -r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + r1;
    }
    arc.innerRadius = function(v) {
      if (!arguments.length) return innerRadius;
      innerRadius = genie_functor(v);
      return arc;
    };
    arc.outerRadius = function(v) {
      if (!arguments.length) return outerRadius;
      outerRadius = genie_functor(v);
      return arc;
    };
    arc.cornerRadius = function(v) {
      if (!arguments.length) return cornerRadius;
      cornerRadius = genie_functor(v);
      return arc;
    };
    arc.padRadius = function(v) {
      if (!arguments.length) return padRadius;
      padRadius = v == genie_svg_arcAuto ? genie_svg_arcAuto : genie_functor(v);
      return arc;
    };
    arc.startAngle = function(v) {
      if (!arguments.length) return startAngle;
      startAngle = genie_functor(v);
      return arc;
    };
    arc.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = genie_functor(v);
      return arc;
    };
    arc.padAngle = function(v) {
      if (!arguments.length) return padAngle;
      padAngle = genie_functor(v);
      return arc;
    };
    arc.centroid = function() {
      var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - halfπ;
      return [ Math.cos(a) * r, Math.sin(a) * r ];
    };
    return arc;
  };
  var genie_svg_arcAuto = "auto";
  function genie_svg_arcInnerRadius(d) {
    return d.innerRadius;
  }
  function genie_svg_arcOuterRadius(d) {
    return d.outerRadius;
  }
  function genie_svg_arcStartAngle(d) {
    return d.startAngle;
  }
  function genie_svg_arcEndAngle(d) {
    return d.endAngle;
  }
  function genie_svg_arcPadAngle(d) {
    return d && d.padAngle;
  }
  function genie_svg_arcSweep(x0, y0, x1, y1) {
    return (x0 - x1) * y0 - (y0 - y1) * x0 > 0 ? 0 : 1;
  }
  function genie_svg_arcCornerTangents(p0, p1, r1, rc, cw) {
    var x01 = p0[0] - p1[0], y01 = p0[1] - p1[1], lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x1 = p0[0] + ox, y1 = p0[1] + oy, x2 = p1[0] + ox, y2 = p1[1] + oy, x3 = (x1 + x2) / 2, y3 = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, d2 = dx * dx + dy * dy, r = r1 - rc, D = x1 * y2 - x2 * y1, d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D)), cx0 = (D * dy - dx * d) / d2, cy0 = (-D * dx - dy * d) / d2, cx1 = (D * dy + dx * d) / d2, cy1 = (-D * dx + dy * d) / d2, dx0 = cx0 - x3, dy0 = cy0 - y3, dx1 = cx1 - x3, dy1 = cy1 - y3;
    if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
    return [ [ cx0 - ox, cy0 - oy ], [ cx0 * r1 / r, cy0 * r1 / r ] ];
  }
  function genie_svg_line(projection) {
    var x = genie_geom_pointX, y = genie_geom_pointY, defined = genie_true, interpolate = genie_svg_lineLinear, interpolateKey = interpolate.key, tension = .7;
    function line(data) {
      var segments = [], points = [], i = -1, n = data.length, d, fx = genie_functor(x), fy = genie_functor(y);
      function segment() {
        segments.push("M", interpolate(projection(points), tension));
      }
      while (++i < n) {
        if (defined.call(this, d = data[i], i)) {
          points.push([ +fx.call(this, d, i), +fy.call(this, d, i) ]);
        } else if (points.length) {
          segment();
          points = [];
        }
      }
      if (points.length) segment();
      return segments.length ? segments.join("") : null;
    }
    line.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      return line;
    };
    line.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return line;
    };
    line.defined = function(_) {
      if (!arguments.length) return defined;
      defined = _;
      return line;
    };
    line.interpolate = function(_) {
      if (!arguments.length) return interpolateKey;
      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = genie_svg_lineInterpolators.get(_) || genie_svg_lineLinear).key;
      return line;
    };
    line.tension = function(_) {
      if (!arguments.length) return tension;
      tension = _;
      return line;
    };
    return line;
  }
  genie.svg.line = function() {
    return genie_svg_line(genie_identity);
  };
  var genie_svg_lineInterpolators = genie.map({
    linear: genie_svg_lineLinear,
    "linear-closed": genie_svg_lineLinearClosed,
    step: genie_svg_lineStep,
    "step-before": genie_svg_lineStepBefore,
    "step-after": genie_svg_lineStepAfter,
    basis: genie_svg_lineBasis,
    "basis-open": genie_svg_lineBasisOpen,
    "basis-closed": genie_svg_lineBasisClosed,
    bundle: genie_svg_lineBundle,
    cardinal: genie_svg_lineCardinal,
    "cardinal-open": genie_svg_lineCardinalOpen,
    "cardinal-closed": genie_svg_lineCardinalClosed,
    monotone: genie_svg_lineMonotone
  });
  genie_svg_lineInterpolators.forEach(function(key, value) {
    value.key = key;
    value.closed = /-closed$/.test(key);
  });
  function genie_svg_lineLinear(points) {
    return points.length > 1 ? points.join("L") : points + "Z";
  }
  function genie_svg_lineLinearClosed(points) {
    return points.join("L") + "Z";
  }
  function genie_svg_lineStep(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("H", (p[0] + (p = points[i])[0]) / 2, "V", p[1]);
    if (n > 1) path.push("H", p[0]);
    return path.join("");
  }
  function genie_svg_lineStepBefore(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("V", (p = points[i])[1], "H", p[0]);
    return path.join("");
  }
  function genie_svg_lineStepAfter(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("H", (p = points[i])[0], "V", p[1]);
    return path.join("");
  }
  function genie_svg_lineCardinalOpen(points, tension) {
    return points.length < 4 ? genie_svg_lineLinear(points) : points[1] + genie_svg_lineHermite(points.slice(1, -1), genie_svg_lineCardinalTangents(points, tension));
  }
  function genie_svg_lineCardinalClosed(points, tension) {
    return points.length < 3 ? genie_svg_lineLinearClosed(points) : points[0] + genie_svg_lineHermite((points.push(points[0]), 
    points), genie_svg_lineCardinalTangents([ points[points.length - 2] ].concat(points, [ points[1] ]), tension));
  }
  function genie_svg_lineCardinal(points, tension) {
    return points.length < 3 ? genie_svg_lineLinear(points) : points[0] + genie_svg_lineHermite(points, genie_svg_lineCardinalTangents(points, tension));
  }
  function genie_svg_lineHermite(points, tangents) {
    if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {
      return genie_svg_lineLinear(points);
    }
    var quad = points.length != tangents.length, path = "", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;
    if (quad) {
      path += "Q" + (p[0] - t0[0] * 2 / 3) + "," + (p[1] - t0[1] * 2 / 3) + "," + p[0] + "," + p[1];
      p0 = points[1];
      pi = 2;
    }
    if (tangents.length > 1) {
      t = tangents[1];
      p = points[pi];
      pi++;
      path += "C" + (p0[0] + t0[0]) + "," + (p0[1] + t0[1]) + "," + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
      for (var i = 2; i < tangents.length; i++, pi++) {
        p = points[pi];
        t = tangents[i];
        path += "S" + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
      }
    }
    if (quad) {
      var lp = points[pi];
      path += "Q" + (p[0] + t[0] * 2 / 3) + "," + (p[1] + t[1] * 2 / 3) + "," + lp[0] + "," + lp[1];
    }
    return path;
  }
  function genie_svg_lineCardinalTangents(points, tension) {
    var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length;
    while (++i < n) {
      p0 = p1;
      p1 = p2;
      p2 = points[i];
      tangents.push([ a * (p2[0] - p0[0]), a * (p2[1] - p0[1]) ]);
    }
    return tangents;
  }
  function genie_svg_lineBasis(points) {
    if (points.length < 3) return genie_svg_lineLinear(points);
    var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [ x0, x0, x0, (pi = points[1])[0] ], py = [ y0, y0, y0, pi[1] ], path = [ x0, ",", y0, "L", genie_svg_lineDot4(genie_svg_lineBasisBezier3, px), ",", genie_svg_lineDot4(genie_svg_lineBasisBezier3, py) ];
    points.push(points[n - 1]);
    while (++i <= n) {
      pi = points[i];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      genie_svg_lineBasisBezier(path, px, py);
    }
    points.pop();
    path.push("L", pi);
    return path.join("");
  }
  function genie_svg_lineBasisOpen(points) {
    if (points.length < 4) return genie_svg_lineLinear(points);
    var path = [], i = -1, n = points.length, pi, px = [ 0 ], py = [ 0 ];
    while (++i < 3) {
      pi = points[i];
      px.push(pi[0]);
      py.push(pi[1]);
    }
    path.push(genie_svg_lineDot4(genie_svg_lineBasisBezier3, px) + "," + genie_svg_lineDot4(genie_svg_lineBasisBezier3, py));
    --i;
    while (++i < n) {
      pi = points[i];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      genie_svg_lineBasisBezier(path, px, py);
    }
    return path.join("");
  }
  function genie_svg_lineBasisClosed(points) {
    var path, i = -1, n = points.length, m = n + 4, pi, px = [], py = [];
    while (++i < 4) {
      pi = points[i % n];
      px.push(pi[0]);
      py.push(pi[1]);
    }
    path = [ genie_svg_lineDot4(genie_svg_lineBasisBezier3, px), ",", genie_svg_lineDot4(genie_svg_lineBasisBezier3, py) ];
    --i;
    while (++i < m) {
      pi = points[i % n];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      genie_svg_lineBasisBezier(path, px, py);
    }
    return path.join("");
  }
  function genie_svg_lineBundle(points, tension) {
    var n = points.length - 1;
    if (n) {
      var x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1, p, t;
      while (++i <= n) {
        p = points[i];
        t = i / n;
        p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);
        p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);
      }
    }
    return genie_svg_lineBasis(points);
  }
  function genie_svg_lineDot4(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  var genie_svg_lineBasisBezier1 = [ 0, 2 / 3, 1 / 3, 0 ], genie_svg_lineBasisBezier2 = [ 0, 1 / 3, 2 / 3, 0 ], genie_svg_lineBasisBezier3 = [ 0, 1 / 6, 2 / 3, 1 / 6 ];
  function genie_svg_lineBasisBezier(path, x, y) {
    path.push("C", genie_svg_lineDot4(genie_svg_lineBasisBezier1, x), ",", genie_svg_lineDot4(genie_svg_lineBasisBezier1, y), ",", genie_svg_lineDot4(genie_svg_lineBasisBezier2, x), ",", genie_svg_lineDot4(genie_svg_lineBasisBezier2, y), ",", genie_svg_lineDot4(genie_svg_lineBasisBezier3, x), ",", genie_svg_lineDot4(genie_svg_lineBasisBezier3, y));
  }
  function genie_svg_lineSlope(p0, p1) {
    return (p1[1] - p0[1]) / (p1[0] - p0[0]);
  }
  function genie_svg_lineFiniteDifferences(points) {
    var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = genie_svg_lineSlope(p0, p1);
    while (++i < j) {
      m[i] = (d + (d = genie_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
    }
    m[i] = d;
    return m;
  }
  function genie_svg_lineMonotoneTangents(points) {
    var tangents = [], d, a, b, s, m = genie_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1;
    while (++i < j) {
      d = genie_svg_lineSlope(points[i], points[i + 1]);
      if (abs(d) < ε) {
        m[i] = m[i + 1] = 0;
      } else {
        a = m[i] / d;
        b = m[i + 1] / d;
        s = a * a + b * b;
        if (s > 9) {
          s = d * 3 / Math.sqrt(s);
          m[i] = s * a;
          m[i + 1] = s * b;
        }
      }
    }
    i = -1;
    while (++i <= j) {
      s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
      tangents.push([ s || 0, m[i] * s || 0 ]);
    }
    return tangents;
  }
  function genie_svg_lineMonotone(points) {
    return points.length < 3 ? genie_svg_lineLinear(points) : points[0] + genie_svg_lineHermite(points, genie_svg_lineMonotoneTangents(points));
  }
  genie.svg.line.radial = function() {
    var line = genie_svg_line(genie_svg_lineRadial);
    line.radius = line.x, delete line.x;
    line.angle = line.y, delete line.y;
    return line;
  };
  function genie_svg_lineRadial(points) {
    var point, i = -1, n = points.length, r, a;
    while (++i < n) {
      point = points[i];
      r = point[0];
      a = point[1] - halfπ;
      point[0] = r * Math.cos(a);
      point[1] = r * Math.sin(a);
    }
    return points;
  }
  function genie_svg_area(projection) {
    var x0 = genie_geom_pointX, x1 = genie_geom_pointX, y0 = 0, y1 = genie_geom_pointY, defined = genie_true, interpolate = genie_svg_lineLinear, interpolateKey = interpolate.key, interpolateReverse = interpolate, L = "L", tension = .7;
    function area(data) {
      var segments = [], points0 = [], points1 = [], i = -1, n = data.length, d, fx0 = genie_functor(x0), fy0 = genie_functor(y0), fx1 = x0 === x1 ? function() {
        return x;
      } : genie_functor(x1), fy1 = y0 === y1 ? function() {
        return y;
      } : genie_functor(y1), x, y;
      function segment() {
        segments.push("M", interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), "Z");
      }
      while (++i < n) {
        if (defined.call(this, d = data[i], i)) {
          points0.push([ x = +fx0.call(this, d, i), y = +fy0.call(this, d, i) ]);
          points1.push([ +fx1.call(this, d, i), +fy1.call(this, d, i) ]);
        } else if (points0.length) {
          segment();
          points0 = [];
          points1 = [];
        }
      }
      if (points0.length) segment();
      return segments.length ? segments.join("") : null;
    }
    area.x = function(_) {
      if (!arguments.length) return x1;
      x0 = x1 = _;
      return area;
    };
    area.x0 = function(_) {
      if (!arguments.length) return x0;
      x0 = _;
      return area;
    };
    area.x1 = function(_) {
      if (!arguments.length) return x1;
      x1 = _;
      return area;
    };
    area.y = function(_) {
      if (!arguments.length) return y1;
      y0 = y1 = _;
      return area;
    };
    area.y0 = function(_) {
      if (!arguments.length) return y0;
      y0 = _;
      return area;
    };
    area.y1 = function(_) {
      if (!arguments.length) return y1;
      y1 = _;
      return area;
    };
    area.defined = function(_) {
      if (!arguments.length) return defined;
      defined = _;
      return area;
    };
    area.interpolate = function(_) {
      if (!arguments.length) return interpolateKey;
      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = genie_svg_lineInterpolators.get(_) || genie_svg_lineLinear).key;
      interpolateReverse = interpolate.reverse || interpolate;
      L = interpolate.closed ? "M" : "L";
      return area;
    };
    area.tension = function(_) {
      if (!arguments.length) return tension;
      tension = _;
      return area;
    };
    return area;
  }
  genie_svg_lineStepBefore.reverse = genie_svg_lineStepAfter;
  genie_svg_lineStepAfter.reverse = genie_svg_lineStepBefore;
  genie.svg.area = function() {
    return genie_svg_area(genie_identity);
  };
  genie.svg.area.radial = function() {
    var area = genie_svg_area(genie_svg_lineRadial);
    area.radius = area.x, delete area.x;
    area.innerRadius = area.x0, delete area.x0;
    area.outerRadius = area.x1, delete area.x1;
    area.angle = area.y, delete area.y;
    area.startAngle = area.y0, delete area.y0;
    area.endAngle = area.y1, delete area.y1;
    return area;
  };
  genie.svg.chord = function() {
    var source = genie_source, target = genie_target, radius = genie_svg_chordRadius, startAngle = genie_svg_arcStartAngle, endAngle = genie_svg_arcEndAngle;
    function chord(d, i) {
      var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i);
      return "M" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + "Z";
    }
    function subgroup(self, f, d, i) {
      var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) - halfπ, a1 = endAngle.call(self, subgroup, i) - halfπ;
      return {
        r: r,
        a0: a0,
        a1: a1,
        p0: [ r * Math.cos(a0), r * Math.sin(a0) ],
        p1: [ r * Math.cos(a1), r * Math.sin(a1) ]
      };
    }
    function equals(a, b) {
      return a.a0 == b.a0 && a.a1 == b.a1;
    }
    function arc(r, p, a) {
      return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + p;
    }
    function curve(r0, p0, r1, p1) {
      return "Q 0,0 " + p1;
    }
    chord.radius = function(v) {
      if (!arguments.length) return radius;
      radius = genie_functor(v);
      return chord;
    };
    chord.source = function(v) {
      if (!arguments.length) return source;
      source = genie_functor(v);
      return chord;
    };
    chord.target = function(v) {
      if (!arguments.length) return target;
      target = genie_functor(v);
      return chord;
    };
    chord.startAngle = function(v) {
      if (!arguments.length) return startAngle;
      startAngle = genie_functor(v);
      return chord;
    };
    chord.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = genie_functor(v);
      return chord;
    };
    return chord;
  };
  function genie_svg_chordRadius(d) {
    return d.radius;
  }
  genie.svg.diagonal = function() {
    var source = genie_source, target = genie_target, projection = genie_svg_diagonalProjection;
    function diagonal(d, i) {
      var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [ p0, {
        x: p0.x,
        y: m
      }, {
        x: p3.x,
        y: m
      }, p3 ];
      p = p.map(projection);
      return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
    }
    diagonal.source = function(x) {
      if (!arguments.length) return source;
      source = genie_functor(x);
      return diagonal;
    };
    diagonal.target = function(x) {
      if (!arguments.length) return target;
      target = genie_functor(x);
      return diagonal;
    };
    diagonal.projection = function(x) {
      if (!arguments.length) return projection;
      projection = x;
      return diagonal;
    };
    return diagonal;
  };
  function genie_svg_diagonalProjection(d) {
    return [ d.x, d.y ];
  }
  genie.svg.diagonal.radial = function() {
    var diagonal = genie.svg.diagonal(), projection = genie_svg_diagonalProjection, projection_ = diagonal.projection;
    diagonal.projection = function(x) {
      return arguments.length ? projection_(genie_svg_diagonalRadialProjection(projection = x)) : projection;
    };
    return diagonal;
  };
  function genie_svg_diagonalRadialProjection(projection) {
    return function() {
      var d = projection.apply(this, arguments), r = d[0], a = d[1] - halfπ;
      return [ r * Math.cos(a), r * Math.sin(a) ];
    };
  }
  genie.svg.symbol = function() {
    var type = genie_svg_symbolType, size = genie_svg_symbolSize;
    function symbol(d, i) {
      return (genie_svg_symbols.get(type.call(this, d, i)) || genie_svg_symbolCircle)(size.call(this, d, i));
    }
    symbol.type = function(x) {
      if (!arguments.length) return type;
      type = genie_functor(x);
      return symbol;
    };
    symbol.size = function(x) {
      if (!arguments.length) return size;
      size = genie_functor(x);
      return symbol;
    };
    return symbol;
  };
  function genie_svg_symbolSize() {
    return 64;
  }
  function genie_svg_symbolType() {
    return "circle";
  }
  function genie_svg_symbolCircle(size) {
    var r = Math.sqrt(size / π);
    return "M0," + r + "A" + r + "," + r + " 0 1,1 0," + -r + "A" + r + "," + r + " 0 1,1 0," + r + "Z";
  }
  var genie_svg_symbols = genie.map({
    circle: genie_svg_symbolCircle,
    cross: function(size) {
      var r = Math.sqrt(size / 5) / 2;
      return "M" + -3 * r + "," + -r + "H" + -r + "V" + -3 * r + "H" + r + "V" + -r + "H" + 3 * r + "V" + r + "H" + r + "V" + 3 * r + "H" + -r + "V" + r + "H" + -3 * r + "Z";
    },
    diamond: function(size) {
      var ry = Math.sqrt(size / (2 * genie_svg_symbolTan30)), rx = ry * genie_svg_symbolTan30;
      return "M0," + -ry + "L" + rx + ",0" + " 0," + ry + " " + -rx + ",0" + "Z";
    },
    square: function(size) {
      var r = Math.sqrt(size) / 2;
      return "M" + -r + "," + -r + "L" + r + "," + -r + " " + r + "," + r + " " + -r + "," + r + "Z";
    },
    "triangle-down": function(size) {
      var rx = Math.sqrt(size / genie_svg_symbolSqrt3), ry = rx * genie_svg_symbolSqrt3 / 2;
      return "M0," + ry + "L" + rx + "," + -ry + " " + -rx + "," + -ry + "Z";
    },
    "triangle-up": function(size) {
      var rx = Math.sqrt(size / genie_svg_symbolSqrt3), ry = rx * genie_svg_symbolSqrt3 / 2;
      return "M0," + -ry + "L" + rx + "," + ry + " " + -rx + "," + ry + "Z";
    }
  });
  genie.svg.symbolTypes = genie_svg_symbols.keys();
  var genie_svg_symbolSqrt3 = Math.sqrt(3), genie_svg_symbolTan30 = Math.tan(30 * genie_radians);
  genie_selectionPrototype.transition = function(name) {
    var id = genie_transitionInheritId || ++genie_transitionId, ns = genie_transitionNamespace(name), subgroups = [], subgroup, node, transition = genie_transitionInherit || {
      time: Date.now(),
      ease: genie_ease_cubicInOut,
      delay: 0,
      duration: 250
    };
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) genie_transitionNode(node, i, ns, id, transition);
        subgroup.push(node);
      }
    }
    return genie_transition(subgroups, ns, id);
  };
  genie_selectionPrototype.interrupt = function(name) {
    return this.each(name == null ? genie_selection_interrupt : genie_selection_interruptNS(genie_transitionNamespace(name)));
  };
  var genie_selection_interrupt = genie_selection_interruptNS(genie_transitionNamespace());
  function genie_selection_interruptNS(ns) {
    return function() {
      var lock, activeId, active;
      if ((lock = this[ns]) && (active = lock[activeId = lock.active])) {
        active.timer.c = null;
        active.timer.t = NaN;
        if (--lock.count) delete lock[activeId]; else delete this[ns];
        lock.active += .5;
        active.event && active.event.interrupt.call(this, this.__data__, active.index);
      }
    };
  }
  function genie_transition(groups, ns, id) {
    genie_subclass(groups, genie_transitionPrototype);
    groups.namespace = ns;
    groups.id = id;
    return groups;
  }
  var genie_transitionPrototype = [], genie_transitionId = 0, genie_transitionInheritId, genie_transitionInherit;
  genie_transitionPrototype.call = genie_selectionPrototype.call;
  genie_transitionPrototype.empty = genie_selectionPrototype.empty;
  genie_transitionPrototype.node = genie_selectionPrototype.node;
  genie_transitionPrototype.size = genie_selectionPrototype.size;
  genie.transition = function(selection, name) {
    return selection && selection.transition ? genie_transitionInheritId ? selection.transition(name) : selection : genie.selection().transition(selection);
  };
  genie.transition.prototype = genie_transitionPrototype;
  genie_transitionPrototype.select = function(selector) {
    var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnode, node;
    selector = genie_selection_selector(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          genie_transitionNode(subnode, i, ns, id, node[ns][id]);
          subgroup.push(subnode);
        } else {
          subgroup.push(null);
        }
      }
    }
    return genie_transition(subgroups, ns, id);
  };
  genie_transitionPrototype.selectAll = function(selector) {
    var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnodes, node, subnode, transition;
    selector = genie_selection_selectorAll(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          transition = node[ns][id];
          subnodes = selector.call(node, node.__data__, i, j);
          subgroups.push(subgroup = []);
          for (var k = -1, o = subnodes.length; ++k < o; ) {
            if (subnode = subnodes[k]) genie_transitionNode(subnode, k, ns, id, transition);
            subgroup.push(subnode);
          }
        }
      }
    }
    return genie_transition(subgroups, ns, id);
  };
  genie_transitionPrototype.filter = function(filter) {
    var subgroups = [], subgroup, group, node;
    if (typeof filter !== "function") filter = genie_selection_filter(filter);
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
          subgroup.push(node);
        }
      }
    }
    return genie_transition(subgroups, this.namespace, this.id);
  };
  genie_transitionPrototype.tween = function(name, tween) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 2) return this.node()[ns][id].tween.get(name);
    return genie_selection_each(this, tween == null ? function(node) {
      node[ns][id].tween.remove(name);
    } : function(node) {
      node[ns][id].tween.set(name, tween);
    });
  };
  function genie_transition_tween(groups, name, value, tween) {
    var id = groups.id, ns = groups.namespace;
    return genie_selection_each(groups, typeof value === "function" ? function(node, i, j) {
      node[ns][id].tween.set(name, tween(value.call(node, node.__data__, i, j)));
    } : (value = tween(value), function(node) {
      node[ns][id].tween.set(name, value);
    }));
  }
  genie_transitionPrototype.attr = function(nameNS, value) {
    if (arguments.length < 2) {
      for (value in nameNS) this.attr(value, nameNS[value]);
      return this;
    }
    var interpolate = nameNS == "transform" ? genie_interpolateTransform : genie_interpolate, name = genie.ns.qualify(nameNS);
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }
    function attrTween(b) {
      return b == null ? attrNull : (b += "", function() {
        var a = this.getAttribute(name), i;
        return a !== b && (i = interpolate(a, b), function(t) {
          this.setAttribute(name, i(t));
        });
      });
    }
    function attrTweenNS(b) {
      return b == null ? attrNullNS : (b += "", function() {
        var a = this.getAttributeNS(name.space, name.local), i;
        return a !== b && (i = interpolate(a, b), function(t) {
          this.setAttributeNS(name.space, name.local, i(t));
        });
      });
    }
    return genie_transition_tween(this, "attr." + nameNS, value, name.local ? attrTweenNS : attrTween);
  };
  genie_transitionPrototype.attrTween = function(nameNS, tween) {
    var name = genie.ns.qualify(nameNS);
    function attrTween(d, i) {
      var f = tween.call(this, d, i, this.getAttribute(name));
      return f && function(t) {
        this.setAttribute(name, f(t));
      };
    }
    function attrTweenNS(d, i) {
      var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));
      return f && function(t) {
        this.setAttributeNS(name.space, name.local, f(t));
      };
    }
    return this.tween("attr." + nameNS, name.local ? attrTweenNS : attrTween);
  };
  genie_transitionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.style(priority, name[priority], value);
        return this;
      }
      priority = "";
    }
    function styleNull() {
      this.style.removeProperty(name);
    }
    function styleString(b) {
      return b == null ? styleNull : (b += "", function() {
        var a = genie_window(this).getComputedStyle(this, null).getPropertyValue(name), i;
        return a !== b && (i = genie_interpolate(a, b), function(t) {
          this.style.setProperty(name, i(t), priority);
        });
      });
    }
    return genie_transition_tween(this, "style." + name, value, styleString);
  };
  genie_transitionPrototype.styleTween = function(name, tween, priority) {
    if (arguments.length < 3) priority = "";
    function styleTween(d, i) {
      var f = tween.call(this, d, i, genie_window(this).getComputedStyle(this, null).getPropertyValue(name));
      return f && function(t) {
        this.style.setProperty(name, f(t), priority);
      };
    }
    return this.tween("style." + name, styleTween);
  };
  genie_transitionPrototype.text = function(value) {
    return genie_transition_tween(this, "text", value, genie_transition_text);
  };
  function genie_transition_text(b) {
    if (b == null) b = "";
    return function() {
      this.textContent = b;
    };
  }
  genie_transitionPrototype.remove = function() {
    var ns = this.namespace;
    return this.each("end.transition", function() {
      var p;
      if (this[ns].count < 2 && (p = this.parentNode)) p.removeChild(this);
    });
  };
  genie_transitionPrototype.ease = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].ease;
    if (typeof value !== "function") value = genie.ease.apply(genie, arguments);
    return genie_selection_each(this, function(node) {
      node[ns][id].ease = value;
    });
  };
  genie_transitionPrototype.delay = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].delay;
    return genie_selection_each(this, typeof value === "function" ? function(node, i, j) {
      node[ns][id].delay = +value.call(node, node.__data__, i, j);
    } : (value = +value, function(node) {
      node[ns][id].delay = value;
    }));
  };
  genie_transitionPrototype.duration = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].duration;
    return genie_selection_each(this, typeof value === "function" ? function(node, i, j) {
      node[ns][id].duration = Math.max(1, value.call(node, node.__data__, i, j));
    } : (value = Math.max(1, value), function(node) {
      node[ns][id].duration = value;
    }));
  };
  genie_transitionPrototype.each = function(type, listener) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 2) {
      var inherit = genie_transitionInherit, inheritId = genie_transitionInheritId;
      try {
        genie_transitionInheritId = id;
        genie_selection_each(this, function(node, i, j) {
          genie_transitionInherit = node[ns][id];
          type.call(node, node.__data__, i, j);
        });
      } finally {
        genie_transitionInherit = inherit;
        genie_transitionInheritId = inheritId;
      }
    } else {
      genie_selection_each(this, function(node) {
        var transition = node[ns][id];
        (transition.event || (transition.event = genie.dispatch("start", "end", "interrupt"))).on(type, listener);
      });
    }
    return this;
  };
  genie_transitionPrototype.transition = function() {
    var id0 = this.id, id1 = ++genie_transitionId, ns = this.namespace, subgroups = [], subgroup, group, node, transition;
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        if (node = group[i]) {
          transition = node[ns][id0];
          genie_transitionNode(node, i, ns, id1, {
            time: transition.time,
            ease: transition.ease,
            delay: transition.delay + transition.duration,
            duration: transition.duration
          });
        }
        subgroup.push(node);
      }
    }
    return genie_transition(subgroups, ns, id1);
  };
  function genie_transitionNamespace(name) {
    return name == null ? "__transition__" : "__transition_" + name + "__";
  }
  function genie_transitionNode(node, i, ns, id, inherit) {
    var lock = node[ns] || (node[ns] = {
      active: 0,
      count: 0
    }), transition = lock[id], time, timer, duration, ease, tweens;
    function schedule(elapsed) {
      var delay = transition.delay;
      timer.t = delay + time;
      if (delay <= elapsed) return start(elapsed - delay);
      timer.c = start;
    }
    function start(elapsed) {
      var activeId = lock.active, active = lock[activeId];
      if (active) {
        active.timer.c = null;
        active.timer.t = NaN;
        --lock.count;
        delete lock[activeId];
        active.event && active.event.interrupt.call(node, node.__data__, active.index);
      }
      for (var cancelId in lock) {
        if (+cancelId < id) {
          var cancel = lock[cancelId];
          cancel.timer.c = null;
          cancel.timer.t = NaN;
          --lock.count;
          delete lock[cancelId];
        }
      }
      timer.c = tick;
      genie_timer(function() {
        if (timer.c && tick(elapsed || 1)) {
          timer.c = null;
          timer.t = NaN;
        }
        return 1;
      }, 0, time);
      lock.active = id;
      transition.event && transition.event.start.call(node, node.__data__, i);
      tweens = [];
      transition.tween.forEach(function(key, value) {
        if (value = value.call(node, node.__data__, i)) {
          tweens.push(value);
        }
      });
      ease = transition.ease;
      duration = transition.duration;
    }
    function tick(elapsed) {
      var t = elapsed / duration, e = ease(t), n = tweens.length;
      while (n > 0) {
        tweens[--n].call(node, e);
      }
      if (t >= 1) {
        transition.event && transition.event.end.call(node, node.__data__, i);
        if (--lock.count) delete lock[id]; else delete node[ns];
        return 1;
      }
    }
    if (!transition) {
      time = inherit.time;
      timer = genie_timer(schedule, 0, time);
      transition = lock[id] = {
        tween: new genie_Map(),
        time: time,
        timer: timer,
        delay: inherit.delay,
        duration: inherit.duration,
        ease: inherit.ease,
        index: i
      };
      inherit = null;
      ++lock.count;
    }
  }
 
  console.log("asdsadsad");
  if (typeof define === "function" && define.amd) this.genie = genie, define(genie); else if (typeof module === "object" && module.exports) module.exports = genie; else this.genie = genie;
}();