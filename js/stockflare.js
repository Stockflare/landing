var Loader = {
  hasLocalStorageSupport: function() {
    return false;
  },

  load: function(key, alt) {
    try {
      var val = this.storage().getItem(key);
      return val !== null ? JSON.parse(atob(val)) : alt;
    } catch(e) {
      return alt;
    }
  },

  save: function(key, obj, expires) {
    try {
      var str = btoa(JSON.stringify(obj));
      this.storage().setItem(key, str, expires);
      return true;
    } catch(e) {
      return false;
    }
  },

  delete: function(key) {
    try {
      this.storage().removeItem(key);
      return true;
    } catch(e) {
      return false;
    }
  },

  storage: function() {
    if(this.hasLocalStorageSupport()) {
      return window.localStorage;
    } else {
      return {
        setItem: function(key, val, expires) {
          expires = expires || new Date().getTime() + 60 * 60 * 24 * 14;
          var date = new Date(expires);
          document.cookie = key + '=' + val + '; expires=' + date.toUTCString() + '; path=/; domain=stockflare.com';
        },

        getItem: function(key) {
          return document.cookie.match(new RegExp(key + '=([^;]+);'))[1];
        },

        removeItem: function(key) {
          return this.setItem(key, '', 0);
        }
      };
    }
  }
};

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
      Loader.save('identity', identity, identity.expires * 1000);
      window.location = "http://stockflare.com";
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
});
