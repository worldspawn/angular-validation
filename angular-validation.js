(function () {
  'use strict';

  var module = angular.module('validation', []);

  module.factory('Validator', function () {
    return validation.Validator;
  })

  module.factory('ValidatorRuleComponent', function () {
    return validation.ValidatorRuleComponent;
  });

  module.factory('ValidatorRule', function () {
    return validation.ValidatorRule;
  });

  //need to point a form at a model and have it read the rules, attach a validator into the angular pipeline
  module.directive('validationTarget', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        var scopePath = attrs.ngModel.split('.');
        var targetExpression = scopePath.slice(0, scopePath.length - 1).join('.');
        var targetField = scopePath.slice(scopePath.length - 1).join('');
        var validationScope = scope.$eval(targetExpression);//this is the object, we're expecting to find $$validator in the prototype
        var validator = validationScope.$$validator;

        if (!validator) {
          return;
        }

        var ruleSet = validator.rules[targetField];
        if (!ruleSet) {
          return;
        }

        var components = ruleSet.components;
        for (var i = 0; i < components.length; i++) {
          var component = components[i];
          var name = component.name;

          ctrl.$validators[name] = function (modelValue, viewValue) {
            var result = component.run(validationScope, viewValue);
            return !result.$error;
          }
        }
      }
    };
  });
})();