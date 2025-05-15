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

function NovationLaunchpad() {
    // Variables: these must be filled out so the session knows your controller layout
    this.deviceDescription               = "Novation Launchpad MK1";        // device name
    this.needsMidiChannel                = true;                            // send midi controller to daw
    this.needsMidiBackChannel            = true;                            // send midi daw to controller
    this.midiChannelName                 = "";                              // MIDI channel name
    this.midiBackChannelName             = "";                              // MIDI channel name
    this.needsOSCSocket                  = false;                           // communicate via osc
    this.numberOfFaderChannels           = 8;                               // number physical faders      
    this.numberOfTrackPads               = 8;                               // number physical pads per channel
    this.numCharactersForTrackNames      = 0;                               // characters of channel text
    this.numCharactersForAuxLabels       = 0;                               // characters of aux text
    this.numParameterControls            = 0;                               // number of labelled rotary dials that can control things like plugin parameters
    this.numCharactersForParameterLabels = 0;                               // characters for rotary dials
    this.wantsClock                      = false;                           // device wants MIDI clock
    this.allowBankingOffEnd              = false;                           // allow surface to display blank channels
    this.numMarkers                      = 0;                               // number of markers that can be displayed
    this.numCharactersForMarkerLabels    = 0;                               // characters for markers
    this.wantsAuxBanks                   = false;                           // display auxes
    this.numAuxes                        = 2;                               // number of auxes that can be displayed
    this.followsTrackSelection           = false;                           // controller track follows UI selection
    this.cliplauncher                    = true;                            // this controller is primarily a clip launcher
    this.limitedPadColours               = true;                            // pad colors are limited to < 8
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
    this.midiCache                      = initArray (128, -1);
    
    this.initialise = function() {
    }

    this.initialiseDevice = function() {  
        sendMidiToDevice ([0xB0, 0x00, 0x00]);

        this.ledCache    = init2DArray (8, 8, -1);
        this.soloCache   = initArray (8, false);
        this.muteCache   = initArray (8, false);
        this.stopCache   = initArray (8, false);
        this.levelCache  = initArray (8, 0);
        this.panCache    = initArray (8, 0);
        this.sendaCache  = initArray (8, 0);
        this.sendbCache  = initArray (8, 0);
        this.recordCache = initArray (8, 0);
        this.midiCache   = initArray (128, -1);
    
        this.updateMisc();
        this.updatePadArea();
    }

    this.shutDownDevice = function() {        
        sendMidiToDevice ([0xB0, 0x00, 0x00]);
    }

    this.sendIfNeeded = function(bytes) {
        if (bytes[0] == 0x90) 
        {
            if (bytes[2] != this.midiCache[bytes[1]])
            {
                sendMidiToDevice (bytes);
                this.midiCache[bytes[1]] = bytes[2];
            }
        }
        else
        {
            sendMidiToDevice (bytes);
        }
    }

    this.updateMisc = function() {

        if (this.screen == "user1")
        {
            sendMidiToDevice ([0xB0, 0x00, 0x02]);

            this.sendIfNeeded ([0xb0, 0x6c, 0x00]);
            this.sendIfNeeded ([0xb0, 0x6d, 0x1c]);
            this.sendIfNeeded ([0xb0, 0x6e, 0x00]);
            this.sendIfNeeded ([0xb0, 0x6f, 0x00]);           
        }
        else if (this.screen == "user2")
        {
            sendMidiToDevice ([0xB0, 0x00, 0x01]);

            this.sendIfNeeded ([0xb0, 0x6c, 0x00]);
            this.sendIfNeeded ([0xb0, 0x6d, 0x00]);
            this.sendIfNeeded ([0xb0, 0x6e, 0x1c]);
            this.sendIfNeeded ([0xb0, 0x6f, 0x00]);   
            
            this.sendIfNeeded ([0x90, 0x08, 0x00]);
            this.sendIfNeeded ([0x90, 0x18, 0x00]);
            this.sendIfNeeded ([0x90, 0x28, 0x00]);
            this.sendIfNeeded ([0x90, 0x38, 0x00]);
            this.sendIfNeeded ([0x90, 0x48, 0x00]);
            this.sendIfNeeded ([0x90, 0x58, 0x00]);
            this.sendIfNeeded ([0x90, 0x68, 0x00]);
            this.sendIfNeeded ([0x90, 0x78, 0x00]);
        }
        else if (this.screen == "session")
        {
            sendMidiToDevice ([0xB0, 0x00, 0x01]);

            this.sendIfNeeded ([0xb0, 0x6c, 0x1c]);
            this.sendIfNeeded ([0xb0, 0x6d, 0x00]);
            this.sendIfNeeded ([0xb0, 0x6e, 0x00]);
            this.sendIfNeeded ([0xb0, 0x6f, 0x00]);    
    
            this.sendIfNeeded ([0x90, 0x08, 0x00]);
            this.sendIfNeeded ([0x90, 0x18, 0x00]);
            this.sendIfNeeded ([0x90, 0x28, 0x00]);
            this.sendIfNeeded ([0x90, 0x38, 0x00]);
            this.sendIfNeeded ([0x90, 0x48, 0x00]);
            this.sendIfNeeded ([0x90, 0x58, 0x00]);
            this.sendIfNeeded ([0x90, 0x68, 0x00]);
            this.sendIfNeeded ([0x90, 0x78, 0x00]);
        }
        else if (this.screen == "mixer")
        {
            sendMidiToDevice ([0xB0, 0x00, 0x01]);
            
            this.sendIfNeeded ([0xb0, 0x6c, 0x00]);
            this.sendIfNeeded ([0xb0, 0x6d, 0x00]);
            this.sendIfNeeded ([0xb0, 0x6e, 0x00]);
            this.sendIfNeeded ([0xb0, 0x6f, 0x1c]);    

            this.sendIfNeeded ([0x90, 0x08, this.mode == "volume"    ? 0x1c : 0x00]);
            this.sendIfNeeded ([0x90, 0x18, this.mode == "pan"       ? 0x1c : 0x00]);
            this.sendIfNeeded ([0x90, 0x28, this.mode == "senda"     ? 0x1c : 0x00]);
            this.sendIfNeeded ([0x90, 0x38, this.mode == "sendb"     ? 0x1c : 0x00]);
            this.sendIfNeeded ([0x90, 0x48, this.mode == "stopclip"  ? 0x1c : 0x00]);
            this.sendIfNeeded ([0x90, 0x58, this.mode == "mute"      ? 0x1c : 0x00]);
            this.sendIfNeeded ([0x90, 0x68, this.mode == "solo"      ? 0x1c : 0x00]);
            this.sendIfNeeded ([0x90, 0x78, this.mode == "recordarm" ? 0x1c : 0x00]);
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

                var note =  pad * 0x10 + ch;

                if (color == 0)
                    this.sendIfNeeded ([0x90, note, 0x0C]);
                else if (color == 1)
                    this.sendIfNeeded ([0x90, note, 0x3F]);
                else if (color == 2)
                    this.sendIfNeeded ([0x90, note, 0x3C]);
                else if (color == 3)
                    this.sendIfNeeded ([0x90, note, 0x0F]);
            }
        }
    }

    this.updatePadArea = function() {

        if (this.screen == "user1") 
        {
            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x40 + x, 0x1D]);
            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x3C + x, 0x1D]);
            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x38 + x, 0x1D]);
            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x34 + x, 0x1D]);

            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x30 + x, 0x1C]);
            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x2C + x, 0x1C]);
            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x28 + x, 0x1C]);
            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x24 + x, 0x1C]);

            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x60 + x, 0x1C]);
            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x5C + x, 0x1C]);
            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x58 + x, 0x1C]);
            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x54 + x, 0x1C]);

            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x50 + x, 0x1D]);
            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x4C + x, 0x1D]);
            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x48 + x, 0x1D]);
            for (var x = 0; x < 4; x++) this.sendIfNeeded ([0x90, 0x44 + x, 0x1D]);

        }
        else if (this.screen == "user2")
        {
            var count = 0;

            for (var pad = 7; pad >= 0; pad--)
            {
                for (var ch = 0; ch < 8; ch++)            
                {
                    var id = pad * 0x10 + ch;

                    var note = count % 12;
                    var sharp = note == 1 || note == 3 || note == 6 || note == 8 || note == 10;

                    this.sendIfNeeded ([0x90, id, sharp ? 0x0D : 0x3F]);
                    count++;
                }
            }
        }
        else if (this.screen == "mixer")
        {
            if (this.mode == "volume")
            {
                for (var ch = 0; ch < 8; ch++)
                {
                    var num = 0;
                    
                    if (this.levelCache[ch] > 0)
                        num = Math.round (this.levelCache[ch] * 7) + 1;

                    for (var i = 0; i < 8; i++)
                    {
                        var note = 0x70 + ch - i * 0x10;
                        this.sendIfNeeded ([0x90, note, i < num ? 0x1D : 0x0C]);
                    }   
                }
            }
            else if (this.mode == "pan")
            {
                for (var ch = 0; ch < 8; ch++)
                {
                    if (Math.abs (this.panCache[ch]) < 0.1)
                    {
                        for (var i = 0; i < 8; i++)
                        {
                            var note = 0x70 + ch - i * 0x10;
                            this.sendIfNeeded ([0x90, note, i == 3 || i == 4 ? 0x1D : 0x0C]);
                        }            
                    }
                    else
                    {    
                        if (this.panCache[ch] > 0)
                        {
                            var num = Math.round (this.panCache[ch] * 3) + 1;

                            for (var i = 0; i < 8; i++)
                            {
                                var note = 0x70 + ch - i * 0x10;
                                if (i < 4)
                                    this.sendIfNeeded ([0x90, note, 0x0C]);
                                else
                                    this.sendIfNeeded ([0x90, note, i - 4 < num ? 0x1D : 0x0C]);
                            }
                        }
                        else
                        {
                            var num = Math.round (-this.panCache[ch] * 3) + 1;

                            for (var i = 0; i < 8; i++)
                            {
                                var note = 0x70 + ch - i * 0x10;
                                if (i >= 4)
                                    this.sendIfNeeded ([0x90, note, 0x0C]);
                                else
                                    this.sendIfNeeded ([0x90, note, 4 - i <= num ? 0x1D : 0x0C]);
                            }
                        }
                    }   
                }
            } 
            else if (this.mode == "senda")
            {
                for (var ch = 0; ch < 8; ch++)
                {
                    var num = 0;
                    
                    if (this.sendaCache[ch] > 0)
                        num = Math.round (this.sendaCache[ch] * 7) + 1;

                    for (var i = 0; i < 8; i++)
                    {
                        var note = 0x70 + ch - i * 0x10;
                        this.sendIfNeeded ([0x90, note, i < num ? 0x1D : 0x0C]);
                    }   
                }
            } 
            else if (this.mode == "sendb")
            {              
                for (var ch = 0; ch < 8; ch++)
                {
                    var num = 0;
                    
                    if (this.sendbCache[ch] > 0)
                        num = Math.round (this.sendbCache[ch] * 7) + 1;

                    for (var i = 0; i < 8; i++)
                    {
                        var note = 0x70 + ch - i * 0x10;
                        this.sendIfNeeded ([0x90, note, i < num ? 0x1D : 0x0C]);
                    }   
                }  
            }
            else if (this.mode == "stopclip")
            {
                this.updateSession (7);
                for (var ch = 0; ch < 8; ch++)
                {
                    var note = 0x70 + ch;
                    this.sendIfNeeded ([0x90, note, 0x0D]);
                }
            }
            else if (this.mode == "solo")
            {
                this.updateSession (7);
                for (var ch = 0; ch < 8; ch++)
                {
                    var note = 0x70 + ch;
                    this.sendIfNeeded ([0x90, note, this.soloCache[ch] ? 0x3C : 0x0C]);
                }
            }
            else if (this.mode == "mute")
            {
                this.updateSession (7);
                for (var ch = 0; ch < 8; ch++)
                {
                    var note = 0x70 + ch;
                    this.sendIfNeeded ([0x90, note, this.muteCache[ch] ? 0x0F : 0x0C]);
                }
            }
            else if (this.mode == "recordarm")
            {
                this.updateSession (7);
                for (var ch = 0; ch < 8; ch++)
                {
                    var note = 0x70 + ch;
                    this.sendIfNeeded ([0x90, note, this.recordCache[ch] ? 0x0F : 0x0C]);
                }
            }
        }
        else if (this.screen == "session") 
        {
            this.updateSession (8);
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

        var note =  pad * 0x10 + channel;

        var somePads = false;

        if (this.screen == "mixer" && pad < 7)
        {
            if (this.mode == "stopclip")
                somePads = true;
            else if (this.mode == "solo")
                somePads = true;
            else if (this.mode == "mute")
                somePads = true;
            else if (this.mode == "recordarm")
                somePads = true;
        }

        if (this.screen == "session" || somePads)
        {
            if (color == 0)
                this.sendIfNeeded ([0x90, note, 0x0C]);
            else if (color == 1)
                this.sendIfNeeded ([0x90, note, 0x3F]);
            else if (color == 2)
                this.sendIfNeeded ([0x90, note, 0x3C]);
            else if (color == 3)
                this.sendIfNeeded ([0x90, note, 0x0F]);
        }
    }

    this.onMidiReceivedFromDevice = function(msg) {
        var d0 = msg[0];
        var d1 = msg[1];
        var d2 = msg[2];

        dataOut(msg);

        if (d0 == 0x90)
        {
            if (this.screen == "user1" && d1 >= 0x24 && d1 <= 0x63) 
            {
                sendMidiToDefaultDevice (msg);
                if (d2 > 0)
                    this.sendIfNeeded ([0x90, d1, 0x3C]);
                else
                    this.updatePadArea();

            }
            else if (this.screen == "user2") 
            {
                var ch = d1 % 16;
                var pad = 7 - Math.floor (d1 / 16);

                if (ch >= 0 && ch < 8)
                {
                    sendMidiToDefaultDevice ([d0, 36 + pad * 8 + ch, d2]);
                    if (d2 > 0)
                        this.sendIfNeeded ([0x90, d1, 0x3C]);
                    else
                        this.updatePadArea();
                }
            }
            else if (d2 > 0)
            {
                if (d1 == 0x08 || d1 == 0x18 || d1 == 0x28 || d1 == 0x38 || d1 == 0x48 || d1 == 0x58 || d1 == 0x68 || d1 == 0x78)
                {
                    if (this.screen == "mixer")
                    {
                        if (d1 == 0x08)
                        { 
                            this.screen = "mixer";
                            this.mode = "volume";
                        }
                        else if (d1 == 0x18)
                        {
                            this.screen = "mixer";
                            this.mode = "pan";
                        }
                        else if (d1 == 0x28)
                        {
                            this.screen = "mixer";
                            this.mode = "senda";
                        }
                        else if (d1 == 0x38)
                        {
                            this.screen = "mixer";
                            this.mode = "sendb";
                        }
                        else if (d1 == 0x48)
                        {
                            this.screen = "mixer";
                            this.mode = "stopclip";
                        }
                        else if (d1 == 0x58)
                        {
                            this.screen = "mixer";
                            this.mode = "mute";
                        }
                        else if (d1 == 0x68)
                        {
                            this.screen = "mixer";
                            this.mode = "solo";
                        }
                        else if (d1 == 0x78)
                        {
                            this.screen = "mixer";
                            this.mode = "recordarm";                        
                        }
    
                        this.updateMisc();                
                        this.updatePadArea();
                    }
                    else if (this.screen == "session")
                    {
                        if (d1 == 0x08) launchScene (0);
                        if (d1 == 0x18) launchScene (1);
                        if (d1 == 0x28) launchScene (2);
                        if (d1 == 0x38) launchScene (3);
                        if (d1 == 0x48) launchScene (4);
                        if (d1 == 0x58) launchScene (5);
                        if (d1 == 0x68) launchScene (6);
                        if (d1 == 0x78) launchScene (7);

                        this.sendIfNeeded ([0x90, d1, 0x1C]);
                    }
                }
                else
                {
                    var clip = Math.floor (d1 / 0x10);
                    var track = d1 % 0x10;

                    if (this.screen == "mixer" && this.mode == "volume")
                    {
                        var val = (7 - clip) / 7.0;
                        setFader (track, val, false);
                    }
                    else if (this.screen == "mixer" && this.mode == "pan")
                    {
                        var val = (7 - clip) / 7.0;
                        if (clip == 3 || clip == 4)
                            setPanPot (track, 0, false);
                        else
                            setPanPot (track, val * 2 - 1, false);
                    } 
                    else if (this.screen == "mixer" && this.mode == "senda")
                    {
                        var val = (7 - clip) / 7.0;
                        setAux (track, 0, val);
                    } 
                    else if (this.screen == "mixer" && this.mode == "sendb")
                    {
                        var val = (7 - clip) / 7.0;
                        setAux (track, 1, val);
                    }
                    else if (this.screen == "mixer" && clip == 7)
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
                if (this.screen == "mixer")
                {
                    if (d1 == 0x08) this.sendIfNeeded ([0x90, 0x08, this.mode == "volume"    ? 0x1c : 0x00]);
                    if (d1 == 0x08) this.sendIfNeeded ([0x90, 0x18, this.mode == "pan"       ? 0x1c : 0x00]);
                    if (d1 == 0x08) this.sendIfNeeded ([0x90, 0x28, this.mode == "senda"     ? 0x1c : 0x00]);
                    if (d1 == 0x08) this.sendIfNeeded ([0x90, 0x38, this.mode == "sendb"     ? 0x1c : 0x00]);
                    if (d1 == 0x08) this.sendIfNeeded ([0x90, 0x48, this.mode == "stopclip"  ? 0x1c : 0x00]);
                    if (d1 == 0x08) this.sendIfNeeded ([0x90, 0x58, this.mode == "mute"      ? 0x1c : 0x00]);
                    if (d1 == 0x08) this.sendIfNeeded ([0x90, 0x68, this.mode == "solo"      ? 0x1c : 0x00]);
                    if (d1 == 0x08) this.sendIfNeeded ([0x90, 0x78, this.mode == "recordarm" ? 0x1c : 0x00]);
                }
                else if (d1 == 0x08 || d1 == 0x18 || d1 == 0x28 || d1 == 0x38 || d1 == 0x48 || d1 == 0x58 || d1 == 0x68 || d1 == 0x78)
                {
                    this.sendIfNeeded ([0x90, d1, 0x0C]);
                }
            }
        }
        else if (d0 == 0xb0)
        {
            if (d2 == 0x7f)
            {
                if (d1 == 0x6c)
                {
                    this.screen = "session";

                    this.midiCache  = initArray (128, -1);

                    this.updateMisc();
                    this.updatePadArea();    
                }
                else if (d1 == 0x6d)
                {
                    this.screen = "user1";

                    this.midiCache  = initArray (128, -1);

                    this.updateMisc();
                    this.updatePadArea();    
                }
                else if (d1 == 0x6e)
                {
                    this.screen = "user2";

                    this.midiCache  = initArray (128, -1);

                    this.updateMisc();
                    this.updatePadArea();    
                }
                else if (d1 == 0x6f)
                {
                    this.screen = "mixer";

                    this.midiCache  = initArray (128, -1);

                    this.updateMisc();
                    this.updatePadArea();
                }
                else if (d1 == 0x68)
                {                    
                    changePadBanks (-1);
                    this.sendIfNeeded ([0xb0, 0x68, 0x3f]);
                }
                else if (d1 == 0x69)
                {
                    changePadBanks (+1);
                    this.sendIfNeeded ([0xb0, 0x69, 0x3f]);
                }
                else if (d1 == 0x6A)
                {
                    changeFaderBanks (-1);
                    this.sendIfNeeded ([0xb0, 0x6A, 0x3f]);
                }
                else if (d1 == 0x6B)
                {
                    changeFaderBanks (+1);
                    this.sendIfNeeded ([0xb0, 0x6B, 0x3f]);
                }
            }
            else
            {
                if (d1 == 0x68)
                {                    
                    this.sendIfNeeded ([0xb0, 0x68, 0x0C]);
                }
                else if (d1 == 0x69)
                {
                    this.sendIfNeeded ([0xb0, 0x69, 0x0C]);
                }
                else if (d1 == 0x6A)
                {
                    this.sendIfNeeded ([0xb0, 0x6A, 0x0C]);
                }
                else if (d1 == 0x6B)
                {
                    this.sendIfNeeded ([0xb0, 0x6B, 0x0C]);
                }
            }
        }
    }

    this.eatsAllMessages = function() {
        return true; 
    }

    this.wantsMessage = function(msg) { 
        return true;
    }
}

registerController (new NovationLaunchpad());
