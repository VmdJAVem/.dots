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
    this.deviceDescription               = "Novation Launchpad Pro MK3";    // device name
    this.needsMidiChannel                = true;                            // send midi controller to daw
    this.needsMidiBackChannel            = true;                            // send midi daw to controller

    if (getOS() == "windows")
    {
        this.midiChannelName             = "MIDIOUT3 (LPProMK3 MIDI)";      // MIDI channel name
        this.midiBackChannelName         = "MIDIIN3 (LPProMK3 MIDI)";       // MIDI channel name
    }
    else
    {
        this.midiChannelName             = "";                              // MIDI channel name
        this.midiBackChannelName         = "";                              // MIDI channel name
    }

    this.needsOSCSocket                  = false;                           // communicate via osc
    this.numberOfFaderChannels           = 8;                               // number physical faders      
    this.numberOfTrackPads               = 8;                               // number physical pads per channel
    this.numCharactersForTrackNames      = 0;                               // characters of channel text
    this.numCharactersForAuxLabels       = 0;                               // characters of aux text
    this.numParameterControls            = 8;                               // number of labelled rotary dials that can control things like plugin parameters
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
    
    this.mode                           = "recordarm";
    this.ledCache                       = init2DArray (8, 8, -1);
    this.stateCache                     = init2DArray (8, 8, -1);
    this.soloCache                      = initArray (8, false);
    this.muteCache                      = initArray (8, false);
    this.stopCache                      = initArray (8, false);
    this.selectCache                    = initArray (8, false);
    this.levelCache                     = initArray (8, 0);
    this.panCache                       = initArray (8, 0);
    this.sendaCache                     = initArray (8, 0);
    this.sendbCache                     = initArray (8, 0);
    this.recordCache                    = initArray (8, 0);
    this.paramCache                     = initArray (8, 0);
    this.ignoreFader                    = false;
    this.playing                        = false;
    this.recording                      = false;
    this.shift                          = false;
    
    this.initialise = function() {
    }

    this.initialiseDevice = function() {  
        sendMidiToDevice ([0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]); // device inquiry
        sendMidiToDevice ([0xf0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x10, 0x01, 0xf7]); // enter DAW mode
        sendMidiToDevice ([0xf0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x00, 0x00, 0x00, 0x00, 0xf7]); // Select session layout

        this.ledCache    = init2DArray (8, 8, -1);
        this.soloCache   = initArray (8, false);
        this.muteCache   = initArray (8, false);
        this.stopCache   = initArray (8, false);
        this.selectCache = initArray (8, false);
        this.levelCache  = initArray (8, 0);
        this.panCache    = initArray (8, 0);
        this.sendaCache  = initArray (8, 0);
        this.sendbCache  = initArray (8, 0);
        this.recordCache = initArray (8, 0);
        this.paramCache  = initArray (8, 0);
    
        this.setupMisc();
        this.updateMisc();
        this.updatePadArea();
    }

    this.shutDownDevice = function() {        
        sendMidiToDevice ([0xf0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x10, 0x00, 0xf7]); // exit DAW mode
    }

    this.wantsDevice = function (manufacturer, family, model, version) {
        if (getOS() == "macOS")
            return manufacturer == 0x2029 && family == 0x2301 && model == 0x00;
        return false;
    }

    this.setupMisc = function() {
       // Top Row
        {
            sendMidiToDevice ([0xb0, 0x5B, 0x01]);
            sendMidiToDevice ([0xb0, 0x5C, 0x01]);
        }

        // Left column
        {
            sendMidiToDevice ([0xb0, 0x50, 0x01]);
            sendMidiToDevice ([0xb0, 0x46, 0x01]);
            sendMidiToDevice ([0xb0, 0x3C, 0x00]);
            sendMidiToDevice ([0xb0, 0x32, 0x00]);
            sendMidiToDevice ([0xb0, 0x28, 0x00]);
            sendMidiToDevice ([0xb0, 0x1E, 0x00]);
        }

        // Right Column
        {
            sendMidiToDevice ([0xb0, 0x59, 0x01]);
            sendMidiToDevice ([0xb0, 0x4f, 0x01]);
            sendMidiToDevice ([0xb0, 0x45, 0x01]);
            sendMidiToDevice ([0xb0, 0x3b, 0x01]);
            sendMidiToDevice ([0xb0, 0x31, 0x01]);
            sendMidiToDevice ([0xb0, 0x27, 0x01]);
            sendMidiToDevice ([0xb0, 0x1d, 0x01]);
            sendMidiToDevice ([0xb0, 0x13, 0x01]);
        }

        // Volumes
        {
            sendMidiToDevice ([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x01, 0x00, 0x00,  
                0x00, 0x00, 0x00, 0x01,
                0x01, 0x00, 0x01, 0x01,
                0x02, 0x00, 0x02, 0x01,
                0x03, 0x00, 0x03, 0x01,
                0x04, 0x00, 0x04, 0x01,
                0x05, 0x00, 0x05, 0x01,
                0x06, 0x00, 0x06, 0x01,
                0x07, 0x00, 0x07, 0x01,
                0xF7]);
        }

        // Pans
        {
            sendMidiToDevice ([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x01, 0x01, 0x00,  
                0x00, 0x01, 0x00, 0x01,
                0x01, 0x01, 0x01, 0x01,
                0x02, 0x01, 0x02, 0x01,
                0x03, 0x01, 0x03, 0x01,
                0x04, 0x01, 0x04, 0x01,
                0x05, 0x01, 0x05, 0x01,
                0x06, 0x01, 0x06, 0x01,
                0x07, 0x01, 0x07, 0x01,
                0xF7]);
        }

        // Sends
        {
            sendMidiToDevice ([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x01, 0x02, 0x00,  
                0x00, 0x00, 0x00, 0x01,
                0x01, 0x00, 0x01, 0x01,
                0x02, 0x00, 0x02, 0x01,
                0x03, 0x00, 0x03, 0x01,
                0x04, 0x00, 0x04, 0x01,
                0x05, 0x00, 0x05, 0x01,
                0x06, 0x00, 0x06, 0x01,
                0x07, 0x00, 0x07, 0x01,
                0xF7]);
        }

        // Params
        {
            sendMidiToDevice ([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x01, 0x03, 0x00,  
                0x00, 0x00, 0x00, 0x01,
                0x01, 0x00, 0x01, 0x01,
                0x02, 0x00, 0x02, 0x01,
                0x03, 0x00, 0x03, 0x01,
                0x04, 0x00, 0x04, 0x01,
                0x05, 0x00, 0x05, 0x01,
                0x06, 0x00, 0x06, 0x01,
                0x07, 0x00, 0x07, 0x01,
                0xF7]);
        }
    }

    this.updateMisc = function() {
        // Top Row
        {
            sendMidiToDevice ([0xb0, 0x5B, this.mode == "device" ? 0x42 : 0x01]);
            sendMidiToDevice ([0xb0, 0x5C, this.mode == "device" ? 0x42 : 0x01]);
        }

        // Left Column
        {
            sendMidiToDevice ([0xb0, 0x14, this.playing ? 0x57: 0x01]);
            sendMidiToDevice ([0xb0, 0x0A, this.recording ? 0x48 : 0x01]);
        }

        // Bottom row
        {
            this.updateBottomButtons();

            sendMidiToDevice ([0xb0, 0x01, this.mode == "recordarm" ? 0x05 : 0x01]);
            sendMidiToDevice ([0xb0, 0x02, this.mode == "mute" ? 0x05 : 0x01]);
            sendMidiToDevice ([0xb0, 0x03, this.mode == "solo" ? 0x57 : 0x01]);
            sendMidiToDevice ([0xb0, 0x04, this.mode == "volume" ? 0x4E : 0x01]);
            sendMidiToDevice ([0xb0, 0x05, this.mode == "pan" ? 0x4E : 0x01]);
            sendMidiToDevice ([0xb0, 0x06, this.mode == "sends" ? 0x4E : 0x01]);
            sendMidiToDevice ([0xb0, 0x07, this.mode == "device" ? 0x4E : 0x01]);
            sendMidiToDevice ([0xb0, 0x08, this.mode == "stopclip" ? 0x4E : 0x01]);
        }
    }         

    this.updateBottomButtons = function() {
        if (this.mode == "recordarm") 
        {
            for (var t = 0; t < 8; t++)
                sendMidiToDevice ([0xb0, 0x65 + t, this.recordCache[t] ? 0x05 : 0x01]);    
        }
        else if (this.mode == "mute") 
        {
            for (var t = 0; t < 8; t++)
                sendMidiToDevice ([0xb0, 0x65 + t, this.muteCache[t] ? 0x05 : 0x01]);    
        }
        else if (this.mode == "solo") 
        {
            for (var t = 0; t < 8; t++)
                sendMidiToDevice ([0xb0, 0x65 + t, this.soloCache[t] ? 0x57 : 0x01]);    
        }
        else if (this.mode == "stopclip")
        {
            sendMidiToDevice ([0xb0, 0x65, 0x01]);
            sendMidiToDevice ([0xb0, 0x66, 0x01]);
            sendMidiToDevice ([0xb0, 0x67, 0x01]);
            sendMidiToDevice ([0xb0, 0x68, 0x01]);
            sendMidiToDevice ([0xb0, 0x69, 0x01]);
            sendMidiToDevice ([0xb0, 0x6A, 0x01]);
            sendMidiToDevice ([0xb0, 0x6B, 0x01]);
            sendMidiToDevice ([0xb0, 0x6C, 0x01]);
        }
        else
        {
            for (var t = 0; t < 8; t++)
                sendMidiToDevice ([0xb0, 0x65 + t, this.selectCache[t] ? 0x57 : 0x01]);    
        }
    }

    this.updatePad = function(channel, pad, state, color) {

        var note =  80 - (pad * 10) + (channel + 1);
        var col = hueToHex (color);
        
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

    this.updateSession = function(numSlots) {
        for (var pad = 0; pad < numSlots; pad++)
        {
            for (var ch = 0; ch < 8; ch++)
            {
                var value = this.ledCache[ch][pad];

                var state = Math.floor (value / 100);
                var color = Math.floor (value % 100);

                var note = 80 - (pad * 10) + (ch + 1);
                var col = hueToHex (color);

                this.updatePad (ch, pad, state, color);
            }
        }
    }

    this.updatePadArea = function() 
    {
        if (this.mode == "volume") {
            for (var track = 0; track < 8; track++)
                sendMidiToDevice ([0xb4, track, Math.round (this.levelCache[track] * 127)]);
        }
        else if (this.mode == "pan") {
            for (var track = 0; track < 8; track++)
                sendMidiToDevice ([0xb4, track, Math.round (((this.panCache[track] + 1) / 2) * 127)]);
        }
        else if (this.mode == "sends") {
            for (var track = 0; track < 8; track++)
                sendMidiToDevice ([0xb4, track, Math.round (this.sendaCache[track] * 127)]);
        }
        else if (this.mode == "device") {
            for (var track = 0; track < 8; track++)
                sendMidiToDevice ([0xb4, track, Math.round (this.paramCache[track] * 127)]);
        }
    }

    this.setMode = function(mode) {
        this.mode = mode;
        this.updateMisc();                
        
        if (this.mode == "volume")
        {
            sendMidiToDevice ([0xf0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x00, 0x01, 0x00, 0x00, 0xf7]);
            this.updatePadArea();
        }
        else if (this.mode == "pan")
        {
            sendMidiToDevice ([0xf0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x00, 0x01, 0x01, 0x00, 0xf7]);
            this.updatePadArea();
        }
        else if (this.mode == "sends")
        {
            sendMidiToDevice ([0xf0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x00, 0x01, 0x02, 0x00, 0xf7]);
            this.updatePadArea();
        }
        else if (this.mode == "device")
        {
            sendMidiToDevice ([0xf0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x00, 0x01, 0x03, 0x00, 0xf7]);
            this.updatePadArea();
        }
        else
        {
            sendMidiToDevice ([0xf0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x00, 0x00, 0x00, 0x00, 0xf7]);
        }
    }

    this.handleModeButton = function(track) 
    {
        if (this.mode == "recordarm")   toggleRecEnable(track, false);
        if (this.mode == "mute")        toggleMute(track, false);
        if (this.mode == "solo")        toggleSolo(track);
        if (this.mode == "volume")      selectOneTrack(track);
        if (this.mode == "pan")         selectOneTrack(track);
        if (this.mode == "sends")       selectOneTrack(track);
        if (this.mode == "device")      selectOneTrack(track);
        if (this.mode == "stopclip")    stopClip(track);
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

    this.onParameterChanged = function(parameterNumber, newValue) {        
        this.paramCache[parameterNumber] = newValue.value;

        if (! this.ignoreFader)
            triggerAsyncUpdate();
    }

    this.onParameterCleared = function(parameterNumber) {   
        this.paramCache[parameterNumber] = 0.0;     
    }

    this.onTrackRecordEnabled = function(channel, isEnabled) {     
        this.recordCache[channel] = isEnabled;
        triggerAsyncUpdate();
    } 

    this.onTrackSelectionChanged = function(channel, isSelected) {        
        this.selectCache[channel] = isSelected;
        triggerAsyncUpdate();
    }

    this.onAsyncUpdate = function() {   
        this.updateBottomButtons();
        this.updatePadArea();
        this.updateSession(8);
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
        this.playing = isPlaying;
        this.updateMisc();
    }

    this.onRecordStateChanged = function(isRecording) {
        this.recording = isRecording;
        this.updateMisc();
    }

    this.onPadStateChanged = function(channel, pad, color, state) {

        var val = state * 100 + color;

        if (this.ledCache[channel][pad] == val) 
            return;

        this.ledCache[channel][pad] = val;

        this.updatePad (channel, pad, state, color);
    }

    this.onMidiReceivedFromDevice = function(msg) {
        var d0 = msg[0];
        var d1 = msg[1];
        var d2 = msg[2];

        if (d0 == 0x90)
        {
            if (d2 > 0)
            {
                var clip = 8 - Math.floor (d1 / 10);
                var track = d1 % 10 - 1;

                launchClip (track, clip);
            }
        }
        else if (d0 == 0xb0)
        {
            if (d2 == 0x7f)
            {
                if (d1 % 10 == 9)
                {
                    var clip = 8 - Math.floor (d1 / 10);                    
               
                    launchScene (clip);
                    sendMidiToDevice ([0xb0, d1, 0x03]);                
                }
                else if (d1 == 0x5b)
                {
                    if (this.mode == "device")
                    {
                        changeParameterBank (this.shift ? -8 : -1);
                        sendMidiToDevice ([0xb0, d1, 0x4E]);   
                    }
                    else
                    {
                        changeFaderBanks (this.shift ? -8 : -1);
                        sendMidiToDevice ([0xb0, d1, 0x03]);                
                    }
                }
                else if (d1 == 0x5c)
                {
                    if (this.mode == "device")
                    {
                        changeParameterBank (this.shift ? +8 : +1);
                        sendMidiToDevice ([0xb0, d1, 0x4E]);
                    }
                    else
                    {
                        changeFaderBanks (this.shift ? +8 : +1);
                        sendMidiToDevice ([0xb0, d1, 0x03]);                
                    }
                }
                else if (d1 == 0x50)
                {
                    changePadBanks (this.shift ? -8 : -1);
                    sendMidiToDevice ([0xb0, d1, 0x03]);
                }
                else if (d1 == 0x46)
                {
                    changePadBanks (this.shift ? +8 : +1);
                    sendMidiToDevice ([0xb0, d1, 0x03]);                
                }
                else if (d1 == 0x5a)
                {
                    this.shift = true;
                    sendMidiToDevice ([0xb0, d1, 0x03]);                
                }
                else if (d1 == 0x14)
                {
                    if (this.playing)
                        stop();
                    else
                        play();
                }
                else if (d1 == 0x0A)
                {
                    if (this.recording)
                        stop();
                    else
                        record();
                }
                else if (d1 >= 0x01 && d1 <= 0x08)
                {
                    if (this.shift)
                    {
                        if (d1 == 0x01) undo();
                        if (d1 == 0x02) redo();
                        if (d1 == 0x03) toggleClick();
                    }
                    else
                    {
                        if (d1 == 0x01) this.setMode ("recordarm");
                        if (d1 == 0x02) this.setMode ("mute");
                        if (d1 == 0x03) this.setMode ("solo");
                        if (d1 == 0x04) this.setMode ("volume");
                        if (d1 == 0x05) this.setMode ("pan");
                        if (d1 == 0x06) this.setMode ("sends");
                        if (d1 == 0x07) this.setMode ("device");
                        if (d1 == 0x08) this.setMode ("stopclip");
                    }
                }
                else if (d1 >= 0x65 && d1 <= 0x6c)
                {
                    this.handleModeButton (d1 - 0x65);
                }
            }
            else if (d2 == 0x00)
            {
                if (d1 == 0x5a)
                {
                    this.shift = false;
                    sendMidiToDevice ([0xb0, d1, 0x01]);
                }
                else if (d1 == 0x5B || d1 == 0x5C)
                {
                    sendMidiToDevice ([0xb0, 0x5B, this.mode == "device" ? 0x42 : 0x01]);
                    sendMidiToDevice ([0xb0, 0x5C, this.mode == "device" ? 0x42 : 0x01]);
                }
                else if (d1 == 0x50 || d1 == 0x46 || d1 == 0x3c || d1 == 0x32 || d1 == 0x28 || d1 == 0x1e)
                {
                    sendMidiToDevice ([0xb0, d1, 0x01]);
                }
                else if (d1 % 10 == 9)
                {
                    sendMidiToDevice ([0xb0, d1, 0x01]);
                }
            }
        }
        else if (d0 == 0xb4)
        {
            if (this.mode == "volume")
                setFader (d1, d2 / 127.0);
            else if (this.mode == "pan")
                setPanPot (d1, d2 / 127.0 * 2.0 - 1.0);
            else if (this.mode == "sends")
                setAux (d1, 0, d2 / 127.0);
            else if (this.mode == "device")
                setParameter (d1, d2 / 127.0);

            this.ignoreFader = true;
            startTimer ("fader", 333);
        }
    }
}

registerController (new NovationLaunchpad());
