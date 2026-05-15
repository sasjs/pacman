var Modernizr = (function () {
  var audio = document.createElement('audio');
  var audioTypes = !!audio.canPlayType ? {
    ogg: audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
    mp3: audio.canPlayType('audio/mpeg;').replace(/^no$/, '')
  } : false;

  var localStorageOk = false;
  try {
    localStorage.setItem('_d', '1');
    localStorage.removeItem('_d');
    localStorageOk = true;
  } catch (e) {}

  return {
    canvas: !!document.createElement('canvas').getContext,
    localstorage: localStorageOk,
    audio: audioTypes
  };
}());
