/*
DO NOT EDIT Example.js -- this file is ignored. It just an example of all available functions.

This file is run in the Duktape Javascript engine which supports JavaScript ES5

To create a controller, make a copy of this file and place it in the User folder. User
controllers with the same name will override factory controllers. Then change the appropriate 
values and implement the appropriate functions. You can use any on the functions in the Tracktion
namespace like keyboard shortcuts. Or you can use the following global functions.
You should prefer global functions over Tracktion.* since global functions have a view of the
current Edit based on the current bank offset. If you choose to interact with Tracktion.* 
you must apply the bank offset yourself and check for safe recording, so you don't accidentally
damage the users recording.

This file is hot reloaded when you make changes, so you can see your changes in real time 
as you work. Call Tracktion.showControllerWindow(); to get a log window with all midi messages
coming to and from the controller.

The following functions are available:

// Log message for debugging purposes. The log file can be found in the same folder as the
// Waveform log file. Use the Help button in Waveform to reveal logs
// Please disable logging once finished development except for errors
logMsg (data, ...)

// Causes Tracktion to call all the callbacks with the current data. Call after your device
// connects, or after your device changes mode, like flip
updateDeviceState();

// Starts a timer with period. The onTimer function will be called every period milliseconds
startTimer (name, ms);

// Stop the timer
stopTimer (name);

// Call the function onAsyncUpdate() in the future
triggerAsyncUpdate()

// Send midi data to the device. And array of midi bytes
sendMidiToDevice (midiData);

// Send osc data to the device. Address and array of data
sendOSCToDevice (addr, data);

// Is currently safe recording? If so don't change the users edit
// The callbacks already check this, but Tracktion.* functions mall not
isSafeRecording();

// tells tracktion that the user has moved a fader.
// the channel number is the physical channel on the device, regardless of bank selection
// delta determines if the fader is moved (new value added to current value) or set (current
// value is replaced by new value)
// delta = false: range 0 to 1.0
// delta = true:  range -1.0 to 1.0
setFader (channelNum, newFaderPosition, delta);

// tells tracktion that the user has moved a pan pot
// the channel number is the physical channel on the device, regardless of bank selection
// range -1.0 to 1.0
setPanPot (channelNum, newPanPosition, delta);

// tells tracktion that the master fader has moved.
setMasterLevelFader (newLevel, delta);
setMasterPanPot (newLevel, delta);

// Launches clip on track and slot
launchClip (track, slot);

// stops all clips on track
stopClip (track)

// starts all clips in slot
launchScene(slot)

setAux (channelNum, auxNum, newPosition, delta);
toggleAuxMute (channelNum, auxNum);
setQuickParam (newLevel);

// these tell tracktion about buttons being pressed
toggleSolo (channelNum);
toggleSoloIsolate (channelNum);
toggleMute (channelNum, muteVolumeControl);
selectTrack (channelNum);
selectOneTrack (channelNum);
selectClipInTrack (channelNum);
selectPluginInTrack (channelNum);
toggleRecEnable (channelNum, enableEtoE);
play();
record();
retrospectiveRecord();
stop();
gotoStart(); // return to zero
gotoEnd();
setMarkIn();
setMarkOut();
toggleAutomationReading();
toggleAutomationWriting();
toggleBeatsSecondsMode();
save();
saveAs();
armAll();
jumpToMarkIn();
jumpToMarkOut();
zoomIn();
zoomOut();
zoomToFit();
createMarker();
gotoNextMarker();
gotoPreviousMarker();
redo();
undo();
abort();
abortRestart();
cut();
copy();
paste (insert);
del (marked);
zoomFitToTracks();
insertTempoChange();
insertPitchChange();
insertTimeSigChange();
toggleVideoWindow();
toggleMixerWindow (fullscreen);
toggleMidiEditorWindow (fullscreen);
toggleTrackEditorWindow();
showBrowserWindow();
showActionsWindow();

// Triggers an action on the current quick actions bar
quickAction (int);
freeze();

clearAllSolo();
clearAllMute();

toggleLoop();
togglePunch();
toggleClick();
toggleSnap();
toggleSlave();
toggleEtoE();
toggleScroll();

skipToNextMarkerLeft();
skipToNextMarkerRight();
nudgedLeft();
nudgedRight();
zoomIn();
zoomOut();
scrollTracksUp();
scrollTracksDown();
scrollTracksLeft();
scrollTracksRight();
zoomTracksIn();
zoomTracksOut();

//User is tapping out a tempo
tapTempo();

setTempo (value, delta)

// Relation ship can be one of moveUp, moveDown, moveLeft, moveRight, moveToHome, moveToEnd, selectAll
selectOtherObject (relationship, moveFromCurrentPlugin);

muteOrUnmutePluginsInTrack();

// tells tracktion to move the fader bank up or down by the specified number of channels.
// After calling this, tracktion will call back the faderBankChanged() method to tell the
// device what its new state is.
changeFaderBanks (channelNumDelta);

// tells tracktion to move the pad bank up or down by the specified number of channels.
// After calling this, tracktion will call back the onPadStateChanged() method for each pad
// to tell the device what its new state is.
changePadBanks (channelNumDelta);

// tells tracktion to move the cursor.
//
// amount < 0 means moving backwards, amount > 0 forwards
// magnitude of about 1.0 is a 'normal' speed
jogWheelMoved (amount);

// to allow it to auto-repeat, these tell tracktion when the left/right buttons are pressed and
// released.
// (try not to make sure the buttons aren't left stuck down!)
rewind (isButtonDown);
fastForward (isButtonDown);

setParameter (parameter, newValue, delta);
incrementParameter (paramNumber);

changeParameterBank (deltaParams);
changeMarkerBank (deltaMarkers);
goToMarker (marker);

changeAuxBank (delta);
setAuxBank (num);

// If you need to get a current bank offset to interact with the Edit directly, use this
getMarkerBankOffset();
getFaderBankOffset(); 
getAuxBankOffset();   
getParamBankOffset();

redrawSelectedPlugin();
redrawSelectedTracks();
*/

function Example() {
      // Variables: these must be filled out so the session knows your controller layout
    this.deviceDescription               = "Example";                // device name
    this.needsMidiChannel                = true;                     // send midi controller to daw
    this.needsMidiBackChannel            = true;                     // send midi daw to controller
    this.midiChannelName                 = "Example";                // MIDI channel name
    this.midiBackChannelName             = "Example";                // MIDI channel name
    this.needsOSCSocket                  = false;                    // communicate via osc
    this.numberOfFaderChannels           = 8;                        // number physical faders      
    this.numberOfTrackPads               = 8;                        // number physical pads per channel
    this.numCharactersForTrackNames      = 8;                        // characters of channel text
    this.numCharactersForAuxLabels       = 0;                        // characters of aux text
    this.numParameterControls            = 0;                        // number of labelled rotary dials that can control things like plugin parameters
    this.numCharactersForParameterLabels = 0;                        // characters for rotary dials
    this.wantsDummyParams                = true;                     // display to parameters with track and plugin name
    this.wantsClock                      = false;                    // device wants MIDI clock
    this.allowBankingOffEnd              = true;                     // allow surface to display blank channels
    this.numMarkers                      = 0;                        // number of markers that can be displayed
    this.numCharactersForMarkerLabels    = 0;                        // characters for markers
    this.wantsAuxBanks                   = false;                    // display auxes
    this.numAuxes                        = 2;                        // number of auxes that can be displayed
    this.followsTrackSelection           = false;                    // controller track follows UI selection
    this.cliplauncher                    = true;                     // this controller supports being a clip launcher
    this.limitedPadColours               = false;                    // pad colors are limited to < 8
    this.auxmode                         = "bybus";                  // Aux index is either 'bybus' (-1 any) or 'byposition'
    this.pickUpMode                      = false;                    // input value must cross current value before input is accepted
                                                                     // useful for non motorized faders, so the don't jump when adjusted
    this.notes                           = "Hello World";            // Any notes for the user here
    
    // Called once at startup. 
    this.initialise = function() {
    }

    // Called at startup or any time the midi or osc ports change.
    // You may now be talking to a new physical device now, time to
    // initialise the hardware again
    this.initialiseDevice = function() {  
    }

    // Called at shutdown
    this.shutDownDevice = function() {        
    }

    // msg is array of midi bytes. return true to handle this message, otherwise false
    // to pass on to the daw
    // A keyboard with faders would return true for fader messages and false for keys
    this.wantsMessage = function(msg) { 
        return true; 
    }

    // return true if you want all midi messages no matter what
    // Something like a control surface should return true
    // A keyboard with a few control surface knobs should say false
    this.eatsAllMessages = function() {
        return true; 
    }

    // Are plugin params visible on controller
    this.isShowingPluginParams = function() { 
        return false; 
    }
    
    // Are markers showing on the controller
    this.isShowingMarkers = function() { 
        return false; 
    }

    // Are tracks showing on the controller 
    this.isShowingTracks = function() { 
        return true;  
    }

    // Area clip slots showing on the controllers
    this.isShowingClipSlots = function() {
        return true;
    }

    // is this the selected plugin? 
    this.isPluginSelected = function(plugin) { 
        return false; 
    }
    
    // If you started a timer, this callback will be called when it fires
    this.onTimer = function(name) {
    }

    // If you called triggerAsyncUpdate, it will cause this function to be called later
    // Good for grouping a bunch of changes into one
    this.onAsyncUpdate = function() {        
    }

    // If the device communicates via OSC, then this tells the device the new settings
    // DAW handles the socket, so you probably don't need to do anything
    this.onUpdateOSCSettings = function(oscInputPort, oscOutputPort, oscOutputAddr) {
    }

    // most settings will be updated by the DAW, but this allows a device
    // a chance to do some extra stuff when it needs to refresh itself
    // This get called quite often, so don't do too much in here and don't assume
    // anything has actually changed
    this.onUpdateMiscFeatures = function() {
    }

    // tells the device to move one of its faders.
    // the channel number is the physical channel on the device, regardless of bank selection
    // slider pos is 0 to 1.0
    this.onMoveFader = function(channelNum, newSliderPos) {
    }

    // tells the device to move the master faders, if it has them. 
    // slider pos is 0 to 1.0
    this.onMasterLevelFaderMoved = function(newSliderPos) {        
    }

    // tells the device to move a pan pot.
    // the channel number is the physical channel on the device, regardless of bank selection
    // pan is -1.0 to 1.0
    this.onPanPotMoved = function(channelNum, newPan) {
    }

    // tells the device to move the master pan pot.
    // pan is -1.0 to 1.0
    this.onMasterPanPotMoved = function(newPanPos) {        
    }

    // tells the device to move an aux.
    // the channel number is the physical channel on the device, regardless of bank selection
    // aux is 0.0 to 1.0
    this.onAuxMoved = function(channel, num, busName, newPos) {        
    }

    // This channel doesn't have an aux, so clear any level
    this.onAuxCleared = function(channel, num) {        
    }

    // the channel number is the physical channel on the device, regardless of bank selection
    // soloLit         = 1,    Track is explicitly soloed. 
    // soloFlashing    = 2,    Track is implicitly soloed. 
    // soloIsolate     = 4,    Track is explicitly solo isolated. 
    // muteLit         = 8,    Track is explicitly muted.
    // muteFlashing    = 16    Track is implicitly muted.
    this.onSoloMuteChanged = function(channelNum, muteAndSoloLightState, isBright) {
    }

    // count of number of tracks soloed
    this.onSoloCountChanged = function(anySoloTracks) {        
    }

    // tells the device that playback has stopped or started, and it should turn its lights on
    // accordingly.
    this.onPlayStateChanged = function(isPlaying) {    
    }
    this.onRecordStateChanged = function(isRecording) {
    }

    // tells the device about automation read/write status changing.
    this.onAutomationReadModeChanged = function(isReading) {        
    }
    this.onAutomationWriteModeChanged = function(isWriting) {
    }

    // tells the device that the user has changed fader banks, so if the device has a bank number
    // indicator, this tells it to update its contents.
    //
    // the newStartChannelNumber is the number of the first virtual channel now being mapped to the
    // first physical fader channel on the device, starting from zero.
    //
    // the trackname array is the set of names for the tracks that now map onto the device's physical
    // fader channels, so if it has a display that can show track names, it should update this.
    this.onFaderBankChanged = function(newStartChannelNumber, trackNames) {      
    }

    // colour 0: off
    // colour 1 - 18: hue = (colour - 1) / 18
    // state 0: solid
    // state 1: blink
    // state 2: pulse
    this.onPadStateChanged = function(channel, pad, colour, state) {
    }

    // Are any clips on this track playing
    this.onClipsPlayingChanged = function(channel, isPlaying) {
    }

    // if the device has per-channel level meters, this should update one of them.
    // the channel number is the physical channel on the device, regardless of bank selection
    // level is 0 to 1.0
    this.onChannelLevelChanged = function(channel, left, right) {   
    }

    // when a track is selected or deselected
    this.onTrackSelectionChanged = function(channel, isSelected) {        
    }

    this.onTrackRecordEnabled = function(channel, isEnabled) {      
    }

    // if the device has a master level readout, this should update it.
    this.onMasterLevelsChanged = function(leftLevel, rightLevel) {        
    }

    // tells the device that the playback position has changed, so if it has a timecode
    // display, it should update it.
    //
    // If isBarsBeats is true, barsOrHours is the bar number (starting from 1), beatsOrMinutes is
    // the beat number (also from 1), ticksOrSeconds is the number of ticks (0 to 959) and millisecs is
    // unused.
    //
    // If isBarsBeats is false, barsOrHours = hours, beatsOrMinutes = minutes, ticksOrSeconds = seconds, and
    // millisecs is (surprise surprise) the milliseconds.
    this.onTimecodeChanged = function(barsOrHours, beatsOrMinutes, ticksOrSeconds, millisecs, isBarsBeats, isFrames) {        
    }

    // tells the device that the click has been turned on or off.
    this.onClickChanged = function(isClickOn) {           
    }

    // tells the device that snapping has been turned on or off.
    this.onSnapChanged = function(isSnapOn) {        
    }

    // tells the device that looping has been turned on or off.
    this.onLoopChanged = function(isLoopOn) {           
    }

    // tells the device that slave has been turned on or off.
    this.onSlaveChanged = function(isSlaving) {        
    }

    // tells the device that punch has been turned on or off.
    this.onPunchChanged = function(isPunching) {        
    }

    // tells the device that looping has been scroll on or off.
    this.onScrollChanged = function(isScroll) {        
    }

    // tells the device that undo or redo status has changed
    this.onUndoStatusChanged = function(undo, redo) {            
    }

    // tells the device that one of the parameters has been changed.
    //
    // parameterNumber is the physical parameter number on the device, not the
    // virtual one.
    // newValue.label
    // newValue.valueDescription
    // newValue.value
    this.onParameterChanged = function(parameterNumber, newValue) {        
    }
    this.onParameterCleared = function(parameterNumber) {        
    }

    // newValue.label
    // newValue.number
    // newValue.absolute
    this.onMarkerChanged = function(parameterNumber, newValue) {        
    }
    this.onMarkerCleared = function(parameterNumber) {        
    }

    // check aux
    this.onAuxBankChanged = function(auxBank) {        
    }

    // return true to allow selected plugin to change
    // return false is selection is locked to current plugin
    this.onCanChangeSelectedPlugin = function() {
        return true; 
    }

    // selection changed
    this.onCurrentSelectionChanged = function(sel) {        
    }

    // bypass state changed
    this.onPluginBypassChanged = function(bypass) {        
    }
    
    // edit user is working on changed
    this.onCurrentEditChanged = function() {
    }

    // Called when a midi message comes in from the controller. You must
    //  translate this and call methods in the session accordingly to
    // trigger whatever action the user is trying to do.
    this.onMidiReceivedFromDevice = function(msg) {

    }

    // called by tracktion when a osc message comes in from the controller. The
    // subclass must translate this and call methods in this class accordingly to
    // trigger whatever action the user is trying to do.
    this.onOSCReceivedFromDevice = function (addr, params) {
    }
}

registerController (new Example());
