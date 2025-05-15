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

function Keylab() {
    this.deviceDescription                  = "Arturia KeyLab";
    this.midiChannelName                    = "KeyLab*DAW"; 
    this.midiBackChannelName                = "KeyLab*DAW"; 
    this.needsMidiBackChannel               = true;
    this.wantsClock                         = false;
    this.numberOfFaderChannels              = 8;
    this.needsMidiChannel                   = true;
    this.pickUpMode                         = true;
    this.notes                              = "Press DAW button to enable controls";

    this.initialise = function() {
    }

    //==============================================================================
   
    this.initialiseDevice = function()
    {
        for (var i = 0; i < 0x60; ++i)
            this.lightUpButton (this.mcuIdx, i, false);
    }

    this.shutDownDevice = function()
    {
        // send a reset message:
        var d = [ 0xf0, 0x00, 0x00, 0x66, 0x14, 0x08, 0x00, 0xf7 ];
        sendMidiToDevice (d);
    }

    this.updateMiscFeatures = function()
    {
    }

    this.onMidiReceivedFromDevice = function(d)
    {
        var d1 = d[1];

        if (d[0] == 0xb0)
        {
            if (d1 == 0x3c)
            {
                jogWheelMoved (((d[2] & 0x40) == 0) ? 0.5 : -0.5);
            }
            else if (d[1] >= 0x10 && d[1] <= 0x17)
            {
                var chan = (d[1] & 0x0f);
                var diff = 0.02 * (d[2] & 0x0f);

                if ((d[2] & 0x40) != 0)
                    diff = -diff;

                setPanPot (chan, diff, true);                
            }
        }
        else if (d[0] >= 0xe0 && d[0] <= 0xe8)
        {
            // fader
            var pos = clamp (0.0, 1.0, (((d[2]) << 7) + d[1]) * (1.0 / 0x3f70));

            // send it back to the MCU
            sendMidiToDevice (d);

            if (d[0] == 0xe8)
            {
                setMasterLevelFader (pos);
            }
            else
            {
                setFader ((d[0] & 0x0f), pos, false);
            }
        }
        else if (d[0] == 0x90)
        {
            if (d1 == 0x5b)
            {
                rewind (d[2] != 0);
                this.lightUpButton (0x5b, d[2] != 0);
            }
            else if (d1 == 0x5c)
            {
                fastForward (d[2] != 0);
                this.lightUpButton (0x5c, d[2] != 0);
            }         
            else if (d[2] != 0)
            {
                if (d1 >= 0x08 && d1 <= 0x0f)
                {
                    toggleSolo ((d1 - 0x08));
                }
                else if (d1 >= 0x10 && d1 <= 0x17)
                {
                    toggleMute ((d1 - 0x10));
                }       
                else if (d1 >= 0x18 && d1 <= 0x1f)
                {
                    selectPluginInTrack ((d1 - 0x18));
                }
                else if (d1 <= 0x07)
                {
                    // rec buttons
                    toggleRecEnable (d1);
                }
                else if (d1 == 0x51)
                {
                    undo();
                }
                else if (d1 == 0x5d)
                {
                    stop();
                }
                else if (d1 == 0x5f)
                {
                    record();
                }    
                else if (d1 == 0x5e)
                {
                    play();
                }
                else if (d1 == 0x2e)
                {
                    changeFaderBanks (-8);
                }
                else if (d1 == 0x2f)
                {
                    changeFaderBanks (8);
                }
                else if (d1 == 0x30)
                {
                    changeFaderBanks (-1);
                }
                else if (d1 == 0x31)
                {
                    changeFaderBanks (1);
                }
                else if (d1 == 0x4a)
                {
                    toggleAutomationReading();
                }
                else if (d1 == 0x4b)
                {
                    toggleAutomationWriting();
                }
                else if (d1 == 0x50)
                {
                    save();
                }
                else if (d1 == 0x56)
                {
                    toggleLoop();
                }
                else if (d1 == 0x57)
                {
                    jumpToMarkIn();
                }
                else if (d1 == 0x58)
                {
                    jumpToMarkOut();
                }
                else if (d1 == 0x59)
                {
                    toggleClick();
                }
                else if (d1 == 0x62)
                {
                    scrollTracksLeft();
                }
                else if (d1 == 0x63)
                {
                    scrollTracksRight();
                }
                else if (d1 == 0x66)
                {
                    footSwitch1();
                }
                else if (d1 == 0x67)
                {
                    footSwitch2();
                }
            }
        }
        else if (d[0] == 0xf0)
        {
            if (d[1] == 0
                && d[2] == 0
                && d[3] == 0x66
                && d[4] == 0x14
                && d[5] == 0x01)
            {
                // device ready message..
                this.initialiseDevice();
            }
        }
    }

    this.onMoveFader = function(channelNum, newSliderPos)
    {
        var faderPos = clamp (0, 0x3fff, (newSliderPos * 0x3fff));

        sendMidiToDevice ([(0xe0 + channelNum), (faderPos & 0x7f), (faderPos >> 7)]);
    }

    this.onMasterLevelFaderMoved = function(newSliderPos)
    {
        this.onMoveFader (8, newSliderPos);
    }

    this.movePanPotInt = function(channelNum, newPan)
    {
        sendMidiToDevice ([0xb0, (0x30 + channelNum), clamp (0x01, 0x0b, 6 + Math.round (5 * newPan))]);
    }

    this.onPanPotMoved = function(channelNum, newPan)
    {
        this.movePanPotInt (channelNum, newPan);
    }

    this.lightUpButton = function(buttonNum, on)
    {
        sendMidiToDevice ([0x90, buttonNum, on ? 0x7f : 0]);
    }

    this.onSoloMuteChanged = function(channelNum, state, isBright)
    {
        var soloLit         = 1;   // Track is explicitly soloed. 
        var soloFlashing    = 2;   // Track is implicitly soloed. 
        var soloIsolate     = 4;   // Track is explicitly solo isolated. 
        var muteLit         = 8;   // Track is explicitly muted.
        var muteFlashing    = 16;  // Track is implicitly muted.

        this.lightUpButton (0x08 + Math.floor (channelNum % 8), (state & soloLit) != 0 || (isBright && (state & soloFlashing) != 0));
        this.lightUpButton (0x10 + Math.floor (channelNum % 8), (state & muteLit) != 0 || (isBright && (state & muteFlashing) != 0));
    }

    this.onTrackSelectionChanged = function(channel, isSelected)
    {
        this.lightUpButton (0x18 + channel, isSelected);
    }

    this.onPlayStateChanged = function(isPlaying)
    {
        this.lightUpButton (0x5e, isPlaying);
        this.lightUpButton (0x5d, ! isPlaying);
    }

    this.onRecordStateChanged = function(isRecording)
    {
        this.lightUpButton (0x5f, isRecording);

        if (isRecording)
            this.lightUpButton (0x5d, false);
    }

    this.onLoopChanged = function(isLoopOn)
    {
        this.lightUpButton (0x56, isLoopOn);
    }

    this.onClickChanged = function(isClickOn)
    {
        this.lightUpButton (0x59, isClickOn);
    }

    this.onAutomationReadModeChanged = function(isReading)
    {
        this.lightUpButton (0x4a, isReading);
    }

    this.onAutomationWriteModeChanged = function(isWriting)
    {
        this.lightUpButton (0x4b, isWriting);
    }

    this.onTrackRecordEnabled = function(channel, isEnabled)
    {
        this.lightUpButton (Math.floor (channel % 8), isEnabled);
    }

    this.isShowingTracks = function()
    {
        return true;
    }

    this.onUndoStatusChanged = function(undo, redo)
    {
        this.lightUpButton (this.mcuIdx, 0x51, undo);
    }

    this.eatsAllMessages = function() {
        return true; 
    }
}

registerController (new Keylab());