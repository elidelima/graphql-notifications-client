var TEMPLATES_LOADED = false;

//ASYNC
/*
async function loadTemplates() {
    var templateNames = ["notifications-counter", "notifications-header" ];
    var response = await templateNames.forEach(fetchAsync);
}

async function fetchAsync(templateName) {
    console.log(1);
    var response = await fetch("../../src/view/" + templateName + ".hbs");
    var content = await response.text();
    console.log(content);
    Handlebars.partials[templateName] = Handlebars.compile(content);
}
*/

$(document).ready(function () {

    var templateNames = [
        "notifications-counter", "notifications-header", "notification-list",
        "notification-list-new", "notification-list-history", "notification"];
    
    var loadedTemplates = 0;
    templateNames.forEach(function(templateName) {
        fetch("../../src/view/" + templateName + ".hbs")
            .then( response => response.text())
            .then( content => {
                Handlebars.partials[templateName] = Handlebars.compile(content);
                loadedTemplates++;
                if (loadedTemplates == templateNames.length) loadPage();
            })
    });
});

function loadPage() {
    console.log("Load NotificationsCenterController");
    window.notificationsCenterController = new NotificationsCenterController();
}

