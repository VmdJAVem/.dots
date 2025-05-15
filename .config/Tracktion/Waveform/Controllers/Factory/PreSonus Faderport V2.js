function clamp (lo, hi, val) {
    if (val < lo) return lo;
    if (val > hi) return hi;
    return val;
}

function dataOut (msg) {
    var hex = new Array();
    for (var i = 0; i < msg.length; i++) {
        hex.push (msg[i].toString(16));
    }
    logMsg ("<<<", hex);
}

function Faderport() {
    this.deviceDescription                  = "PreSonus Faderport V2";
    this.needsMidiBackChannel               = true;
    this.wantsClock                         = false;
    this.midiChannelName                    = "PreSpnus FP2";
    this.midiBackChannelName                = "PreSpnus FP2";
    this.numberOfFaderChannels              = 1;
    this.numCharactersForTrackNames         = 0;
    this.numCharactersForAuxLabels          = 0;
    this.numCharactersForParameterLabels    = 0;
    this.numParameterControls               = 1;
    this.numMarkers                         = 0;
    this.numCharactersForMarkerLabels       = 0;
    this.wantsAuxBanks                      = false;
    this.needsMidiChannel                   = true;
    this.supportedExtenders                 = 0; 
    this.followsTrackSelection              = true;                   
    this.notes                              = "Power on device while pressing 'Next' button. Then press 'solo' once device has powered up to enter MIDI mode";

    this.shiftKeyDown                       = false;
    this.mode                               = "channel";
    this.flip                               = false;

    this.rewindDown                         = false;
    this.fastForwardDown                    = false;

    this.channelFader                       = 0;
    this.channelPan                         = 0;

    this.initialise = function() {
        this.allLEDsOff();
    }

    this.initialiseDevice = function() {
        this.allLEDsOff();
        this.updateLEDs();
    }

    this.shutDownDevice = function() {        
        this.allLEDsOff();
    }

    this.allLEDsOff = function() {
        sendMidiToDevice ([0x90, 0x00, 0x00]);
        sendMidiToDevice ([0x90, 0x03, 0x00]);
        sendMidiToDevice ([0x90, 0x08, 0x00]);
        sendMidiToDevice ([0x90, 0x10, 0x00]);
        sendMidiToDevice ([0x90, 0x46, 0x00]);

        sendMidiToDevice ([0x90, 0x2e, 0x00]);
        sendMidiToDevice ([0x90, 0x2f, 0x00]);
        sendMidiToDevice ([0x90, 0x05, 0x00]);
        sendMidiToDevice ([0x90, 0x2a, 0x00]);
        sendMidiToDevice ([0x90, 0x36, 0x00]);
        sendMidiToDevice ([0x90, 0x38, 0x00]);
        sendMidiToDevice ([0x90, 0x3a, 0x00]);
        sendMidiToDevice ([0x90, 0x3b, 0x00]);
        sendMidiToDevice ([0x90, 0x3c, 0x00]);
        sendMidiToDevice ([0x90, 0x3d, 0x00]);

        sendMidiToDevice ([0x90, 0x4a, 0x00]);
        sendMidiToDevice ([0x90, 0x4b, 0x00]);
        sendMidiToDevice ([0x90, 0x4d, 0x00]);

        sendMidiToDevice ([0x90, 0x56, 0x00]);
        sendMidiToDevice ([0x90, 0x5b, 0x00]);
        sendMidiToDevice ([0x90, 0x5c, 0x00]);
        sendMidiToDevice ([0x90, 0x5d, 0x00]);
        sendMidiToDevice ([0x90, 0x5e, 0x00]);
        sendMidiToDevice ([0x90, 0x5f, 0x00]);
    }

    this.setMode = function(m) {
        this.mode = m;

        if (this.mode != "pan" && this.flip)
            this.setFlip (false);

        this.updateLEDs();
    }

    this.updateLEDs = function() {   

        sendMidiToDevice ([0x90, 0x3a, this.mode == "master"  ? 0x7f : 0x00]);
        
        sendMidiToDevice ([0x90, 0x36, this.mode == "channel" ? 0x7f : 0x00]);
        sendMidiToDevice ([0x90, 0x3c, this.mode == "section" ? 0x7f : 0x00]);
        sendMidiToDevice ([0x90, 0x3d, this.mode == "marker"  ? 0x7f : 0x00]);

        if (this.flip)
            sendMidiToDevice ([0x90, 0x2a, 0x01]);
        else
            sendMidiToDevice ([0x90, 0x2a, this.mode == "pan" ? 0x7f : 0x00]);

        if (this.mode == "scroll")
            sendMidiToDevice ([0x90, 0x38, 0x7f]);
        else if (this.mode == "zoom")
            sendMidiToDevice ([0x90, 0x38, 0x01]);
        else
            sendMidiToDevice ([0x90, 0x38, 0x00]);
    }

    this.setFlip = function(f) {       
        this.flip = f;

        if (this.mode != "pan")
            this.setMode ("pan");

        if (this.flip) {
            var val = (this.channelPan + 1.0) / 2.0 * 0x3FFF;
            sendMidiToDevice ([0xe0, val & 0x7f, (val >> 7) & 0x7f]);
        } else {
            var val = this.channelFader * 0x3FFF;
            sendMidiToDevice ([0xe0, val & 0x7f, (val >> 7) & 0x7f]);
        }
        this.updateLEDs();
    }

    this.onMoveFader = function(channelNum_, newSliderPos) {
        this.channelFader = newSliderPos;

        if (! this.flip) {
            var val = newSliderPos * 0x3FFF;
            sendMidiToDevice ([0xe0, val & 0x7f, (val >> 7) & 0x7f]);
        }
    }

    this.onPanPotMoved = function(channelNum_, newPan) {
        this.channelPan = newPan;

        if (this.flip) {
            var val = (newPan + 1.0) / 2.0 * 0x3FFF;
            sendMidiToDevice ([0xe0, val & 0x7f, (val >> 7) & 0x7f]);
        }
    }

    this.onSoloMuteChanged = function(channelNum, state, isBright) {
        var soloLit         = 1;   // Track is explicitly soloed. 
        var soloFlashing    = 2;   // Track is implicitly soloed. 
        var soloIsolate     = 4;   // Track is explicitly solo isolated. 
        var muteLit         = 8;   // Track is explicitly muted.
        var muteFlashing    = 16;  // Track is implicitly muted.

        sendMidiToDevice ([0x90, 0x08, (state & (soloLit | soloFlashing | soloIsolate)) != 0x00 ? 0x7f : 0x00]);        
        sendMidiToDevice ([0x90, 0x10, (state & (muteLit | muteFlashing)) != 0x00 ? 0x7f : 0x00]);        
    }

    this.onPlayStateChanged = function(isPlaying) {
        sendMidiToDevice ([0x90, 0x5e, isPlaying ? 0x7f : 0x00]); 
        sendMidiToDevice ([0x90, 0x5d, isPlaying ? 0x00 : 0x7f]);
    }

    this.onRecordStateChanged = function(isRecording) {
        sendMidiToDevice ([0x90, 0x5f, isRecording ? 0x7f : 0x00]);

        if (isRecording)
            sendMidiToDevice ([0x90, 0x5d, 0x00]);
    }

    this.onTrackRecordEnabled = function(channel, isEnabled) {
        sendMidiToDevice ([0x90, 0x00, isEnabled ? 0x7f : 0x00]);
    }

    this.onLoopChanged = function(isLoopOn) {
        sendMidiToDevice ([0x90, 0x56, isLoopOn ? 0x7f : 0x00]);
    }

    this.onClickChanged = function(isClickOn) {
        sendMidiToDevice ([0x90, 0x3b, isClickOn ? 0x7f : 0x00]);
    }

    this.onAutomationReadModeChanged = function(isReading) {
        sendMidiToDevice ([0x90, 0x4a, isReading ? 0x7f : 0x00]);
    }

    this.onAutomationWriteModeChanged = function(isWriting) {
        sendMidiToDevice ([0x90, 0x4b, isWriting ? 0x7f : 0x00]);
    }

    this.onMidiReceivedFromDevice = function(d) {

        var d0 = d[0];
        var d1 = d[1];
        var d2 = d[2];

        if (d0 == 0xe0) {
            var val = (d1 + (d2 << 7)) / 0x3FFF;
            if (this.flip)
                setPanPot (0, val * 2 - 1, false);
            else
                setFader (0, val, false);
        }
        else if (d0 == 0xb0 && d1 == 0x10) {
            var val = (d2 & 0x3f) / 0x3f;
            var neg = d2 & 0x40 ? true : false;
            if (neg)
                val *= -1;

            if (this.mode == "master") {  
                setMasterLevelFader (val, true);              
            }
            else if (this.mode == "pan") {    
                if (this.flip) 
                    setFader (0, val, true);
                else
                    setPanPot (0, val, true);
            }
            else if (this.mode == "channel") {    
                changeFaderBanks (neg ? -1 : 1);            
            }
            else if (this.mode == "section") {   
                if (neg)
                    nudgeLeft();
                else
                    nudgeRight();             
            }
            else if (this.mode == "scroll") {
                if (this.shiftKeyDown) {
                    if (neg)
                        scrollTracksUp();
                    else
                        scrollTracksDown();
                } else {
                    jogWheelMoved (val * 0x3f);
                }
            }
            else if (this.mode == "zoom") {
                if (this.shiftKeyDown) {
                    if (neg)
                        zoomTracksOut();                    
                    else
                        zoomTracksIn();                
                } else {
                    if (neg)
                        zoomOut();
                    else
                        zoomIn();                
                }
            }
            else if (this.mode == "marker") {  
                jogWheelMoved (val * 0x3f);  
            }
        }
        else if (d0 == 0x90) {

            // Buttons that trigger on up / down
            if (d1 == 0x5b) {
                rewind (d2 == 0x7f);

                if (d2 == 0x00 && this.rewindDown && this.fastForwardDown)
                    gotoStart();

                this.rewindDown = d2 == 0x7f;
            } 
            else if (d1 == 0x5c) {
                fastForward (d2 == 0x7f);

                if (d2 == 0x00 && this.rewindDown && this.fastForwardDown)
                    gotoStart();

                this.fastForwardDown = d2 == 0x7f;
            }
            else if (d1 == 0x46) {
                if (d2 == 0x7f)
                    this.shiftKeyDown = true;
                else
                    this.shiftKeyDown = false;

                sendMidiToDevice ([0x90, 0x46, this.shiftKeyDown ? 0x7f : 0x00]);
            }

            // Buttons that trigger on release only
            if (d2 == 0x00) {
                if (d1 == 0x20) {
                    if (this.mode == "pan") {    
                        if (! this.flip) 
                            setPanPot (0, 0, false);
                    }
                    else if (this.mode == "scroll") {
                        gotoStart();
                    }
                    else if (this.mode == "zoom") {
                        if (this.shiftKeyDown) 
                            zoomFitToTracks();
                        else
                            zoomToFit();
                    }
                    else if (this.mode == "marker") {     
                        createMarker();
                    }
                }    
                else if (d1 == 0x08) {
                    if (this.shiftKeyDown)
                        clearAllSolo();
                    else
                        toggleSolo (0);
                }
                else if (d1 == 0x10) {
                    if (this.shiftKeyDown)
                        clearAllMute();
                    else
                        toggleMute (0);
                }
                else if (d1 == 0x00) {
                    if (this.shiftKeyDown)
                        armAll();
                    else
                        toggleRecEnable (0, false);
                }
                else if (d1 == 0x03) {
                    muteOrUnmutePluginsInTrack();
                }
                else if (d1 == 0x3a) {
                    if (this.shiftKeyDown)
                        quickAction (0);
                    else 
                        this.setMode ("master");
                }
                else if (d1 == 0x3b) {
                    if (this.shiftKeyDown)
                        quickAction (1);
                    else
                        toggleClick();
                }
                else if (d1 == 0x3c) {
                    if (this.shiftKeyDown)
                        quickAction (2);
                    else
                        this.setMode ("section");
                }
                else if (d1 == 0x2a) {
                    if (this.shiftKeyDown)
                        this.setFlip (! this.flip);
                    else
                        this.setMode ("pan");
                }
                else if (d1 == 0x36) {
                    this.setMode ("channel");
                }
                else if (d1 == 0x38) {
                    if (this.shiftKeyDown)
                        this.setMode ("zoom");
                    else
                        this.setMode ("scroll");
                }
                else if (d1 == 0x3d) {
                    if (this.shiftKeyDown)
                        quickAction (3);
                    else
                        this.setMode ("marker");
                }
                else if (d1 == 0x4b) {
                    toggleAutomationWriting();
                }
                else if (d1 == 0x4a) {
                    toggleAutomationReading();
                }
                else if (d1 == 0x2e) {
                    if (this.shiftKeyDown) {
                        undo();
                    } else if (this.mode == "master") {  
                        changeFaderBanks (-1);
                    }
                    else if (this.mode == "pan") {   
                        changeFaderBanks (-1); 
                    }
                    else if (this.mode == "channel") {    
                        changeFaderBanks (-1);
                    }
                    else if (this.mode == "section") {  
                        selectOtherObject ("moveLeft", true); 
                    }
                    else if (this.mode == "scroll") {
                        scrollTracksLeft();
                    }
                    else if (this.mode == "zoom") {
                        zoomTracksOut();
                    }
                    else if (this.mode == "marker") {  
                        gotoPreviousMarker();       
                    }
                }
                else if (d1 == 0x2f) {
                    if (this.shiftKeyDown) {
                        redo();
                    } else if (this.mode == "master") {  
                        changeFaderBanks (1);
                    }
                    else if (this.mode == "pan") {    
                        changeFaderBanks (1);
                    }
                    else if (this.mode == "channel") {    
                        changeFaderBanks (1);
                    }
                    else if (this.mode == "section") {   
                        selectOtherObject ("moveRight", true);
                    }
                    else if (this.mode == "scroll") {
                        scrollTracksRight();
                    }
                    else if (this.mode == "zoom") {
                        zoomTracksIn();
                    }
                    else if (this.mode == "marker") {  
                        gotoNextMarker();              
                    }
                }
                else if (d1 == 0x56) {
                    toggleLoop();
                }
                else if (d1 == 0x5d) {
                    stop();
                }
                else if (d1 == 0x5e) {
                    play();
                } 
                else if (d1 == 0x5f) {
                    record();
                }
                else if (d1 == 0x66) {
                    if (this.shiftKeyDown)
                        footSwitch2();
                    else
                        footSwitch1();
                }
            }
        }
    }
}

registerController (new Faderport());