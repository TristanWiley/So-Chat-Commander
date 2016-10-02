(function() {
	var ignoreList = localStorage.getItem("ignoreList") ? JSON.parse(localStorage.getItem("ignoreList")) : []
	var command = function(name, callback){
		this.name = name;
		this.callback = callback;
		this.execute = function(parameters) {
			this.callback(parameters);
		}
	}

	function findCommand(name) {
		return commands.hasOwnProperty(name) ?
			commands[name] :
			undefined;
	}

	var commands = {
		collapse: new command('collapse', collapseAll),
		uncollapse: new command('uncollapse', unCollapseAll),
		shruggie: new command('shruggie', shruggie),
		norris: new command('norris', getNorris),
		skeet: new command('skeet', getSkeet),
		cat: new command('cat', getCat),
		replyLast: new command('replyLast', replyLast),
		giphy: new command('giphy', giphyStuff),
		glink: new command('glink', giphyShorten),
		ignore: new command('ignore', ignoreUsers),
		coin: new command('coin', flipACoin),
		dice: new command('dice', rollADice),
		unignore: new command('unignore', unignoreUsers)
	};

	function clearInput() {
		input.value = '';
	}

	function sendMessage(message) {
		input.value = message;
        document.getElementById('sayit-button').dispatchEvent(new MouseEvent('click'));
	}

	function sendLink(name, url) {
		input.value = "[" + name + "]" + "(" + url + ")";
		document.getElementById('sayit-button').dispatchEvent(new MouseEvent('click'));
	}

	function removePopup(){
		var popup = document.getElementById('commands-popup');
		if (popup)
			popup.parentNode.removeChild(popup);
	}

	function commandClicked(){
		input.value = "/" + this.innerHTML;
		input.focus();
		removePopup();
	}

	function displayPopup(possibleCommands){
		var popup = document.getElementById('commands-list');
		if (popup) {

			while (popup.firstChild) {
				popup.removeChild(popup.firstChild);
			}

			for (var i = 0; i < possibleCommands.length; i++) {
				var tempCommand = document.createElement('span');
				tempCommand.style = 'margin: 4px; cursor: pointer;';
				tempCommand.innerHTML = possibleCommands[i];
				tempCommand.onclick = commandClicked;
				popup.appendChild(tempCommand);
			}

		}
		else {
			var element = document.createElement("div");
			element.id = "commands-popup";

			element.className = "popup";
			element.style = "position: absolute; left: 0; top: 0; margin-top: -35px; width: 600px;";

			var inputArea = document.getElementById('input-area');

			var closeButton = document.createElement('div');
			closeButton.className = 'btn-close';
			closeButton.id = 'close-commands-popup';
			closeButton.innerHTML = 'X';

			closeButton.onclick = removePopup;

			var commandsList = document.createElement('div');
			commandsList.className = 'commands-list';
			commandsList.id = 'commands-list';

			for (var i = 0; i < possibleCommands.length; i++) {
				var tempCommand = document.createElement('span');
				tempCommand.style = 'margin: 4px;';
				tempCommand.innerHTML = possibleCommands[i];
				tempCommand.onclick = commandClicked;
				commandsList.appendChild(tempCommand);
			}

			element.appendChild(closeButton);
			element.appendChild(commandsList);

			inputArea.appendChild(element);
		}
	}

    var targetNode = document.querySelector("#main #chat")
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
		var key = e.which || e.keyCode;

		if (input.value.indexOf('/') === 0){

			var enteredText = input.value;
			var data = enteredText.split(' ');
			var commandName = data.length > 0 ? data[0].substring(1) : '';

			var possibleCommands = [];
			Object.keys(commands).forEach(function(command) {
				if (command.indexOf(commandName) === 0)
					possibleCommands.push(command);
			});

			displayPopup(possibleCommands);

			if (possibleCommands.length === 0)
				removePopup();
		}

		if (key !== 13)
			return;

		removePopup();


		if (input.value.indexOf('/') === 0){
			e.stopPropagation();
			var enteredText = input.value.trim();

			var data = enteredText.split(/\s+/);

			var commandName = data.length > 0 ? data[0].substring(1) : '';
			var additionalParameters = data.length > 1 ? data.slice(1, data.length) : [];

			var temp_command = findCommand(commandName);

			if (temp_command) {
				temp_command.execute(additionalParameters);
			}

			clearInput();

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

	function shruggie(){
		sendMessage('¯\\\\_(ツ)_/¯');
	};

    function getNorris() {
        fetch(`https://jsonp.afeld.me/?url=http://api.icndb.com/jokes/random`)
            .then(response => response.json())
            .then(json => {
                var joke = json.value.joke;
				sendMessage(joke);
            });
    }

    function getSkeet(){
        fetch(`https://jsonp.afeld.me/?url=http://tristanwiley.com/labs/skeet/v1/`)
            .then(response => response.json())
            .then(json => {
                var joke = json.JOKES;
                sendMessage(joke);
            });
    }

    function giphyStuff(parameters) {
		var searchText = encodeURI(parameters.join(' '));
        fetch(`https://api.giphy.com/v1/gifs/search?q=${searchText}&api_key=dc6zaTOxFJmzC`)
            .then(response => response.json())
            .then(json => {
                const url = json.data[0].images.fixed_height.url;
					sendMessage(url);
            });
    }

	function giphyShorten(parameters) {
		var searchText = encodeURI(parameters.join(' '));
        fetch(`https://api.giphy.com/v1/gifs/search?q=${searchText}&api_key=dc6zaTOxFJmzC`)
            .then(response => response.json())
            .then(json => {
                const url = json.data[0].images.fixed_height.url;
					sendLink(parameters.join(' '), url);
            });
	}

    function replyLast(parameters) {
        var username = parameters[0].replace(/\s/g, '');
		var message = parameters.slice(1, parameters.length).join(' ');
        var signatures = document.getElementsByClassName('tiny-signature');
        for (var i = signatures.length-1; i > 0; --i) {
            var item = signatures[i];
            var itemusername = item.getElementsByClassName('username')[0].innerHTML.replace(/\s/g, '');
            if(username == itemusername) {
                var parent = item.parentNode.parentNode;
                var elements = parent.getElementsByClassName('messages')[0].getElementsByClassName('message');
                var id = elements[elements.length-1].id.replace('message-','');
                var send = ":" + id + " " + message;
				sendMessage(send);
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
				sendMessage(url);
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
    }

    function ignoreUsers(parameters) {
		var parts = parameters;
        var time = parts[parts.length-1].match(/^\d+$/) ? parts[parts.length-1] : -1;
		time = parseInt(time);
        parts.forEach((item) => {
            if (item.charAt(0) === "@") {
                var name = item.slice(1)
                displayMessage(`${name} is muted`)
                ignoreList.push(name)
                updateStore()
                if (time != -1 && time > 0) {
                    setTimeout(() => {
                        ignoreList = ignoreList.filter(function(item) {
                            return item != name
                        })
                        updateStore()
                    }, time * 60000)
                }
            }
        })
    }

	function flipACoin() {
        if(Math.floor(Math.random()*2) == 0){
            sendMessage("I flipped a coin and it was heads");
        }else{
            sendMessage("I flipped a coin and it was tails");
        }
	}

	function rollADice() {
		sendMessage("I rolled a die and it was a " + Math.floor(Math.random()*6+1));
	}

    function displayMessage(message) {
    	var messageNode = document.createElement("div")
        messageNode.innerHTML = message
        messageNode.attributes.class = "user-container"
        targetNode.appendChild(messageNode)
    }

    function unignoreUsers(parameters) {
    	var parts = parameters
    	parts.forEach(item => {
    		if (item.charAt(0) === "@") {
    			const name = item.slice(1)
    			const oldLength = ignoreList.length
    			ignoreList = ignoreList.filter(function(item) {
                    return item != name
                })
                updateStore()
                if (oldLength > ignoreList.length) {
                	displayMessage(`${name} has been unmuted`)
                }
    		}
    	})
    }

    function updateStore() {
    	localStorage.setItem("ignoreList", JSON.stringify(ignoreList))
    }

	function flipACoin() {
        if(Math.floor(Math.random()*2) == 0){
            sendMessage("I flipped a coin and it was heads");
        }else{
            sendMessage("I flipped a coin and it was tails");
        }
	}

	function rollADice() {
		sendMessage("I rolled a die and it was a " + Math.floor(Math.random()*6+1));
	}

})();
