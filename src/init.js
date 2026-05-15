(function () {
  var el = document.getElementById("pacman");

  if (Modernizr.canvas && Modernizr.localstorage) {
    window.setTimeout(function () { PACMAN.init(el, "./"); }, 0);
  } else {
    var msg = document.createElement("span");
    msg.textContent = "Sorry, needs a decent browser";
    var small = document.createElement("small");
    small.textContent = "(firefox 3.6+, Chrome 4+, Opera 10+ and Safari 4+)";
    el.appendChild(msg);
    el.appendChild(document.createElement("br"));
    el.appendChild(small);
  }
}());
