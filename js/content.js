var LINK_TO_OPEN = 5;

chrome.extension.onMessage.addListener(function(message, sender, _sendResponse){
  var isAlreadyOpened = alreadyOpened(message.action);
  if(message.action == "hotKeyPressed" && isAlreadyOpened)
    deleteAll();
  else if(message.action == "hotKeyPressed" && !isAlreadyOpened)
    addAll(_sendResponse);
  else if (message.action == "parseFirstLinks")
    startCheckingTabs(_sendResponse, LINK_TO_OPEN);
  else return false;

  return true;
});

function alreadyOpened(actionName){
  return actionName == "hotKeyPressed" ? ($('#open_first_tabs_extension').length > 0) : false
}

function startCheckingTabs(sendResponse, tabsAmount){
  var checkExist = setInterval(function() {
    if (appearedEnoughTabs(tabsAmount)) {
      clearInterval(checkExist);
      sendResponse({ links: parseFirstLinks(tabsAmount) });
    }
  }, 300);
}

function appearedEnoughTabs(tabsCount){
  return ($('.g .r a').length > tabsCount);
}


function addAll(sendResponse){
  AddInput(sendResponse);
  addBgShadow();
}

function deleteAll(){
  deleteInput();
  deleteBgShadow();
}

function AddInput(sendResponse) {
  element = $('<input/>', {
    id: 'open_first_tabs_extension',
    placeholder: 'Enter google query'
  }).css({
    left: "40%",
    top: "40%",
    position: 'fixed',
    width: "500px",
    height: "60px",
    fontSize: 24,
    zIndex: 1024
  }).bind("enterKey", function (e) {
    text = $(this).val();
    deleteAll();
    sendResponse({query: text });
  }).keyup(function (e) {
    if (e.keyCode == 13)
      $(this).trigger("enterKey");
  }).appendTo('body');
  element.focus();
}
function deleteInput(){
  $('#open_first_tabs_extension').remove();
}


function addBgShadow(){
  $('<div/>', {
    id: 'open_first_tabs_extension_bg_shadow'
  }).css({
    left: "0",
    top: "0",
    position: 'fixed',
    width: "100%",
    height: "100%",
    backgroundColor: 'black',
    opacity: 0.7,
    zIndex: 1023
  }).appendTo('body');
}
function deleteBgShadow(){
  $('#open_first_tabs_extension_bg_shadow').remove();
}


function parseFirstLinks(n){
  elements = $('.g .r a');

  if (elements.length < n)
    n = elements.length;

  links = [];

  var i = 0;

  elements.each(function(){
    if (i>=n) return;
    i++;

    pure_link = $(this).attr('href').split('url=');

    if(isNotCorrect(pure_link)) return;

    pure_link =  pure_link.pop();
    if(isNotCorrect(pure_link)) return;

    pure_link =  pure_link.split('&amp;')[0];
    if(isNotCorrect(pure_link)) return;

    links.push(pure_link);
  });

  return links;
}


function isNotCorrect(obj){
  return obj == undefined || obj == "undefined" || obj == null;
}
