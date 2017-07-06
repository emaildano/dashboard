riot.tag2('activation', '<div class="middle-box text-center animated fadeInDown"> <p><img src="img/shifter_logo_login@2x.png" width="250px"></p> <h3 class="font-bold" style="margin-top:30px;">{message || \'Now Activating...\'}</h3> <a href="/#register"><small>Back to register</small></a> </div>', '', '', function(opts) {
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

  var userData = {
     Username : self.opts.username,
     Pool : userPool
  }

  cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
  cognitoUser.confirmRegistration(self.opts.code, false, function(err, result) {
    if (err) {
      self.message = 'Your account can not activate. Please try regster once.'
      toastr.warning(err.message,'error')
      self.update()
      return
    }
    window.sessionStorage.setItem('shifter_activation', 'true')
    $('body').removeClass('gray-bg')
    riot.route('/')
  })

  this.on('mount', function() {
    $('body').addClass('gray-bg')
  });
});
