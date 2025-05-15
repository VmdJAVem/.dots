function pad (num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function clamp (lo, hi, val) {
    if (val < lo) return lo;
    if (val > hi) return hi;
    return val;
}

function zeroedArray (num) {
    var arr = new Array();
    for (var i = 0; i < num; i++) {
        arr.push (0);
    }
    return arr;
}

function falseArray (num) {
    var arr = new Array();
    for (var i = 0; i < num; i++) {
        arr.push (0);
    }
    return arr;
}

function zeroed2DArray (x,y)
{
    var arr = new Array();
    for (var i = 0; i < x; i++) {
        arr.push (zeroedArray(y));
    }
    return arr;
}

function dataOut (msg) {
    var hex = new Array();
    for (var i = 0; i < msg.length; i++) {
        hex.push (msg[i].toString(16));
    }
    logMsg ("<<<", hex);
}

function repeatedString (strIn, times) {
    var str = "";
    for (var i = 0; i < times; i++) {
        str + strIn;
    }
    return strIn;
}

function strToArray (str) {
    var a = [];
    for (var i = 0; i < str.length; i++) {
        a.push (str.charCodeAt (i));
    }
    return a;
}

function paddedRight (str, len) {
    while (str.length < len) {
        str = str + " ";
    }
    return str;
}

function isString (obj) {
    return (Object.prototype.toString.call(obj) === '[object String]');
}

function volumeFaderPositionToDB (pos) {
    return (pos > 0.0) ? (20 * Math.log (pos)) + 6.0 : -100.0;
}

function decibelsToString (db) {
    if (db < -96.0) return "-INF";

    return db.toFixed (1);
}

function IconG2() {
    this.deviceDescription                  = "iCON QCON Pro G2";
    this.midiChannelName                    = "iCON QCON Pro G2"; 
    this.midiBackChannelName                = "iCON QCON Pro G2"; 
    this.needsMidiBackChannel               = true;
    this.wantsClock                         = false;
    this.numberOfFaderChannels              = 8;
    this.numCharactersForTrackNames         = 6;
    this.numCharactersForAuxLabels          = 6;
    this.numCharactersForParameterLabels    = 0;
    this.numParameterControls               = 0;
    this.numMarkers                         = 0;
    this.numCharactersForMarkerLabels       = 0;
    this.shiftKeysDown                      = 0;
    this.wantsAuxBanks                      = true;
    this.needsMidiChannel                   = true;
    this.supportedExtenders                 = 3; 

    this.maxNumSurfaces                     = 4;
    this.maxNumChannels                     = this.maxNumSurfaces * 8;
    this.maxCharsOnDisplay                  = 128;

    this.mcuIdx                             = 0;        // position of the main unit
    this.oneTouchRecord                     = true;     // does record need play + record or just record
    this.numExtenders                       = 0;        // number of Mackie XTs connected

    this.assignmentMode                     = "PanMode";
    this.panPos                             = zeroedArray(this.maxNumChannels);
    this.timecodeDigits                     = zeroedArray(9);
    this.lastSmpteBeatsSetting              = false;
    this.isZooming                          = false; 
    this.marker                             = false;
    this.nudge                              = false;

    this.lastChannelLevels                  = zeroedArray(this.maxNumChannels);
    this.recLight                           = falseArray(this.maxNumChannels);
    this.isRecButtonDown                    = false;
    this.flipped                            = false;
    this.editFlip                           = false;
    this.shiftKeysDown                      = 0;
    this.currentDisplayChars                = zeroed2DArray(this.maxNumSurfaces, this.maxCharsOnDisplay);
    this.newDisplayChars                    = zeroed2DArray(this.maxNumSurfaces, this.maxCharsOnDisplay);
    this.lastRewindPress                    = 0;
    this.lastFaderPos                       = zeroed2DArray(this.maxNumSurfaces, 9);
    this.auxLevels                          = zeroedArray(this.maxNumChannels);
    this.auxBusNames                        = zeroed2DArray(this.maxNumChannels, 7);
    this.lastStartChan                      = 0;
    this.userMovedAuxes                     = new Array();

    this.initialise = function() {
        this.indicesChanged();
    }

    this.indicesChanged = function()
    {
        for (var i = 0; i < this.maxNumSurfaces; ++i)
            for (var j = 9; --j >= 0;)
                this.lastFaderPos[i][j] = 0x7fffffff;

        this.panPos                             = zeroedArray(this.maxNumChannels);
        this.timecodeDigits                     = zeroedArray(9);
        this.lastChannelLevels                  = zeroedArray(this.maxNumChannels);
        this.recLight                           = falseArray(this.maxNumChannels);
        this.currentDisplayChars                = zeroed2DArray(this.maxNumSurfaces, this.maxCharsOnDisplay);
        this.newDisplayChars                    = zeroed2DArray(this.maxNumSurfaces, this.maxCharsOnDisplay);
    }

    //==============================================================================
    this.setDisplay = function(devIdx, text, pos)
    {
        var len = Math.min (56 * 2 - pos, text.length);

        for (var i = 0; i < len; ++i)
            this.newDisplayChars[devIdx][pos + i] = text[i];

        triggerAsyncUpdate();
    }

    this.setWholeDisplay = function(devIdx, topLine, bottomLine)
    {
        if (isString (topLine))    topLine    = strToArray (topLine);
        if (isString (bottomLine)) bottomLine = strToArray (bottomLine);

        for (var i = 0; i < this.maxCharsOnDisplay; i++)
            this.newDisplayChars[devIdx][i] = 0;

        for (var i = 0; i < Math.min(56, topLine.length); i++) 
            this.newDisplayChars[devIdx][i] = topLine[i];
        for (var i = 0; i < Math.min(56, bottomLine.length); i++) 
            this.newDisplayChars[devIdx][i + 56] = bottomLine[i];

        triggerAsyncUpdate();
    }

    this.clearDisplaySegment = function(devIdx, column, row)
    {
        this.setDisplaySegment (devIdx, column, row, "      ");
    }

    this.setDisplaySegment = function(devIdx, column, row, text)
    {
        var str = text.substring (0, 6);
        str = paddedRight(str, 6);

        this.setDisplay (devIdx, strToArray (str), column * 7 + row * 56);
    }

    this.centreDisplaySegment = function(devIdx, column, row, text)
    {
        this.setDisplaySegment (devIdx, column, row, repeatedString (" ", (6 - text.length) / 2) + text);
    }

    this.onAsyncUpdate = function()
    {
        for (var i = 0; i < this.numExtenders + 1; ++i)
        {
            var newChars = zeroedArray(this.maxCharsOnDisplay);
            
            for (var j = 0; j < this.maxCharsOnDisplay; ++j)
                newChars[j] = this.newDisplayChars[i][j];

            var currentChars = this.currentDisplayChars[i];

            for (var j = 0; j < this.maxCharsOnDisplay; ++j)
                if (newChars[j] == 0)
                    newChars[j] = 32;

            var end = 56 + 55;

            while (end > 0)
            {
                if (newChars[end] != currentChars[end])
                {
                    ++end;
                    break;
                }

                --end;
            }

            var start = 0;

            while (start < end)
            {
                if (newChars[start] != currentChars[start])
                    break;

                ++start;
            }

            if (end > start)
            {
                var d = zeroedArray(7 + end - start + 1);
                d[0] = 0xf0;
                d[3] = 0x66;
                d[4] = (i == this.mcuIdx ? 0x14 : 0x15);
                d[5] = 0x12;
                d[6] = start;
                d[7 + end - start] = 0xf7;

                for (var j = 0; j < (end - start); ++j)
                    d[7 + j] = newChars[start + j];

                sendMidiToDevice (d, i);

                for (var j = 0; j < this.maxCharsOnDisplay; j++)
                    this.currentDisplayChars[i][j] = newChars[j];
            }
        }
    }

    this.setDevSignalMetersEnabled = function(dev, b)
    {
        // enable signal level meters..
        for (var j = 0; j < 8; ++j)
        {
            var d = zeroedArray(10);
            d[0] = 0xf0;
            d[1] = 0x00;
            d[2] = 0x00;
            d[3] = 0x66;
            d[4] = (dev == this.mcuIdx) ? 0x14 : 0x15; // xxx or 15 for extender
            d[5] = 0x20;
            d[6] = j;
            d[7] = b ? 3 : 0;  // 1 for just led
            d[8] = 0xf7;

            sendMidiToDevice (d, dev);

            if (b)
            {
                var d = zeroedArray(8);
                d[0] = 0xf0;
                d[1] = 0x00;
                d[2] = 0x00;
                d[3] = 0x66;
                d[4] = (dev == this.mcuIdx) ? 0x14 : 0x15; // xxx or 15 for extender
                d[5] = 0x21;
                d[6] = 0x00;
                d[7] = 0xf7;

                sendMidiToDevice (d, dev);

                var d = zeroedArray(2);
                d[0] = 0xd0;
                d[1] = ((j << 4) | 0x0f);

                sendMidiToDevice (d, dev);
            }
        }
    }

    this.setSignalMetersEnabled = function(b)
    {
        for (var i = 0; i < this.numExtenders + 1; ++i)
            this.setDevSignalMetersEnabled (i, b);
    }

    this.initialiseDevice = function()
    {
        this.lastSmpteBeatsSetting = false;
        this.isRecButtonDown = 0;
        this.marker = 0;
        this.nudge = 0;
        this.isZooming = false;
        this.lastStartChan = 0;

        this.indicesChanged();

        this.auxLevels   = zeroedArray(this.maxNumChannels);
        this.auxBusNames = zeroed2DArray(this.maxNumChannels, 7);
    
        for (var i = 0x00; i < 0x60; ++i)
            this.lightUpButton (this.mcuIdx, i, false);

        this.currentDisplayChars                = zeroed2DArray(this.maxNumSurfaces, this.maxCharsOnDisplay);
        this.newDisplayChars                    = zeroed2DArray(this.maxNumSurfaces, this.maxCharsOnDisplay);
    
        for (var i = 0; i < this.numExtenders + 1; i++)
            this.setWholeDisplay (i, "                - Tracktion Waveform -    ", "");

        sleep (100);
        this.setSignalMetersEnabled (this.mcuIdx, true);

        this.assignmentMode = "None";
        this.setAssignmentMode ("PanMode");

        this.flipped = true;
        this.flip();

        this.updateMiscFeatures();
    }

    this.shutDownDevice = function()
    {
        // send a reset message:
        var d = [ 0xf0, 0x00, 0x00, 0x66, 0x14, 0x08, 0x00, 0xf7 ];
        sendMidiToDevice (d, this.mcuIdx);
    }

    this.updateMiscFeatures = function()
    {
    }

    this.onMidiReceivedFromDevice = function(d, deviceIndex)
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
                var chan = (d[1] & 0x0f) + 8 * deviceIndex;
                var diff = 0.02 * (d[2] & 0x0f);

                if ((d[2] & 0x40) != 0)
                    diff = -diff;

                this.panPos[chan] = clamp (-1.0, 1.0, this.panPos[chan] + diff);

                if (this.flipped)
                {
                    setFader (chan, (this.panPos[chan] + 1.0) * 0.5, false);
                }
                else
                {
                    if (this.assignmentMode == "AuxMode")
                    {
                        setAux (chan, 0, (this.panPos[chan] + 1.0) * 0.5);
                        if (this.userMovedAuxes.indexOf (chan) < 0)
                            this.userMovedAuxes.push (chan);
                        startTimer ("auxTimer", 2000);
                    }
                    else if (this.assignmentMode == "PanMode")
                    {
                        setPanPot (chan, this.panPos[chan]);
                    }
                }
            }
        }
        else if (d[0] >= 0xe0 && d[0] <= 0xe8)
        {
            // fader
            var pos = clamp (0.0, 1.0, (((d[2]) << 7) + d[1]) * (1.0 / 0x3f70));

            // send it back to the MCU
            sendMidiToDevice (d, deviceIndex);

            if (d[0] == 0xe8)
            {
                setMasterLevelFader (pos);
            }
            else
            {
                if (this.flipped)
                {
                    if (this.assignmentMode == "AuxMode")
                    {
                        userMovedAux ((d[0] & 0x0f) + deviceIndex * 8, pos);
                        var v = (d[0] & 0x0f) + deviceIndex * 8;
                        if (this.userMovedAuxes.indexOf (v) < 0)
                            this.userMovedAuxes.push (v);
                        startTimer ("auxTimer", 2000);
                    }
                    else if (this.assignmentMode == "PanMode")
                    {
                        setPanPot ((d[0] & 0x0f) + deviceIndex * 8, pos * 2.0 - 1.0, false);
                    }
                }
                else
                {
                    setFader ((d[0] & 0x0f) + deviceIndex * 8, pos, false);
                }
            }
        }
        else if (d[0] == 0x90)
        {
            if (d1 == 0x5b)
            {
                rewind (d[2] != 0);
                this.lightUpButton (deviceIndex, 0x5b, d[2] != 0);
            }
            else if (d1 == 0x5c)
            {
                fastForward (d[2] != 0);
                this.lightUpButton (deviceIndex, 0x5c, d[2] != 0);
            }
            else if (d1 == 0x5f)
            {
                this.isRecButtonDown = (d[2] != 0);

                if (this.oneTouchRecord)
                {
                    if (this.isRecButtonDown)
                    {
                        if (this.shiftKeysDown != 0)
                            armAll();
                        else
                            record();
                    }
                }
                else
                {
                    if (this.isRecButtonDown && (this.shiftKeysDown != 0))
                        armAll();
                }
            }
            else if (d1 == 0x54)
            {
                if (d[2] != 0)
                    this.shiftKeysDown = 1;
                else
                    this.shiftKeysDown = 0;

                this.lightUpButton (this.mcuIdx, 0x54, d[2] != 0);
            }
            else if (d[2] != 0)
            {
                if (d1 >= 0x08 && d1 <= 0x0f)
                {
                    if (this.shiftKeysDown)
                        toggleSoloIsolate ((d1 - 0x08) + 8 * deviceIndex);
                    else
                        toggleSolo ((d1 - 0x08) + 8 * deviceIndex);
                }
                else if (d1 >= 0x10 && d1 <= 0x17)
                {
                    toggleMute ((d1 - 0x10) + 8 * deviceIndex, this.shiftKeysDown != 0);
                }
                else if (d1 >= 0x20 && d1 <= 0x27)
                {
                    var chan = (d1 & 0x0f) + 8 * deviceIndex;
                    this.panPos[chan] = 0.0;

                    if (this.flipped)
                    {
                        setFader (chan, decibelsToVolumeFaderPosition (0.0), false);
                    }
                    else
                    {
                        if (this.assignmentMode == "AuxMode")
                        {
                            toggleAuxMute(chan, 0);
                        }
                        else if (this.assignmentMode == "PanMode")
                        {
                            setPanPot (chan, 0.0);
                        }
                    }
                }
                else if (d1 >= 0x18 && d1 <= 0x1f)
                {
                    if (this.shiftKeysDown != 0)
                    {
                        selectClipInTrack ((d1 - 0x18) + 8 * deviceIndex);
                    }
                    else
                    {
                        selectPluginInTrack ((d1 - 0x18) + 8 * deviceIndex);
                    }
                }
                else if (d1 <= 0x07)
                {
                    // rec buttons
                    toggleRecEnable (d1 + 8 * deviceIndex, this.shiftKeysDown != 0);
                }
                else if (d1 == 0x5d)
                {
                    stop();
                }
                else if (d1 == 0x5e)
                {
                    if (this.oneTouchRecord)
                    {
                        play();
                    }
                    else
                    {
                        if (this.isRecButtonDown)
                            record();
                        else
                            play();
                    }
                }
                else if (d1 == 0x2e)
                {
                    changeFaderBanks (-(this.numExtenders + 1) * 8);
                }
                else if (d1 == 0x2f)
                {
                    changeFaderBanks ((this.numExtenders + 1) * 8);
                }
                else if (d1 == 0x30)
                {
                    changeFaderBanks (-1);
                }
                else if (d1 == 0x31)
                {
                    changeFaderBanks (1);
                }
                else if (d1 == 0x32)
                {
                    this.flip();
                }
                else if (d1 == 0x34)
                {
                    toggleMixerWindow (this.shiftKeysDown != 0);
                }
                else if (d1 == 0x35)
                {
                    toggleMidiEditorWindow (this.shiftKeysDown != 0);
                }
                else if (d1 >= 0x36 && d1 <= 0x44)
                {
                    quickAction (d1 - 0x36);
                }
                else if (d1 == 0x44)
                {
                    quickAction (15);
                }
                else if (d1 == 0x45)
                {
                    showEditScreen();
                }
                else if (d1 == 0x46)
                {
                    toggleTrackEditorWindow (this.shiftKeysDown != 0);
                }
                else if (d1 == 0x47)
                {
                    showBrowserWindow();
                }
                else if (d1 == 0x48)
                {
                    showActionsWindow();
                }
                else if (d1 == 0x4a)
                {
                    this.setAssignmentMode ("PanMode");
                }
                else if (d1 == 0x4b)
                {
                    this.setAssignmentMode ("AuxMode");
                    if (this.shiftKeysDown)
                    {
                        changeAuxBank (-100);
                        changeAuxBank (2);
                    }
                    else
                    {
                        changeAuxBank (-100);
                        changeAuxBank (1);
                    }
                }
                else if (d1 == 0x4c)
                {
                    if (this.shiftKeysDown)
                        toggleCountIn();
                    else
                        toggleClick();
                }
                else if (d1 == 0x4d)
                {
                    toggleSnap();
                }
                else if (d1 == 0x4e)
                {
                    paste (this.shiftKeysDown != 0);
                }
                else if (d1 == 0x4f)
                {
                    del (this.shiftKeysDown != 0);
                }
                else if (d1 == 0x50)
                {
                    toggleAutomationReading();
                }
                else if (d1 == 0x51)
                {
                    toggleAutomationWriting();
                }
                else if (d1 == 0x52)
                {
                    redo();
                }
                else if (d1 == 0x53)
                {
                    if (this.shiftKeysDown)
                        saveAs();
                    else
                        save();
                }
                else if (d1 == 0x54)
                {
                }
                else if (d1 == 0x55)
                {
                    undo();
                }
                else if (d1 == 0x56)
                {
                    toggleLoop();
                }
                else if (d1 == 0x64)
                {
                    this.isZooming = ! this.isZooming;
                    this.lightUpButton (this.mcuIdx, 0x64, this.isZooming);
    
                    this.editFlip = false;
                    this.lightUpButton (this.mcuIdx, 0x33, this.editFlip);
                }
                else if (d1 == 0x60)
                {                    
                    // up
                    if (this.isZooming)
                        zoomTracksIn();
                    else if (this.editFlip)
                        selectOtherObject ("moveUp", false);
                    else
                        scrollTracksDown();
                }
                else if (d1 == 0x61)
                {
                    // down
                    if (this.isZooming)
                    {
                        if (this.shiftKeysDown)
                        {
                            zoomToSelection();
                        }
                        else
                        {
                            zoomTracksOut();
                        }
                    }
                    else if (this.editFlip)
                    {
                        selectOtherObject ("moveDown", false);
                    }
                    else
                    {
                        scrollTracksUp();
                    }
                }
                else if (d1 == 0x62)
                {
                    // left
                    if (this.isZooming)
                        zoomOut();
                    else if (this.editFlip)
                        selectOtherObject ("moveLeft", false);
                    else
                        scrollTracksLeft();
                }
                else if (d1 == 0x63)
                {
                    // right
                    if (this.isZooming)
                        zoomIn();
                    else if (this.editFlip)
                        selectOtherObject ("moveRight", false);
                    else
                        scrollTracksRight();
                }
                else if (d1 == 0x28)
                {
                    if (this.shiftKeysDown)
                        jumpToMarkIn();
                    else
                        setMarkIn();
                }
                else if (d1 == 0x29)
                {
                    if (this.shiftKeysDown)
                        jumpToMarkOut();
                    else
                        setMarkOut();
                }
                else if (d1 == 0x2a)
                {
                    togglePunch();
                }
                else if (d1 == 0x2b)
                {
                    toggleScroll();
                }
                else if (d1 == 0x2c)
                {
                    cut();
                }
                else if (d1 == 0x2d)
                {
                    copy();
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
                if (deviceIndex == this.mcuIdx)
                {
                    this.initialiseDevice();
                    updateDeviceState();
                }
            }
        }
    }

    this.flip = function()
    {
        this.flipped = ! this.flipped;
        this.lightUpButton (this.mcuIdx, 0x32, this.flipped);
        updateDeviceState();
    }

    this.setAssignmentMode = function(newMode)
    {
        if (this.assignmentMode != newMode)
        {
            this.currentDisplayChars = zeroed2DArray(this.maxNumSurfaces, this.maxCharsOnDisplay);

            stopTimer ("auxTimer");
            this.auxBusNames = zeroed2DArray(this.maxNumChannels, 7);
            this.userMovedAuxes = new Array();

            this.assignmentMode = newMode;
            redrawSelectedPlugin();

            this.lightUpButton (this.mcuIdx, 0x4a, this.assignmentMode == "PanMode");
            this.lightUpButton (this.mcuIdx, 0x4b, this.assignmentMode == "AuxMode");

            if (newMode == "PanMode")
            {
                this.setSignalMetersEnabled (true);
                changeFaderBanks (0);
            }
            else if (newMode == "AuxMode")
            {
                this.setSignalMetersEnabled (false);
                this.clearAllDisplays();
                changeAuxBank (-100);
                changeAuxBank (1);
                changeFaderBanks (0);
            }

            this.onTimer();
        }
    }

    this.onTimer = function (name)
    {
        if (name == "auxTimer")
        {
            stopTimer ("auxTimer");

            var auxCopy = this.userMovedAuxes;
            this.userMovedAuxes = new Array();

            for (var i = auxCopy.length; --i >= 0;)
            {
                var chan = auxCopy[i];
                var level = this.auxLevels[chan];
                this.auxLevels[chan] = -1000.0;
                this.onAuxMoved (chan, 0, this.auxBusNames[chan], level);
            }
        }
    }

    this.moveFaderInt = function(dev, channelNum, newSliderPos)
    {
        var faderPos = clamp (0, 0x3fff, (newSliderPos * 0x3fff));

        if (Math.abs (this.lastFaderPos[dev][channelNum] - faderPos) > 2)
        {
            this.lastFaderPos[dev][channelNum] = faderPos;

            sendMidiToDevice ([(0xe0 + channelNum), (faderPos & 0x7f), (faderPos >> 7)], dev);
        }
    }

    this.onMoveFader = function(channelNum_, newSliderPos)
    {
        var channelNum = Math.floor (channelNum_ % 8);
        var dev        = Math.floor (channelNum_ / 8);

        if (channelNum < 8)
        {
            if (this.flipped)
                this.movePanPotInt (dev, channelNum, newSliderPos * 2.0 - 1.0);
            else
                this.moveFaderInt (dev, channelNum, newSliderPos);
        }
    }

    this.onMasterLevelFaderMoved = function(newSliderPos)
    {
        this.moveFaderInt (this.mcuIdx, 8, newSliderPos);
    }

    this.movePanPotInt = function(dev, channelNum, newPan)
    {
        this.panPos [dev * 8 + channelNum] = newPan;

        sendMidiToDevice ([0xb0, (0x30 + channelNum), clamp (0x01, 0x0b, 6 + Math.round (5 * newPan))], dev);
    }

    this.onPanPotMoved = function(channelNum_, newPan)
    {
        var channelNum = Math.floor (channelNum_ % 8);
        var dev        = Math.floor (channelNum_ / 8);

        if (this.flipped)
            this.moveFaderInt (dev, channelNum, (newPan + 1.0) * 0.5);
        else if (this.assignmentMode == "PanMode")
            this.movePanPotInt (dev, channelNum, newPan);
    }

    this.auxString = function(chan)
    {
        return decibelsToString (volumeFaderPositionToDB (this.auxLevels[chan]));
    }

    this.onAuxMoved = function(channelNum_, num, bus, newPos)
    {
        var channelNum = Math.floor (channelNum_ % 8);
        var dev        = Math.floor (channelNum_ / 8);

        if ((this.auxLevels[channelNum_] != newPos || bus == this.auxBusNames[channelNum_])
            && channelNum >= 0 && channelNum < 8)
        {
            this.auxLevels[channelNum_] = newPos;
            this.auxBusNames[channelNum_] = bus;

            if (this.assignmentMode == "AuxMode")
            {
                if (this.flipped)
                    this.moveFaderInt (dev, channelNum, newPos);
                else
                    this.movePanPotInt (dev, channelNum, newPos * 2.0 - 1.0);

                if (this.userMovedAuxes.indexOf (channelNum_) != -1)
                    this.setDisplaySegment (dev, channelNum, 1, this.auxString (channelNum_));
                else
                    this.setDisplaySegment (dev, channelNum, 1, String (bus));
            }
        }
    }

    this.onAuxCleared = function(channel_, num)
    {
        var channel = Math.floor (channel_ % 8);
        var dev     = Math.floor (channel_ / 8);

        if (this.assignmentMode == "AuxMode")
        {
            this.clearDisplaySegment (dev, channel, 1);

            if (this.flipped)
                this.moveFaderInt (dev, channel, 0);
            else
                this.movePanPotInt (dev, channel, 0);
        }
    }

    this.lightUpButton = function(dev, buttonNum, on)
    {
        sendMidiToDevice ([0x90, buttonNum, on ? 0x7f : 0], dev);
    }

    this.onSoloMuteChanged = function(channelNum, state, isBright)
    {
        var soloLit         = 1;   // Track is explicitly soloed. 
        var soloFlashing    = 2;   // Track is implicitly soloed. 
        var soloIsolate     = 4;   // Track is explicitly solo isolated. 
        var muteLit         = 8;   // Track is explicitly muted.
        var muteFlashing    = 16;  // Track is implicitly muted.

        this.lightUpButton (Math.floor (channelNum / 8), 0x08 + Math.floor (channelNum % 8), (state & soloLit) != 0 || (isBright && (state & soloFlashing) != 0));
        this.lightUpButton (Math.floor (channelNum / 8), 0x10 + Math.floor (channelNum % 8), (state & muteLit) != 0 || (isBright && (state & muteFlashing) != 0));
    }

    this.onSoloCountChanged = function(anySoloTracks)
    {
        // (rude solo light)
        this.lightUpButton (this.mcuIdx, 0x73, anySoloTracks);
    }

    this.onTrackSelectionChanged = function(channel, isSelected)
    {
        this.lightUpButton (Math.floor (channel / 8), 0x18 + Math.floor (channel % 8), isSelected);
    }

    this.onPlayStateChanged = function(isPlaying)
    {
        this.lightUpButton (this.mcuIdx, 0x5e, isPlaying);
        this.lightUpButton (this.mcuIdx, 0x5d, ! isPlaying);
    }

    this.onRecordStateChanged = function(isRecording)
    {
        this.lightUpButton (this.mcuIdx, 0x5f, isRecording);

        if (isRecording)
            this.lightUpButton (this.mcuIdx, 0x5d, false);
    }

    this.onLoopChanged = function(isLoopOn)
    {
        this.lightUpButton (this.mcuIdx, 0x56, isLoopOn);
    }

    this.onPunchChanged = function(isPunching)
    {
        this.lightUpButton (this.mcuIdx, 0x2a, isPunching);
    }

    this.onClickChanged = function(isClickOn)
    {
        this.lightUpButton (this.mcuIdx, 0x4c, isClickOn);
    }

    this.onScrollChanged = function(isScroll) 
    {        
        this.lightUpButton (this.mcuIdx, 0x2b, isScroll);
    }

    this.onSnapChanged = function(isSnapOn)
    {
        this.lightUpButton (this.mcuIdx, 0x4d, isSnapOn);
    }

    this.onAutomationReadModeChanged = function(isReading)
    {
        this.lightUpButton (this.mcuIdx, 0x50, isReading);
    }

    this.onAutomationWriteModeChanged = function(isWriting)
    {
        this.lightUpButton (this.mcuIdx, 0x51, isWriting);
    }

    this.onFaderBankChanged = function(newStartChannelNumber, trackNames)
    {
        if (this.assignmentMode == "PanMode" || this.assignmentMode == "AuxMode")
        {
            if (newStartChannelNumber != this.lastStartChan)
            {
                this.lastStartChan = newStartChannelNumber;

                ++newStartChannelNumber;

                sendMidiToDevice ([0xb0, 0x4a, (0x30 + newStartChannelNumber % 10)], this.mcuIdx);
                sendMidiToDevice ([0xb0, 0x4b, (0x30 + newStartChannelNumber / 10)], this.mcuIdx);
            }

            this.clearAllDisplays();

            for (var i = 0; i < this.numExtenders + 1; ++i)
            {
                for (var j = 0; j < 8; ++j)
                    this.centreDisplaySegment (i, j, 0, j + i * 8 < trackNames.length ? trackNames[j + i * 8] : "");

                if (this.assignmentMode != "PanMode")
                    for (var j = 0; j < 8; j++)
                        this.setDisplaySegment (i, j, 1, this.auxString (j + i * 8));
            }
        }
    }

    this.onChannelLevelChanged = function(channelNum_, l, r)
    {
        var channel = Math.floor (channelNum_ % 8);
        var dev     = Math.floor (channelNum_ / 8);

        if (this.assignmentMode == "PanMode")
        {
            var newValue = clamp (0, 13, Math.round (13.0 * Math.max (l, r)));

            if (this.lastChannelLevels[channelNum_] != newValue)
            {
                this.lastChannelLevels[channelNum_] = newValue;

                var d = zeroedArray(2);
                d[0] = 0xd0;
                d[1] = ((channel << 4) | newValue);

                sendMidiToDevice (d, dev);
            }
        }
    }

    this.convertCharToMCUCode = function(c)
    {
        if (c >= "a".charCodeAt(0) && c <= "z".charCodeAt(0))   return ((c - "a".charCodeAt(0)) + 1);
        if (c >= "A".charCodeAt(0) && c <= "Z".charCodeAt(0))   return ((c - "A".charCodeAt(0)) + 1);
        if (c >= "0".charCodeAt(0) && c <= "9".charCodeAt(0))   return ((c - "0".charCodeAt(0)) + 0x30);

        return 0x20;
    }

    this.updateTCDisplay = function(newDigits)
    {
        for (var i = 0; i < this.timecodeDigits.length; ++i)
        {
            var c = newDigits.charCodeAt(i);

            if (this.timecodeDigits[i] != c)
            {
                this.timecodeDigits[i] = c;
                sendMidiToDevice ([0xb0, (0x49 - i), this.convertCharToMCUCode (c)], this.mcuIdx);
            }
        }
    }

    this.onTimecodeChanged = function(barsOrHours, beatsOrMinutes, ticksOrSeconds, millisecs, isBarsBeats, isFrames)
    {
        var txt = "";

        if (isBarsBeats)
            txt = pad(barsOrHours, 3) + pad(beatsOrMinutes, 2) + " " + pad(ticksOrSeconds, 3);
        else if (isFrames)
            txt = pad(barsOrHours, 2) + pad(beatsOrMinutes, 2) + pad(ticksOrSeconds, 2) + " " + pad(millisecs, 2);
        else
            txt = pad(barsOrHours, 2) + pad(beatsOrMinutes, 2) + pad(ticksOrSeconds, 2) + pad(millisecs, 3);

        this.updateTCDisplay (txt);

        if (this.lastSmpteBeatsSetting != isBarsBeats)
        {
            this.lastSmpteBeatsSetting = isBarsBeats;

            this.lightUpButton (this.mcuIdx, 0x71, ! isBarsBeats);
            this.lightUpButton (this.mcuIdx, 0x72, isBarsBeats);
        }
    }

    this.onTrackRecordEnabled = function(channel, isEnabled)
    {
        if (this.recLight[channel] != isEnabled)
        {
            this.recLight[channel] = isEnabled;
            this.lightUpButton (Math.floor (channel / 8), Math.floor (channel % 8), isEnabled);
        }
    }

    this.isShowingPluginParams = function()
    {
        return false;
    }

    this.isShowingMarkers = function()
    {
        return false;
    }

    this.isShowingTracks = function()
    {
        return true;
    }

    this.onExtendersChanged = function(num, main)
    {
        this.mcuIdx                 = main;
        this.numExtenders           = num;
        this.numberOfFaderChannels  = 8 * (num + 1);
        this.numParameterControls   = 8 * (num + 1);
        this.numMarkers             = 8 * (num + 1);

        updateDeviceState();
    }
    this.clearAllDisplays = function()
    {
        for (var i = 0; i < this.numExtenders + 1; ++i)
            this.setWholeDisplay (i, "", "");
    }

    this.onAuxBankChanged = function(bank)
    {
        for (var i = 0; i < this.maxNumChannels; ++i)
            this.auxLevels[i] = -1000.0;

        stopTimer("auxTimer");
        this.auxBusNames = zeroed2DArray(this.maxNumChannels, 7);
        
        this.userMovedAuxes = new Array();

        this.auxBank = bank;
    }
}

registerController (new IconG2());