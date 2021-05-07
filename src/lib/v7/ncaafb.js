const V7 = require('./v7');

class NCAAFBv7 extends V7 {
  constructor(apiKey, accessLevel, testLeague) {
    super(apiKey, accessLevel, testLeague);
  }

}

module.exports = NCAAFBv7;
