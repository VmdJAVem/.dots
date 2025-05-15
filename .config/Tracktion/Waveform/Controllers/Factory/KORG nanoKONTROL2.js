/*
    KORG nanoKONTROL2
*/

function KORGnanoKONTROL2() {
    // Variables: these must be filled out so the session knows your controller layout
    this.deviceDescription               = "KORG nanoKONTROL 2";        // device name
    this.needsMidiChannel                = true;                        // send midi controller to daw
    this.needsMidiBackChannel            = true;                        // send midi daw to controller
    this.midiChannelName                 = "nanoKONTROL2 SLIDER/KNOB";  // MIDI channel name
    this.midiBackChannelName             = "nanoKONTROL2 CTRL";         // MIDI channel name
    this.numberOfFaderChannels           = 8;                           // number physical faders      
    this.allowBankingOffEnd              = true;                        // allow surface to display blank channels
    this.pickUpMode                      = true;                        // set true for non motorized faders
    this.notes                           = "Set 'LED Mode' = 'External' using Korg Kontrol Editor to enable light up buttons";

    // the channel number is the physical channel on the device, regardless of bank selection
    // soloLit         = 1,    Track is explicitly soloed. 
    // soloFlashing    = 2,    Track is implicitly soloed. 
    // soloIsolate     = 4,    Track is explicitly solo isolated. 
    // muteLit         = 8,    Track is explicitly muted.
    // muteFlashing    = 16    Track is implicitly muted.
    this.onSoloMuteChanged = function(channelNum, muteAndSoloLightState, isBright) {
        var s = ((muteAndSoloLightState & (8 | 16)) != 0 ? 1 : 0);
        var m = ((muteAndSoloLightState & (1 | 2 | 4)) != 0 ? 1 : 0);

        sendMidiToDevice ([0xb0, 0x20 + channelNum, m ? 0x7f : 0x00]);
        sendMidiToDevice ([0xb0, 0x30 + channelNum, s ? 0x7f : 0x00]);
    }

    // tells the device that playback has stopped or started, and it should turn its lights on
    // accordingly.
    this.onPlayStateChanged = function(isPlaying) {  
        sendMidiToDevice ([0xb0, 0x29, isPlaying ? 0x7f : 0x00]);
        sendMidiToDevice ([0xb0, 0x2a, isPlaying ? 0x00 : 0x7f]);
    }

    this.onRecordStateChanged = function(isRecording) {
        sendMidiToDevice ([0xb0, 0x2d, isRecording ? 0x7f : 0x00]);
    }

    this.onTrackRecordEnabled = function(channel, isEnabled) { 
        sendMidiToDevice ([0xb0, 0x40 + channel, isEnabled ? 0x7f : 0x00]);     
    }

    // tells the device that looping has been turned on or off.
    this.onLoopChanged = function(isLoopOn) {      
        sendMidiToDevice ([0xb0, 0x2e, isLoopOn ? 0x7f : 0x00]);
    }

    // Called when a midi message comes in from the controller. You must
    //  translate this and call methods in the session accordingly to
    // trigger whatever action the user is trying to do.
    this.onMidiReceivedFromDevice = function(msg) {
        if (msg[0] == 0xb0) {
            var d = msg[1];
            var v = msg[2];

            if (d >= 0x0 && d <= 0x7) {
                setFader (d - 0, v / 127, false);
            }
            else if (d >= 0x10 && d <= 0x17) {
                setPanPot (d - 0x10, v / 127 * 2 - 1, false);
            }
            else if (d >= 0x20 && d <= 0x27 && v == 0) {
                toggleSolo (d - 0x20);
            }
            else if (d >= 0x30 && d <= 0x37 && v == 0) {
                toggleMute (d - 0x30);
            }
            else if (d >= 0x40 && d <= 0x47 && v == 0) {
                toggleRecEnable (d - 0x40, false);
            }
            else if (d == 0x3a && v == 0) {
                changeFaderBanks (-8);
            }
            else if (d == 0x3b && v == 0) {
                changeFaderBanks (8);
            }
            else if (d == 0x2e && v == 0) {
                toggleLoop();
            }
            else if (d == 0x3c && v == 0) {
                createMarker();
            }
            else if (d == 0x3d && v == 0) {
                gotoPreviousMarker();
            }
            else if (d == 0x3e && v == 0) {
                gotoNextMarker();
            }
            else if (d == 0x2b) {
                rewind (v != 0);
            }
            else if (d == 0x2c) {
                fastForward (v != 0);
            }
            else if (d == 0x2a && v == 0) {
                stop();
            }
            else if (d == 0x29 && v == 0) {
                play();
            }
            else if (d == 0x2d && v == 0) {
                record();
            }
        }
    }
}

registerController (new KORGnanoKONTROL2());
