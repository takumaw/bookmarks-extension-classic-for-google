/*!
 * Copyright 2012 WATANABE Takuma <takumaw@sfo.kuramae.ne.jp>
 * Released under the MIT license
 */

function loadBookmarkStatus() {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  		var tab = tabs[0];
		$("#bkmk_n")[0].value = tab.title;
		$("#bkmk_u")[0].value = tab.url;

        var title_encoded = encodeURIComponent(tab.title);
        var url_encoded = encodeURIComponent(tab.url);
        var addBookmarkUrl = "http://www.google.com/bookmarks/mark?op=edit&bkmk=" + url_encoded + "&title=" + title_encoded;

        $.ajax({
            url: addBookmarkUrl,
            success: function ( code ) {
                html = $(code);
                // get sig
                var sig = html.find("input[name=sig]")[0].value;

                // get bookmark's labels
                var bkmk_labels_raw = html.find("input#bkmk_label_1")[0].value;
                var bkmk_labels = [];
                jQuery.each(bkmk_labels_raw.split(", "), function() {
                    if (this != "") {
                        bkmk_labels.push({ id: this, name: this });
                    }
                });

                // get global labels
                var labels_raw = html.find("div.kd-content-sidebar > ul > li > a");
                var labels = [];
                jQuery.each(labels_raw, function() {
                    if (this.href.indexOf("label:") != -1) {
                        var labelEntry = this.innerHTML.split("<")[0];
                        labels.push({ id: labelEntry, name: labelEntry });
                    }
                });

                // set values
                $("#sig")[0].value = sig;
                $("#bkmk_label_1").tokenInput(labels,
                    {
                        theme: "facebook",
                        hintText: "",
                        searchingText: "",
                        noResultsText: "",
                        animateDropdown: false,
                        resultsLimit: 2,
                        searchDelay: 0,
                        minChars: 1,
                        prePopulate: bkmk_labels
                    });

                $("#token-input-bkmk_label_1")[0].focus();
            }
        });
	});
}

function openAddUrlPage() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var tab = tabs[0];
        var title_encoded = encodeURIComponent(tab.title);
        var url_encoded = encodeURIComponent(tab.url);
        var addBookmarkUrlPopup = "http://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk=" + url_encoded + "&title=" + title_encoded;

        var win_width = 750;
        var win_height = 475;
        var win_left = 0;
        var win_top = 0;

        chrome.windows.getCurrent(function(win) {
            win_left = win.left + win.width - win_width - 25;
            win_top = win.top + 25;

            window.open(addBookmarkUrlPopup,
                "bookmark_popup",
                "top=" + (win_top) + ",left=" + (win_left) +
                ",width=" + (win_width) + ",height=" + (win_height) +
                ",resizable=1,alwaysRaised=1,location=0");
        });
    });
}

function localize() {
    $("#add_to_google_bookmarks")[0].innerText = chrome.i18n.getMessage("add_to_google_bookmarks");
    $("#form_label_name")[0].innerText = chrome.i18n.getMessage("form_label_name") + ":";
    $("#form_label_label")[0].innerText = chrome.i18n.getMessage("form_label_label") + ":";
    $("#form_button_save")[0].value = chrome.i18n.getMessage("form_button_save");
    $("#form_button_edit")[0].value = chrome.i18n.getMessage("form_button_edit");
}

function onLoad(query) {
    localize();
    $("#form_button_edit")[0].onclick = openAddUrlPage;
    loadBookmarkStatus();
}

document.addEventListener('DOMContentLoaded', onLoad);
