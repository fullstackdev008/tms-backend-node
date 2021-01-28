/**
 * IP to location model file
 *
 * @package   backend/src/models
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var ip2Location = require('ip2location-nodejs')
var lib  = require('../constants/lib')

var ip2LocationModel = {
  getLocationInfo: getLocationInfo
}

/**
 * Function that returns location info by IP
 *
 * @author  WangTuring <wangwang@turing.com>
 * @param   object  ip address
 * @return  object  location info
 */
function getLocationInfo(ip) {
  ip2Location.IP2Location_init(lib.IP2LOCATION_PATH)

  let location = {
    country: ip2Location.IP2Location_get_country_long(ip),
    region: ip2Location.IP2Location_get_region(ip),
    city: ip2Location.IP2Location_get_city(ip)
  }

  return location
}

module.exports = ip2LocationModel
