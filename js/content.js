var LINKT_TO_OPEN = 5;


chrome.extension.onMessage.addListener(function(message, sender, _sendResponse){
  if(message.action == "showInput"){
    showInput(_sendResponse);
  }else if (message.action == "parseFirstLinks"){
    var checkExist = setInterval(function() {
      if ($('.g .r a').length > LINKT_TO_OPEN) {
        clearInterval(checkExist);
        _sendResponse({ links: parseFirstLinks(LINKT_TO_OPEN) })
      }
    }, 300);
  } else{
    return false
  }
  return true;
});

function showInput(sendResponse) {
  element = $('<input/>', {
    id: 'open_first_tabs',
    title: 'Become a Googler',
    rel: 'external',
    text: 'Go to Google!'
  }).css({
    left: $(document).width() / 4,
    top: $(document).height() / 32,
    position: 'absolute',
    width: $(document).width() / 2,
    height: $(document).height() / 32
  }).bind("enterKey", function (e) {
    text = $(this).val();
    $(this).remove();
    sendResponse({query: text });
  }).keyup(function (e) {
    if (e.keyCode == 13)
      $(this).trigger("enterKey");
  }).appendTo('body');

  element.focus();
}

function parseFirstLinks(n){

  elements = $('.g .r a');

  if (elements.length < n)
    n = elements.length;

  links = [];

  var i = 0;

  elements.each(function(){
    if (i>=n) return;
    i++
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
