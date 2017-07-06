riot.tag2('reset_password', '<div class="gray-bg" style="height:100%;"> <div class="passwordBox animated fadeInDown"> <div class="text-center" style="margin-bottom:10px;"> <a href="/"> <img src="img/shifter_logo_login@2x.png" width="250px"> </a> </div> <div class="row"> <div class="col-md-12"> <div class="ibox-content"> <p> Input new password. </p> <div class="row"> <div class="col-lg-12"> <form class="m-t" role="form" action="/"> <div class="form-group"> <input id="password" type="password" class="form-control" placeholder="New Password" required=""> </div> <button id="resetpassword" type="button" class="ladda-button ladda-button-demo btn btn-primary block full-width m-b" data-style="expand-right" onclick="{resetpassword}">Reset Password</button> </form> </div> </div> </div> </div> </div> <hr> <div class="text-center"> <a href="/">Back to Login page</a> </div> </div> </div>', '', '', function(opts) {
  var self = this
  toastr.options = {
    "closeButton": true,
    "debug": true,
    "progressBar": false,
    "preventDuplicates": false,
    "positionClass": "toast-bottom-right",
    "showDuration": "400",
    "hideDuration": "1000",
    "timeOut": "7000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

  function submit(event) {
    if (event.keyCode == 13) {
      document.getElementById('resetpassword').click()
    }
  }
  window.document.onkeydown = submit

  this.resetpassword = function(e) {
    var btn = $( '#resetpassword' ).ladda()
    btn.ladda( 'start' )

    if ( !self.password.value ) {
      btn.ladda( 'stop' )
      toastr.warning('Enter your new password.', 'Error')
      return
    }

    var userData = {
      Username : self.opts.username,
      Pool : userPool
    }

    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.confirmPassword(self.opts.code, self.password.value, {
      onSuccess: function (result) {
        btn.ladda( 'stop' )
        window.sessionStorage.setItem('shifter_passwordreset', 'true')
        riot.route('/')
        return
      },
      onFailure: function(err) {
        btn.ladda( 'stop' )
        toastr.warning(err.message,'Error')
        return
      }
    });
  }.bind(this)
});
