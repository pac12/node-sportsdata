V7 = require './v7'

class NCAAMBv7 extends V7
  league: 'ncaamb'

  getYearWeekParams: (params, callback) ->
    if typeof params is 'function'
      callback = params
      params = {}
    if not params
      params = {}
    if not params.week
      week = new Date()
      week.setHours(0,0,0)
      week.setDate(week.getDate()+1-(week.getDay()||7))
      week = Math.ceil((((week-new Date(week.getFullYear(),0,1))/8.64e7)+1)/7)
      if week < 10
        seasonWeek = (week + 52) - 34
      else if week < 35
        seasonWeek = 1
      else
        seasonWeek = week - 34
      params.week = seasonWeek

    if not params.year
      now = new Date()
      year = now.getFullYear()
      start = new Date(now.getFullYear(),0,0)
      diff = now - start
      oneDay = 1000 * 60 * 60 * 24
      day = Math.floor(diff / oneDay)
      if day > 180
        params.year = year
      else
        params.year = year - 1
    if not params.poll_type
      params.poll_type = 'AP25'

    [params]


module.exports = NCAAMBv7
