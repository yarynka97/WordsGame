function game () {
    var usedWords = [];
    var commonUrl = "https://api.datamuse.com/words?sp=";
    var urlToSend;
    var mistakeText;
    var $wordsField = $("#words-field");
    var $botAnswerText = $("#bot-answer");

    setFirstWord();
    $("button").click(setNewWord);
    $("input").keypress(function (event) {
        if (event.which == 13) setNewWord();   
    });

    function setFirstWord() {
        var randomLetter = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1);
        urlToSend = commonUrl + randomLetter + "*";
        sendRequest(urlToSend);
    }

    function setNewWord() {
        var usersWord = $("input").val();
        var valid = checkWord(usersWord);
        if (valid) {
            usedWords.push(usersWord);
            $wordsField.append(" - <span class='users-word'>" + usersWord + "</span> - ");
            var lastLetter = usersWord[usersWord.length - 1];
            urlToSend = commonUrl + lastLetter + "*";
            sendRequest(urlToSend);
        } else {
            $botAnswerText.removeClass("bot-answer-ok").addClass("bot-answer-mistake").text(mistakeText);
        }
        console.log(usedWords);
    }

    function sendRequest(requestUrl) {
        var request = $.ajax({
            type: "GET",
            url: requestUrl,
        });
        request.done(function (words) {
            var valid;
            do {
                var word = words[parseInt(Math.random() * words.length)].word;
                valid = checkUsedWords(word);
                if (word.length < 2) valid = false;
            } while (!valid);
            usedWords.push(word);
            setCorrectAnswer(word);
        });
    }

    function setCorrectAnswer(word) {
        $botAnswerText
            .removeClass("bot-answer-mistake")
            .addClass("bot-answer-ok")
            .text("My word is ")
            .append("<span class='bots-word'>" + word + "</span>");
        $wordsField.append(word.substr(0, word.length - 1)).append("<span style='color:crimson'>" + word.slice(-1) + "</span>");
    }

    function checkWord(word) {
        var valid = true;
        var lastUsedWord = usedWords[usedWords.length - 1];
        var lastLetter = lastUsedWord[lastUsedWord.length - 1];
        if (lastLetter != word.substr(0, 1)) {
            mistakeText = "Your word sould start with the letter previous word ended";
            valid = false;
        } else {
            valid = checkUsedWords(word);
            if (valid) {
                urlToSend = commonUrl + word;
                var request = $.ajax({
                    type: 'GET',
                    url: urlToSend,
                    async: false
                });
                request.done(function (words) {
                    if (words.length < 1) {
                        mistakeText = "Your word doesn't exist";
                        valid = false;
                    }
                });
            } else {
                if (word.length < 2) {
                    mistakeText = "Please, type word with at least 2 letters";
                    valid = false;
                }
            }
        }
        return valid;
    }
    function checkUsedWords(word) {
        var valid = true;
        usedWords.forEach(function (usedWord) {
            if (usedWord.toString() === word.toString()) {
                mistakeText = "The word " + word + " was already used";
                valid = false;
            }
        });
        return valid;
    }
}