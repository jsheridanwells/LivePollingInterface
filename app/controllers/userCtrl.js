'use strict';

module.exports = function(
  $scope,
  $window,
  userFactory,
  errorService
) {

  // values filled for easy login,
  // delete values on deploy
  //creates model for holding form data for creating new user
  $scope.user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  };

  $scope.loginError = false;
  $scope.errors = {};

  // posts user data to db endpoint post 'signup' 'users#create'
  // calls login() function on return to generate auth token for user
  $scope.signUp = () => {
    userFactory.signUp($scope.user)
    .then(response => $scope.logIn())
    .catch(error => {
      $scope.loginError = true;
      $scope.errors = errorService.renderErrors(error.data);
      console.log('$scope.errors ', $scope.errors);
    });
  };

  // takes email and password from user model
  // calls post 'authenticate' 'authentication#authenticate' endpoint
  // redirects to /presentations #index view
  $scope.logIn = () => {
    userFactory.logIn($scope.user).
    then(userData => {
      $window.location.href = '#!/presentations';
    })
    .catch(() => $scope.loginError = true);
  };

  // destroys current auth token
  $scope.logOut = () => {
    userFactory.logOut()
    .then(() => $window.location.href = '/')
    .catch((error => console.log(error)));
  };

};
