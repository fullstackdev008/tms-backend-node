/**
 * Pug helper model file
 *
 * @package   backend/src/models/mail
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var pug = require('pug')

/**
 * Function that convert .pug to html content
 *
 * @author  DongTuring <dong@turing.com>
 * @param   string relativeTemplatePath
 * @param   object data
 * @return  object if success returns object else returns message.
 */
exports.compile = function(relativeTemplatePath, data, next){
  var absoluteTemplatePath = __dirname + '/../../views/' + relativeTemplatePath + '.pug';
  pug.renderFile(absoluteTemplatePath, data, function(err, compiledTemplate){
    if(err){
      throw new Error('Problem compiling template(double check relative template path): ' + relativeTemplatePath)
    }
    //console.log('[INFO] COMPILED TEMPLATE: ', compiledTemplate)
    next(compiledTemplate)
  })
}