$(document).ready(function () {

    var templateNames = ["notifications-counter", "notifications" ];

    templateNames.forEach(function(templateName) {
        fetch("../../src/view/" + templateName + ".hbs")
            .then( response => response.text())
            .then( content => {
                console.log(content)
                var context = { test: "TEST" };
                Handlebars.partials[templateName] = Handlebars.compile(content);
            })
    });
});

