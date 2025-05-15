var OFF     = 0x0c;
var RED     = 0x0F;
var AMBER   = 0x1D;
var YELLOW  = 0x3E;
var GREEN   = 0x3c;

var SENDA = new Array (13, 29, 45, 61, 77, 93, 109, 125);
var SENDB = new Array (14, 30, 46, 62, 78, 94, 110, 126);
var PAN   = new Array (15, 31, 47, 63, 79, 95, 111, 127);

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

function NovationControl() {
    // Variables: these must be filled out so the session knows your controller layout
    this.deviceDescription               = "Novation Launch Control XL";    // device name
    this.needsMidiChannel                = true;                            // send midi controller to daw
    this.needsMidiBackChannel            = true;                            // send midi daw to controller
    if (getOS() == "windows")
    {
        this.midiChannelName             = "^Launch Control XL";            // MIDI channel name
        this.midiBackChannelName         = "^Launch Control XL";            // MIDI channel name    
    }
    else
    {
        this.midiChannelName             = "Launch Control XL";             // MIDI channel name
        this.midiBackChannelName         = "Launch Control XL";             // MIDI channel name
    }
    this.needsOSCSocket                  = false;                           // communicate via osc
    this.numberOfFaderChannels           = 8;                               // number physical faders      
    this.numberOfTrackPads               = 0;                               // number physical pads per channel
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
    this.cliplauncher                    = false;                           // this controller is primarily a clip launcher
    this.pickUpMode                      = true;                            // input value must cross current value before input is accepted
    this.auxmode                         = "byposition";                    // Aux index is either 'bybus' (-1 any) or 'byposition'

    this.buttonMode                      = "mute";
    this.solo                            = initArray (8, 0);
    this.mute                            = initArray (8, 0);
    this.arm                             = initArray (8, 0);
    this.select                          = initArray (8, 0);
  
    this.setButtonMode = function(mode) {
        this.buttonMode = mode;
        this.updateMiscLEDS();

        sendMidiToDevice ([0x98, 0x6a, this.buttonMode == "mute" ? YELLOW : OFF]); 
        sendMidiToDevice ([0x98, 0x6b, this.buttonMode == "solo" ? YELLOW : OFF]); 
        sendMidiToDevice ([0x98, 0x6c, this.buttonMode == "arm"  ? YELLOW : OFF]); 
    }

    this.updateMiscLEDS = function() {

        for (var i = 0; i < 4; i++)
            sendMidiToDevice ([0x98, 0x29 + i, this.select[i] ? GREEN : OFF]); 
        for (var i = 0; i < 4; i++)
            sendMidiToDevice ([0x98, 0x39 + i, this.select[i + 4] ? GREEN : OFF]); 

        if (this.buttonMode == "mute") 
        {
            for (var i = 0; i < 4; i++)
                sendMidiToDevice ([0x98, 0x49 + i, this.mute[i] ? RED : OFF]); 
            for (var i = 0; i < 4; i++)
                sendMidiToDevice ([0x98, 0x59 + i, this.mute[i + 4] ? RED : OFF]); 
        }
        else if (this.buttonMode == "solo")
        {
            for (var i = 0; i < 4; i++)
                sendMidiToDevice ([0x98, 0x49 + i, this.solo[i] ? GREEN : OFF]); 
            for (var i = 0; i < 4; i++)
                sendMidiToDevice ([0x98, 0x59 + i, this.solo[i + 4] ? GREEN : OFF]); 
        }
        else if (this.buttonMode == "arm")
        {
            for (var i = 0; i < 4; i++)
                sendMidiToDevice ([0x98, 0x49 + i, this.arm[i] ? RED : OFF]); 
            for (var i = 0; i < 4; i++)
                sendMidiToDevice ([0x98, 0x59 + i, this.arm[i + 4] ? RED : OFF]); 
        }
    }

    this.initialise = function() {

    }

    this.initialiseDevice = function() {  
        sendMidiToDevice ([0xf0, 0x00, 0x20, 0x29, 0x02, 0x11, 0x77, 0x08, 0xf7]); // select template 8
        sendMidiToDevice ([0xb8, 0x00, 0x00]); // reset

        this.setButtonMode ("mute");
    }

    this.shutDownDevice = function() {        
        sendMidiToDevice ([0xb8, 0x00, 0x00]); // reset
    }

    this.onTimer = function(name) {
    }

    this.onUpdateMiscFeatures = function() {
    }    

    this.onPlayStateChanged = function(isPlaying) {            
    }

    this.onRecordStateChanged = function(isRecording) {
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
    }

    this.onAuxMoved = function(channel, num, busName, newPos) {     
        
        if (num == 0)
            sendMidiToDevice ([0x98, SENDA[channel], GREEN]); 
        else if (num == 1)
            sendMidiToDevice ([0x98, SENDB[channel], GREEN]); 
    }

    this.onAuxCleared = function(channel, num) {        
        if (num == 0)
            sendMidiToDevice ([0x98, SENDA[channel], OFF]); 
        else if (num == 1)
            sendMidiToDevice ([0x98, SENDB[channel], OFF]); 
    }

    this.onPanPotMoved = function(channelNum, newPan) {
        if (newPan < 0.05 && newPan > -0.05)
            sendMidiToDevice ([0x98, PAN[channelNum], GREEN]); 
        else
            sendMidiToDevice ([0x98, PAN[channelNum], YELLOW]); 
    }

    this.onMidiReceivedFromDevice = function(msg) {
        var d0 = msg[0];
        var d1 = msg[1];
        var d2 = msg[2];

        if (d0 == 0xb8)
        {
            if (d1 >= 0x4d && d1 <= 0x54)
            {
                setFader (d1 - 0x4d, d2 / 127.0, false);
            }
            else if (d1 >= 0x31 && d1 <= 0x38)
            {
                setPanPot (d1 - 0x31, (d2 / 127.0) * 2.0 - 1.0, false);
            }
            else if (d1 >= 0x0d && d1 <= 0x14)
            {
                setAux (d1 - 0x0d, 0, d2 / 127.0);
            }
            else if (d1 >= 0x1d && d1 <= 0x24)
            {
                setAux (d1 - 0x1d, 1, d2 / 127.0);
            }
            else if (d1 == 0x68)
            {
                if (d2 == 0x7f)
                    changeAuxBank (-2);
            }
            else if (d1 == 0x69)
            {
                if (d2 == 0x7f)
                    changeAuxBank (+2);
            }
            else if (d1 == 0x6a)
            {
                if (d2 == 0x7f)
                    changeFaderBanks (-8);
            }
            else if (d1 == 0x6b)
            {
                if (d2 == 0x7f)
                    changeFaderBanks (+8);
            }            
        }
        else if (d0 == 0x98)
        {
            if (d1 == 0x6a)
            {
                this.setButtonMode ("mute");
            }
            else if (d1 == 0x6b)
            {
                this.setButtonMode ("solo");
            }
            else if (d1 == 0x6c)
            {
                this.setButtonMode ("arm");
            }
            else if (d1 >= 0x29 && d1 <= 0x2c)
            {
                selectTrack (d1 - 0x29);
            }
            else if (d1 >= 0x39 && d1 <= 0x3c)
            {
                selectTrack (d1 - 0x39 + 4);
            }
            else if (d1 >= 0x49 && d1 <= 0x4c)
            {
                if (this.buttonMode == "mute")
                    toggleMute (d1 - 0x49);
                else if (this.buttonMode == "solo")
                    toggleSolo (d1 - 0x49);
                else if (this.buttonMode == "arm")
                    toggleRecEnable (d1 - 0x49);
            }
            else if (d1 >= 0x59 && d1 <= 0x5c)
            {
                if (this.buttonMode == "mute")
                    toggleMute (d1 - 0x59 + 4);
                else if (this.buttonMode == "solo")
                    toggleSolo (d1 - 0x59 + 4);
                else if (this.buttonMode == "arm")
                    toggleRecEnable (d1 - 0x59 + 4);
            }
        }
    }
}

registerController (new NovationControl());
