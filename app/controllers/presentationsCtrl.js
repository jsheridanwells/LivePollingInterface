'use strict';

module.exports = function(
    $scope,
    $window,
    $routeParams,
    userFactory,
    presentationFactory
  ) {

  // holds current user information
  $scope.currentUser = userFactory.getCurrentUser();

  // holds authtoken to pass into api calls
  let currentUserToken = userFactory.getCurrentUserToken();

  // holds array of all presentations created by current user
  $scope.presentations = [];

  // shows loading animation if true
  $scope.loading = true;

  // calls get /presentations presentations#show endpoint
  // takes authorization token to pass to api call
  const getAllPresentations = () => {
    window.setTimeout(() => {
      presentationFactory.getAllPresentations(currentUserToken)
      .then(presentations => {
        $scope.presentations = presentations.presentations;
        $scope.loading = false;
      })
      .catch(error => {
        if (error.status === 401) {
          $window.location.href = '#!/login';
        }
      });
    },1000);
  };

  // takes id of presentation to destroy and user auth token
  // calls delete presentations/:id #destroy endpoint
  $scope.deletePresentation = (presentationId) => {
    presentationFactory.deletePresentation(presentationId, currentUserToken)
    .then(data => getAllPresentations())
    .catch(error => console.log(error));
  };

  // loads current presentation data when view loads
  getAllPresentations();

};
