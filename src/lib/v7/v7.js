const https = require('https');
const SportApi = require('../sport-api');

class V7 extends SportApi {
  constructor(apiKey, accessLevel, testLeague) {
    super(apiKey, accessLevel, testLeague);
    this.version = 7;
    this.league = 'ncaafb';
  }

  getWeeklySchedule(params, callback) {
    const pathParams = this.getYearSeasonWeekParams(params);
    const path = `/${pathParams.year}/${pathParams.season}/${pathParams.week}/schedule.xml`;
    return this.getResource(path, callback);

  }

  getExtendedBoxscore(params, callback) {
    const path = `/games/${params.gameId}/extended-boxscore.xml`;
    return this.getResource(path, callback);
  }

  getPlayByPlay(params, callback) {
    const path = `/games/${params.gameId}/pbp.xml`;
    return this.getResource(path, callback);
  }

  getRankings(params, callback) {
    const pathParams = this.getYearWeekParams(params)[0];
    const path = `/polls/AP25/${pathParams.year}/${pathParams.week}/rankings.xml`;
    return this.getResource(path, callback);
  }

  getCfpRankings(params, callback) {
    const pathParams = this.getYearWeekParams(params)[0];
    const path = `/polls/CFP25/${pathParams.year}/${pathParams.week}/rankings.xml`;
    return this.getResource(path, callback);
  }

  getYearSeasonWeekParams(params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }
    if (!params) {
      params = {};
    }
    if (!params.year) {
      params.year = new Date().getFullYear();
    }
    if (!params.season) {
      params.season = 'REG';
    }
    if (!params.week) {
      params.week = 1;
    }
    return params;
  };

  getYearWeekParams(params, callback) {
    var seasonWeek, week;
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }
    if (!params) {
      params = {};
    }
    if (!params.week) {
      week = new Date();
      week.setHours(0, 0, 0);
      week.setDate(week.getDate() + 1 - (week.getDay() || 7));
      week = Math.ceil((((week - new Date(week.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
      if (week < 10) {
        seasonWeek = (week + 52) - 34;
      } else if (week < 35) {
        seasonWeek = 1;
      } else {
        seasonWeek = week - 34;
      }
      params.week = seasonWeek;
    }
    if (!params.year) {
      if (week < 10) {
        params.year = new Date().getFullYear() - 1;
      }
      if (week >= 10) {
        params.year = new Date().getFullYear();
      }
    }
    return [params];
  };

  getResource(path, callback) {
    const options = {
      hostname: this.domain,
      path: `/${this.league}-${this.accessLevel}${this.version}${path}?api_key=${this.apiKey}`,
    };
    return this.performHttpGet(options, callback);
    // return https.get(options, (res) => {
    //   const { statusCode } = res;
    //   const contentType = res.headers['content-type'];
    //   let error;
    //   let parser;
    //   if (statusCode !== 200) {
    //     error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
    //   }
    //   if (/^application\/json/.test(contentType)) {
    //     parser = 'json';
    //   }
    //   else if (/^text\/xml/.test(contentType)) {
    //     parser = 'xml';
    //   } else {
    //     error = new Error('Invalid content-type.\n' + `Received ${contentType}`);
    //   }
    //   if (error) {
    //     console.error(error.message);
    //     // Consume response data to free up memory
    //     res.resume();
    //     return callback(error.message);
    //   }
    //
    //   res.setEncoding('utf8');
    //   let rawData = '';
    //   res.on('data', (chunk) => { rawData += chunk; });
    //   res.on('end', () => {
    //     try {
    //       if (parser === 'json') {
    //         return callback(null, JSON.parse(rawData));
    //       }
    //       else {
    //         return this.parseXml(rawData, callback);
    //       }
    //     } catch (e) {
    //       console.error(e.message);
    //       return callback(e.message);
    //     }
    //   });
    // }).on('error', (e) => {
    //   console.error(`Got error: ${e.message}`);
    //   return callback(e.message);
    // });
  }
}

module.exports = V7;
