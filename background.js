//Before we begin this tortuous journey, let us thank all the developers that died making this (none) and all of the developers
//who painfully cried while realizing they were idiots (me).
window.addEventListener('keydown', e => {
    //Commands only requring /command, no extra text. Messy, I know, I don't really care.
    var key = e.which || e.keyCode;
    
    if (key !== 13) return;
    
    if (input.value === '/collapse') {
        e.stopPropagation();
        collapseAll();
        return input.value = '';
    }
    if (input.value === '/uncollapse') {
        e.stopPropagation();
        unCollapseAll();
        input.value = '';
    }
    if (input.value.split(/\s+/)[0] === '/giphy') {
        e.stopPropagation();
        const result = input.value.substr(input.value.indexOf(' '));
        giphyStuff(result.match(/\s(.*)/));
    }
}, true);

//NEVER GONNA GIVE YOU UP
//NEVER GONNA LET YOU DOWN
//Meow
//Honestly it's self explanatory
//tristanwiley.com
function collapseAll() {
    Array.from(document.querySelectorAll('.content')).forEach(content => {
        const onebox = content.querySelector('.onebox');
        if (onebox) {
            onebox.hidden = true;
        }
    });
}

function unCollapseAll() {
    Array.from(document.querySelectorAll('.content')).forEach(content => {
        const onebox = content.querySelector('.onebox');
        if (onebox) {
            onebox.hidden = false;
        }
    });
}

function giphyStuff(searchText) {
    fetch(`https://api.giphy.com/v1/gifs/search?q=${ searchText }&api_key=dc6zaTOxFJmzC`)
    .then(response => response.json())
    .then(json => {
        const url = json.data[0].images.fixed_height.url;
        input.value = url;
        document.getElementById('sayit-button').dispatchEvent(new MouseEvent('click'))
    });
}

//The time spent adding random comments could actually have been used to put in helpful comments. 
//tooooo baaad
//TODO actually work on stuff
