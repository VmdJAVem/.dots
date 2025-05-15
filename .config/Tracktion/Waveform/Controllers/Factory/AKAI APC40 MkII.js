function dataOut (msg) {
    var hex = new Array();
    for (var i = 0; i < msg.length; i++) {
        hex.push (msg[i].toString(16));
    }
    logMsg ("<<<", hex);
}

function initArray (num, val) {
    var arr = new Array();
    for (var i = 0; i < num; i++) {
        arr.push (val);
    }
    return arr;
}

function init2DArray (x,y,val)
{
    var arr = new Array();
    for (var i = 0; i < x; i++) {
        arr.push (initArray (y,val));
    }
    return arr;
}

function hueToHex (color)
{
    var col = 0;
    switch (color)
    {
        case 0:  col = 0x00; break;
        case 1:  col = 0x05; break;
        case 2:  col = 0x05; break;
        case 3:  col = 0x09; break;
        case 4:  col = 0x09; break;
        case 5:  col = 0x0D; break;
        case 6:  col = 0x0D; break;
        case 7:  col = 0x15; break;
        case 8:  col = 0x15; break;
        case 9:  col = 0x21; break;
        case 10: col = 0x25; break;
        case 11: col = 0x29; break;
        case 12: col = 0x29; break;
        case 13: col = 0x2D; break;
        case 14: col = 0x2D; break;
        case 15: col = 0x31; break;
        case 16: col = 0x31; break;
        case 17: col = 0x35; break;
        case 18: col = 0x39; break;
    }
    return col;
}

function AKAIAPC40() {
    // Variables: these must be filled out so the session knows your controller layout
    this.deviceDescription               = "AKAI APC40 MkII";        // device name
    this.needsMidiChannel                = true;                     // send midi controller to daw
    this.needsMidiBackChannel            = true;                     // send midi daw to controller
    if (getOS() == "windows")
    {
        this.midiChannelName             = "MIDIIN";                // MIDI channel name
        this.midiBackChannelName         = "MIDIOUT";               // MIDI channel name
    }
    else
    {
        this.midiChannelName             = "APC40 mkII";            // MIDI channel name
        this.midiBackChannelName         = "APC40 mkII";            // MIDI channel name
    }

    this.needsOSCSocket                  = false;                    // communicate via osc
    this.numberOfFaderChannels           = 8;                        // number physical faders      
    this.numberOfTrackPads               = 5;                        // number physical pads per channel
    this.numCharactersForTrackNames      = 0;                        // characters of channel text
    this.numCharactersForAuxLabels       = 0;                        // characters of aux text
    this.numParameterControls            = 8;                        // number of labelled rotary dials that can control things like plugin parameters
    this.numCharactersForParameterLabels = 0;                        // characters for rotary dials
    this.wantsClock                      = true;                     // device wants MIDI clock
    this.allowBankingOffEnd              = false;                    // allow surface to display blank channels
    this.numMarkers                      = 0;                        // number of markers that can be displayed
    this.numCharactersForMarkerLabels    = 0;                        // characters for markers
    this.wantsDummyParams                = false;
    this.wantsAuxBanks                   = false;                    // display auxes
    this.numAuxes                        = 2;                        // number of auxes that can be displayed
    this.followsTrackSelection           = false;                    // controller track follows UI selection
    this.cliplauncher                    = true;                     // this controller is primarily a clip launcher
    this.auxmode                         = "byposition";
    this.pickUpMode                      = false;                    // input value must cross current value before input is accepted
                                                                     // useful for non motorized faders, so the don't jump when adjusted

    this.buttonMode                      = "pan";
    this.shift                           = false;
    this.ignoreIncoming                  = false;

    this.solo                            = initArray (8, 0);
    this.mute                            = initArray (8, 0);
    this.arm                             = initArray (8, 0);
    this.select                          = initArray (8, 0);
    this.pan                             = initArray (8, 0);
    this.send1                           = initArray (8, 0);
    this.send2                           = initArray (8, 0);

    this.playingCache                    = initArray (8, false);
    this.ledCache                        = init2DArray (8, 8, -1);

    this.initialise = function() {
    }

    this.initialiseDevice = function() {  
        sendMidiToDevice ([0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]); // device inquiry
        sendMidiToDevice ([0xf0, 0x47, 0x7f, 0x29, 0x60, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0xf7]); // intro message

        this.ledCache = init2DArray (8, 8, -1);
        this.ledsOff();

        this.ignoreIncoming = true;
        startTimer ("go", 1000);
    }

    this.shutDownDevice = function() {       
        this.ledsOff(); 
    }

    this.onTimer = function(name) {
        stopTimer ("go");
        this.ignoreIncoming = false;
    }

    this.ledsOff = function()
    {
        for (var channel = 0; channel < 8; channel++)
        {
            for (var pad = 0; pad < 5; pad++)
            {
                var note =  ((4 - pad) * 8) + channel;
                sendMidiToDevice ([0x90, note, 0x00]);
            }
        }     
        
        for (var ctrl = 1; ctrl <= 127; ctrl++)
        {
            for (var ch = 0; ch <= 8; ch++)
            {
                sendMidiToDevice ([0x90 + ch, ctrl, 0x00]);
            }
        }
    }

    this.setButtonMode = function(mode) {
        this.buttonMode = mode;
        this.updateMiscLEDS();
    }

    this.updateMiscLEDS = function() 
    {
        sendMidiToDevice ([0x90, 0x57, this.buttonMode == "pan"    ? 0x01 : 0x00]);
        sendMidiToDevice ([0x90, 0x58, this.buttonMode == "sends"  ? 0x01 : 0x00]);
        sendMidiToDevice ([0x90, 0x59, this.buttonMode == "user"   ? 0x01 : 0x00]);

        for (var ch = 0; ch < 8; ch++)
        {
            sendMidiToDevice ([0x90 + ch, 0x30, this.arm[ch]]);
            sendMidiToDevice ([0x90 + ch, 0x31, this.solo[ch]]);
            sendMidiToDevice ([0x90 + ch, 0x32, this.mute[ch]]);
            sendMidiToDevice ([0x90 + ch, 0x33, this.select[ch]]);
        }

        if (this.buttonMode == "pan")
        {
            for (var ch = 0; ch < 8; ch++)
            {
                sendMidiToDevice ([0xB0, 0x38 + ch, 0x03]);
                sendMidiToDevice ([0xB0, 0x30 + ch, Math.round ((this.pan[ch] + 1) / 2 * 127)]);
            }
        }
        else if (this.buttonMode == "sends")
        {
            for (var ch = 0; ch < 8; ch++)
            {
                if (this.send1[ch] >= 0)
                {
                    sendMidiToDevice ([0xB0, 0x38 + ch, 0x01]);
                    sendMidiToDevice ([0xB0, 0x30 + ch, Math.round (this.send1[ch] * 127)]);
                }
                else
                {
                    sendMidiToDevice ([0xB0, 0x38 + ch, 0x00]);
                }
            }    
        }
        else if (this.buttonMode == "user")
        {
            for (var ch = 0; ch < 8; ch++)
            {
                if (this.send2[ch] >= 0)
                {
                    sendMidiToDevice ([0xB0, 0x38 + ch, 0x01]);
                    sendMidiToDevice ([0xB0, 0x30 + ch, Math.round (this.send2[ch] * 127)]);
                }
                else
                {
                    sendMidiToDevice ([0xB0, 0x38 + ch, 0x00]);
                }
            }    
        }
    }

    this.onSoloMuteChanged = function(channel, state, isBright) {
        if (state & 0x01)
            this.solo[channel] = 0x01;
        else if (state & 0x02)
            this.solo[channel] = isBright ? 0x01 : 0x00;
        else if (state & 0x04)
            this.solo[channel] = isBright ? 0x01 : 0x00;
        else
            this.solo[channel] = 0x00;
        
        if (state & 0x08)
            this.mute[channel] = 0x01;
        else if (state & 0x16)
            this.mute[channel] = isBright ? 0x01 : 0x00;
        else
            this.mute[channel] = 0x00;

        this.updateMiscLEDS();
    }

    this.onTrackSelectionChanged = function(channel, isSelected) {        
        this.select[channel] = isSelected ? 0x01 : 0x00;
        this.updateMiscLEDS();
    }

    this.onTrackRecordEnabled = function(channel, isEnabled) {      
        this.arm[channel] = isEnabled ? 0x01 : 0x00;
        this.updateMiscLEDS();

        for (var pad = 0; pad < 5; pad++)
        {
            var value = this.ledCache[channel][pad];

            var state = Math.floor (value / 100);
            var color = Math.floor (value % 100);

            var note =  ((4 - pad) * 8) + channel;
            var col = hueToHex (color);
    
            if (state == 0)
            {
                if (this.arm[channel] && col == 0x00)
                    sendMidiToDevice ([0x90, note, 0x07]);
                else
                    sendMidiToDevice ([0x90, note, col]);
            }
            else if (state == 1)
            {
                sendMidiToDevice ([0x9e, note, col]);
            }
            else if (state == 2)
            {
                sendMidiToDevice ([0x99, note, col]);
            }
        }
    }

    this.onPanPotMoved = function(channelNum, newPan) {
        this.pan[channelNum] = newPan;

        if (this.buttonMode == "pan")
            sendMidiToDevice ([0xB0, 0x30 + channelNum, Math.round ((newPan + 1) / 2 * 127)]);
    }

    this.onAuxMoved = function(channel, num, busName, newPos) {        
        if (num == 0)
        {
            this.send1[channel] = newPos;

            if (this.buttonMode == "sends")
            {
                sendMidiToDevice ([0xB0, 0x38 + channel, 0x01]);
                sendMidiToDevice ([0xB0, 0x30 + channel, Math.round (newPos * 127)]);
            }
        }
        else if (num == 1)
        {
            this.send2[channel] = newPos;

            if (this.buttonMode == "user")
            {
                sendMidiToDevice ([0xB0, 0x38 + channel, 0x01]);
                sendMidiToDevice ([0xB0, 0x30 + channel, Math.round (newPos * 127)]);
            }    
        }
    }

    this.onAuxCleared = function(channel, num) {        
        if (num == 0)
        {
            this.send1[channel] = -1;

            if (this.buttonMode == "sends")
                sendMidiToDevice ([0xB0, 0x38 + ch, 0x00]);
        }
        else if (num == 1)
        {
            this.send2[channel] = -1;

            if (this.buttonMode == "user")
                sendMidiToDevice ([0xB0, 0x38 + ch, 0x00]);
        }
    }

    this.onParameterChanged = function(parameterNumber, newValue) {        
        sendMidiToDevice ([0xB0, 0x18 + parameterNumber, 0x01]);
        sendMidiToDevice ([0xB0, 0x10 + parameterNumber, Math.round (newValue.value * 127)]);
    }

    this.onParameterCleared = function(parameterNumber) {       
        sendMidiToDevice ([0xB0, 0x18 + parameterNumber, 0x00]); 
    }

    this.onPadStateChanged = function(channel, pad, color, state) {
        var val = state * 100 + color;

        if (this.ledCache[channel][pad] == val) 
            return;

        this.ledCache[channel][pad] = val;

        var note =  ((4 - pad) * 8) + channel;
        var col = hueToHex (color);

        if (state == 0)
        {
            if (this.arm[channel] && col == 0x00)
                sendMidiToDevice ([0x90, note, 0x07]);
            else
                sendMidiToDevice ([0x90, note, col]);
        }
        else if (state == 1)
        {
            sendMidiToDevice ([0x9e, note, col]);
        }
        else if (state == 2)
        {
            sendMidiToDevice ([0x99, note, col]);
        }
    }

    this.onClipsPlayingChanged = function(channel, isPlaying) {
        if (this.playingCache[channel] == isPlaying)
            return;

        this.playingCache[channel] = isPlaying;
    }

    this.onClickChanged = function(isClickOn) {
        sendMidiToDevice ([0x90, 0x5a, isClickOn ? 0x01 : 0x00]);           
    }

    this.onPlayStateChanged = function(isPlaying) {  
        sendMidiToDevice ([0x90, 0x5b, isPlaying ? 0x01 : 0x00]);             
    }

    this.onRecordStateChanged = function(isRecording) {
        sendMidiToDevice ([0x90, 0x5d, isRecording ? 0x01 : 0x00]);             
    }

    this.onMidiReceivedFromDevice = function(msg) {
        var d0 = msg[0];
        var d1 = msg[1];
        var d2 = msg[2];

        if (this.ignoreIncoming)
            return;
        
        if ((d0 & 0xf0) == 0x90)
        {
            if (d1 == 0x30)
            {
                toggleRecEnable (d0 & 0x0f, false);
            }
            else if (d1 == 0x31)
            {
                toggleSolo (d0 & 0x0f);
            }
            else if (d1 == 0x32)
            {
                toggleMute (d0 & 0x0f, false);
            }
            else if (d1 == 0x33)
            {
                selectOneTrack (d0 & 0x0f);
            }
            else if (d1 == 0x3c)
            {
                changeParameterBank (-8);
            }
            else if (d1 == 0x3d)
            {
                changeParameterBank (+8);
            }
            else if (d1 == 0x5b)
            {
                play();
            }
            else if (d1 == 0x5d)
            {
                record();
            }
            else if (d1 == 0x5e)
            {
                changePadBanks (-1);
            }
            else if (d1 == 0x5f)
            {
                changePadBanks (+1);                                
            }
            else if (d1 == 0x60)
            {
                changeFaderBanks (+1);
            }
            else if (d1 == 0x61)
            {
                changeFaderBanks (-1);
            }            
            else if (d1 == 0x62)
            {
                this.shift = true;                
                this.updateMiscLEDS();
            }
            else if (d1 >= 0x00 && d1 <= 0x27)
            {
                var clip = 4 - Math.floor (d1 / 8);
                var track = d1 % 8;

                launchClip (track, clip, true);
            }
            else if (d1 == 0x34)
            {
                stopClip (d0 & 0x0f, true);
                sendMidiToDevice ([0x90 + (d0 & 0x0f), 0x34, 0x01]);
            }
            else if (d1 == 0x51)
            {
                stopClip (-1, true);
            }
            else if (d1 >= 0x52 && d1 <= 0x56)
            {
                launchScene (d1 - 0x52, true);
                sendMidiToDevice ([d0, d1, 0x01]);
            }
            else if (d1 == 0x57)
            {
                this.setButtonMode ("pan");
            }
            else if (d1 == 0x58)
            {
                this.setButtonMode ("sends");
            }
            else if (d1 == 0x59)
            {
                this.setButtonMode ("user");
            }
            else if (d1 == 0x5a)
            {
                toggleClick();
            }
            else if (d1 == 0x63)
            {
                tapTempo();
            }
            else if (d1 == 0x64)
            {
                nudgeLeft();
            }
            else if (d1 == 0x65)
            {
                nudgeRight();
            }
        }
        else if ((d0 & 0xf0) == 0x80)
        {
            if (d1 >= 0x00 && d1 <= 0x27)
            {
                var clip = 4 - Math.floor (d1 / 8);
                var track = d1 % 8;

                launchClip (track, clip, false);
            }
            if (d1 == 0x34)
            {
                stopClip (d0 & 0x0f, false);
                sendMidiToDevice ([0x90 + (d0 & 0x0f), 0x34, 0x00]);
            }
            else if (d1 == 0x51)
            {
                stopClip (-1, false);
            }
            else if (d1 >= 0x52 && d1 <= 0x56)
            {
                launchScene (d1 - 0x52, false);
                sendMidiToDevice ([0x90, d1, 0x00]);
            }    
        }
        else if ((d0 & 0xf0) == 0xb0)
        {
            var chan = d0 & 0x0f;
            var ctrl = d1;
            var val = d2;

            logMsg ("chan: " + chan + " ctrl " + ctrl.toString(16) + " val: " + val);

            if (ctrl == 7)
            {
                setFader (chan, val / 127, false);
            }
            else if (ctrl == 0x0d)
            {
                setTempo (val == 127 ? -1 : 1, true);
            }
            else if (ctrl == 0x0e)
            {
                setMasterLevelFader (val / 127, false);
            }
            else if (ctrl == 0x2f)
            {
                val = val >= 0x40 ? (val - 128) : val;
                setMasterPanPot (val / 127, true);
            }
            else if (d1 >= 0x10 && d1 <= 0x17)
            {
                setParameter (d1 - 0x10, val / 127, false);
            }
            else if (d1 >= 0x30 && d1 <= 0x37)
            {
                if (this.buttonMode == "pan")
                    setPanPot (d1 - 0x30, (val / 127) * 2 - 1, false);
                else if (this.buttonMode == "sends")
                    setAux (d1 - 0x30, 0, val / 127, false);
                else if (this.buttonMode == "user")
                    setAux (d1 - 0x30, 1, val / 127, false);
            }
        }
    }
}

registerController (new AKAIAPC40());
