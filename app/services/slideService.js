'use strict';

module.exports = function(
    presentationFactory
  ) {

  // used for changing slideNumber after loading, editing, and deleting slides
  const setSlideNumber = (slideNumber, presentationId, token) => {
    console.log('slide number', slideNumber);
    let presentationObj = {presentation: {current_slide: slideNumber}};
    presentationFactory.editPresentation(presentationObj, presentationId, token)
    .catch(error => console.log(error));
  };

  return {setSlideNumber};

};