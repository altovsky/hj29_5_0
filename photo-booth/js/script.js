'use strict';

const app = document.querySelector('.app'),
  list = document.querySelector('.list'),
  controls = app.querySelector('.controls'),
  shot = document.getElementById('take-photo'),
  error = document.getElementById('error-message'),
  video = document.createElement('video'),
  canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d'),
  audioPlayer = document.createElement('audio');

app.appendChild(video);
audioPlayer.setAttribute('src','./audio/click.mp3');
// document.querySelector('main').appendChild(audioPlayer);

function createElement(tagName, attributes, children) {
  const element = document.createElement(tagName);

  if (attributes instanceof Object) {
    Object.keys(attributes).forEach(el => {
      element.setAttribute(el, attributes[el])
    });
  }

  if (typeof children === 'string') {
    element.textContent = children;
  } else if (children instanceof Array) {
    children.forEach(child => element
      .appendChild(child));
  }

  return element;
}

function getPic(photo) {
  return createElement('figure', null, [
    createElement('img', {src: photo}),
    createElement('figcaption', null, [
      createElement('a', {href: photo, download: 'shot.png'}, [
        createElement('i', {class: 'material-icons'}, 'file_download')
      ]),
      createElement('a', null, [
        createElement('i', {class: 'material-icons'}, 'file_upload')
      ]),
      createElement('a', null, [
        createElement('i', {class: 'material-icons'}, 'delete')
      ])
    ])
  ])
}

function getBlob(dataURI) {
  const mimeType = dataURI.split(',')[0].split(':')[1].split(';')[0],
    array = [],
    decoded = atob(dataURI.split(',')[1]);

  for (let i = 0; i < decoded.length; i++) {
    array.push(decoded.charCodeAt(i));
  }

  return new Blob([new Uint8Array(array)], { type: mimeType });
}

function getAction(event) {
  const actionType = event.target.innerText;
  const figure = event.target.closest('figure');

  if (actionType !== 'file_download') {
    event.preventDefault();

    switch (actionType) {
      case 'file_upload' :
        const image = figure.querySelector('img');
        upload(image)
          .then(res => {
            if (200 <= res.status && res.status < 300) {
              event.target.parentNode.style.visibility = 'hidden';
            }
          })
          .catch(err => {
            error.style.display = 'block';
            error.textContent = err;
          });
        break;
      case 'delete' :
        figure.remove();
        break;
    }
  } else {
    event.target.parentNode.style.visibility = 'hidden';
  }
}

function getPhoto(video) {
  setTimeout(() => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const data = canvas.toDataURL(),
      pic = getPic(data);
    pic.querySelectorAll('a').forEach(item => {
      item.addEventListener('click', getAction);
    });
    list.prepend(pic);
  }, 100)
}

function upload(photo) {
  const data = new FormData();
  const blob = getBlob(photo.src);
  data.append('image', blob);
  return fetch('https://neto-api.herokuapp.com/photo-booth', {
    method: 'POST',
    body: data
  });
}

navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then(stream => {
    video.srcObject = stream;
    video.play();
    controls.style.display = 'flex';
    shot.addEventListener('click', () => {
      audioPlayer.play();
      getPhoto(video);
    });
  })
  .catch(err => {
    error.style.display = 'block';
    error.textContent = err;
  });
