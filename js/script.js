$(function () {
    var usedWords = [];
    var commonUrl = "https://api.datamuse.com/words?sp=";
    var urlToSend;
    var mistakeText;
    setFirstWord();
    $("button").click(setNewWord);

    function setFirstWord() {
        $("#bot-answer").addClass("bot-answer-ok");
        var randomLetter = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1);
        urlToSend = commonUrl + randomLetter + "*";
        setTimeout(sendRequest(urlToSend), 2000);
    }

    function setNewWord() {
        var usersWord = $("input").val();
        var valid = checkWord(usersWord);
        if (valid) {
            usedWords.push(usersWord);
            $("#words-field").append(" - " + usersWord + " - ");
            var lastLetter = usersWord[usersWord.length - 1];
            urlToSend = commonUrl + lastLetter + "*";
            sendRequest(urlToSend);
        } else {
            $("#bot-answer").removeClass("bot-answer-ok").addClass("bot-answer-mistake").text(mistakeText);
        }
        console.log(usedWords);
    }

    function sendRequest(requestUrl) {
        $.ajax({
            type: "GET",
            url: requestUrl,
            success: function (words) {
                var valid;
                do {
                    var word = words[parseInt(Math.random() * words.length)].word;
                    valid = checkUsedWords(word);
                } while (!valid);
                usedWords.push(word);
                $("#bot-answer")
                    .removeClass("bot-answer-mistake")
                    .addClass("bot-answer-ok")
                    .text("My word is "+ word);

                $("#words-field").append(word);    
            }
        });
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
                $.ajax({
                    type: 'GET',
                    url: urlToSend,
                    success: function (words) {
                        if (words.length < 1) {
                            mistakeText = "Your word doesn't exist";
                            valid = false;
                        }
                    }
                });
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
});