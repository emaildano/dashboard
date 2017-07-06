riot.tag2('register', '<div class="gray-bg" style="height:100%;"> <div class="middle-box text-center loginscreen animated fadeInDown"> <div> <div> <a href="/"> <img src="img/shifter_logo_login@2x.png" width="250px"> </a> </div> <p>Create an account</p> <form class="m-t" role="form" action="login.html"> <div class="form-group"> <input id="user_id" type="text" class="form-control" placeholder="Username" required=""> </div> <div class="form-group"> <input id="email" class="form-control" placeholder="Email" required="" type="email"> </div> <div class="form-group"> <input id="password" type="password" class="form-control" placeholder="Password" required=""> </div> <button id="register" type="button" class="ladda-button ladda-button-demo btn btn-primary block full-width m-b" onclick="{signup}" data-style="expand-right">Register Now</button> <p class="text-muted text-center"><small>Already have an account?</small></p> <a class="btn btn-sm btn-white btn-block" href="/">Login</a> </form> </div> </div> </div>', '', '', function(opts) {
    var self = this

    function submit(event) {
	  if (event.keyCode == 13) {
		document.getElementById('register').click()
	  }
    }
    window.document.onkeydown = submit
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

	this.signup = function(e) {
		var btn = $( '#register' ).ladda()
		btn.ladda( 'start' )

		if ( !self.password.value || !self.email.value || !self.user_id.value ) {
          btn.ladda( 'stop' )
          toastr.warning('Complete form to continue.','Error')
          return
		}

		var attributeList = [];

		var dataEmail = {
		    Name : 'email',
		    Value : self.email.value
		};

		var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

		attributeList.push(attributeEmail);

		userPool.signUp(self.user_id.value, self.password.value, attributeList, null, function(err, result){
		    if (err) {
		      btn.ladda( 'stop' )
              toastr.warning(err.message,'Error')
              return
            }
            btn.ladda( 'stop' )
            toastr.success('To complete your registration follow the steps in the activation email.','Thank you and welcome to Shifter!')

		    if (window.localStorage) {
		      window.localStorage.setItem('shifter_email', self.email.value)
		      window.localStorage.setItem('shifter_user_id', self.user_id.value)
		    }
		});
	}.bind(this)
});
