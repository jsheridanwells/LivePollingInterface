'use strict';

module.exports = function(
  $scope,
  $routeParams,
  $window,
  $timeout,
  api,
  presentationFactory,
  userFactory,
  responseTallyService
) {
  let ActionCable = require('../../lib/node_modules/actioncable/lib/assets/compiled/action_cable.js');
  let currentUserToken = userFactory.getCurrentUserToken();

  $scope.currentPresentation = {};
  $scope.responsePercentageArr = [];

  const showPresentation = () => {
    presentationFactory.getPresentation($routeParams.presentationId, currentUserToken)
    .then(data => {
      $scope.currentPresentation = data.presentation;
      $scope.responsePercentageArr = responseTallyService.tallyResponses($scope.currentPresentation.polls[$scope.currentPresentation.current_slide].items);

      let cable = ActionCable.createConsumer(api.ws);
      cable.subscriptions.create({
        channel: 'ResponseChannel',
        presentation_id: $routeParams.presentationId
      }, {
        received: (responses) => {
          $scope.responsePercentageArr = responseTallyService.tallySocketResponses(responses.data);
          $timeout();
        }
      });

    })
    .catch(error => console.log(error));
  };

  $scope.broadcast = () => {
    presentationFactory.toggleBroadcasting($scope.currentPresentation.id, currentUserToken)
    .then(data => {
      $scope.currentPresentation = data.presentation;
      showPresentation();
    })
    .catch(error => console.log(error));
  };

  $scope.nextSlide = () => {
    presentationFactory.nextSlide($scope.currentPresentation.id, currentUserToken)
    .then(data => {
      $scope.currentPresentation = data.presentation;
      $scope.responsePercentageArr = responseTallyService.tallyResponses($scope.currentPresentation.polls[$scope.currentPresentation.current_slide].items);
    })
    .catch(error => console.log(error));
  };

  $scope.prevSlide = () => {
    presentationFactory.prevSlide($scope.currentPresentation.id, currentUserToken)
    .then(data => {
      $scope.currentPresentation = data.presentation;
      $scope.responsePercentageArr = responseTallyService.tallyResponses($scope.currentPresentation.polls[$scope.currentPresentation.current_slide].items);
    })
    .catch(error => console.log(error));
  };

  $scope.$on('$viewContentLoaded', () => {
    showPresentation();
  });

};
