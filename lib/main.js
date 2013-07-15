let {Cc, Ci} = require("chrome");
let Prefs = require("sdk/simple-prefs");
let HotKey = require("sdk/hotkeys").Hotkey;

// HotKey objects currently in use.
let shortcuts = [];
// Valid modifier keys for pref validation.
let modifiers = {
  shift: 1,
  alt: 1,
  meta: 1,
  control: 1
};
let defaultModifier = "control";


function bindKeys() {
  if (shortcuts.length > 0)
    cleanup();

  let modifier = Prefs.prefs["modifier"];
  if (!modifier.split("-").every(function(k) k in modifiers))
    modifier = defaultModifier;

  for (let i = 1; i < 10; i++) {
    let combo = modifier + "-" + i;
    shortcuts.push(HotKey({combo: combo, onPress: jumpTo(i)}));
  }
}

function cleanup() {
  shortcuts.forEach(function(k) k.destroy());
  shortuts = [];
}

function jumpTo(i) {
  return function() {
    let wm = Cc["@mozilla.org/appshell/window-mediator;1"]
               .getService(Ci.nsIWindowMediator);
    let chromeWindow = wm.getMostRecentWindow("navigator:browser");
    let items = Array.slice(chromeWindow.document
                            .querySelectorAll("#PlacesToolbarItems > .bookmark-item"));
    if (i <= items.length)
      items[i - 1].click();
  }
}

exports.main = function() {
  Prefs.on("modifier", bindKeys);
  bindKeys();
}

exports.onUnload = function(reason) {
  if (reason != "shutdown")
    cleanup();
}
