/*!
 * Copyright 2012 WATANABE Takuma <takumaw@sfo.kuramae.ne.jp>
 * Released under the MIT license
 */

/*
 * Shortcut Key Handler
 */

function openAddUrlPage() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var tab = tabs[0];
        var title_encoded = encodeURIComponent(tab.title);
        var url_encoded = encodeURIComponent(tab.url);
        var addBookmarkUrl = "http://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk=" + url_encoded + "&title=" + title_encoded;

        var win_width = 750;
        var win_height = 475;
        var win_left = 0;
        var win_top = 0;

        chrome.windows.getCurrent(function(win) {
            win_left = win.left + win.width - win_width - 25;
            win_top = win.top + 25;

            window.open(addBookmarkUrl,
                "bookmark_popup",
                "top=" + (win_top) + ",left=" + (win_left) +
                ",width=" + (win_width) + ",height=" + (win_height) +
                ",resizable=1,alwaysRaised=1,location=0");
        });
    });
}

chrome.commands.onCommand.addListener(function(command) {
    switch(command) {
        case "on-google-bookmark-edit":
            openAddUrlPage();
            break;
        default:
            break;
    }
});


/*
 * Omnibox Handler
 */

/*chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    if (text.length >= 3) {
        var links = $(localStorage["bookmarks"]).find("DT > A");
        var suggestions = [];
        jQuery.each(links, function() {
            if (this.innerText.indexOf(text) != -1) {
                var suggestionEntry = {
                    content: this.href,
                    description: this.innerText
                };
                suggestions.push(suggestionEntry);
            }
        });
        suggest(suggestions);
    }
});*/

chrome.omnibox.onInputEntered.addListener(function(text) {
    var url = "https://www.google.com/bookmarks/find?q=" + encodeURIComponent(text);
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.update(tabs[0].id, {url: url});
    });
});


/*
 * Bookmarks Loader
 */

/*$.ajax({
    url: "https://www.google.com/bookmarks/bookmarks.html?hl=ja",
    success: function ( code ) {
        localStorage["bookmarks"] = code;
    }
});*/
