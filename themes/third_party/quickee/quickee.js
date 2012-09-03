var quickeeOpen = false;

$(function() {
  
  var keyCodes = [38, 40, 13, 27];
  var ignoreKey = false;
  
  addQuickeeToDom()  
  
  $('#quickee').addClass("animated");
   
  $('#quickee-form').submit(function(e){
    e.preventDefault()
  });
  
  $('#quickee-search').keydown(function(e){
    if (e.keyCode == 38 || e.keyCode == 40) {
      e.preventDefault();
    }
  });
  
  $('#quickee-search').keyup(function(e){
    e.preventDefault()
    if ($.inArray(e.keyCode, keyCodes) == -1) {
      $("#quickee-results").empty()
      var term = $(this).val();
      if (term.length) {
        $links = $("#mainMenu li a:not([href=#])");
        filtered = $links.filter(function(index, element, array){
          var reg = new RegExp(term.split('').join('\.*'), 'i');
          $element = $(element)
          if ($element.text() != "") {
            if ($element.text().match(reg)) {
              return $element;
            }  
          } else if ($element.attr("title").match(reg)) {
            return $element;
          }
        })
        filtered.each(function(){
          $this = $(this)
          var text = $this.text() || $this.attr("title");
          $parents = $this.parents(".parent");
          $parentLinks =  $("> a:first", $parents)
          breadcrumbs = "";
          $parentLinks.each(function(){
            parentText = $(this).text();
            if (parentText != text) {
              breadcrumbs = $(this).text() + " >  " + breadcrumbs;  
            };
          })
          if (text != "") {
            var link = $this.attr("href")
            $('#quickee-results').append("<li><a href='"+link+"'>" + breadcrumbs + "<strong>" + text + "</strong>" + "</a></li>")  
          };
        });
        $('#quickee-results li:first').addClass("current-selected")
      };  
    };
  })
  
  $(window).keydown(function (e){
    
    // Open Quickee
    if (e.keyCode == 81 && quickeeOpen == false) {
      e.preventDefault();
      openQuickee()
    };
    
    if (quickeeOpen) {
      switch (e.keyCode) {
        case 38: // up key
        moveSelection("up")
        e.preventDefault();
        break;
        case 40: // down key
        moveSelection("down")
        e.preventDefault();
        break;
        case 13: // enter key
        goToSelection()
        e.preventDefault();
        break;
        case 27: // esc key
        e.preventDefault();
        closeQuickee()
        break;
      }
    };
  });
  
});

function openQuickee () {
  $('#quickee').addClass("active");
  $('#quickee-search').focus();
  quickeeOpen = true;
}

function closeQuickee () {
  $('#quickee').removeClass("active");
  $('#quickee-search').blur().val("");
  $("#quickee-results").empty();
  quickeeOpen = false;
}

function moveSelection (direction) {
  var $current = $('#quickee-results li.current-selected');
  
  if (direction == "down") {
    var $next = $current.next().addClass("current-selected");
  } else if (direction == "up") {
    var $next = $current.prev().addClass("current-selected");
  };
  
  if ($next.length > 0) {
    $current.removeClass("current-selected");  
  };
}

function goToSelection () {
  var $current = $('#quickee-results li.current-selected a');
  var url = $current.attr("href");
  window.location.href = url;
}

function addQuickeeToDom () {
  $('body').append('<div id="quickee"><form id="quickee-form"><input type="text" id="quickee-search"></form><ul id="quickee-results"></ul></div>')
}