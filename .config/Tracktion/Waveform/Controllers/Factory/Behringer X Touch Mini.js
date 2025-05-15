/*
    Behringer X Touch Mini
*/

function dataOut (msg) {
    var hex = new Array();
    for (var i = 0; i < msg.length; i++) {
        hex.push (msg[i].toString(16));
    }
    logMsg ("<<<", hex);
}

function BehringerXTouchMini() {
    // Variables: these must be filled out so the session knows your controller layout
    this.deviceDescription               = "Behringer X Touch Mini"; // device name
    this.needsMidiChannel                = true;                        // send midi controller to daw
    this.needsMidiBackChannel            = true;                        // send midi daw to controller
    this.midiChannelName                 = "X-TOUCH MINI";              // MIDI channel name
    this.midiBackChannelName             = "X-TOUCH MINI";              // MIDI channel name
    this.numberOfFaderChannels           = 8;                           // number physical faders      
    this.allowBankingOffEnd              = true;                        // allow surface to display blank channels
    this.pickUpMode                      = true;                        // set true for non motorized faders
    this.notes                           = "The MC LED must be OFF for proper operation. If not, unplug and reconnect while holding the MC button.";

    this.initialise = function() {
        sendMidiToDevice ([0xb0, 0x7f, 0x00]);
    }

    this.initialiseDevice = function() {
        sendMidiToDevice ([0xb0, 0x7f, 0x00]);
    }

    // tells the device to move one of its faders.
    // the channel number is the physical channel on the device, regardless of bank selection
    // slider pos is 0 to 1.0
    this.onMoveFader = function(channelNum, newSliderPos) { 
        sendMidiToDevice ([0xb0, 0x01 + channelNum, 0x00]);
        sendMidiToDevice ([0xb0, 0x09 + channelNum, Math.round (newSliderPos * 13)]);
    }

    // tells the device to move a pan pot.
    // the channel number is the physical channel on the device, regardless of bank selection
    // pan is -1.0 to 1.0
    this.onPanPotMoved = function(channelNum, newPan) {       
    }

    // the channel number is the physical channel on the device, regardless of bank selection
    // soloLit         = 1,    Track is explicitly soloed. 
    // soloFlashing    = 2,    Track is implicitly soloed. 
    // soloIsolate     = 4,    Track is explicitly solo isolated. 
    // muteLit         = 8,    Track is explicitly muted.
    // muteFlashing    = 16    Track is implicitly muted.
    this.onSoloMuteChanged = function(channelNum, muteAndSoloLightState, isBright) {
        var s = ((muteAndSoloLightState & (1 | 2 | 4)) != 0 ? 1 : 0);

        sendMidiToDevice ([0x90, 0x00 + channelNum, s]);
    }

    // tells the device that playback has stopped or started, and it should turn its lights on
    // accordingly.
    this.onPlayStateChanged = function(isPlaying) {  
        sendMidiToDevice ([0x90, 13, isPlaying ? 0 : 1]);
        sendMidiToDevice ([0x90, 14, isPlaying ? 1 : 0]);
    }
    this.onRecordStateChanged = function(isRecording) {
        sendMidiToDevice ([0x90, 15, isRecording ? 1 : 0]);
    }

    // tells the device that looping has been turned on or off.
    this.onLoopChanged = function(isLoopOn) {      
        sendMidiToDevice ([0x90, 12, isLoopOn ? 1 : 0]);
    }

    // Called when a midi message comes in from the controller. You must
    //  translate this and call methods in the session accordingly to
    // trigger whatever action the user is trying to do.
    this.onMidiReceivedFromDevice = function(d) {
        var msg = d;

        var d0 = d[0];
        var d1 = d[1];
        var d2 = d[2];

        if (d0 == 0xba && d1 >= 0x01 && d1 <= 0x08) {
            setFader (d1 - 0x01, d2 / 0x7f, false);
        }
        else if (d0 == 0xba && d1 == 0x09) {
            setMasterLevelFader (d2 / 0x7f);
        }
        else if (d0 == 0xba && d1 == 0x0a) {
            setFader (0, d2 / 0x7f, false);
        }
        else if (d0 == 0xba && d1 >= 0x0b && d1 <= 0x12) {
            setPanPot (d1 - 0x0b, (d2 / 0x7f) * 2 - 1, false);
        }
        else if (d0 == 0x8a && d1 >= 0x18 && d1 <= 0x1f && d2 == 0x00) {
            setPanPot (d1 - 0x18, 0, false);
        }
        else if (d0 == 0x8a && d1 >= 0x00 && d1 <= 0x07 && d2 == 0x00) {
            toggleMute (d1 - 0x00, false);
        }
        else if (d0 == 0x8a && d1 >= 0x08 && d1 <= 0x0f && d2 == 0x00) {
            toggleSolo (d1 - 0x08, false);
        }
        else if (d0 == 0x8a && d1 >= 0x20 && d1 <= 0x27 && d2 == 0x00) {
            toggleRecEnable (d1 - 0x20, false);
        }
        else if (d0 == 0x8a && d1 >= 0x28 && d1 <= 0x2f && d2 == 0x00) {
            quickAction (d1 - 0x28, false);
        }
        else if (d0 == 0x8a && d1 == 0x10 && d2 == 0x00) {
            changeFaderBanks (-8);
        }
        else if (d0 == 0x8a && d1 == 0x11 && d2 == 0x00) {
            changeFaderBanks (8);
        }
        else if (d0 == 0x9a && d1 == 0x12 && d2 == 0x7f) {
            rewind (true);
        }
        else if (d0 == 0x8a && d1 == 0x12 && d2 == 0x00) {
            rewind (false);
        }
        else if (d0 == 0x9a && d1 == 0x13 && d2 == 0x7f) {
            fastForward (true);
        }
        else if (d0 == 0x8a && d1 == 0x13 && d2 == 0x00) {
            fastForward (false);
        }
        else if (d0 == 0x8a && d1 == 0x14 && d2 == 0x00) {
            toggleLoop();
        }
        else if (d0 == 0x8a && d1 == 0x15 && d2 == 0x00) {
            stop();
        }
        else if (d0 == 0x8a && d1 == 0x16 && d2 == 0x00) {
            play();
        }
        else if (d0 == 0x8a && d1 == 0x17 && d2 == 0x00) {
            record();
        }
    }
}

registerController (new BehringerXTouchMini());
