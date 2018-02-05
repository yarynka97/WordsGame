$(function () {
    var usedWords = [];
    var commonUrl = "https://api.datamuse.com/words?sp=";
    var urlToSend;
    setFirstWord();
    $("button").click(function () {
        var usersWord = $("input").val();
        usedWords.push(usersWord);
        $("#words-field").append(" - " + usersWord);
        var lastLetter = usersWord[usersWord.length - 1];
        urlToSend = commonUrl + lastLetter + "*";
        $("#bot-answer").text(urlToSend);
        $.ajax({
            type: "GET",
            url: urlToSend,
            success: function (words) {
                var word = words[parseInt(Math.random() * words.length)].word;
                usedWords.push(word);
                $("#words-field").append(" - " + word);
                alert(usedWords);
            }
        });
        console.log("click");
    });

    function setFirstWord() {
        $("#bot-answer").addClass("bot-answer-ok");
        var randomLetter = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1);
        urlToSend = commonUrl + randomLetter + "*";
        $.ajax({
            type: "GET",
            url: urlToSend,
            success: function (words) {
                var word = words[parseInt(Math.random() * words.length)].word;
                usedWords.push(word);
                $("#bot-answer").text("My word is " + word);
                $("#words-field").append(word);
            }
        });
    }
    //function mistake(errorText) {
    //    $("#bot-answer")
    //        .removeClass("bot-answer-ok")
    //        .addClass("bot-answer-mistake")
    //        .text(errorText);
    //}
});