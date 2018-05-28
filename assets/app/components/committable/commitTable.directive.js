/**
 * @author v.lugovsky
 * created on 23.12.2015
 */
(function () {
  'use strict';

  /**
   * Includes basic panel layout inside of current element.
   */
  angular.module('reliablyMe.rating').directive('baPanel', baPanel);

  /** @ngInject */
  function baPanel(baPanel) {
    return angular.extend({}, baPanel, {
      template: function(el, attrs) {
        var res = '<div  class="panel ' + ' full-invisible ' + (attrs.baPanelClass || '');
        res += '" zoom-in ' +  '>';
        res += baPanel.template(el, attrs);
        res += '</div>';
        return res;
      }
    });
  }
})();
