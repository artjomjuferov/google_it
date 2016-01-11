var LINK_TO_OPEN = 5;

chrome.extension.onMessage.addListener(function(message, sender, _sendResponse){
  if(message.action == "showInput"){
    if ($('#open_first_tabs_extension').length > 0) {
      $('#open_first_tabs_extension').remove();
      deleteBgShadow();
    }else{
      showInput(_sendResponse);
    }
  }else if (message.action == "parseFirstLinks"){
    var checkExist = setInterval(function() {
      if ($('.g .r a').length > LINK_TO_OPEN) {
        clearInterval(checkExist);
        _sendResponse({ links: parseFirstLinks(LINK_TO_OPEN) });
      }
    }, 300);
  } else{
    return false
  }
  return true;
});

function showInput(sendResponse) {
  element = $('<input/>', {
    id: 'open_first_tabs_extension',
    title: 'Become a Googler',
    rel: 'external',
    text: 'Go to Google!'
  }).css({
    left: "40%",
    top: "40%",
    position: 'fixed',
    width: "300px",
    height: "30px",
    zIndex: 1024
  }).bind("enterKey", function (e) {
    text = $(this).val();
    $(this).remove();
    deleteBgShadow();
    sendResponse({query: text });
  }).keyup(function (e) {
    if (e.keyCode == 13)
      $(this).trigger("enterKey");
  }).appendTo('body');

  addBgShadow();
  element.focus();
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
    opacity: 0.5,
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

  console.log(links);
  return links;
}


function isNotCorrect(obj){
  return obj == undefined || obj == "undefined" || obj == null || obj == null;
}
