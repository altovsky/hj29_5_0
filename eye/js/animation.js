'use strict';

const orb = document.querySelector('.big-book__eye'),
  pupil = document.querySelector('.big-book__pupil');

window.addEventListener('mousemove', event => {
  const bodySize = document.body.getBoundingClientRect(),
    windowSize = {
      x: window.innerWidth,
      y: document.documentElement.clientHeight
    },
    orbBounds = orb.getBoundingClientRect(),
    orbSize = {
      width: orbBounds.width,
      height: orbBounds.height
    },
    orbCentrum = {
      x: ( orbBounds.left - bodySize.left ) + ( orbSize.width / 2 ),
      y: ( orbBounds.top - bodySize.top ) + ( orbSize.height / 2 )
    },
    mousePos = {
      x: event.pageX,
      y: event.pageY
    };

  function getPosition(axis) {
    const remain = mousePos[axis] - orbCentrum[axis];

    if (remain === 0) {
      return 0
    }

    const range = {
        from: ( axis === 'x' ) ? -orbCentrum[axis] : ( orbBounds.top + ( orbSize.height / 2 ) ),
        to: ( axis === 'x' ) ? windowSize[axis] - orbCentrum[axis] : windowSize[axis] - ( orbBounds.bottom - ( orbSize.height / 2 ) )
      },
      relPos = {
        neg: ( axis === 'x' ) ? (-( remain / range.from ) * 100 ) : ( ( remain / range.from ) * 100 ),
        pos: ( ( remain / range.to ) * 100 )
      };

    return (remain < 0) ? relPos.neg : relPos.pos;
  }

  const relativePupilX =  getPosition('x'),
    relativePupilY =  getPosition('y'),

    getSize = function () {
      const xAxis = relativePupilX * Math.sign(relativePupilX),
        yAxis = relativePupilY * Math.sign(relativePupilY),
        size = ((100 - ((xAxis + yAxis) / 2)) * 0.03);

      return size >= 1 ? size : 1;
    };

  pupil.style.setProperty('--pupil-x', `${relativePupilX * 0.3}px`);
  pupil.style.setProperty('--pupil-y', `${relativePupilY * 0.3}px`);
  pupil.style.setProperty('--pupil-size', getSize());
});
