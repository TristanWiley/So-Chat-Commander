//Before we begin this tortuous journey, let us thank all the developers that died making this (none) and all of the developers
//who painfully cried while realizing they were idiots (me).
window.addEventListener('keydown', e => {
    //Commands only requring /command, no extra text. Messy, I know, I don't really care.
    var key = e.which || e.keyCode;
    if (key !== 13) {return;}

    if (input.value === '/collapse') {
        collapseAll();
        input.value = '';
        e.stopPropagation();
    } else if (input.value === '/uncollapse') {
        unCollapseAll();
        input.value = '';
        e.stopPropagation();
    } else if (input.value.split(/\s+/)[0] === '/giphy') {
        // giphyStuff(input.value);
        var result = input.value.substr(input.value.indexOf(" "));
        giphyStuff(result.match(/\s(.*)/));
        e.stopPropagation();
    } else if (input.value == '/norris'){
        getNorris();
        input.value = '';
        e.stopPropagation;
    } else if (input.value == '/skeet'){
        getSkeet();
        input.value = '';
        e.stopPropagation;
    }
}, true);

//NEVER GONNA GIVE YOU UP
//NEVER GONNA LET YOU DOWN
//Meow
//Honestly it's self explanatory
//tristanwiley.com
function collapseAll() {
    $('.content').each(function(i, obj) {
        var elem = $(obj).children()[0];
        if ($(elem).hasClass("onebox")) {
            $(elem).hide();
        }
    });
}

function unCollapseAll() {
    $('.content').each(function(i, obj) {
        var elem = $(obj).children()[0];
        if ($(elem).hasClass("onebox")) {
            $(elem).show();
        }
    });
}

function getNorris() {
$.getJSON("https://jsonp.afeld.me/?url=http://api.icndb.com/jokes/random", function(json) {
        var joke = json.value.joke;
        input.value = joke;
        $('#sayit-button').click();
    });
}

function getSkeet(){
    $.getJSON("https://jsonp.afeld.me/?url=http://tristanwiley.com/labs/skeet/v1/", function(json) {
        var joke = json.JOKES;
        input.value = joke;
        $('#sayit-button').click();
    });
}

function giphyStuff(searchText) {
    $.getJSON("https://api.giphy.com/v1/gifs/search?q=" + searchText + "&api_key=dc6zaTOxFJmzC", function(json) {
        var url = json.data[0].images.fixed_height.url;
        input.value = url;
        $('#sayit-button').click();
    });
}

function getJSONP(url, success) {

    var ud = '_' + +new Date,
        script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0] 
               || document.documentElement;

    window[ud] = function(data) {
        head.removeChild(script);
        success && success(data);
    };

    script.src = url.replace('callback=?', 'callback=' + ud);
    head.appendChild(script);

}
//The time spent adding random comments could actually have been used to put in helpful comments. 
//tooooo baaad
//TODO actually work on stuff