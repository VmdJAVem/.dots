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

function NovationLaunchpad() {
    // Variables: these must be filled out so the session knows your controller layout
    this.deviceDescription               = "Novation Launchpad Mini MK3";   // device name
    this.needsMidiChannel                = true;                            // send midi controller to daw
    this.needsMidiBackChannel            = true;                            // send midi daw to controller
    if (getOS() == "windows")
    {
        this.midiChannelName             = "^LPMiniMK3 MIDI";               // MIDI channel name
        this.midiBackChannelName         = "^LPMiniMK3 MIDI";               // MIDI channel name
    }
    else
    {
        this.midiChannelName             = "Launchpad Mini MK3*DAW";        // MIDI channel name
        this.midiBackChannelName         = "Launchpad Mini MK3*DAW";        // MIDI channel name
    }
    this.needsOSCSocket                  = false;                           // communicate via osc
    this.numberOfFaderChannels           = 8;                               // number physical faders      
    this.numberOfTrackPads               = 8;                               // number physical pads per channel
    this.numCharactersForTrackNames      = 0;                               // characters of channel text
    this.numCharactersForAuxLabels       = 0;                               // characters of aux text
    this.numParameterControls            = 0;                               // number of labelled rotary dials that can control things like plugin parameters
    this.numCharactersForParameterLabels = 0;                               // characters for rotary dials
    this.wantsClock                      = true;                            // device wants MIDI clock
    this.allowBankingOffEnd              = false;                           // allow surface to display blank channels
    this.numMarkers                      = 0;                               // number of markers that can be displayed
    this.numCharactersForMarkerLabels    = 0;                               // characters for markers
    this.wantsAuxBanks                   = false;                           // display auxes
    this.numAuxes                        = 0;                               // number of auxes that can be displayed
    this.followsTrackSelection           = false;                           // controller track follows UI selection
    this.cliplauncher                    = true;                            // this controller is primarily a clip launcher
    
    this.mode                           = "play";
    this.ledCache                       = init2DArray (8, 8, -1);
    this.stateCache                     = init2DArray (8, 8, -1);
    this.soloCache                      = initArray (8, false);
    this.muteCache                      = initArray (8, false);
    this.stopCache                      = initArray (8, false);
    this.recordCache                    = initArray (8, false);
    
    this.initialise = function() {
    }

    this.initialiseDevice = function() {  
        sendMidiToDevice ([0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]); // device inquiry
        sendMidiToDevice ([0xf0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x10, 0x01, 0xf7]); // enter DAW mode
        sendMidiToDevice ([0xf0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x10, 0xf7]); // readback DAW mode
        sendMidiToDevice ([0xf0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x00, 0x00, 0xf7]); // Select session layout

        this.ledCache  = init2DArray (8, 8, -1);
        this.soloCache = initArray (8, false);
        this.muteCache = initArray (8, false);
        this.stopCache = initArray (8, false);
        this.recordCache = initArray (8, false);

        this.updateModeButton();
        this.updateBottomButtons();
    }

    this.shutDownDevice = function() {        
        sendMidiToDevice ([0xf0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x10, 0x00, 0xf7]); // exit DAW mode
    }

    this.updateModeButton = function() {
        if (this.mode == "play")
            sendMidiToDevice ([0xb0, 0x13, 0x02]);
        else if (this.mode == "stop")
            sendMidiToDevice ([0xb0, 0x13, 0x06]);
        else if (this.mode == "solo")
            sendMidiToDevice ([0xb0, 0x13, 0x15]);
        else if (this.mode == "mute")
            sendMidiToDevice ([0xb0, 0x13, 0x05]);
    }

    this.updateAllButtons = function() {
        for (var pad = 0; pad < 7; pad++)
        {
            for (var ch = 0; ch < 8; ch++)
            {
                var value = this.ledCache[ch][pad];

                var state = Math.floor (value / 100);
                var color = Math.floor (value % 100);

                var note =  80 - (pad * 10) + (ch + 1);
                var col = hueToHex (color);

                if (state == 0)
                {
                    if (this.recordCache[ch] && col == 0x00)
                        sendMidiToDevice ([0x90, note, 0x07]);
                    else    
                        sendMidiToDevice ([0x90, note, col]);
                }
                else if (state == 1)
                {
                    sendMidiToDevice ([0x90, note, col]);
                    sendMidiToDevice ([0x91, note, 0x00]);
                }
                else if (state == 2)
                {
                    sendMidiToDevice ([0x92, note, col]);
                }
            }
        }
        this.updateBottomButtons();
    }

    this.updateBottomButtons = function() {

        var pad = 7;

        if (this.mode == "play")
        {
            for (var ch = 0; ch < 8; ch++)
            {
                var value = this.ledCache[ch][pad];

                var state = Math.floor (value / 100);
                var color = Math.floor (value % 100);

                var note =  80 - (pad * 10) + (ch + 1);
                var col = hueToHex (color);

                if (state == 0)
                {
                    if (this.recordCache[ch] && col == 0x00)
                        sendMidiToDevice ([0x90, note, 0x07]);
                    else    
                        sendMidiToDevice ([0x90, note, col]);
                }
                else if (state == 1)
                {
                    sendMidiToDevice ([0x90, note, col]);
                    sendMidiToDevice ([0x91, note, 0x00]);
                }
                else if (state == 2)
                {
                    sendMidiToDevice ([0x92, note, col]);
                }
            }
        }
        else if (this.mode == "stop")
        {
            for (var ch = 0; ch < 8; ch++)
            {
                var note =  80 - (pad * 10) + (ch + 1);
                sendMidiToDevice ([0x90, note, 0x07]);
            }
        }
        else if (this.mode == "solo")
        {
            for (var ch = 0; ch < 8; ch++)
            {
                var note =  80 - (pad * 10) + (ch + 1);
                sendMidiToDevice ([0x90, note, this.soloCache[ch] ? 0x15 : 0x00]);
            }
        }
        else if (this.mode == "mute")
        {
            for (var ch = 0; ch < 8; ch++)
            {
                var note =  80 - (pad * 10) + (ch + 1);
                sendMidiToDevice ([0x90, note, this.muteCache[ch] ? 0x05 : 0x00]);
            }
        }
    }

    this.onSoloMuteChanged = function(channelNum, muteAndSoloLightState, isBright) {
        var soloLit         = 1;   // Track is explicitly soloed. 
        var soloFlashing    = 2;   // Track is implicitly soloed. 
        var soloIsolate     = 4;   // Track is explicitly solo isolated. 
        var muteLit         = 8;   // Track is explicitly muted.
        var muteFlashing    = 16;  // Track is implicitly muted.

        this.soloCache[channelNum] = (muteAndSoloLightState & soloLit) != 0 || (isBright && (muteAndSoloLightState & soloFlashing) != 0);
        this.muteCache[channelNum] = (muteAndSoloLightState & muteLit) != 0 || (isBright && (muteAndSoloLightState & muteFlashing) != 0);

        if (this.mode == "solo" || this.mode == "mute")
            this.updateBottomButtons();
    }

    this.onTrackRecordEnabled = function(channel, isEnabled) {     
        this.recordCache[channel] = isEnabled;
        this.updateAllButtons ();
    } 

    this.onTimer = function(name) {
    }

    this.onUpdateMiscFeatures = function() {
    }

    this.onPlayStateChanged = function(isPlaying) {    
    }

    this.onRecordStateChanged = function(isRecording) {
    }

    this.onPadStateChanged = function(channel, pad, color, state) {

        var val = state * 100 + color;

        if (this.ledCache[channel][pad] == val) 
            return;

        this.ledCache[channel][pad] = val;

        var note =  80 - (pad * 10) + (channel + 1);
        var col = hueToHex (color);

        if (this.mode == "play" || pad < 7)
        {
            if (state == 0)
            {
                if (this.recordCache[channel] && col == 0x00)
                    sendMidiToDevice ([0x90, note, 0x07]);
                else
                    sendMidiToDevice ([0x90, note, col]);
            }
            else if (state == 1)
            {
                sendMidiToDevice ([0x90, note, col]);
                sendMidiToDevice ([0x91, note, 0x00]);
            }
            else if (state == 2)
            {
                sendMidiToDevice ([0x92, note, col]);
            }
        }
    }

    this.onMidiReceivedFromDevice = function(msg) {
        var d0 = msg[0];
        var d1 = msg[1];
        var d2 = msg[2];

        if (d0 == 0x90)
        {
            var clip = 8 - Math.floor (d1 / 10);
            var track = d1 % 10 - 1;

            if (d2 == 0x7f)
            {
                if (clip == 7)
                {
                    if (this.mode == "play")
                        launchClip (track, clip, true);
                    else if (this.mode == "stop")
                        stopClip (track, true);
                    else if (this.mode == "solo")
                        toggleSolo (track);
                    else if (this.mode == "mute")
                        toggleMute (track, false);
                }
                else
                {
                    launchClip (track, clip, true);
                }
            }
            else
            {
                if (clip == 7)
                {
                    if (this.mode == "play")
                        launchClip (track, clip, false);
                    else if (this.mode == "stop")
                        stopClip (track, false);
                }
                else
                {
                    launchClip (track, clip, false);
                }
            }
        }
        else if (d0 == 0xb0)
        {
            if (d2 == 0x00)
            {
                if (d1 != 0x13)
                    sendMidiToDevice ([0xb0, d1, 0x00]);

                if (d1 % 10 == 9)
                {
                    var clip = 8 - Math.floor (d1 / 10);                    
                    if (clip < 7)
                        launchScene (clip, false);       
                }
            }
            else if (d2 == 0x7f)
            {
                if (d1 % 10 == 9)
                {
                    var clip = 8 - Math.floor (d1 / 10);                    
                    if (clip == 7)
                    {
                        if (this.mode == "play")
                            this.mode = "stop";
                        else if (this.mode == "stop")
                            this.mode = "solo";
                        else if (this.mode == "solo")
                            this.mode = "mute";
                        else if (this.mode == "mute")
                            this.mode = "play";
                        this.updateModeButton();
                        this.updateBottomButtons();
                    }
                    else
                    {
                        launchScene (clip, true);
                        sendMidiToDevice ([0xb0, d1, 0x03]);
                    }
                }
                else if (d1 == 0x5b)
                {
                    changePadBanks (-1);
                    sendMidiToDevice ([0xb0, d1, 0x03]);
                }
                else if (d1 == 0x5c)
                {
                    changePadBanks (+1);
                    sendMidiToDevice ([0xb0, d1, 0x03]);
                }
                else if (d1 == 0x5d)
                {
                    changeFaderBanks (-1);
                    sendMidiToDevice ([0xb0, d1, 0x03]);
                }
                else if (d1 == 0x5e)
                {
                    changeFaderBanks (+1);
                    sendMidiToDevice ([0xb0, d1, 0x03]);
                }
            }
        }
    }
}

registerController (new NovationLaunchpad());
