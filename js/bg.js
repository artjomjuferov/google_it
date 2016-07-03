chrome.commands.onCommand.addListener(function(command) {
    if (command === "search") {
        afterSearchPressedSend("searchPressed", thenOpenGooglePage);
    } else if (command === "close") {
        closeLastSessionOfTabs();
    }
});


// store array
// even stores search results page
var SESSIONS = [];

function closeLastSessionOfTabs() {
    tabsToClose = SESSIONS.pop();
    if (!tabsToClose) {
        return;
    }

    for (var i = 0; i < tabsToClose.length; i++) {
        tabId = tabsToClose[i];
        chrome.tabs.remove(tabId);
    }
}


function afterSearchPressedSend(actionName, responseFunction) {
    chrome.tabs.query({
            active: true,
            currentWindow: true
        },
        function(tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id, {
                    action: actionName
                },
                function(response) {
                    responseFunction(response)
                }
            );
        }
    );
}


function thenOpenGooglePage(response) {
    // if it is not shown that exit from function
    if (!response) return;
    // var baseUrl = "https://www.google.co.uk/webhp?hl=en#newwindow=1&hl=en-GB&q=";
    var baseUrl = "https://www.google.co.uk/search?newwindow=1&hl=en-GB&q=";
    // var baseUrl = "https://www.google.co.uk/search?site=&source=hp&q=";
    chrome.tabs.create({
        url: baseUrl + response.query
    }, thenSendMessageToParseLinks);
}


function thenSendMessageToParseLinks(resultsTab) {
    var sendMessageToParseLinks = function(tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete' && resultsTab.id === tabId) {
            chrome.tabs.sendMessage(
                resultsTab.id, {
                    action: "parseFirstLinks"
                },
                function(response) {
                    if (!response)
                        return;
                    // all parsed links
                    var links = response.links;
                    var tabs = [];
                    // for different purposes
                    var tabsToClose = [resultsTab.id];
                    SESSIONS.push(tabsToClose);
                    if (links.length > 0) {
                        for (var i = 0; i < links.length; i++) {
                            // open tab
                            chrome.tabs.create({
                                    url: links[i]
                                },
                                function(activeTab) {
                                    id = activeTab.id;
                                    tabs.push(id);
                                    tabsToClose.push(id);
                                }
                            );
                        }
                    }

                    // it is good idea to switch on first loaded tab
                    switchOnFirstLoadedTab(tabs);

                    // after tabs created we remove listener to prevent creating new
                    chrome.tabs.onUpdated.removeListener(sendMessageToParseLinks);
                }
            );
        }
    };
    chrome.tabs.onUpdated.addListener(sendMessageToParseLinks)
}


function switchOnFirstLoadedTab(tabs) {
    var loaded = function(tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete' && exist(tabs, tabId)) {
            selectTab(tabId);
            chrome.tabs.onUpdated.removeListener(loaded);
        }
    };
    chrome.tabs.onUpdated.addListener(loaded)
}


function exist(arr, id) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == id)
            return true;
    }
    return false;
}


function selectTab(tabId) {
    chrome.tabs.update(tabId, {
        selected: true
    });
}
