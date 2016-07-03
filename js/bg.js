chrome.commands.onCommand.addListener(function (command) {
  if (command === "search") {
    afterSearchPressedSend("searchPressed", thenOpenGooglePage);
  } else if (command === "close") {

  }
});

function afterSearchPressedSend(actionName, responseFunction){
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

function thenOpenGooglePage(response){
  var baseUrl = "https://www.google.ru/webhp?hl=en#newwindow=1&hl=en-RU&q=";
  chrome.tabs.create({ url: baseUrl+ response.query}, thenSendMessageToParseLinks);
}


function thenSendMessageToParseLinks(activeTab){
  var sendMessageToParseLinks = function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && activeTab.id === tabId) {
      chrome.tabs.sendMessage(
        activeTab.id,
        {action: "parseFirstLinks"},
        function(response){
          var links = response.links;
          var tabs = [];
          if (links.length > 0 ){
            for (var i=0; i<links.length ; i++){
              chrome.tabs.create({
                url: links[i]},
                function(activeTab){
                  tabs.push(activeTab.id);
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

function switchOnFirstLoadedTab(tabs){
  var loaded = function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && exist(tabs, tabId)) {
      selectTab(tabId);
      chrome.tabs.onUpdated.removeListener(loaded);
    }
  };
  chrome.tabs.onUpdated.addListener(loaded)
}

function exist(arr, id){
  for(var i=0; i<arr.length; i++){
    if (arr[i] == id)
      return true;
  }
  return false;
}

function selectTab(tabId){
  chrome.tabs.update(tabId, {selected: true});
}

//
//function thenOpenParsedLinks(response){
//
//}
