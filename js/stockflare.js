var OnStockflareRegister = function() {
  var username = $('#email_address');
  var password = $('#password');
  $.ajax({
    url: 'https://api.stockflare.com/users/register',
    type: 'POST',
    context: this,
    data: {
      username: username.val(),
      password: password.val()
    },
    complete: function(){
      password.val('');
    },
    success: function(data) {
      var identity = data;
      mixpanel.track(
          "Landing Conversion"
      );
      window.location = "http://stockflare.com/landing?i=" + btoa(JSON.stringify(identity));
    },
    error: function(xhr) {
      if (xhr.status === 409) {
        $('#form_fail p').html("Email address already used");
      } else {
        $('#form_fail p').html("Oops.  Somthing went wrong.");
      }
      $('#form_fail').css({"display": "block" });
    }
  });
};

// $('#email-form').attr("data-actionssss", "OnStockflareRegister()");

$(document).ready(function(){
  $('#email-form').submit(function(event){
    event.preventDefault();
    OnStockflareRegister();
  });

  // Hook up link tracking
  function generate_callback(a) {
      return function() {
          if (a.data("href")) {
            window.location = a.data("href");
          }
      };
  }

  $("a").click(function(event) {
    event.preventDefault();
    if (!$(this).attr('href').startsWith('#')) {
      event.stopPropagation();
    }
    var cb = generate_callback($(this));
    console.log($(this).data('event'));
    mixpanel.track("Landing link click", { "link": $(this).data('event') }, cb);
    setTimeout(cb, 500);
  });


});
