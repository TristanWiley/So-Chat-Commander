# So-Chat-Commander
Chat Commander is a client side Chrome extension that integrates commands for use on any Stackexchange Chat.  

## Command list
So far, these commands are implemented:

- `/collapse`
- `/uncollapse`
- `/giphy <phrase/word>`
- `/glink <phrase/word> --name [linkText]`
- `/shruggie`
- `/replyLast <username> <message>`
- `/cat`
- `/norris`
- `/skeet`
- `/coin`
- `/dice`
- `/ignore <username> [minutes]` (Prefixing username with @ is supported)
- `/unignore <username>` (Prefixing username with @ is supported)
- `/star`
- `/time`
- `/sound`
- `/xkcd ['random'/number]`
- `/reddit <subreddit> [new/top/hot]`

`/collapse` takes any onebox chat message (Wikipedia, SO Question/Answer, Youtube, Image, etc.) and collapses it.

`/uncollapse` takes any onebox chat message (Wikipedia, SO Question/Answer, Youtube, Image, etc.) and uncollapses it.

`/giphy` will send a GIF to the chat according to anything you send after it.

`/glink` will send a link to a GIF according to anything you send after it.

`/shruggie` will send a `¯\_(ツ)_/¯`.

`/replyLast` will reply to the last message `<username>` sent with the message `<message>`.

`/cat` will post a random cat picture.

`/norris` will post a random Chuck Norris joke.

`/skeet` will also post a random joke.

`/ignore` will not display messages from certain user for certain amount of time.

`/coin` will flip a coin and output its value.

`/dice` will roll a dice and output its value.

`/star` will star the last message.

`/time` will output current time.

`/sound` will play notification sound on local computer.

`/xkcd` will display latest XKCD comic (if there are no arguments `/xkcd`), random comic (if there is only 1 parameter - word 'random' `/xkcd random`) or specified comic (if there is only 1 parameter - number of comic `/xkcd 23`).

`/reddit` will display link to random subreddit (if there are no arguments `/reddit`), link to subreddit (if there is only subreddit name `/reddit history`) or display link to top / new / hot post (`/reddit history new` or `/reddit history hot` or `/reddit history top`).

## Wanna contribute?

Take a look at [this Contribution guide](CONTRIBUTING.md) before!

Make sure to add your command to the Readme when contributing.

## Thank You To...
Huge thank you to all the contributers! Especially @drobilc and @jonathangb who have done so much!
