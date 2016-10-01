(function() {
    let ignoreList = localStorage.getItem("ignoreList") ? JSON.parse(localStorage.getItem("ignoreList")) : []
    console.log(ignoreList)
    //Before we begin this tortuous journey, let us thank all the developers that died making this (none) and all of the developers
    //who painfully cried while realizing they were idiots (me).

    const targetNode = document.querySelector("#main #chat")
    const observerConfig = {
        childList: true
    }
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                removeIgnoredUsers(node)
            })
        })
    })
    observer.observe(targetNode, observerConfig)

    window.addEventListener('keydown', e => {
        //Commands only requring /command, no extra text. Messy, I know, I don't really care.
        const key = e.which || e.keyCode;

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
            giphyStuff(result.match(/\s(.*)/), false);
        } else if (input.value.split(/\s+/)[0] === '/glink'){
            e.stopPropagation();
            const result = input.value.substr(input.value.indexOf(' '));
            giphyStuff(result.match(/\s(.*)/), true);
        } else if (input.value == '/norris'){
            getNorris();
            input.value = '';
            e.stopPropagation;
        } else if (input.value == '/skeet'){
            getSkeet();
            input.value = '';
            e.stopPropagation;
        } else if (input.value == '/shruggie') {
            e.stopPropagation();
            input.value = '¯\\\\_(ツ)_/¯';
            document.getElementById('sayit-button').dispatchEvent(new MouseEvent('click'));
            input.value = '';
        } else if (input.value.split(/\s+/)[0] === '/replyLast'){
            e.stopPropagation();
            const username = input.value.split(/\s+/)[1];
            const messagetosend = input.value.substr(input.value.indexOf(input.value.split(/\s+/)[2]));
            replyLast(username.replace(/@/g , ""), messagetosend);
            input.value = '';
        } else if (input.value.split(/\s+/)[0].trim() === "/ignore") {
            e.stopPropagation()
            const parts = input.value.split(/\s+/).slice(1)
            const time = parts[parts.length-1].match(/^\d+$/) ? parts[parts.length-1] : -1
            ignoreUsers(parts, parseInt(time))
            input.value = ""
        } else if (input.value == '/cat') {
            e.stopPropagation();
            getCat();
            input.value = '';
        } else if (input.value.split(/\s+/)[0].trim() === "/unignore") {
            e.stopPropagation()
            const parts = input.value.split(/\s+/).slice(1)
            unignoreUsers(parts)
            input.value = ""
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

    function getNorris() {
        fetch(`https://jsonp.afeld.me/?url=http://api.icndb.com/jokes/random`)
            .then(response => response.json())
            .then(json => {
                const joke = json.value.joke;
                input.value = joke;
                document.getElementById('sayit-button').dispatchEvent(new MouseEvent('click'))
            });
    }

    function getSkeet(){
        fetch(`https://jsonp.afeld.me/?url=http://tristanwiley.com/labs/skeet/v1/`)
            .then(response => response.json())
            .then(json => {
                const joke = json.JOKES;
                input.value = joke;
                document.getElementById('sayit-button').dispatchEvent(new MouseEvent('click'))
            });
    }

    function giphyStuff(searchText, shorten) {
        fetch(`https://api.giphy.com/v1/gifs/search?q=${searchText[1]}&api_key=dc6zaTOxFJmzC`)
            .then(response => response.json())
            .then(json => {
                const url = json.data[0].images.fixed_height.url;
                if(shorten){
                    input.value = "[" + searchText[1] + "]" + "(" + url + ")";
                }else{
                    input.value = url;
                }
                document.getElementById('sayit-button').dispatchEvent(new MouseEvent('click'))
            });
    }

    function replyLast(usern, message) {
        const username = usern.replace(/\s/g, '');
        const signatures = document.getElementsByClassName('tiny-signature');
        for (let i = signatures.length-1; i > 0; --i) {
            const item = signatures[i];
            const itemusername = item.getElementsByClassName('username')[0].innerHTML.replace(/\s/g, '');
            if(username == itemusername) {
                const parent = item.parentNode.parentNode;
                const elements = parent.getElementsByClassName('messages')[0].getElementsByClassName('message');
                const id = elements[elements.length-1].id.replace('message-','');
                const send = ":" + id + " " + message;
                input.value = send;
                document.getElementById('sayit-button').dispatchEvent(new MouseEvent('click'))
                break;
            }
        }
    }

    //The time spent adding random comments could actually have been used to put in helpful comments.
    function getCat(){
        fetch(`https://thecatapi.com/api/images/get?format=html&type=png`)
            .then(response => response.text())
            .then(text => {
                const url = text.substring(text.indexOf('<img src="')+10,text.indexOf('"></a>'));
                input.value = url;
                document.getElementById('sayit-button').dispatchEvent(new MouseEvent('click'))
            });
    }

    function removeIgnoredUsers(node) {
        const el = node.querySelector("a .username")
        if (el) {
            const name = el.innerHTML
        }
        if (ignoreList.indexOf(name) != -1) {
            targetNode.removeChild(node)
        }
        // console.log(name)
    }

    function ignoreUsers(parts, time) {
        parts.forEach((item) => {
            if (item.charAt(0) === "@") {
                const name = item.slice(1)
                displayMessage(`${name} is muted`)
                ignoreList.push(name)
                updateStorage()
                localStorage.setItem("ignoreList", JSON.stringify(ignoreList))
                if (time != -1 && time > 0) {
                    setTimeout(removeNameFromList.bind(this, name), time * 60000)
                }
            }
        })
    }

    function unignoreUsers(parts) {
        parts.forEach(function(item) {
            const name = item.slice(1)
            removeNameFromList(name)
            displayMessage(`${name} has been unignored`)
        })
    }

    function removeNameFromList(name) {
        ignoreList = ignoreList.filter(function(item) {
            return item != name
        })
        updateStorage()
    }

    function displayMessage(text) {
        const textNode = document.createElement("div")
        textNode.innerHTML = text
        textNode.attributes.class = "user-container"
        targetNode.appendChild(textNode)
    }

    function updateStorage() {
        localStorage.setItem("ignoreList", JSON.stringify(ignoreList))
    }

    //The time spent adding random comments could actually have been used to put in helpful comments.
    //tooooo baaad
    //TODO actually work on stuff
})()