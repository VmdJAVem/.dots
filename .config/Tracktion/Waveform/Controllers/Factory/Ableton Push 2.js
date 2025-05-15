function dataOut (msg) {
    var hex = new Array();
    for (var i = 0; i < msg.length; i++) {
        hex.push (msg[i].toString(16));
    }
    logMsg ("<<<", hex);
}

function noop() {}

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

var off             = 0x00;
var red             = 0x7f;
var green           = 0x7e;
var buttonBright    = 0x78;
var buttonDim       = 0x7b;
var whiteBright     = 0x7f;
var whiteDim        = 0x09;

function hueToHex (color)
{
    var col = 0;
    switch (color)
    {
        case 0:  col = 0;  break;

        case 1:  col = 0x02; break;
        case 2:  col = 0x04; break;
        case 3:  col = 0x07; break;
        case 4:  col = 0x09; break;
        case 5:  col = 0x0C; break;
        case 6:  col = 0x0B; break;
        case 7:  col = 0x20; break;
        case 8:  col = 0x7E; break;
        case 9:  col = 0x0F; break;

        case 10: col = 0x2E; break;
        case 11: col = 0x10; break;
        case 12: col = 0x12; break;
        case 13: col = 0x7D; break;
        case 14: col = 0x17; break;
        case 15: col = 0x1A; break;
        case 16: col = 0x18; break;
        case 17: col = 0x34; break;
        case 18: col = 0x19; break;
    }
    return col;
}

function AbletonPush() {
    // Variables: these must be filled out so the session knows your controller layout
    this.deviceDescription               = "Ableton Push 2";                // device name
    this.needsMidiChannel                = true;                            // send midi controller to daw
    this.needsMidiBackChannel            = true;                            // send midi daw to controller
    if (getOS() == "windows")
    {
        this.midiChannelName             = "^Ableton Push 2";               // MIDI channel name
        this.midiBackChannelName         = "^Ableton Push 2";               // MIDI channel name
    }
    else
    {
        this.midiChannelName             = "Ableton Push 2 Live Port";      // MIDI channel name
        this.midiBackChannelName         = "Ableton Push 2 Live Port";      // MIDI channel name
    }
    this.needsOSCSocket                  = false;                           // communicate via osc
    this.numberOfFaderChannels           = 8;                               // number physical faders      
    this.numberOfTrackPads               = 8;                               // number physical pads per channel
    this.numCharactersForTrackNames      = 20;                              // characters of channel text
    this.numCharactersForAuxLabels       = 0;                               // characters of aux text
    this.numCharactersForParameterLabels = 20;                              // characters for rotary dials
    this.numParameterControls            = 8;                               // number of labelled rotary dials that can control things like plugin parameters
    this.wantsDummyParams                = false;                           // display to parameters with track and plugin name
    this.wantsClock                      = true;                            // device wants MIDI clock
    this.allowBankingOffEnd              = false;                           // allow surface to display blank channels
    this.numMarkers                      = 0;                               // number of markers that can be displayed
    this.numCharactersForMarkerLabels    = 0;                               // characters for markers
    this.wantsAuxBanks                   = false;                           // display auxes
    this.numAuxes                        = 6;                               // number of auxes that can be displayed
    this.followsTrackSelection           = false;                           // controller track follows UI selection
    this.cliplauncher                    = true;                            // this controller is primarily a clip launcher
    this.auxmode                         = "bybus";                         // Aux index is either 'bybus' (-1 any) or 'byposition'
    
    this.screenMode                     = "mix";
    this.screenParam                    = "vol";
    this.buttonRowMode                  = "stop";
    this.padMode                        = "session";
    this.ledCache                       = init2DArray (8, 8, -1);
    this.soloCache                      = initArray (8, false);
    this.muteCache                      = initArray (8, false);
    this.stopCache                      = initArray (8, false);
    this.selectCache                    = initArray (8, false);
    this.levelCache                     = initArray (8, 0);
    this.panCache                       = initArray (8, 0);
    this.recordCache                    = initArray (8, 0);
    this.paramCache                     = initArray (8, 0);
    this.playingCache                   = initArray (8, false);
    this.playing                        = false;
    this.recording                      = false;
    this.shift                          = false;
    this.isClickOn                      = false;
    this.octave                         = 0;
    
    this.initialise = function() {
    }

    this.initialiseDevice = function() {  
        //sendMidiToDevice([0xF0, 0x00, 0x21, 0x1D, 0x01, 0x01, 0x0A, 0x01, 0xF7]);

        this.ledCache     = init2DArray (8, 8, -1);
        this.soloCache    = initArray (8, false);
        this.muteCache    = initArray (8, false);
        this.stopCache    = initArray (8, false);
        this.selectCache  = initArray (8, false);
        this.playingCache = initArray (8, false);
        this.levelCache   = initArray (8, 0);
        this.panCache     = initArray (8, 0);
        this.recordCache  = initArray (8, 0);
        this.paramCache   = initArray (8, 0);
    
        this.updateMisc();
        this.updatePadArea();

        enablePush(true);
        setPushScreen ("mixVol");
        setAuxBank (0);
    }

    this.shutDownDevice = function() {      
        
        for (var i = 0; i < 127; i++)
        {
            sendMidiToDevice([0xb0, i, 0x00]);
            sendMidiToDevice([0x90, i, 0x00]);
        }
        
        enablePush(false);
    }

    this.updateMisc = function() {
        sendMidiToDevice([0xb0, 0x3c, this.buttonRowMode == "mute" ? red   : buttonDim]);
        sendMidiToDevice([0xb0, 0x3d, this.buttonRowMode == "solo" ? green : buttonDim]);
        sendMidiToDevice([0xb0, 0x1d, this.buttonRowMode == "stop" ? red   : buttonDim]);

        sendMidiToDevice([0xb0, 0x55, this.playing ? green : buttonDim]);
        sendMidiToDevice([0xb0, 0x56, this.recording ? red : buttonDim]);

        sendMidiToDevice([0xb0, 0x03, whiteDim]);
        sendMidiToDevice([0xb0, 0x09, this.isClickOn ? whiteBright : whiteDim]);

        sendMidiToDevice([0xb0, 0x76, whiteDim]);
        sendMidiToDevice([0xb0, 0x77, whiteDim]);

        sendMidiToDevice([0xb0, 0x33, this.padMode == "session" ? whiteBright : whiteDim]);
        sendMidiToDevice([0xb0, 0x32, this.padMode != "session" ? whiteBright : whiteDim]);

        sendMidiToDevice([0xb0, 0x6e, this.screenMode == "device" ? whiteBright : whiteDim]);
        sendMidiToDevice([0xb0, 0x70, this.screenMode == "mix"    ? whiteBright : whiteDim]);
        //sendMidiToDevice([0xb0, 0x6f, this.screenMode == "browse" ? whiteBright : whiteDim]);
        sendMidiToDevice([0xb0, 0x71, this.screenMode == "clip"   ? whiteBright : whiteDim]);

        if (this.screenMode == "mix")
        {
            sendMidiToDevice([0xb0, 0x66, this.screenParam == "vol" ? buttonBright : buttonDim]);
            sendMidiToDevice([0xb0, 0x67, this.screenParam == "pan" ? buttonBright : buttonDim]);
            sendMidiToDevice([0xb0, 0x68, this.screenParam == "send1" ? buttonBright : buttonDim]);
            sendMidiToDevice([0xb0, 0x69, this.screenParam == "send2" ? buttonBright : buttonDim]);
            sendMidiToDevice([0xb0, 0x6a, this.screenParam == "send3" ? buttonBright : buttonDim]);
            sendMidiToDevice([0xb0, 0x6b, this.screenParam == "send4" ? buttonBright : buttonDim]);
            sendMidiToDevice([0xb0, 0x6c, this.screenParam == "send5" ? buttonBright : buttonDim]);
            sendMidiToDevice([0xb0, 0x6d, this.screenParam == "send6" ? buttonBright : buttonDim]);

            sendMidiToDevice([0xb0, 0x1c, this.screenParam == "master" ? whiteBright : whiteDim]);
        }
        else
        {
            sendMidiToDevice([0xb0, 0x66, off]);
            sendMidiToDevice([0xb0, 0x67, off]);
            sendMidiToDevice([0xb0, 0x68, off]);
            sendMidiToDevice([0xb0, 0x69, off]);
            sendMidiToDevice([0xb0, 0x6a, off]);
            sendMidiToDevice([0xb0, 0x6b, off]);
            sendMidiToDevice([0xb0, 0x6c, off]);
            sendMidiToDevice([0xb0, 0x6d, off]);

            sendMidiToDevice([0xb0, 0x1c, off]);
        }

        if (this.padMode == "session")
        {
            for (var i = 0; i < 8; i++)
                sendMidiToDevice([0xb0, 0x24 + i, buttonDim]);

            sendMidiToDevice([0xb0, 0x2c, whiteDim]);
            sendMidiToDevice([0xb0, 0x2d, whiteDim]);
            sendMidiToDevice([0xb0, 0x2e, whiteDim]);
            sendMidiToDevice([0xb0, 0x2f, whiteDim]);

            sendMidiToDevice([0xb0, 0x36, whiteDim]);
            sendMidiToDevice([0xb0, 0x37, whiteDim]);
            sendMidiToDevice([0xb0, 0x3e, whiteDim]);
            sendMidiToDevice([0xb0, 0x3f, whiteDim]);
        }
        else
        {
            for (var i = 0; i < 8; i++)
                sendMidiToDevice([0xb0, 0x24 + i, off]);
    
            sendMidiToDevice([0xb0, 0x2c, off]);
            sendMidiToDevice([0xb0, 0x2d, off]);
            sendMidiToDevice([0xb0, 0x2e, off]);
            sendMidiToDevice([0xb0, 0x2f, off]);

            if (this.padMode == "note")
            {
                sendMidiToDevice([0xb0, 0x37, whiteDim + (this.octave > 0 ? Math.abs(this.octave) * 10 : 0)]);
                sendMidiToDevice([0xb0, 0x36, whiteDim + (this.octave < 0 ? Math.abs(this.octave) * 10 : 0)]);
            }
            else
            {

            }
            sendMidiToDevice([0xb0, 0x3e, off]);
            sendMidiToDevice([0xb0, 0x3f, off]);
        }

        if (this.buttonRowMode == "mute")
        {
            for (var t = 0; t < 8; t++)
                sendMidiToDevice([0xb0, 0x14 + t, this.muteCache[t] ? red : buttonDim]);
        }
        else if (this.buttonRowMode == "solo")
        {
            for (var t = 0; t < 8; t++)
                sendMidiToDevice([0xb0, 0x14 + t, this.soloCache[t] ? green : buttonDim]);
        }
        else if (this.buttonRowMode == "stop")
        {
            for (var t = 0; t < 8; t++)
                sendMidiToDevice([0xb0, 0x14 + t, this.playingCache[t] ? red : buttonDim]);
        }
        else if (this.buttonRowMode == "arm")
        {
            for (var t = 0; t < 8; t++)
                sendMidiToDevice([0xb0, 0x14 + t, this.recordCache[t] ? red : buttonDim]);
        }
    }     
    
    this.updatePad = function(channel, pad, state, color) {

        var note =  92 - (pad * 8) + channel;
        var col = hueToHex (color);
        
        if (state == 0)
        {
            if (this.recordCache[channel] && col == 0x00)
                sendMidiToDevice ([0x90, note, 0x41]);
            else
                sendMidiToDevice ([0x90, note, col]);
        }
        else if (state == 1)
        {
            sendMidiToDevice ([0x90, note, 0x00]);
            sendMidiToDevice ([0x9E, note, col]);
        }
        else if (state == 2)
        {
            sendMidiToDevice ([0x90, note, 0x00]);
            sendMidiToDevice ([0x9A, note, col]);
        }
    }

    this.updatePadArea = function() {
        
        if (this.padMode == "session")
        {
            for (var pad = 0; pad < 8; pad++)
            {
                for (var channel = 0; channel < 8; channel++)
                {
                    var value = this.ledCache[channel][pad];
                    var state = Math.floor (value / 100);
                    var color = Math.floor (value % 100);

                    this.updatePad (channel, pad, state, color);
                }
            }
        }
        else if (this.padMode == "note")
        {
            for (var note = 0; note < 64; note++)
            {
                if (note % 12 == 0)
                    sendMidiToDevice ([0x90, note + 0x24, 0x1a]);
                else
                    sendMidiToDevice ([0x90, note + 0x24, 0x10]);
            }
        }
        else if (this.padMode == "drum")
        {
            for (var pad = 0; pad < 8; pad++)
            {
                for (var channel = 0; channel < 8; channel++)
                {
                    var note = 92 - (pad * 8) + channel;

                    var x = Math.floor (channel / 4);
                    var y = Math.floor (pad / 4);

                    if (x == 0 && y == 0) sendMidiToDevice ([0x90, note, 0x34]);
                    if (x == 1 && y == 0) sendMidiToDevice ([0x90, note, 0x0A]);
                    if (x == 0 && y == 1) sendMidiToDevice ([0x90, note, 0x08]);
                    if (x == 1 && y == 1) sendMidiToDevice ([0x90, note, 0x12]);
                }
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
        triggerAsyncUpdate();
    }

    this.onPanPotMoved = function(channelNum, newPan) {
        this.panCache[channelNum] = newPan;
        triggerAsyncUpdate();
    }

    this.onClipsPlayingChanged = function(channel, isPlaying) {
        this.playingCache[channel] = isPlaying;
        triggerAsyncUpdate();
    }

    this.onAuxMoved = function(channel, num, busName, newPos) {        
    }

    this.onAuxCleared = function(channel, num) {        
    }

    this.onClickChanged = function(isClickOn) {           
        this.isClickOn = isClickOn;
        triggerAsyncUpdate();
    }

    this.onParameterChanged = function(parameterNumber, newValue) {        
        this.paramCache[parameterNumber] = newValue.value;
        triggerAsyncUpdate();
    }

    this.onParameterCleared = function(parameterNumber) {   
        this.paramCache[parameterNumber] = 0.0;     
        triggerAsyncUpdate();
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
        this.updateMisc();
        this.updatePadArea();
    }

    this.onTimer = function(name) {
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

       if (this.padMode == "session")
        {
            var note =  92 - (pad * 8) + channel;
            var col = hueToHex (color);
            
            if (state == 0)
            {
                sendMidiToDevice ([0x90, note, col]);
            }
            else if (state == 1)
            {
                sendMidiToDevice ([0x90, note, 0x00]);
                sendMidiToDevice ([0x9A, note, col]);
            }
            else if (state == 2)
            {
                sendMidiToDevice ([0x90, note, 0x00]);
                sendMidiToDevice ([0x9E, note, col]);
            }
        }
    }

    this.handlePad = function(msg) {
        var d0 = msg[0];
        var d1 = msg[1];
        var d2 = msg[2];

        if (d1 >= 0x24 && d1 <= 0x63)            
        {
            if (this.padMode == "session")
            {
                var offset = d1 - 0x24;
                var track = offset % 8;
                var pad = 7 - Math.floor (offset / 8);
                
                launchClip (track, pad);
            }
        }
    }

    this.handleRotary = function(msg) {
        var d0 = msg[0];
        var d1 = msg[1];
        var d2 = msg[2];

        var delta = (d2 < 64 ? d2 : d2 - 128) / 200;

        if (d1 == 0x0e)
        {
            setTempo ((d2 < 64 ? d2 : d2 - 128), true);
        }
        else if (d1 >= 0x47 && d1 <= 0x4e)
        {
            var ch = d1 - 0x47;
            
            if (this.screenMode == "mix")
            {
                if (this.screenParam == "vol")   setFader (ch, delta, true);
                if (this.screenParam == "pan")   setPanPot (ch, delta, true);
                if (this.screenParam == "send1") setAux (ch, 0, delta, true);
                if (this.screenParam == "send2") setAux (ch, 1, delta, true);
                if (this.screenParam == "send3") setAux (ch, 2, delta, true);
                if (this.screenParam == "send4") setAux (ch, 3, delta, true);
                if (this.screenParam == "send5") setAux (ch, 4, delta, true);
                if (this.screenParam == "send6") setAux (ch, 5, delta, true);

                if (this.screenParam == "master" && ch == 0) setMasterLevelFader (delta, true);
                if (this.screenParam == "master" && ch == 1) setMasterPanPot (delta, true);
            }
            else if (this.screenMode == "device")
            {
                setParameter (ch, delta, true);
            }
        }
        else if (d1 == 0x4f)
        {
            setMasterLevelFader (delta, true);
        }
    }

    this.setButtonRowMode = function(mode) {
        if (mode == this.buttonRowMode)
            this.buttonRowMode = "arm"
        else
            this.buttonRowMode = mode;

        this.updateMisc();
    }

    this.handleButton = function(msg) {
        var d0 = msg[0];
        var d1 = msg[1];
        var d2 = msg[2];

        if (d2 == 0x7f)
        {
            if (d1 >= 0x14 && d1 <= 0x1b)
            {
                var track = d1 - 0x14;
                if (this.buttonRowMode == "stop")       stopClip(track);
                else if (this.buttonRowMode == "solo")  toggleSolo (track);
                else if (this.buttonRowMode == "mute")  toggleMute (track, false);
                else if (this.buttonRowMode == "arm")   toggleRecEnable (track, false);
            }
            else if (d1 >= 0x24 && d1 <= 0x2b)
            {
                if (this.padMode == "session")
                {
                    launchScene (7 - (d1 - 0x24));
                    sendMidiToDevice([0xb0, d1, buttonBright]);
                }
            }
            else if (d1 == 0x03)    tapTempo();
            else if (d1 == 0x09)    toggleClick();
            else if (d1 == 0x55)    play();
            else if (d1 == 0x56)    record();
            else if (d1 == 0x76)    Tracktion.deleteSelected();
            else if (d1 == 0x77)    undo();
            else if (d1 == 0x3c)    this.setButtonRowMode ("mute");
            else if (d1 == 0x3d)    this.setButtonRowMode ("solo");
            else if (d1 == 0x1d)    this.setButtonRowMode ("stop");
            else if (d1 == 0x32)
            {
                if (this.padMode == "session")
                    this.padMode = "note";
                else if (this.padMode == "note")
                    this.padMode = "drum";
                else
                    this.padMode = "note";

                this.updateMisc();
                this.updatePadArea();
            }
            else if (d1 == 0x33)
            {
                this.padMode = "session";
                this.updateMisc();
                this.updatePadArea();
            }
            else if ((d1 >= 0x66 && d1 <= 0x6d) || d1 == 0x1c)
            {
                if (this.screenMode == "mix")
                {
                    if (d1 == 0x66)
                    {
                        this.screenParam = "vol"
                        setPushScreen ("mixVol");
                    }
                    else if (d1 == 0x67)
                    {
                        this.screenParam = "pan"
                        setPushScreen ("mixPan");
                    }
                    else if (d1 == 0x68)
                    {
                        this.screenParam = "send1"
                        setPushScreen ("mixSend1");
                    }
                    else if (d1 == 0x69)
                    {
                        this.screenParam = "send2"
                        setPushScreen ("mixSend2");
                    }
                    else if (d1 == 0x6a)
                    {
                        this.screenParam = "send3"
                        setPushScreen ("mixSend3");
                    }
                    else if (d1 == 0x6b)
                    {
                        this.screenParam = "send4"
                        setPushScreen ("mixSend4");
                    }
                    else if (d1 == 0x6c)
                    {
                        this.screenParam = "send5"
                        setPushScreen ("mixSend5");
                    }
                    else if (d1 == 0x6d)
                    {
                        this.screenParam = "send6"
                        setPushScreen ("mixSend6");
                    }
                    else if (d1 == 0x1c)
                    {
                        if (this.screenParam == "master")
                        {
                            this.screenParam = "vol";
                            setPushScreen ("mixVol");
                        }
                        else
                        {
                            this.screenParam = "master";
                            setPushScreen ("mixMaster");
                        }
                    }
                }
            }
            else if (d1 == 0x6e)
            {
                this.screenMode = "device";
                setPushScreen ("device");
                sendMidiToDevice([0xb0, d1, whiteBright]);
            }
            else if (d1 == 0x70)
            {
                this.screenMode = "mix";
                this.screenParam = "vol"
                setPushScreen ("mixVol");
                sendMidiToDevice([0xb0, d1, whiteBright]);
            }
            else if (d1 == 0x6f)
            {
                //todo
                //this.screenMode = "browse";
                //setPushScreen ("browse");
                //sendMidiToDevice([0xb0, d1, whiteBright]);
            }
            else if (d1 == 0x71)
            {
                this.screenMode = "clip";
                setPushScreen ("clip");
                sendMidiToDevice([0xb0, d1, whiteBright]);
            }
            else if (d1 == 0x2c)
            {
                if (this.screenMode == "device")
                    changeParameterBank (-1);
                else if (this.screenMode == "clip")
                    Tracktion.selectItem ('left');
                else if (this.padMode == "session")
                    changeFaderBanks (-1);
            }
            else if (d1 == 0x2d)
            {
                if (this.screenMode == "device")
                    changeParameterBank (+1);
                else if (this.screenMode == "clip")
                    Tracktion.selectItem ('right');
                else if (this.padMode == "session")
                    changeFaderBanks (+1);
            }
            else if (d1 == 0x2e)
            {
                if (this.screenMode == "device")
                    noop();
                else if (this.screenMode == "clip")
                    Tracktion.selectItem ('up');
                else if (this.padMode == "session")
                    changePadBanks (-1);
            }
            else if (d1 == 0x2f)
            {
                if (this.screenMode == "device")
                    noop();
                else if (this.screenMode == "clip")
                    Tracktion.selectItem ('down');
                else if (this.padMode == "session")
                    changePadBanks (+1);
            }
            else if (d1 == 0x3e)
            {
                if (this.padMode == "session")
                {
                    changeFaderBanks (-8);
                    sendMidiToDevice([0xb0, d1, whiteBright]);
                }
            }
            else if (d1 == 0x3f)
            {
                if (this.padMode == "session")
                {
                    changeFaderBanks (+8);
                    sendMidiToDevice([0xb0, d1, whiteBright]);
                }
            }
            else if (d1 == 0x37)
            {
                if (this.padMode == "session")
                {
                    changePadBanks (-8);
                    sendMidiToDevice([0xb0, d1, whiteBright]);
                }
                else
                {
                    this.octave = Math.min (2, this.octave + 1);

                    this.updateMisc();
                }
            }
            else if (d1 == 0x36)
            {
                if (this.padMode == "session")
                {
                    changePadBanks (+8);
                    sendMidiToDevice([0xb0, d1, whiteBright]);
                }
                else
                {
                    this.octave = Math.max (-3, this.octave - 1);
                    this.updateMisc();
                }
            }
        }
        else
        {
            this.updateMisc();
        }
    }

    this.mapDrum = function(note) {

        var offset = note - 0x24;
        var track = offset % 8;
        var pad = Math.floor (offset / 8);

        if (track < 4)
            return 0x24 + pad * 4 + track;
        else
            return 0x44 + pad * 4 + track - 4;
    }

    this.forwardNotes = function(msg) {

        var d0 = msg[0];
        var d1 = msg[1];
        var d2 = msg[2];

        if (d1 < 0x24 || d1 > 0x63)
            return;

        if (this.padMode == "note")
            sendMidiToDefaultDevice ([d0, d1 + 12 * this.octave, d2]);
        else if (this.padMode == "drum")
            sendMidiToDefaultDevice([d0, this.mapDrum (d1), d2]);

        if (d0 == 0x90)
            sendMidiToDevice ([0x90, d1, green]);
        else if (d0 == 0x80)
            this.updatePadArea();
    }

    this.onMidiReceivedFromDevice = function(msg) {

        if (msg.length == 1)
            return;

        var d0 = msg[0];
        var d1 = msg[1];
        var d2 = msg[2];

        if (d0 == 0xe0 || d0 == 0xd0)
        {
            sendMidiToDefaultDevice (msg);
            return;
        }

        if ((d0 == 0x90 || d0 == 0x80) && this.padMode != "session")
            this.forwardNotes (msg);

        if (d0 == 0x90)
            this.handlePad (msg);
        else if (d0 == 0xb0 && (d1 == 0x0e || d1 == 0x0f || (d1 >= 0x47 && d1 <= 0x4f)))
            this.handleRotary (msg);
        else (d0 == 0xb0)
            this.handleButton (msg);
    }
}

registerController (new AbletonPush());
