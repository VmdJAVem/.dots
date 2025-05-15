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
    this.deviceDescription               = "Novation Launchkey Mini MK2";   // device name
    this.needsMidiChannel                = true;                            // send midi controller to daw
    this.needsMidiBackChannel            = true;                            // send midi daw to controller
    this.midiChannelName                 = "Launchkey Mini MK2*InControl";  // MIDI channel name
    this.midiBackChannelName             = "Launchkey Mini MK2*InControl";  // MIDI channel name
    this.needsOSCSocket                  = false;                           // communicate via osc
    this.numberOfFaderChannels           = 8;                               // number physical faders      
    this.numberOfTrackPads               = 1;                               // number physical pads per channel
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
    this.limitedPadColours               = true;                            // pad colors are limited to < 8
    this.auxmode                         = "byposition";                    // Aux index is either 'bybus' (-1 any) or 'byposition'
    this.pickUpMode                      = true;                            // input value must cross current value before input is accepted
                                                                            // useful for non motorized faders, so the don't jump when adjusted
    this.identifyResponse                = [0xf0,0x7e,0x7f,0x06,0x02,0x00,0x20,0x29,0x35,0x00,0x00,0x00,0x00,0x02,0x00,0x00,0xf7]                                                                         
    
    this.shift                          = false;
    this.ledCache                       = init2DArray (8, 8, -1);
    this.playingCache                   = initArray (8, false);
    
    this.initialise = function() {        
    }

    this.initialiseDevice = function() {  
        sendMidiToDevice ([0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]); // device inquiry
        sendMidiToDevice ([0x90, 0x0C, 0x7f]); // DAW mode
        sendMidiToDevice ([0x90, 0x0D, 0x7f]); // Pots
        sendMidiToDevice ([0x90, 0x0F, 0x7f]); // Pads

        this.ledCache  = init2DArray (8, 8, -1);
    }

    this.shutDownDevice = function() {      

        for (var i = 0; i < 8; i++)
        {
            sendMidiToDevice ([0x90, 0x60 + i, 0x0C]);
            sendMidiToDevice ([0x90, 0x70 + i, 0x0C]);
        }

        sendMidiToDevice ([0x90, 0x0C, 0x00]); // DAW mode
        sendMidiToDevice ([0x90, 0x0D, 0x00]); // Pots
        sendMidiToDevice ([0x90, 0x0F, 0x00]); // Pads
    }

    this.onPadStateChanged = function(channel, pad, color, state) {

        var val = state * 100 + color;

        if (this.ledCache[channel][pad] == val) 
            return;

        this.ledCache[channel][pad] = val;

        var note = 0x60 + (pad * 0x10) + channel;
        var col = hueToHex (color);

        if (color == 0)
            sendMidiToDevice ([0x90, note, 0x0C]);
        else if (color == 1)
            sendMidiToDevice ([0x90, note, 0x3F]);
        else if (color == 2)
            sendMidiToDevice ([0x90, note, 0x3C]);
        else if (color == 3)
            sendMidiToDevice ([0x90, note, 0x0F]);
    }

    this.onClipsPlayingChanged = function(channel, isPlaying) {
        if (this.playingCache[channel] == isPlaying)
            return;

        this.playingCache[channel] = isPlaying;

        if (! isPlaying)
            sendMidiToDevice ([0x90, 0x70 + channel, 0x0C]);
        else
            sendMidiToDevice ([0x90, 0x70 + channel, 0x3F]);
    }

    this.onMidiReceivedFromDevice = function(msg) {
        var d0 = msg[0];
        var d1 = msg[1];
        var d2 = msg[2];

        if (d0 == 0xb0)
        {
            if (d1 == 0x6a && d2 == 0x7f)
            {
                changeFaderBanks (-1);
            }
            else if (d1 == 0x6b && d2 == 0x7f)
            {
                changeFaderBanks (+1);
            }
            else if (d1 == 0x68 && d2 == 0x7f)
            {
                changePadBanks (-1);
            }
            else if (d1 == 0x69 && d2 == 0x7f)
            {
                changePadBanks (+1);
            }
            else if (d1 >= 0x15 && d1 <= 0x1c)
            {
                setFader (d1 - 0x15, d2 / 127.0, false);
            }
        }
        else if (d0 == 0x90)
        {
            if (d1 >= 0x60 && d1 <= 0x67)
            {
                launchClip (d1 - 0x60, 0);
            }
            else if (d1 >= 0x70 && d1 <= 0x77)
            {
                stopClip (d1 - 0x70)
            }
            else if (d1 == 0x68)
            {
                launchScene (0);
            }
            else if (d1 == 0x78)
            {
                stopClip (-1);
            }
        }
    }
}

registerController (new NovationLaunchpad());
