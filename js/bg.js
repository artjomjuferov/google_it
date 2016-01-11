chrome.commands.onCommand.addListener(function (command) {
  if (command === "search") {
    afterHotKeyPressedSend("hotKeyPressed", responseFromHotKeyPressed);
  }
});

function afterHotKeyPressedSend(actionName, responseFunction){
  chrome.tabs.query(
    {active: true, currentWindow: true},
    function(tabs){
      chrome.tabs.sendMessage(
        tabs[0].id, {action: actionName},
        function(response) { responseFunction(response) }
      );
    }
  );
}

function responseFromHotKeyPressed(response){
  openGooglePage(response.query)
}

function openGooglePage(searchQuery){
  var baseUrl = "https://www.google.ru/webhp?hl=en#newwindow=1&hl=en-RU&q=";
  chrome.tabs.create({ url: baseUrl+ searchQuery}, afterGooglePageOpened);
}

function afterGooglePageOpened(activeTab){
  var sendParseFirstLinks = function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && activeTab.id === tabId) {
      chrome.tabs.sendMessage(
        activeTab.id,
        {action: "parseFirstLinks"},
        function(response) {
          var links = response.links;
          if (links.length > 0 ){
            for (var i=0; i<links.length ; i++){
              chrome.tabs.create({ url: links[i]});
            }
          }
          chrome.tabs.onUpdated.removeListener(sendParseFirstLinks);
        }
      );
    }
  };
  chrome.tabs.onUpdated.addListener(sendParseFirstLinks)
}










