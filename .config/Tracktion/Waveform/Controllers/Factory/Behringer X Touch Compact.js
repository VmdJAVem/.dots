/*
    Behringer X Touch Compact
*/

function BehringerXTouchCompact() {
    // Variables: these must be filled out so the session knows your controller layout
    this.deviceDescription               = "Behringer X Touch Compact"; // device name
    this.needsMidiChannel                = true;                        // send midi controller to daw
    this.needsMidiBackChannel            = true;                        // send midi daw to controller
    this.midiChannelName                 = "X-TOUCH COMPACT";           // MIDI channel name
    this.midiBackChannelName             = "X-TOUCH COMPACT";           // MIDI channel name
    this.numberOfFaderChannels           = 8;                           // number physical faders      
    this.allowBankingOffEnd              = true;                        // allow surface to display blank channels
    this.notes                           = "The MC LED must be illuminated for proper operation. If not, power cycle the device while holding the MC button.\n\nEncoders 9 - 14 trigger quick actions when pressed.";

    // tells the device to move one of its faders.
    // the channel number is the physical channel on the device, regardless of bank selection
    // slider pos is 0 to 1.0
    this.onMoveFader = function(channelNum, newSliderPos) { 
        sendMidiToDevice ([0xe0 + channelNum, 0x00, Math.round (newSliderPos * 0x7f)]);
    }

    // tells the device to move the master faders, if it has them. If it just has one master
    // fader, it can use the average of these levels.
    // slider pos is 0 to 1.0
    this.onMasterLevelFaderMoved = function(newSliderPos) {    
        sendMidiToDevice ([0xe8, 0x00, Math.round (newSliderPos * 0x7f)]);
    }

    // tells the device to move a pan pot.
    // the channel number is the physical channel on the device, regardless of bank selection
    // pan is -1.0 to 1.0
    this.onPanPotMoved = function(channelNum, newPan) {       
        sendMidiToDevice ([0xb0, 0x30 + channelNum, 6 + Math.round (5 * newPan)]);
    }

    // the channel number is the physical channel on the device, regardless of bank selection
    // soloLit         = 1,    Track is explicitly soloed. 
    // soloFlashing    = 2,    Track is implicitly soloed. 
    // soloIsolate     = 4,    Track is explicitly solo isolated. 
    // muteLit         = 8,    Track is explicitly muted.
    // muteFlashing    = 16    Track is implicitly muted.
    this.onSoloMuteChanged = function(channelNum, muteAndSoloLightState, isBright) {
        var s = ((muteAndSoloLightState & (8 | 16)) != 0 ? 1 : 0);
        var m = ((muteAndSoloLightState & (1 | 2 | 4)) != 0 ? 1 : 0);

        sendMidiToDevice ([0x90, 0x10 + channelNum, s ? 0x7f : 0x00]);
        sendMidiToDevice ([0x90, 0x18 + channelNum, m ? 0x7f : 0x00]);
    }

    // count of number of tracks soloed
    this.onSoloCountChanged = function(anySoloTracks) { 
        sendMidiToDevice ([0x90, 0x32, anySoloTracks ? 0x7f : 0x00]);       
    }

    // tells the device that playback has stopped or started, and it should turn its lights on
    // accordingly.
    this.onPlayStateChanged = function(isPlaying) {  
        sendMidiToDevice ([0x90, 0x5e, isPlaying ? 0x7f : 0x00]);
        sendMidiToDevice ([0x90, 0x5d, isPlaying ? 0x00 : 0x7f]);
    }
    this.onRecordStateChanged = function(isRecording) {
        sendMidiToDevice ([0x90, 0x5f, isRecording ? 0x7f : 0x00]);
    }

    // when a track is selected or deselected
    this.onTrackSelectionChanged = function(channel, isSelected) {     
        sendMidiToDevice ([0x90, 0x00 + channel, isSelected ? 0x7f : 0x00]);   
    }

    this.onTrackRecordEnabled = function(channel, isEnabled) { 
        sendMidiToDevice ([0x90, 0x08 + channel, isEnabled ? 0x7f : 0x00]);     
    }

    // tells the device that looping has been turned on or off.
    this.onLoopChanged = function(isLoopOn) {      
        sendMidiToDevice ([0x90, 0x56, isLoopOn ? 0x7f : 0x00]);
    }

    // Called when a midi message comes in from the controller. You must
    //  translate this and call methods in the session accordingly to
    // trigger whatever action the user is trying to do.
    this.onMidiReceivedFromDevice = function(msg) {
        if (msg[0] >= 0xe0 && msg[0] <= 0xe7) {            
            setFader (msg[0] - 0xe0, msg[2] / 0x7f, false);
        }
        else if (msg[0] == 0xe8) {
            setMasterLevelFader (msg[2] / 0x7f);
        }
        else if (msg[0] == 0xb0 && msg[1] >= 0x10 && msg[1] <= 0x17) {
            var diff = 0.02 * (msg[2] & 0x0f);

            if ((msg[2] & 0x40) != 0)
                diff = -diff;

            setPanPot (msg[1] - 0x10, diff, true);
        }
        else if (msg[0] == 0x90) {
            if (msg[1] == 0x5b) {
                rewind (msg[2] == 0x7f);
            }
            else if (msg[1] == 0x5c) {
                fastForward (msg[2] == 0x7f);
            }
            else if (msg[2] == 0) {
                if (msg[1] >= 0x00 && msg[1] <= 0x07) {
                    selectTrack (msg[1] - 0x00);
                }
                else if (msg[1] >= 0x08 && msg[1] <= 0x0f) { 
                    toggleRecEnable (msg[1] - 0x08, false);
                }
                else if (msg[1] >= 0x10 && msg[1] <= 0x17) { 
                    toggleMute (msg[1] - 0x10, false);
                }
                else if (msg[1] >= 0x18 && msg[1] <= 0x1f) { 
                    toggleSolo (msg[1] - 0x18, false);
                }
                else if (msg[1] == 0x56) {
                    toggleLoop();
                }
                else if (msg[1] == 0x5f) {
                    record();
                }
                else if (msg[1] == 0x5d) {
                    stop();
                }
                else if (msg[1] == 0x5e) {
                    play();
                }
                else if (msg[1] == 0x54) {
                    changeFaderBanks (-8);
                }
                else if (msg[1] == 0x55) {
                    changeFaderBanks (+8);
                }
                else if (msg[1] >= 0x28 && msg[1] <= 0x2d) {
                    quickAction (msg[1] - 0x28);
                }
                else if (msg[1] == 0x32) {
                    clearAllSolo();
                }
            }
        }
    }
}

registerController (new BehringerXTouchCompact());
