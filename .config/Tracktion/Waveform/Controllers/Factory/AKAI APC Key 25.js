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

function AKAIAPCKey() {
    // Variables: these must be filled out so the session knows your controller layout
    this.deviceDescription               = "AKAI APC Key 25";        // device name
    this.needsMidiChannel                = true;                     // send midi controller to daw
    this.needsMidiBackChannel            = true;                     // send midi daw to controller
    if (getOS() == "windows")
    {
        this.midiChannelName             = "MIDIIN2 (APC Key 25 mk2)"; // MIDI channel name
        this.midiBackChannelName         = "MIDIOUT2 (APC Key 25 mk2)";// MIDI channel name
    }
    else
    {
        this.midiChannelName             = "APC Key*Control";        // MIDI channel name
        this.midiBackChannelName         = "APC Key*Control";        // MIDI channel name
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
    this.wantsAuxBanks                   = false;                    // display auxes
    this.numAuxes                        = 0;                        // number of auxes that can be displayed
    this.followsTrackSelection           = false;                    // controller track follows UI selection
    this.cliplauncher                    = true;                     // this controller is primarily a clip launcher
    this.pickUpMode                      = false;                    // input value must cross current value before input is accepted
                                                                     // useful for non motorized faders, so the don't jump when adjusted

    this.buttonMode                      = "clip";
    this.faderMode                       = "level";
    this.shift                           = false;

    this.solo                            = initArray (8, 0);
    this.mute                            = initArray (8, 0);
    this.arm                             = initArray (8, 0);
    this.select                          = initArray (8, 0);

    this.playingCache                    = initArray (8, false);
    this.ledCache                        = init2DArray (8, 8, -1);

    this.initialise = function() {
    }

    this.initialiseDevice = function() {  
        sendMidiToDevice ([0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]); // device inquiry
        sendMidiToDevice ([0xf0, 0x47, 0x7f, 0x4e, 0x60, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0xf7]); // intro message

        this.ledCache = init2DArray (8, 8, -1);
    }

    this.shutDownDevice = function() {        
        for (var channel = 0; channel < 8; channel++)
        {
            for (var pad = 0; pad < 5; pad++)
            {
                var note =  ((4 - pad) * 8) + channel;
                sendMidiToDevice ([0x96, note, 0x00]);
            }
        }
        
    }

    this.setButtonMode = function(mode) {
        this.buttonMode = mode;
        this.updateMiscLEDS();
    }

    this.setFaderMode = function(mode) {
        this.faderMode = mode;
        this.updateMiscLEDS();
    }

    this.updateMiscLEDS = function() 
    {
        if (this.shift)
        {
            sendMidiToDevice ([0x90, 0x40, 0x00]);
            sendMidiToDevice ([0x90, 0x41, 0x00]);
            sendMidiToDevice ([0x90, 0x42, 0x00]);
            sendMidiToDevice ([0x90, 0x43, 0x00]);
            sendMidiToDevice ([0x90, 0x44, this.faderMode  == "level"  ? 0x01 : 0x00]);
            sendMidiToDevice ([0x90, 0x45, this.faderMode  == "pan"    ? 0x01 : 0x00]);
            sendMidiToDevice ([0x90, 0x46, this.faderMode  == "send"   ? 0x01 : 0x00]);
            sendMidiToDevice ([0x90, 0x47, this.faderMode  == "device" ? 0x01 : 0x00]);

            sendMidiToDevice ([0x90, 0x52, this.buttonMode == "clip"   ? 0x01 : 0x00]);
            sendMidiToDevice ([0x90, 0x53, this.buttonMode == "solo"   ? 0x01 : 0x00]);
            sendMidiToDevice ([0x90, 0x54, this.buttonMode == "mute"   ? 0x01 : 0x00]);
            sendMidiToDevice ([0x90, 0x55, this.buttonMode == "arm"    ? 0x01 : 0x00]);
            sendMidiToDevice ([0x90, 0x56, this.buttonMode == "select" ? 0x01 : 0x00]);
        }
        else
        {
            sendMidiToDevice ([0x90, 0x52, 0x00]);
            sendMidiToDevice ([0x90, 0x53, 0x00]);
            sendMidiToDevice ([0x90, 0x54, 0x00]);
            sendMidiToDevice ([0x90, 0x55, 0x00]);
            sendMidiToDevice ([0x90, 0x56, 0x00]);

            if (this.buttonMode == "clip")
            {
                for (var i = 0; i < 9; i++)
                    sendMidiToDevice ([0x90, 0x40 + i, this.playingCache[i] ? 0x05 : 0x00]);
            }
            else if (this.buttonMode == "solo")
            {
                for (var i = 0; i < 9; i++)
                    sendMidiToDevice ([0x90, 0x40 + i, this.solo[i]]);
            }
            else if (this.buttonMode == "mute")
            {
                for (var i = 0; i < 9; i++)
                    sendMidiToDevice ([0x90, 0x40 + i, this.mute[i]]);
            }
            else if (this.buttonMode == "arm")
            {
                for (var i = 0; i < 9; i++)
                    sendMidiToDevice ([0x90, 0x40 + i, this.arm[i]]);
            }
            else if (this.buttonMode == "select")
            {
                for (var i = 0; i < 9; i++)
                    sendMidiToDevice ([0x90, 0x40 + i, this.select[i]]);
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
                    sendMidiToDevice ([0x96, note, 0x07]);
                else
                    sendMidiToDevice ([0x96, note, col]);
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
                sendMidiToDevice ([0x96, note, 0x07]);
            else
                sendMidiToDevice ([0x96, note, col]);
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

        if (this.buttonMode == "clip")
        {
            if (! isPlaying)
                sendMidiToDevice ([0x90, 0x40 + channel, 0x00]);
            else
                sendMidiToDevice ([0x90, 0x40 + channel, 0x05]);
        }
    }

    this.onMidiReceivedFromDevice = function(msg) {
        var d0 = msg[0];
        var d1 = msg[1];
        var d2 = msg[2];

        if (d0 == 0x90)
        {
            if (d1 == 0x5b)
            {
                play();
            }
            else if (d1 == 0x5d)
            {
                record();
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

                launchClip (track, clip);
            }
            else if (d1 >= 0x40 && d1 <= 0x47)
            {
                var track = d1 - 0x40;
                if (this.shift) 
                {
                    if (track == 0)
                        changePadBanks (-1);
                    else if (track == 1)
                        changePadBanks (+1);
                    else if (track == 2 && this.faderMode == "device")
                        changeParameterBank (-1);
                    else if (track == 2)
                        changeFaderBanks (-1);
                    else if (track == 3 && this.faderMode == "device")
                        changeParameterBank (+1);
                    else if (track == 3)
                        changeFaderBanks (+1);
                    else if (track == 4)
                        this.setFaderMode ("level");
                    else if (track == 5)
                        this.setFaderMode ("pan");
                    else if (track == 6)
                        this.setFaderMode ("send");
                    else if (track == 7)                    
                        this.setFaderMode ("device");
                }
                else if (this.buttonMode == "clip")
                {
                    stopClip (track);                
                }
                else if (this.buttonMode == "solo")
                {                    
                    toggleSolo (track);
                }
                else if (this.buttonMode == "mute")
                {                    
                    toggleMute (track);
                }
                else if (this.buttonMode == "arm")
                {                    
                    toggleRecEnable (track, false);
                }
                else if (this.buttonMode == "select")
                {           
                    selectTrack (track);         
                }
            }
            else if (d1 == 0x52)
            {
                if (this.shift)
                    this.setButtonMode ("clip");
                else
                    launchScene (0);
            }
            else if (d1 == 0x53)
            {
                if (this.shift)
                    this.setButtonMode ("solo");
                else
                    launchScene (1);

            }
            else if (d1 == 0x54)
            {
                if (this.shift)
                    this.setButtonMode ("mute");
                else
                    launchScene (2);
            }
            else if (d1 == 0x55)
            {
                if (this.shift)
                    this.setButtonMode ("arm");
                else
                    launchScene (3);
            }
            else if (d1 == 0x56)
            {
                if (this.shift)
                    this.setButtonMode ("select");
                else
                    launchScene (4);
            }
            else if (d1 == 0x51)
            {
                stopClip (-1);
            }
        }
        else if (d0 == 0x80)
        {
            if (d1 == 0x62)
            {
                this.shift = false;
                this.updateMiscLEDS();
            }
        }
        else if (d0 == 0xb0)
        {
            if (d1 >= 0x30 && d1 <= 0x37)
            {
                var val = d2 >= 0x40 ? (d2 - 128) : d2;
                
                if (this.faderMode == "level")
                    setFader (d1 - 0x30, val / 127, true);
                else if (this.faderMode == "pan")
                    setPanPot (d1 - 0x30, val / 127, true);
                else if (this.faderMode == "send")
                    setAux (d1 - 0x30, 0, val / 127, true);
                else if (this.faderMode == "device")
                    setParameter (d1 - 0x30, val / 127, true);
            }
        }
    }
}

registerController (new AKAIAPCKey());
