/**
 * @author v.lugovsky
 * created on 23.12.2015
 */
(function () {
  'use strict';

  /**
   * Includes basic panel layout inside of current element.
   */
  angular.module('reliablyMe.rating').directive('commitTable', commitTable);

  /** @ngInject */
  function commitTable(commitTable) {
    return angular.extend({}, commitTable, {
      template: function(el, attrs) {
        var res = '<div  class="panel ' + ' full-invisible ' + (attrs.commitTableClass || '');
        res += '" zoom-in ' +  '>';
        res += commitTable.template(el, attrs);
        res += '</div>';
        return res;
      }
    });
  }
})();
