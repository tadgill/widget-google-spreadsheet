;(function(window) {

    var container = window.document.createElement("div");
    var messageContainer = window.document.createElement("div");
    container.setAttribute("id", "container");
    messageContainer.setAttribute("id", "messageContainer");

    var sheet = window.document.createElement("rise-google-sheet");

    sheet.id = "rise-google-sheet";
    sheet.go = function() {};

    var body = document.getElementsByTagName("BODY")[0];

    body.appendChild(container);
    body.appendChild(messageContainer);
    body.appendChild(sheet);

})(window);
