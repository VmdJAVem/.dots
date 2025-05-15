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
    this.deviceDescription               = "Novation Launchpad MK2";        // device name
    this.needsMidiChannel                = true;                            // send midi controller to daw
    this.needsMidiBackChannel            = true;                            // send midi daw to controller
    this.midiChannelName                 = "Launchpad MK2";                 // MIDI channel name
    this.midiBackChannelName             = "Launchpad MK2";                 // MIDI channel name
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
    this.numAuxes                        = 2;                               // number of auxes that can be displayed
    this.followsTrackSelection           = false;                           // controller track follows UI selection
    this.cliplauncher                    = true;                            // this controller is primarily a clip launcher
    this.auxmode                         = "byposition";                    // Aux index is either 'bybus' (-1 any) or 'byposition'
    
    this.screen                         = "session";
    this.mode                           = "volume";
    this.ledCache                       = init2DArray (8, 8, -1);
    this.stateCache                     = init2DArray (8, 8, -1);
    this.soloCache                      = initArray (8, false);
    this.muteCache                      = initArray (8, false);
    this.stopCache                      = initArray (8, false);
    this.levelCache                     = initArray (8, 0);
    this.panCache                       = initArray (8, 0);
    this.sendaCache                     = initArray (8, 0);
    this.sendbCache                     = initArray (8, 0);
    this.recordCache                    = initArray (8, 0);
    this.ignoreFader                    = false;
    
    this.initialise = function() {
    }

    this.initialiseDevice = function() {  
        sendMidiToDevice ([0xF0, 0x00, 0x20, 0x29, 0x02, 0x18, 0x0E, 0x00, 0xF7]);

        this.ledCache    = init2DArray (8, 8, -1);
        this.soloCache   = initArray (8, false);
        this.muteCache   = initArray (8, false);
        this.stopCache   = initArray (8, false);
        this.levelCache  = initArray (8, 0);
        this.panCache    = initArray (8, 0);
        this.sendaCache  = initArray (8, 0);
        this.sendbCache  = initArray (8, 0);
        this.recordCache = initArray (8, 0);
    
        this.updateMisc();
        this.updatePadArea();
    }

    this.shutDownDevice = function() {        
        sendMidiToDevice ([0xF0, 0x00, 0x20, 0x29, 0x02, 0x18, 0x0E, 0x00, 0xF7]);
    }

    this.updateMisc = function() {

        if (this.screen == "user1")
        {
            sendMidiToDevice ([0xF0, 0x00, 0x20, 0x29, 0x02, 0x18, 0x22, 0x01, 0xF7]);

            sendMidiToDevice ([0xb7, 0x6c, 0x00]);
            sendMidiToDevice ([0xb7, 0x6d, 0x03]);
            sendMidiToDevice ([0xb7, 0x6e, 0x00]);
            sendMidiToDevice ([0xb7, 0x6f, 0x00]);    
        }
        else if (this.screen == "user2")
        {
            sendMidiToDevice ([0xF0, 0x00, 0x20, 0x29, 0x02, 0x18, 0x22, 0x02, 0xF7]);

            sendMidiToDevice ([0xbf, 0x6c, 0x00]);
            sendMidiToDevice ([0xbf, 0x6d, 0x00]);
            sendMidiToDevice ([0xbf, 0x6e, 0x03]);
            sendMidiToDevice ([0xbf, 0x6f, 0x00]);    
        }
        else if (this.screen == "session")
        {
            sendMidiToDevice ([0xF0, 0x00, 0x20, 0x29, 0x02, 0x18, 0x22, 0x00, 0xF7]);

            sendMidiToDevice ([0xb0, 0x6c, 0x03]);
            sendMidiToDevice ([0xb0, 0x6d, 0x00]);
            sendMidiToDevice ([0xb0, 0x6e, 0x00]);
            sendMidiToDevice ([0xb0, 0x6f, 0x00]);    
    
            sendMidiToDevice ([0x90, 0x59, 0x00]);
            sendMidiToDevice ([0x90, 0x4F, 0x00]);
            sendMidiToDevice ([0x90, 0x45, 0x00]);
            sendMidiToDevice ([0x90, 0x3B, 0x00]);
            sendMidiToDevice ([0x90, 0x31, 0x00]);
            sendMidiToDevice ([0x90, 0x27, 0x00]);
            sendMidiToDevice ([0x90, 0x1D, 0x00]);
            sendMidiToDevice ([0x90, 0x13, 0x00]);
        }
        else if (this.screen == "mixer" || this.screen == "sessionB")
        {
            if (this.screen == "mixer")
            {
                if (this.mode == "pan")
                {
                    sendMidiToDevice ([0xF0, 0x00, 0x20, 0x29, 0x02, 0x18, 0x22, 0x05, 0xF7]);

                    sendMidiToDevice ([0xF0, 0x00, 0x20, 0x29, 0x02, 0x18, 0x2b,
                        0x00, 0x01, 0x01, 0x40,
                        0x01, 0x01, 0x01, 0x40,
                        0x02, 0x01, 0x01, 0x40,
                        0x03, 0x01, 0x01, 0x40,
                        0x04, 0x01, 0x01, 0x40,
                        0x05, 0x01, 0x01, 0x40,
                        0x06, 0x01, 0x01, 0x40,
                        0x07, 0x01, 0x01, 0x40,
                        0xF7]);    

                }
                else
                {
                    sendMidiToDevice ([0xF0, 0x00, 0x20, 0x29, 0x02, 0x18, 0x22, 0x04, 0xF7]);

                    sendMidiToDevice ([0xF0, 0x00, 0x20, 0x29, 0x02, 0x18, 0x2b,
                        0x00, 0x00, 0x01, 0x00,
                        0x01, 0x00, 0x01, 0x00,
                        0x02, 0x00, 0x01, 0x00,
                        0x03, 0x00, 0x01, 0x00,
                        0x04, 0x00, 0x01, 0x00,
                        0x05, 0x00, 0x01, 0x00,
                        0x06, 0x00, 0x01, 0x00,
                        0x07, 0x00, 0x01, 0x00,
                        0xF7]);

                }                
            }
            else
            {
                sendMidiToDevice ([0xF0, 0x00, 0x20, 0x29, 0x02, 0x18, 0x22, 0x00, 0xF7]);
            }

            sendMidiToDevice ([0xb0, 0x6c, 0x00]);
            sendMidiToDevice ([0xb0, 0x6d, 0x00]);
            sendMidiToDevice ([0xb0, 0x6e, 0x00]);
            sendMidiToDevice ([0xb0, 0x6f, 0x03]);    

            sendMidiToDevice ([0x90, 0x59, this.mode == "volume"    ? 0x09 : 0x02]);
            sendMidiToDevice ([0x90, 0x4F, this.mode == "pan"       ? 0x09 : 0x02]);
            sendMidiToDevice ([0x90, 0x45, this.mode == "senda"     ? 0x09 : 0x02]);
            sendMidiToDevice ([0x90, 0x3B, this.mode == "sendb"     ? 0x09 : 0x02]);
            sendMidiToDevice ([0x90, 0x31, this.mode == "stopclip"  ? 0x09 : 0x02]);
            sendMidiToDevice ([0x90, 0x27, this.mode == "mute"      ? 0x09 : 0x02]);
            sendMidiToDevice ([0x90, 0x1D, this.mode == "solo"      ? 0x09 : 0x02]);
            sendMidiToDevice ([0x90, 0x13, this.mode == "recordarm" ? 0x09 : 0x02]);
        }
    }       
    
    this.updateSession = function(numSlots) {
        for (var pad = 0; pad < numSlots; pad++)
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
    }

    this.updatePadArea = function() {

        if (this.screen == "user1")
        {
            for (var i  = 0; i < 4; i++)
            {
                sendMidiToDevice ([0x97, 0x40 + i, 0x34]);
                sendMidiToDevice ([0x97, 0x3C + i, 0x34]);
                sendMidiToDevice ([0x97, 0x38 + i, 0x34]);
                sendMidiToDevice ([0x97, 0x34 + i, 0x34]);

                sendMidiToDevice ([0x97, 0x60 + i, 0x4B]);
                sendMidiToDevice ([0x97, 0x5C + i, 0x4B]);
                sendMidiToDevice ([0x97, 0x58 + i, 0x4B]);
                sendMidiToDevice ([0x97, 0x54 + i, 0x4B]);

                sendMidiToDevice ([0x97, 0x30 + i, 0x0D]);
                sendMidiToDevice ([0x97, 0x2C + i, 0x0D]);
                sendMidiToDevice ([0x97, 0x28 + i, 0x0D]);
                sendMidiToDevice ([0x97, 0x24 + i, 0x0D]);

                sendMidiToDevice ([0x97, 0x50 + i, 0x25]);
                sendMidiToDevice ([0x97, 0x4C + i, 0x25]);
                sendMidiToDevice ([0x97, 0x48 + i, 0x25]);
                sendMidiToDevice ([0x97, 0x44 + i, 0x25]);
            }
        }
        else if (this.screen == "user2")
        {
            sendMidiToDevice ([0x9f, 0x48, 0x05]);
            sendMidiToDevice ([0x9f, 0x54, 0x05]);
            sendMidiToDevice ([0x9f, 0x0C, 0x05]);
            sendMidiToDevice ([0x9f, 0x18, 0x05]);
            sendMidiToDevice ([0x9f, 0x24, 0x05]);
            sendMidiToDevice ([0x9f, 0x30, 0x05]);

            sendMidiToDevice ([0x9f, 0x29, 0x45]);
            sendMidiToDevice ([0x9f, 0x35, 0x45]);
            sendMidiToDevice ([0x9f, 0x41, 0x45]);
            sendMidiToDevice ([0x9f, 0x4D, 0x45]);
            sendMidiToDevice ([0x9f, 0x11, 0x45]);
            sendMidiToDevice ([0x9f, 0x59, 0x45]);
            sendMidiToDevice ([0x9f, 0x1D, 0x45]);
        }
        else if (this.screen == "session") 
        {
            this.updateSession (8);
        } 
        else if (this.screen == "sessionB") 
        {
            this.updateSession (7);

            var pad = 7;
            
            if (this.mode == "stopclip")
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
            else if (this.mode == "recordarm")
            {
                for (var ch = 0; ch < 8; ch++)
                {
                    var note =  80 - (pad * 10) + (ch + 1);
                    sendMidiToDevice ([0x90, note, this.recordCache[ch] ? 0x05 : 0x00]);
                }
            }
        }
        else 
        {
            if (this.mode == "volume") {
                for (var track = 0; track < 8; track++)
                    sendMidiToDevice ([0xb0, 0x15 + track, Math.round (this.levelCache[track] * 127)]);
            }
            else if (this.mode == "pan") {
                for (var track = 0; track < 8; track++)
                    sendMidiToDevice ([0xb0, 0x15 + track, Math.round (((this.panCache[track] + 1) / 2) * 127)]);
            }
            else if (this.mode == "senda") {
                for (var track = 0; track < 8; track++)
                    sendMidiToDevice ([0xb0, 0x15 + track, Math.round (this.sendaCache[track] * 127)]);
            }
            else if (this.mode == "sendb") {
                for (var track = 0; track < 8; track++)
                    sendMidiToDevice ([0xb0, 0x15 + track, Math.round (this.sendbCache[track] * 127)]);
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

    this.onMoveFader = function(channelNum, newSliderPos) {
        this.levelCache[channelNum] = newSliderPos;
        if (! this.ignoreFader)
            triggerAsyncUpdate();
    }

    this.onPanPotMoved = function(channelNum, newPan) {
        this.panCache[channelNum] = newPan;
        if (! this.ignoreFader)
            triggerAsyncUpdate();
    }

    this.onAuxMoved = function(channel, num, busName, newPos) {        
        if (num == 0)
            this.sendaCache[channel] = newPos;
        else
            this.sendbCache[channel] = newPos;

        if (! this.ignoreFader)
            triggerAsyncUpdate();
    }

    this.onAuxCleared = function(channel, num) {        
        if (num == 0)
            this.sendaCache[channel] = 0;
        else
            this.sendbCache[channel] = 0;
        
        if (! this.ignoreFader)
            triggerAsyncUpdate();
    }

    this.onTrackRecordEnabled = function(channel, isEnabled) {     
        this.recordCache[channel] = isEnabled;
        triggerAsyncUpdate();
    } 

    this.onAsyncUpdate = function() {   
        this.updatePadArea();
    }

    this.onTimer = function(name) {
        stopTimer (name);
        if (name == "fader")
        {
            this.ignoreFader = false;
            this.updatePadArea();
        }
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
       
        if (this.screen == "session" || (this.screen == "sessionB" && pad < 7))
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
            if (d2 > 0)
            {
                if (d1 == 0x59 || d1 == 0x4f || d1 == 0x45 || d1 == 0x3B || d1 == 0x31 || d1 == 0x27 || d1 == 0x1D || d1 == 0x13)
                {
                    if (this.screen == "mixer" || this.screen == "sessionB")
                    {
                        if (d1 == 0x59)
                        { 
                            this.screen = "mixer";
                            this.mode = "volume";
                        }
                        else if (d1 == 0x4f)
                        {
                            this.screen = "mixer";
                            this.mode = "pan";
                        }
                        else if (d1 == 0x45)
                        {
                            this.screen = "mixer";
                            this.mode = "senda";
                        }
                        else if (d1 == 0x3b)
                        {
                            this.screen = "mixer";
                            this.mode = "sendb";
                        }
                        else if (d1 == 0x31)
                        {
                            this.screen = "sessionB";
                            this.mode = "stopclip";
                        }
                        else if (d1 == 0x27)
                        {
                            this.screen = "sessionB";
                            this.mode = "mute";
                        }
                        else if (d1 == 0x1d)
                        {
                            this.screen = "sessionB";
                            this.mode = "solo";
                        }
                        else if (d1 == 0x13)
                        {
                            this.screen = "sessionB";
                            this.mode = "recordarm";                        
                        }
    
                        this.updateMisc();                
                        this.updatePadArea();
                    }
                    else
                    {
                        if (d1 == 0x59) launchScene (0);
                        if (d1 == 0x4F) launchScene (1);
                        if (d1 == 0x45) launchScene (2);
                        if (d1 == 0x3B) launchScene (3);
                        if (d1 == 0x31) launchScene (4);
                        if (d1 == 0x27) launchScene (5);
                        if (d1 == 0x1D) launchScene (6);
                        if (d1 == 0x13) launchScene (7);

                        sendMidiToDevice ([0x90, d1, 0x03]);
                    }
                }
                else
                {
                    var clip = 8 - Math.floor (d1 / 10);
                    var track = d1 % 10 - 1;

                    if (clip == 7 && this.screen == "sessionB")
                    {
                        if (this.mode == "stopclip")
                            stopClip (track);
                        else if (this.mode == "solo")
                            toggleSolo (track);
                        else if (this.mode == "mute")
                            toggleMute (track, false);
                        else if (this.mode == "recordarm")
                            toggleRecEnable (track, false);
                    }
                    else
                    {
                        launchClip (track, clip);
                    }
                }
            }
            else
            {
                if (d1 == 0x59 || d1 == 0x4f || d1 == 0x45 || d1 == 0x3B || d1 == 0x31 || d1 == 0x27 || d1 == 0x1D || d1 == 0x13)
                    sendMidiToDevice ([0x90, d1, 0x00]);
            }
        }
        else if ((d0 & 0xf0) == 0xb0)
        {
            if (d0 == 0xb0 && (d1 >= 0x15 && d1 <= 0x1c))
            {
                if (this.mode == "volume")
                    setFader (d1 - 0x15, d2 / 127.0);
                else if (this.mode == "pan")
                    setPanPot (d1 - 0x15, d2 / 127.0 * 2.0 - 1.0);
                else if (this.mode == "senda")
                    setAux (d1 - 0x15, 0, d2 / 127.0);
                else if (this.mode == "sendb")
                    setAux (d1 - 0x15, 1, d2 / 127.0);
    
                this.ignoreFader = true;
                startTimer ("fader", 333);
            }
            else if (d2 == 0x00)
            {
                if (d1 == 0x68)
                    sendMidiToDevice ([0xb0, 0x68, 0x00]);
                else if (d1 == 0x69)
                    sendMidiToDevice ([0xb0, 0x69, 0x00]);
                else if (d1 == 0x6A)
                    sendMidiToDevice ([0xb0, 0x6A, 0x00]);
                else if (d1 == 0x6B)
                    sendMidiToDevice ([0xb0, 0x6B, 0x00]);
            }
            else if (d2 == 0x7f)
            {
                if (d1 == 0x6c)
                {
                    this.screen = "session";

                    this.updateMisc();
                    this.updatePadArea();    
                }
                else if (d1 == 0x6d)
                {
                    this.screen = "user1";

                    this.updateMisc();
                    this.updatePadArea();    
                }
                else if (d1 == 0x6e)
                {
                    this.screen = "user2";

                    this.updateMisc();
                    this.updatePadArea();    
                }
                else if (d1 == 0x6f)
                {
                    if (this.mode == "volume" || this.mode == "pan" || this.mode == "senda" || this.mode == "sendb")
                        this.screen = "mixer";
                    else
                        this.screen = "sessionB";

                    this.updateMisc();
                    this.updatePadArea();
                }
                else if (d1 == 0x60)
                {
                    this.screen = "note";
                }
                else if (d1 == 0x61)
                {
                    this.screen = "custom";
                }
                else if (d1 == 0x68)
                {
                    changePadBanks (-1);
                    sendMidiToDevice ([0xb0, 0x68, 0x03]);
                }
                else if (d1 == 0x69)
                {
                    changePadBanks (+1);
                    sendMidiToDevice ([0xb0, 0x69, 0x03]);
                }
                else if (d1 == 0x6A)
                {
                    changeFaderBanks (-1);
                    sendMidiToDevice ([0xb0, 0x6A, 0x03]);
                }
                else if (d1 == 0x6B)
                {
                    changeFaderBanks (+1);
                    sendMidiToDevice ([0xb0, 0x6B, 0x03]);
                }
            }
        }
    }

    this.eatsAllMessages = function() {
        return false; 
    }

    this.wantsMessage = function(msg) { 
        var d0 = msg[0];
        if (d0 == 0x97 || d0 == 0x9f)
            return false;
        return true;
    }
}

registerController (new NovationLaunchpad());
