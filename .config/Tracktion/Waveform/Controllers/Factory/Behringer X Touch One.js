/*
    Behringer X Touch One
*/

function pad (num, size) {
    num = num.toString();
    while (num.length < size) num = " " + num;
    return num;
}

function zpad (num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function sevenSeg (num) {
    if (num == "0") return 0x3f;
    if (num == "1") return 0x06;
    if (num == "2") return 0x5b;
    if (num == "3") return 0x4f;
    if (num == "4") return 0x66;
    if (num == "5") return 0x6d;
    if (num == "6") return 0x7d;
    if (num == "7") return 0x07;
    if (num == "8") return 0x7f;
    if (num == "9") return 0x6f;
    return 0;
}

function dataOut (msg) {
    var hex = new Array();
    for (var i = 0; i < msg.length; i++) {
        hex.push (msg[i].toString(16));
    }
    logMsg ("<<<", hex);
}

function BehringerXTouchOne() {
    // Variables: these must be filled out so the session knows your controller layout
    this.deviceDescription               = "Behringer X Touch One";     // device name
    this.needsMidiChannel                = true;                        // send midi controller to daw
    this.needsMidiBackChannel            = true;                        // send midi daw to controller
    this.midiChannelName                 = "X-Touch One";               // MIDI channel name
    this.midiBackChannelName             = "X-Touch One";               // MIDI channel name
    this.numberOfFaderChannels           = 1;                           // number physical faders      
    this.allowBankingOffEnd              = true;                        // allow surface to display blank channels
    this.numCharactersForTrackNames      = 7;                           // number of characters to display for track names
    this.notes                           = "Press and hold stop while pressing encoder. Rotate encoder to 'CChgRel' and press encoder again";

    this.masterMode                      = false;
    this.nudgeMode                       = false;
    this.zoomMode                        = false;

    this.channelLevel                    = 0;
    this.masterLevel                     = 0;

    this.trackName                       = "";
    this.trackDB                         = "";
    this.masterDB                        = "";

    this.initialise = function() {
    }

    this.initialiseDevice = function() {
        this.updateMiscFeatures();
        this.updateDisplay ("Wave", "   form");
    }

    this.toggleMasterMode = function() {
        this.masterMode = ! this.masterMode;
        this.updateMiscFeatures();
        changeFaderBanks (0);
        this.updateDisplay();
    }

    this.toggleNudge = function() {
        this.nudgeMode = ! this.nudgeMode;
        this.updateMiscFeatures();
    }

    this.toggleZoom = function() {
        this.zoomMode = ! this.zoomMode;
        this.updateMiscFeatures();
    }

    this.updateMiscFeatures = function() {
        sendMidiToDevice ([0xb0, 0x02, this.masterMode ? 0x7f : 0x00]);
        sendMidiToDevice ([0xb0, 0x0e, this.nudgeMode ? 0x7f : 0x00]);
        sendMidiToDevice ([0xb0, 0x20, this.zoomMode ? 0x7f : 0x00]);
    }

    this.updateTime = function(txt) {
        var msg = [0xF0, 0x00, 0x20, 0x32, 0x41, 0x37];

        msg.push (0x00);
        msg.push (0x00);

        for (var i = 0; i < 10; i++) {
            msg.push (sevenSeg (txt.charAt (i)));
        }

        msg.push (0x00);
        msg.push (0x00);
        
        msg.push (0xF7);

        sendMidiToDevice (msg);
    }

    this.onTimecodeChanged = function(barsOrHours, beatsOrMinutes, ticksOrSeconds, millisecs, isBarsBeats, isFrames) {
        var txt = "";

        if (isBarsBeats)
            txt = pad(barsOrHours, 3) + pad(beatsOrMinutes, 2) + "  " + pad(ticksOrSeconds, 3);
        else if (isFrames)
            txt = pad(barsOrHours, 3) + pad(beatsOrMinutes, 2) + pad(ticksOrSeconds, 2) + " " + zpad(millisecs, 2);
        else
            txt = pad(barsOrHours, 3) + pad(beatsOrMinutes, 2) + pad(ticksOrSeconds, 2) + zpad(millisecs, 3);

        while (txt.length < 10) 
            txt += " ";

        this.updateTime (txt);
    }

    this.sendDisplay = function(line1, line2) {
        var msg = [0xF0, 0x00, 0x20, 0x32, 0x41, 0x4C, 0x00, 0x07];

        for (var i = 0; i < 7; i++) {
            if (i < line1.length) 
                msg.push (line1.charCodeAt(i));
            else
                msg.push (0x20);
        }

        for (var i = 0; i < 7; i++) {
            if (i < line2.length) 
                msg.push (line2.charCodeAt(i));
            else
                msg.push (0x20);
        }

        msg.push (0xF7);

        sendMidiToDevice (msg);
    }

    this.updateDisplay = function() {
        if (this.masterMode)
            this.sendDisplay ("Master", this.masterDB);
        else
            this.sendDisplay (this.trackName, this.trackDB);
    }

    this.onFaderBankChanged = function(newStartChannelNumber, trackNames) {      
        this.trackName = trackNames[0];
        this.updateDisplay();
    }

    // tells the device to move one of its faders.
    // the channel number is the physical channel on the device, regardless of bank selection
    // slider pos is 0 to 1.0
    this.onMoveFader = function(channelNum, newSliderPos) { 
        this.channelLevel = newSliderPos;
        if (! this.masterMode) {
            sendMidiToDevice ([0xb0, 0x46, Math.round (newSliderPos * 127)]);
        }

        var text = "-inf dB";
        if (newSliderPos > 0.0) {
            var db = 20.0 * Math.log (newSliderPos) + 6.0;
            text = db.toFixed(1) + "dB";
        }
        this.trackDB = text;
        this.updateDisplay();
    }

    // tells the device to move the master faders, if it has them. If it just has one master
    // fader, it can use the average of these levels.
    // slider pos is 0 to 1.0
    this.onMasterLevelFaderMoved = function(newSliderPos) {        
        this.masterLevel = newSliderPos;
        if (this.masterMode) {
            sendMidiToDevice ([0xb0, 0x46, Math.round (this.masterLevel * 127)]);
        }

        var text = "-inf dB";
        if (this.masterLevel > 0.0) {
            var db = 20.0 * Math.log (this.masterLevel) + 6.0;
            text = db.toFixed(1) + "dB";
        }
        this.masterDB = text;
        this.updateDisplay();
    }

    // when a track is selected or deselected
    this.onTrackSelectionChanged = function(channel, isSelected) {   
        sendMidiToDevice ([0xb0, 0x03, isSelected ? 0x7f : 0x00]);     
    }

    this.onTrackRecordEnabled = function(channel, isEnabled) {      
        sendMidiToDevice ([0xb0, 0x06, isEnabled ? 0x7f : 0x00]);     
    }

    // tells the device to move a pan pot.
    // the channel number is the physical channel on the device, regardless of bank selection
    // pan is -1.0 to 1.0
    this.onPanPotMoved = function(channelNum, newPan) {   
        sendMidiToDevice ([0xb0, 0x50, Math.round ((newPan + 1) / 2 * 127)]);    
    }

    // if the device has per-channel level meters, this should update one of them.
    // the channel number is the physical channel on the device, regardless of bank selection
    // level is 0 to 1.0
    this.onChannelLevelChanged = function(channel, left, right) {   
        var level = Math.max (left, right);
        if (level > 1.0) level = 1.0;
        if (level < 0.0) level = 0.0;

        sendMidiToDevice ([0xb0, 0x5a, Math.round (level * level * 127)]);
    }

    // the channel number is the physical channel on the device, regardless of bank selection
    // soloLit         = 1,    Track is explicitly soloed. 
    // soloFlashing    = 2,    Track is implicitly soloed. 
    // soloIsolate     = 4,    Track is explicitly solo isolated. 
    // muteLit         = 8,    Track is explicitly muted.
    // muteFlashing    = 16    Track is implicitly muted.
    this.onSoloMuteChanged = function(channelNum, muteAndSoloLightState, isBright) {
        var m = ((muteAndSoloLightState & (8 | 16)) != 0 ? 1 : 0);
        var s = ((muteAndSoloLightState & (1 | 2 | 4)) != 0 ? 1 : 0);

        sendMidiToDevice ([0xb0, 0x04, m ? 0x7f : 0x00]);
        sendMidiToDevice ([0xb0, 0x05, s ? 0x7f : 0x00]);
    }

    // tells the device that playback has stopped or started, and it should turn its lights on
    // accordingly.
    this.onPlayStateChanged = function(isPlaying) {  
        sendMidiToDevice ([0xb0, 0x17, isPlaying ? 0x7f : 0x00]);
        sendMidiToDevice ([0xb0, 0x16, ! isPlaying ? 0x7f : 0x00]);
    }
    this.onRecordStateChanged = function(isRecording) {
        sendMidiToDevice ([0xb0, 0x18, isRecording ? 0x7f : 0x00]);
    }

    this.onAutomationWriteModeChanged = function(isWriting) {
        sendMidiToDevice ([0xb0, 0x10, isWriting ? 0x7f : 0x00]);
    }

    // tells the device that punch has been turned on or off.
    this.onPunchChanged = function(isPunching) {        
        sendMidiToDevice ([0xb0, 0x11, isPunching ? 0x7f : 0x00]);
    }
    
    // tells the device that looping has been turned on or off.
    this.onLoopChanged = function(isLoopOn) {   
        sendMidiToDevice ([0xb0, 0x0f, isLoopOn ? 0x7f : 0x00]);   
    }

    // tells the device that the click has been turned on or off.
    this.onClickChanged = function(isClickOn) {           
        sendMidiToDevice ([0xb0, 0x12, isClickOn ? 0x7f : 0x00]);   
    }

    this.onSoloCountChanged =function(anySoloTracks) {        
        sendMidiToDevice ([0xb0, 0x13, anySoloTracks ? 0x7f : 0x00]);   
    }

    // Called when a midi message comes in from the controller. You must
    //  translate this and call methods in the session accordingly to
    // trigger whatever action the user is trying to do.
    this.onMidiReceivedFromDevice = function(d) {
        var d1 = d[0];
        var d2 = d[1];
        var d3 = d[2];

        if (d1 == 0xb0) {
            if (d2 == 0x14) {
                rewind (d3 == 0x7f);
            }
            else if (d2 == 0x15) {
                fastForward (d3 == 0x7f);            
            }
            else if (d2 == 0x58) {
                if (d3 == 0x41) {
                    if (this.nudgeMode) 
                        nudgeRight();
                    else
                        jogWheelMoved (1.0);
                } else {
                    if (this.nudgeMode)
                        nudgeLeft();
                    else
                        jogWheelMoved (-1.0);
                }
            }
            else if (d2 == 0x46) {
                if (this.masterMode) 
                    setMasterLevelFader (d3 / 0x7f, false);
                else
                    setFader (0, d3 / 0x7f, false);
            }
            else if (d2 == 0x50) {
                setPanPot (0, d3 == 0x41 ? 0.05 : -0.05, true);
            }

            // Buttons that only trigger on release
            if (d3 == 0x00) {
                     if (d2 == 0x01) toggleBeatsSecondsMode(); 
                else if (d2 == 0x02) this.toggleMasterMode(); 
                else if (d2 == 0x03) selectTrack (0);
                else if (d2 == 0x04) toggleMute (0, false);
                else if (d2 == 0x05) toggleSolo (0);
                else if (d2 == 0x06) toggleRecEnable (0, false);
                else if (d2 == 0x07) quickAction (0);
                else if (d2 == 0x08) quickAction (1);
                else if (d2 == 0x09) quickAction (2);
                else if (d2 == 0x0a) quickAction (3);
                else if (d2 == 0x0b) quickAction (4);
                else if (d2 == 0x0c) quickAction (5);
                else if (d2 == 0x0d) createMarker();
                else if (d2 == 0x0e) this.toggleNudge();
                else if (d2 == 0x0f) toggleLoop();
                else if (d2 == 0x10) toggleAutomationWriting();
                else if (d2 == 0x11) togglePunch();
                else if (d2 == 0x12) toggleClick();
                else if (d2 == 0x13) clearAllSolo();
                else if (d2 == 0x16) stop();
                else if (d2 == 0x17) play();
                else if (d2 == 0x18) record();
                else if (d2 == 0x19) changeFaderBanks (-8);
                else if (d2 == 0x1a) changeFaderBanks (8);
                else if (d2 == 0x1b) changeFaderBanks (-1);
                else if (d2 == 0x1c) changeFaderBanks (1);
                else if (d2 == 0x20) this.toggleZoom();
                else if (d2 == 0x1e)
                {                    
                    // up
                    if (this.zoomMode)
                        zoomTracksIn();
                    else
                        scrollTracksDown();
                }
                else if (d2 == 0x22)
                {
                    // down
                    if (this.zoomMode)
                        zoomTracksOut();
                    else
                        scrollTracksUp();
                }
                else if (d2 == 0x1f)
                {
                    // left
                    if (this.zoomMode)
                        zoomOut();
                    else
                        scrollTracksLeft();
                }
                else if (d2 == 0x21)
                {
                    // right
                    if (this.zoomMode)
                        zoomIn();
                    else
                        scrollTracksRight();
                }
            }            
        }
    }
}

registerController (new BehringerXTouchOne());
