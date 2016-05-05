/*!
 * Copyright 2012 WATANABE Takuma <takumaw@sfo.kuramae.ne.jp>
 * Released under the MIT license
 */

function loadFromGoogle() {
    console.log("Loading data...");
    var addBookmarkUrl = "http://www.google.com/bookmarks/mark?op=edit";
    $.ajax({
        url: addBookmarkUrl,
        success: function ( code ) {
            html = $(code);
            // get sig
            var sig = html.find("input[name=sig]")[0].value;
            console.log(sig);
            $("#sig")[0].value = sig;

            // get global labels
            var labels_raw = html.find("div.kd-content-sidebar > ul > li > a");
            var labels = [];
            jQuery.each(labels_raw, function() {
                if (this.href.indexOf("label:") != -1) {
                    var labelEntry = this.innerHTML.split("<")[0];
                    labels.push(labelEntry);
                    //labels.push({ id: labelEntry, name: labelEntry });
                }
            });
            console.log(labels);
            $("#labels")[0].value = labels.join(", ");
        }
    });
}

function localize() {
    document.title = chrome.i18n.getMessage("settings_page_title");
    $("#settings_page_title")[0].innerText = chrome.i18n.getMessage("settings_page_title");
    jQuery.each($(".about_title"), function() {
        this.innerText = chrome.i18n.getMessage("about_title");
    });
    //$("#about_message")[0].innerText = chrome.i18n.getMessage("about_message");
    jQuery.each($(".settings_title"), function() {
        this.innerText = chrome.i18n.getMessage("settings_title");
    });
    $("#settings_message")[0].innerText = chrome.i18n.getMessage("settings_message");
    jQuery.each($(".test_title"), function() {
        this.innerText = chrome.i18n.getMessage("test_title");
    });
    $("#test_message")[0].innerText = chrome.i18n.getMessage("test_message");
}

function onLoad() {
    localize();
    $("#load_from_google_button")[0].onclick = function() {
        loadFromGoogle();
    };
}

document.addEventListener('DOMContentLoaded', onLoad);
