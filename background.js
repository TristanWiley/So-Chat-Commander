(function() {
    var ignoreList = localStorage.getItem("ignoreList") ? JSON.parse(localStorage.getItem("ignoreList")) : []
    console.log(ignoreList)
    //Before we begin this tortuous journey, let us thank all the developers that died making this (none) and all of the developers
    //who painfully cried while realizing they were idiots (me).

    var targetNode = document.querySelector("#main #chat")
    var observerConfig = {
        childList: true
    }
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                removeIgnoredUsers(node)
            })
        })
    })
    observer.observe(targetNode, observerConfig)

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
            var username = input.value.split(/\s+/)[1];
            var messagetosend = input.value.substr(input.value.indexOf(input.value.split(/\s+/)[2]));
            replyLast(username.replace(/@/g , ""), messagetosend);
            input.value = '';
        } else if (input.value.split(/\s+/)[0].trim() === "/ignore") {
            e.stopPropagation()
            var parts = input.value.split(/\s+/).slice(1)
            var time = parts[parts.length-1].match(/^\d+$/) ? parts[parts.length-1] : -1
            ignoreUsers(parts, parseInt(time))
            input.value = ""
        } else if (input.value == '/cat') {
            e.stopPropagation();
            getCat();
            input.value = '';
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
                var joke = json.value.joke;
                input.value = joke;
                document.getElementById('sayit-button').dispatchEvent(new MouseEvent('click'))
            });
    }

    function getSkeet(){
        fetch(`https://jsonp.afeld.me/?url=http://tristanwiley.com/labs/skeet/v1/`)
            .then(response => response.json())
            .then(json => {
                var joke = json.JOKES;
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
        var username = usern.replace(/\s/g, '');
        var signatures = document.getElementsByClassName('tiny-signature');
        for (var i = signatures.length-1; i > 0; --i) {
            var item = signatures[i];
            var itemusername = item.getElementsByClassName('username')[0].innerHTML.replace(/\s/g, '');
            if(username == itemusername) {
                var parent = item.parentNode.parentNode;
                var elements = parent.getElementsByClassName('messages')[0].getElementsByClassName('message');
                var id = elements[elements.length-1].id.replace('message-','');
                var send = ":" + id + " " + message;
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
                var url = text.substring(text.indexOf('<img src="')+10,text.indexOf('"></a>'));
                input.value = url;
                document.getElementById('sayit-button').dispatchEvent(new MouseEvent('click'))
            });
    }

    function removeIgnoredUsers(node) {
        var el = node.querySelector("a .username")
        if (el) {
            var name = el.innerHTML
        }
        if (ignoreList.indexOf(name) != -1) {
            targetNode.removeChild(node)
        }
        // console.log(name)
    }

    function ignoreUsers(parts, time) {
        parts.forEach((item) => {
            if (item.charAt(0) === "@") {
                var name = item.slice(1)
                var successText = document.createElement("div")
                successText.innerHTML = `${name} is muted`
                successText.attributes.class = "user-container"
                targetNode.appendChild(successText)
                ignoreList.push(name)
                updateStorage()
                localStorage.setItem("ignoreList", JSON.stringify(ignoreList))
                if (time != -1 && time > 0) {
                    setTimeout(() => {
                        ignoreList = ignoreList.filter(function(item) {
                            return item != name
                        })
                        updateStorage()
                    }, time * 60000)
                }
            }
        })
    }

    function updateStorage() {
        localStorage.setItem("ignoreList", JSON.stringify(ignoreList))
    }

    //The time spent adding random comments could actually have been used to put in helpful comments.
    //tooooo baaad
    //TODO actually work on stuff
})()