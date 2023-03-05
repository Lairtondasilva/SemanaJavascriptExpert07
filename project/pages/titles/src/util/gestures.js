const { GestureDescription, Finger, FingerCurl } = window.fp;
  
const ScrollDown = new GestureDescription('scroll-down'); // ✊️
const ScrollUp = new GestureDescription('scroll-up'); // 🖐
const ClickGesture = new GestureDescription('click'); // 👈

  
// scrollDown
// -----------------------------------------------------------------------------
  
// thumb: half curled
// accept no curl with a bit lower confidence
ScrollDown.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
ScrollDown.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

// all other fingers: curled
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    ScrollDown.addCurl(finger, FingerCurl.FullCurl, 1.0);
}


// scrollUp
// -----------------------------------------------------------------------------
  
// no finger should be curled
for(let finger of Finger.all) {
    ScrollUp.addCurl(finger, FingerCurl.NoCurl, 1.0);
}


// ClickGesture
//------------------------------------------------------------------------------
  
// index and middle finger: stretched out
// Click
// -----------------------------------------------------------------------------
ClickGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.8)

ClickGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
ClickGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.4)

ClickGesture.addCurl(Finger.Middle, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 0.9)

ClickGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 0.9)

ClickGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 0.9)

const knownGestures = [
    ScrollDown, 
    ScrollUp, 
    ClickGesture
]

const gestureStrings = {
    "scroll-down": '✊️',
    "scroll-up": '🖐',
    "click": '👈'
}

export {
    knownGestures,
    gestureStrings
}