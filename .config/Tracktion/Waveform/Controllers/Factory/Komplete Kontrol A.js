/*
This file is run in the Duktape Javascript engine which supports JavaScript ES5

To create a controller, make a copy of this file and place it in the User folder. User
controllers with the same name will override factor y controllers. Then change the appropriate 
values and implement the appropriate functions. You can use any on the functions in the Tracktion
namespace like keyboard shortcuts. Or you can use the following global functions.
You should prefer global functions over Tracktion.* since global functions have a view of the
current Edit based on the current bank offset. If you choose to interact with Tracktion.* 
you must apply the bank offset yourself and check for safe recording, so you don't accidentally
damage the users recording.

This file is hot reloaded when you make changes, so you can see your changes in real time 
as you work.

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
setMasterLevelFader (newLevel);
setMasterPanPot (newLevel);

setAux (channelNum, auxNum, newPosition);
toggleAuxMute (channelNum);
setQuickParam (newLevel);

// these tell tracktion about buttons being pressed
toggleSolo (channelNum);
toggleSoloIsolate (channelNum);
toggleMute (channelNum, muteVolumeControl);
selectTrack (channelNum);
selectClipInTrack (channelNum);
selectPluginInTrack (channelNum);
toggleRecEnable (channelNum, enableEtoE);
play();
record();
stop();
gotoStartHome(); // return to zero
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
delete (marked);
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

// Relation ship can be one of moveUp, moveDown, moveLeft, moveRight, moveToHome, moveToEnd, selectAll
selectOtherObject (relationship, moveFromCurrentPlugin);

muteOrUnmutePluginsInTrack();

// tells tracktion to move the fader bank up or down by the specified number of channels.
// After calling this, tracktion will call back the faderBankChanged() method to tell the
// device what its new state is.
changeFaderBanks (channelNumDelta);

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

setParameter (parameter, newValue);
incrementParameter (paramNumber);

changeParameterBank (deltaParams);
changeMarkerBank (deltaMarkers);
goToMarker (marker);

changeAuxBank (delta);

// If you need to get a current bank offset to interact with the Edit directly, use this
getMarkerBankOffset();
getFaderBankOffset(); 
getAuxBankOffset();   
getParamBankOffset();

redrawSelectedPlugin();
redrawSelectedTracks();
*/

function KompleteKontrol() {
    // Local functions
    this.dataOut = function(msg) {
        var hex = new Array();
        for (var i = 0; i < msg.length; i++) {
            hex.push (msg[i].toString(16));
        }
        logMsg ("<<<", hex);
    }

    // Variables: these must be filled out so the session knows your controller layout
    this.deviceDescription               = "Komplete Kontrol A";     // device name
    this.needsMidiChannel                = true;                     // send midi controller to daw
    this.needsMidiBackChannel            = true;                     // send midi daw to controller
    this.midiChannelName                 = "Komplete Kontrol A DAW"; // MIDI channel name
    this.midiBackChannelName             = "Komplete Kontrol A DAW"; // MIDI channel name
    this.needsOSCSocket                  = false;                    // communicate via osc
    this.numberOfFaderChannels           = 8;                        // number physical faders      
    this.numCharactersForTrackNames      = 8;                        // characters of channel text
    this.numCharactersForAuxLabels       = 0;                        // characters of aux text
    this.numParameterControls            = 0;                        // number of labelled rotary dials that can control things like plugin parameters
    this.numCharactersForParameterLabels = 0;                        // characters for rotary dials
    this.wantsClock                      = false;                    // device wants MIDI clock
    this.allowBankingOffEnd              = true;                     // allow surface to display blank channels
    this.numMarkers                      = 0;                        // number of markers that can be displayed
    this.numCharactersForMarkerLabels    = 0;                        // characters for markers
    this.wantsAuxBanks                   = false;                    // display auxes
    this.numAuxes                        = 0;                        // number of auxes that can be displayed
    this.followsTrackSelection           = false;                    // controller track follows UI selection
    // Private variables
    this.connected                       = false;                    // have we connected yet?
    this.protocol                        = 0;                        // Komplete Protocol Version

    // Called at startup or any time the midi or osc ports change.
    // You may now be talking to a new physical device now, time to
    // initialise the hardware again
    this.initialiseDevice = function() {  
        startTimer ("connectTimer", 1000);
        stopTimer ("meterTimer");

        var data = [0xBF, 0x01, 0x03]; 
        sendMidiToDevice (data);
        this.connected = false;
    }

    // Called at shutdown
    this.shutDownDevice = function() {        
        var data = [0xBF, 0x02, 0x00]; 
        sendMidiToDevice (data);
        this.connected = false;

        stopTimer ("connectTimer");
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

    // is this the selected plugin? 
    this.isPluginSelected = function(plugin) { 
        return false; 
    }
    
    // Called once at startup. 
    this.initialise = function() {
    }

    // If you started a timer, this callback will be called when it fires
    this.onTimer = function(name) {
        if (! this.connected) {
            if (name == "connectTimer") {
                var data = [0xBF, 0x01, 0x03]; 
                sendMidiToDevice (data);    
            }
        }
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
        if (this.connected) {
            // Position
            var data = [0xBF, 0x50 + channelNum, Math.round (newSliderPos * 127)]; 
            sendMidiToDevice (data);    

            // Text
            var text = "-inf dB";
            if (newSliderPos > 0.0) {
                var db = 20.0 * Math.log (newSliderPos) + 6.0;
                text = db.toFixed(2) + " dB";
            }

            var sysex = [0xF0, 0x00, 0x21, 0x09, 0x00, 0x00, 0x44, 0x43, 0x01, 0x00];

            sysex.push (0x46);
            sysex.push (0x00);
            sysex.push (channelNum);

            for (var j = 0; j < text.length; j++)
                sysex.push (text.charCodeAt (j));

            sysex.push (0xF7);

            sendMidiToDevice (sysex);   
        }    
    }

    // tells the device to move a pan pot.
    // the channel number is the physical channel on the device, regardless of bank selection
    // pan is -1.0 to 1.0
    this.onPanPotMoved = function(channelNum, newPan) {
        if (this.connected) {
            // Position
            var data = [0xBF, 0x58 + channelNum, Math.round ((newPan + 1) / 2 * 127)]; 
            sendMidiToDevice (data);    

            // Text
            var pos = Math.round (newPan * 100);

            var text = 'C';
            if (pos < 0) {
                text = (-pos).toString() + "L";
            } 
            else if (pos > 0) {
                text = pos.toString() + "R";
            }

            var sysex = [0xF0, 0x00, 0x21, 0x09, 0x00, 0x00, 0x44, 0x43, 0x01, 0x00];

            sysex.push (0x47);
            sysex.push (0x00);
            sysex.push (channelNum);

            for (var j = 0; j < text.length; j++)
                sysex.push (text.charCodeAt (j));

            sysex.push (0xF7);

            sendMidiToDevice (sysex);    
        }  
    }

    // tells the device to move an aux.
    // the channel number is the physical channel on the device, regardless of bank selection
    // aux is 0.0 to 1.0
    this.onAuxMoved = function(channel, num, bus, newPos) {        
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
        if (this.connected) {
            var sysex = [0xF0, 0x00, 0x21, 0x09, 0x00, 0x00, 0x44, 0x43, 0x01, 0x00];

            sysex.push (0x43);
            sysex.push ((muteAndSoloLightState & (8 | 16)) != 0 ? 1 : 0);
            sysex.push (channelNum);
            sysex.push (0xF7);
    
            sendMidiToDevice (sysex);  
        }  
        if (this.connected) {
            var sysex = [0xF0, 0x00, 0x21, 0x09, 0x00, 0x00, 0x44, 0x43, 0x01, 0x00];

            sysex.push (0x44);
            sysex.push ((muteAndSoloLightState & (1 | 2 | 4)) != 0 ? 1 : 0);
            sysex.push (channelNum);
            sysex.push (0xF7);
    
            sendMidiToDevice (sysex);  
        }   
    }

    // count of number of tracks soloed
    this.onSoloCountChanged =function(anySoloTracks) {        
    }

    // tells the device that playback has stopped or started, and it should turn its lights on
    // accordingly.
    this.onPlayStateChanged = function(isPlaying) {  
        if (this.connected) {
            var data = [0xBF, 0x10, isPlaying ? 0x01 : 0x00]; 
            sendMidiToDevice (data);    
        }      
    }
    this.onRecordStateChanged = function(isRecording) {
        if (this.connected) {
            var data = [0xBF, 0x12, isRecording ? 0x01 : 0x00]; 
            sendMidiToDevice (data);    
        }      
    },

    // tells the device about automation read/write status changing.
    this.onAutomationReadModeChanged = function(isReading) {        
    }
    this.onAutomationWriteModeChanged = function(isWriting) {
        if (this.connected) {
            var data = [0xBF, 0x23, isWriting ? 0x01 : 0x00]; 
            sendMidiToDevice (data);    
        }    
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
        if (this.connected) {
            for (var i = 0; i < 8; i++)  {
                var name = trackNames[i].trim();

                var sysex = [0xF0, 0x00, 0x21, 0x09, 0x00, 0x00, 0x44, 0x43, 0x01, 0x00];

                sysex.push (0x48);
                sysex.push (0x00);
                sysex.push (i);

                for (var j = 0; j < name.length; j++)
                    sysex.push (name.charCodeAt (j));

                sysex.push (0xF7);

                sendMidiToDevice (sysex);    
            }
        }
    }

    // if the device has per-channel level meters, this should update one of them.
    // the channel number is the physical channel on the device, regardless of bank selection
    // level is 0 to 1.0
    this.onChannelLevelChanged = function(channel, level) {   
    }

    // when a track is selected or deselected
    this.onTrackSelectionChanged = function(channel, isSelected) {        
    }

    this.onTrackRecordEnabled = function(channel, isEnabled) {      
        if (this.connected) {
            var sysex = [0xF0, 0x00, 0x21, 0x09, 0x00, 0x00, 0x44, 0x43, 0x01, 0x00];

            sysex.push (0x45);
            sysex.push (isEnabled ? 1 : 0);
            sysex.push (channel);
            sysex.push (0xF7);

            sendMidiToDevice (sysex);  
        }   
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
        if (this.connected) {
            var data = [0xBF, 0x17, isClickOn ? 0x01 : 0x00]; 
            sendMidiToDevice (data);    
        }          
    },

    // tells the device that snapping has been turned on or off.
    this.onSnapChanged = function(isSnapOn) {        
    }

    // tells the device that looping has been turned on or off.
    this.onLoopChanged = function(isLoopOn) {      
        if (this.connected) {
            var data = [0xBF, 0x16, isLoopOn ? 0x01 : 0x00]; 
            sendMidiToDevice (data);    
        }        
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
        if (this.connected) {
            var data = [0xBF, 0x20, undo ? 0x01 : 0x00]; 
            sendMidiToDevice (data);    
        }    
        if (this.connected) {
            var data = [0xBF, 0x21, redo ? 0x01 : 0x00]; 
            sendMidiToDevice (data);    
        }            
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
        if (msg[0] == 0xbf) {
            if (msg[1] == 0x01) {
                this.connected = true;
                this.protocol = msg[2];

                updateDeviceState();
                startTimer ("meterTimer", 33); 
            }
            else if (msg[1] == 0x10) {
                play();
            }
            else if (msg[1] == 0x11) {
                abortRestart();
            }
            else if (msg[1] == 0x12) {
                record();
            }
            else if (msg[1] == 0x13) {
                // Count in
            }
            else if (msg[1] == 0x14) {
                stop();
            }
            else if (msg[1] == 0x15) {
                // Clear?
            }
            else if (msg[1] == 0x16) {
                toggleLoop();
            }
            else if (msg[1] == 0x17) {
                toggleClick();
            }
            else if (msg[1] == 0x18) {
                // Tap tempo
            }
            else if (msg[1] == 0x20) {
                undo();
            }
            else if (msg[1] == 0x21) {
                redo();
            }
            else if (msg[1] == 0x22) {
                // Quantize
            }
            else if (msg[1] == 0x23) {
                toggleAutomationWriting();
            }
            else if (msg[1] == 0x30) {
                changeFaderBanks (msg[2] == 1 ? 1 : -1);
            }
            else if (msg[1] == 0x32) {
                changeFaderBanks (msg[2] == 1 ? 8 : -8);
            }
            else if (msg[1] == 0x34) {
                var d = msg[2];
                jogWheelMoved (d == 127 ? -1 : 1);
            }
            else if (msg[1] == 0x42) {
                selectTrack (msg[2]);
            }
            else if (msg[1] == 0x43) {
                toggleMute (msg[2], false);
            }
            else if (msg[1] == 0x44) {
                toggleSolo (msg[2]);
            }
            else if (msg[1] >= 0x50 && msg[1] <= 0x57) {
                var w = (64 - msg[2]) / 64;
                setFader (msg[1] - 0x50, w, true);
            }
            else if (msg[1] >= 0x58 && msg[1] <= 0x5f) {
                var w = (64 - msg[2]) / 64;
                setPanPot (msg[1] - 0x58, w, true);
            }            
        }
    }

    // called by tracktion when a osc message comes in from the controller. The
    // subclass must translate this and call methods in this class accordingly to
    // trigger whatever action the user is trying to do.
    this.onOSCReceivedFromDevice = function (addr, params) {
    }
}

registerController (new KompleteKontrol());