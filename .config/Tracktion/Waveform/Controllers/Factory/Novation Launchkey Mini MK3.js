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
    this.deviceDescription               = "Novation Launchkey Mini MK3";   // device name
    this.needsMidiChannel                = true;                            // send midi controller to daw
    this.needsMidiBackChannel            = true;                            // send midi daw to controller
    if (getOS() == "windows")
    {
        this.midiChannelName             = "MIDIIN2 (Launchkey Mini MK3";   // MIDI channel name
        this.midiBackChannelName         = "MIDIOUT2 (Launchkey Mini MK3";  // MIDI channel name
    }
    else
    {
        this.midiChannelName             = "Launchkey Mini MK3*DAW";        // MIDI channel name
        this.midiBackChannelName         = "Launchkey Mini MK3*DAW";        // MIDI channel name
    }
    this.needsOSCSocket                  = false;                           // communicate via osc
    this.numberOfFaderChannels           = 8;                               // number physical faders      
    this.numberOfTrackPads               = 2;                               // number physical pads per channel
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
    this.auxmode                         = "byposition";                    // Aux index is either 'bybus' (-1 any) or 'byposition'
    this.pickUpMode                      = true;                            // input value must cross current value before input is accepted
                                                                            // useful for non motorized faders, so the don't jump when adjusted

    
    this.screen                         = "session";
    this.sessionMode                    = "launch";
    this.knobMode                       = "device";
    this.shift                          = false;
    this.ledCache                       = init2DArray (8, 8, -1);
    this.stateCache                     = init2DArray (8, 8, -1);
    this.soloCache                      = initArray (8, false);
    this.muteCache                      = initArray (8, false);
    
    this.initialise = function() {
    }

    this.initialiseDevice = function() {  
        sendMidiToDevice ([0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]); // device inquiry
        sendMidiToDevice ([0x9f, 0x0C, 0x7f]); // DAW mode

        this.ledCache  = init2DArray (8, 8, -1);
        this.soloCache = initArray (8, false);
        this.muteCache = initArray (8, false);

        this.updateScreen();
    }

    this.shutDownDevice = function() {      
        sendMidiToDevice ([0xb0, 0x69, 0x00]);  
        sendMidiToDevice ([0xb0, 0x73, 0x00]);
        sendMidiToDevice ([0xb0, 0x75, 0x00]);

        for (var t = 0; t < 8; t++)
        {
            sendMidiToDevice ([0x90, 0x60 + t, 0x00]);    
            sendMidiToDevice ([0x90, 0x60 + t, 0x00]);    
        }

        for (var t = 0; t < 4; t++)
        {
            sendMidiToDevice ([0x99, 0x28 + t, 0x00]);    
            sendMidiToDevice ([0x99, 0x30 + t, 0x00]);    
            sendMidiToDevice ([0x99, 0x24 + t, 0x00]);    
            sendMidiToDevice ([0x99, 0x2C + t, 0x00]);    
        }


        sendMidiToDevice ([0x9d, 0x0C, 0x00]); // exit DAW mode
    }

    this.updateSession = function(pad) {
        for (var ch = 0; ch < 8; ch++)
        {
            var value = this.ledCache[ch][pad];

            var state = Math.floor (value / 100);
            var color = Math.floor (value % 100);

            var note =  0x60 + (pad * 0x10) + ch;
            var col = hueToHex (color);

            if (state == 0)
            {
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

    this.updateScreen = function() {       
        
        if (this.screen == "session")
        {
            this.updateSession (0);

            if (this.sessionMode == "launch")
            {
                this.updateSession (1);
                sendMidiToDevice ([0xb0, 0x69, 0x03]);
            }
            else if (this.sessionMode == "stop")
            {
                sendMidiToDevice ([0xb0, 0x69, 0x07]);

                for (var t = 0; t < 8; t++)
                    sendMidiToDevice ([0x90, 0x70 + t, 0x07]);    
            }
            else if (this.sessionMode == "solo")
            {
                sendMidiToDevice ([0xb0, 0x69, 0x57]);

                for (var t = 0; t < 8; t++)
                    sendMidiToDevice ([0x90, 0x70 + t, this.soloCache[t] ? 0x57 : 0x01]);    

            }
            else if (this.sessionMode == "mute")                
            {
                sendMidiToDevice ([0xb0, 0x69, 0x05]);

                for (var t = 0; t < 8; t++)
                    sendMidiToDevice ([0x90, 0x70 + t, this.muteCache[t] ? 0x05 : 0x01]);    
            }            
        }
        else if (this.screen == "drum")
        {
            sendMidiToDevice ([0xb0, 0x69, 0x00]);

            for (var t = 0; t < 4; t++)
            {
                sendMidiToDevice ([0x99, 0x28 + t, 0x27]);    
                sendMidiToDevice ([0x99, 0x30 + t, 0x27]);    
                sendMidiToDevice ([0x99, 0x24 + t, 0x27]);    
                sendMidiToDevice ([0x99, 0x2C + t, 0x27]);    
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

        triggerAsyncUpdate();
    }

    this.onTimer = function(name) {
    }

    this.onUpdateMiscFeatures = function() {
    }

    this.onPlayStateChanged = function(isPlaying) {    
        sendMidiToDevice ([0xb0, 0x73, isPlaying ? 0x15 : 0x00]);
    }

    this.onRecordStateChanged = function(isRecording) {
        sendMidiToDevice ([0xb0, 0x75, isRecording ? 0x15 : 0x00]);
    }

    this.onAsyncUpdate = function() {      
        this.updateScreen();  
    }

    this.onPadStateChanged = function(channel, pad, color, state) {

        var val = state * 100 + color;

        if (this.ledCache[channel][pad] == val) 
            return;

        this.ledCache[channel][pad] = val;

        var note = 0x60 + (pad * 0x10) + channel;
        var col = hueToHex (color);

        if (this.screen == "session" && (this.sessionMode == "launch" || pad < 1))
        {
            if (state == 0)
            {
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

        if (d0 == 0x99)
        {
            if (d2 > 0)
                sendMidiToDevice ([0x99, d1, 0x15]);
            else
                sendMidiToDevice ([0x99, d1, 0x27]);

            sendMidiToDefaultDevice (msg);
            return;
        }

        if (d0 == 0xbf)
        {
            if (d1 == 0x03)
            {
                if (d2 == 2)        this.screen = "session";
                else if (d2 == 1)   this.screen = "drum";
                else if (d2 == 5)   this.screen = "custom";

                triggerAsyncUpdate();
            }
            else if (d1 == 0x09)
            {
                if (d2 == 2)        this.knobMode = "device";
                else if (d2 == 1)   this.knobMode = "volume";
                else if (d2 == 3)   this.knobMode = "pan";
                else if (d2 == 4)   this.knobMode = "send1";
                else if (d2 == 5)   this.knobMode = "send2";
                else if (d2 == 6)   this.knobMode = "custom";

                triggerAsyncUpdate();
            }
            else if (d1 >= 0x15 && d1 <= 0x1c)
            {
                if (this.knobMode == "volume")
                    setFader (d1 - 0x15, d2 / 127.0, false);
                else if (this.knobMode == "pan")
                    setPanPot (d1 - 0x15, (d2 / 127.0) * 2 - 1, false);
                else if (this.knobMode == "send1")
                    setAux (d1 - 0x15, 0, d2 / 127.0);
                else if (this.knobMode == "send2")
                    setAux (d1 - 0x15, 1, d2 / 127.0);
                else if (this.knobMode == "device")
                    setParameter (d1 - 0x15, d2 / 127.0);
            }
        }

        if (d0 == 0xb0)
        {
            if (d1 == 0x6c)
            {
                this.shift = d2 == 0x7f;
            }
            //
            // Normal buttons
            //
            if (! this.shift)
            {
                if (d1 == 0x68 && d2 == 0x7f)
                {
                    if (this.screen == "session")
                        launchScene (0);
                }
                else if (d1 == 0x69 && d2 == 0x7f)
                {
                    if (this.screen == "session")
                    {
                        if (this.sessionMode == "launch")
                            this.sessionMode = "stop";
                        else if (this.sessionMode == "stop")
                            this.sessionMode = "solo";
                        else if (this.sessionMode == "solo")
                            this.sessionMode = "mute";
                        else if (this.sessionMode == "mute")
                            this.sessionMode = "launch";
                    }

                    triggerAsyncUpdate();
                }
            }

            //
            // Shift buttons
            //
            if (this.shift)
            {
                if (d1 == 0x68 && d2 == 0x7f)
                {
                    changePadBanks (-1);
                    sendMidiToDevice ([0xb0, d1, 0x03]);
                }
                else if (d1 == 0x69 && d2 == 0x7f)
                {
                    changePadBanks (+1);
                    sendMidiToDevice ([0xb0, d1, 0x03]);
                }
            }
        }

        if (d0 == 0xbf)
        {
            //
            // Normal buttons
            //
            if (! this.shift)
            {
                if (d1 == 0x73 && d2 == 0x7f)
                {
                    play();
                }
                else if (d1 == 0x75 && d2 == 0x7f)
                {
                    record();
                }
            }
            
            //
            // Shift buttons
            //
            if (this.shift)
            {
                if (d1 == 0x67 && d2 == 0x7f)
                {
                    changeFaderBanks (-1);
                    sendMidiToDevice ([0xb0, d1, 0x03]);
                }
                else if (d1 == 0x66 && d2 == 0x7f)
                {
                    changeFaderBanks (+1);
                    sendMidiToDevice ([0xb0, d1, 0x03]);
                }
                else if (d1 == 0x75 && d2 == 0x7f)
                {
                    retrospectiveRecord();
                }
            }
        }

        if (d0 == 0x90)
        {
            //
            // Normal buttons
            //
            if (! this.shift)
            {
                if (d1 >= 0x60 && d1 <= 0x67 && d2 > 0x00)
                {
                    if (this.screen == "session")
                        launchClip (d1 - 0x60, 0);
                }
                else if (d1 >= 0x70 && d1 <= 0x77 && d2 > 0x00)
                {
                    if (this.screen == "session")
                    {
                        if (this.sessionMode == "launch")
                            launchClip (d1 - 0x70, 1);
                        else if (this.sessionMode == "stop")
                            stopClip (d1 - 0x70);
                        else if (this.sessionMode == "solo")
                            toggleSolo (d1 - 0x70);
                        else if (this.sessionMode == "mute")
                            toggleMute (d1 - 0x70, false);
                    }   
                }

            }
        }
    }
}

registerController (new NovationLaunchpad());
