$(document).ready(function () {
    fetch("../../src/view/notifications.hbs")
    .then( response => response.text())
    .then( content => {
        console.log(content)
        var context = { test: "TEST" };
        Handlebars.partials["notifications"] = Handlebars.compile(content);
    })
});

