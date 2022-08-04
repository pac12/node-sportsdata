(function() {
  var NCAAFBv7, V7, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  V7 = require('./v7');

  NCAAFBv7 = (function(_super) {
    __extends(NCAAFBv7, _super);

    function NCAAFBv7() {
      _ref = NCAAFBv7.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NCAAFBv7.prototype.league = 'ncaafb';

    return NCAAFBv7;

  })(V7);

  module.exports = NCAAFBv7;

}).call(this);
