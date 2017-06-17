var Command = function(name, description, isEnabled) {
    this.name = name;
    this.description = description;
    this.isEnabled = isEnabled;
};

var commands = [];

function commandChanged() {
    var commandName = this.id;
    var checked = this.checked;
    if (this.id) {
        for (var i = 0; i < commands.length; i++) {
            if (commands[i].name == commandName) {
                commands[i].isEnabled = checked;
                break;
            }
        }
        chrome.storage.sync.set({
            commands: commands
        }, function() {});
    }
}

var allCommands = [new Command('collapse', 'takes any onebox chat message (Wikipedia, SO Question/Answer, Youtube, Image, etc.) and collapses it.', true),
    new Command('uncollapse', 'takes any onebox chat message (Wikipedia, SO Question/Answer, Youtube, Image, etc.) and uncollapses it.', true),
    new Command('shruggie', 'will send a ¯\\_(ツ)_/¯.', true),
    new Command('norris', 'will post a random Chuck Norris joke.', true),
    new Command('skeet', 'will also post a random joke.', true),
    new Command('cat', 'will post a random cat picture. Add <gif, png, or jpg> if you want to specify a type. Defaults to jpg.', true),
    new Command('replyLast', 'will reply to the last message <username> sent with the message <message>.', true),
    new Command('giphy', 'will send a GIF to the chat according to anything you send after it.', true),
    new Command('glink', 'will send a link to a GIF according to anything you send after it.', true),
    new Command('ignore', 'will not display messages from certain user for certain amount of time.', true),
    new Command('coin', 'will flip a coin and output its value.', true),
    new Command('dice', 'will roll a dice and output its value.', true),
    new Command('unignore', 'will unignore user and start displaying his messages again.', true),
    new Command('star', 'will star last message.'),
    new Command('time', 'will display current time.'),
    new Command('sound', 'will play sound on local computer.'),
    new Command('xkcd', 'will display last / random XKCD comic.'),
    new Command('reddit', 'will send link to newest / hottest / top post in subreddit.'),
    new Command('kiddo', 'will send (☞ﾟヮﾟ)☞ That\'s where you\'re wrong kiddo'),
    new Command('tableflip', 'will send (╯°□°)╯︵ ┻━┻'),
    new Command('settable', 'will send ┬─┬ノ( º _ ºノ)'),
    new Command('disapprove', 'will send ಠ_ಠ'),
    new Command('ayfkm', 'will send a comic for "are you fucking kidding me"'),
    new Command('thinking', 'will send the thinking face'),
    new Command('lenny', 'will send a (͡° ͜ʖ ͡°)', true)
];

function saveCommands() {
    chrome.storage.sync.set({
        commands: allCommands
    }, function() {});
}

function refresh() {
    chrome.storage.sync.get({
        commands: [],
        pluginEnabled: true,
        displayPopup: true,
        firstTime: true
    }, function(items) {

        commands = items.firstTime ? allCommands : items.commands;

        if (items.firstTime) {
            saveCommands();
            chrome.storage.sync.set({ firstTime: false }, function() {});
        }

        document.getElementById("displayPopup").checked = items.displayPopup;
        document.getElementById("pluginEnabled").checked = items.pluginEnabled;

        var commandList = document.getElementById("command-list");
        for (var i = 0; i < commands.length; i++) {
            var listObject = document.createElement('li');

            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = commands[i].isEnabled;
            checkbox.id = commands[i].name;
            checkbox.onchange = commandChanged;

            var commandName = document.createElement('span');
            commandName.innerHTML = '/' + commands[i].name;
            commandName.className = 'command-name';

            var commandDescription = document.createElement('span');
            commandDescription.innerHTML = commands[i].description;
            commandDescription.className = 'command-description';

            listObject.appendChild(checkbox);
            listObject.appendChild(commandName);
            listObject.appendChild(commandDescription);
            commandList.appendChild(listObject);
        }

    });
}

document.body.onload = refresh();

document.getElementById("displayPopup").onchange = function(e) {
    chrome.storage.sync.set({
        displayPopup: document.getElementById("displayPopup").checked
    }, function() {});
}

document.getElementById("pluginEnabled").onchange = function(e) {
    chrome.storage.sync.set({
        pluginEnabled: document.getElementById("pluginEnabled").checked
    }, function() {});
}
