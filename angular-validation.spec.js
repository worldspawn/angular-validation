(function () {
  'use strict';

  describe('validation', function () {
    var resources = createResources();

    beforeEach(module('validation'));
    beforeEach(function () {
      var m = angular.module('validation');
      m.factory('UserCreate', resources.userConstructorFactory);
      m.factory('Address', resources.addressConstructorFactory);
    });

    it ('should inject ValidatorRuleComponent', inject(function (ValidatorRuleComponent) {
      expect(ValidatorRuleComponent instanceof Function).toBe(true);
    }));

    it ('should inject ValidatorRule', inject(function (ValidatorRule) {
      expect(ValidatorRule instanceof Function).toBe(true);
    }));

    it ('should inject Validator', inject(function (Validator) {
      expect(Validator instanceof Function).toBe(true);
    }));

    describe('for a form', function () {
      it('should indicate username notEmpty has failed validation then pass after a value is entered', inject(function ($controller, $compile, $rootScope, UserCreate) {
        var user = new UserCreate();
        var html = '<form name="form" novalidate><input type="text" name="username" ng-model="user.username" validation-target /></form>';
        var form = angular.element(html);
        var scope = $rootScope.$new();
        scope.user = user;
        form = $compile(form)(scope);

        scope.$digest();
        expect(scope.form.username.$error.notEmpty).toBe(true);
        user.username = 'username';
        scope.$digest();
        expect(scope.form.username.$error.notEmpty).toBeUndefined();
      }));

      describe('for nested model validation', function () {
        it('should indicate line of the users address has failed then pass after a value is entered', inject(function ($controller, $compile, $rootScope, UserCreate) {
          var user = new UserCreate();
          var html = '<form name="form" novalidate><input type="text" name="username" ng-model="user.username" validation-target /><input type="text" name="address.line1" ng-model="user.address.line1" validation-target /></form>';
          var form = angular.element(html);
          var scope = $rootScope.$new();
          scope.user = user;
          form = $compile(form)(scope);

          scope.$digest();

          expect(scope.form['address.line1'].$error.notEmpty).toBe(true);
          user.address.line1 = 'line1';
          scope.$digest();
          expect(scope.form['address.line1'].$error.notEmpty).toBeUndefined();
        }));
      });
    });
  });
})();
