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
        "notification-center", "notifications-counter", "notifications-header", 
        "notification-list-history-content", "notification-list-new-content",
        "pagination-structure","notifications-footer-fixed" 
    ];

    var loadedTemplates = 0;
    templateNames.forEach(function(templateName) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                // console.log(this.responseText)
                Handlebars.partials[templateName] = Handlebars.compile(this.responseText);
                loadedTemplates++;
                if (loadedTemplates == templateNames.length) loadPage();
               }            
        };

        xhttp.open("GET","../../src/view/" + templateName + ".hbs",true);
        xhttp.send();
            // .then( response => response.text())
            // .then( content => {
              
            // })
    });

    window.MEMBER_NUMBER = document.querySelector("#memberNumber").value;

    document.querySelector("#changeMemberNumber").addEventListener("click", function(){
        var newMemberNumber = document.querySelector("#memberNumber").value;
        if (newMemberNumber != window.MEMBER_NUMBER) {
            window.MEMBER_NUMBER = newMemberNumber;
            window.notificationsCenterController._destroy();
            console.log("Reload NotificationsCenterController");
            window.notificationsCenterController = new NotificationsCenterController(
                $("#container-notifications"),
                'notification-center'
    );
        } else {
            alert("sama value");
        }
    });
});

function loadPage() {
    console.log("Load NotificationsCenterController");
    window.notificationsCenterController = new NotificationsCenterController(
        $("#container-notifications"),
        'notification-center'
    );
}

