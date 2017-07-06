riot.tag2('forgot_password', '<div class="gray-bg" style="height:100%;"> <div class="passwordBox animated fadeInDown"> <div class="text-center" style="margin-bottom:10px;"> <a href="/"> <img src="img/shifter_logo_login@2x.png" width="250px"> </a> </div> <div class="row"> <div class="col-md-12"> <div class="ibox-content"> <p> To create new password, enter your username or email and we&apos;ll send you a password reset link. </p> <div class="row"> <div class="col-lg-12"> <form class="m-t" role="form" action="/"> <div class="form-group"> <input type="text" class="form-control" placeholder="Username or Email" required="" name="user_id"> </div> <button id="reminder" type="button" class="ladda-button ladda-button-demo btn btn-primary block full-width m-b" onclick="{reminder}" data-style="expand-right">Get A New Password!</button> </form> </div> </div> </div> </div> </div> <hr> <div class="text-center"> <a href="/">Back to Login page</a> </div> </div> </div>', '', '', function(opts) {
	var self = this

	function submit(event) {
	  if (event.keyCode == 13) {
		document.getElementById('reminder').click()
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

	this.reminder = function(e) {
      var btn = $( '#reminder' ).ladda()
      btn.ladda( 'start' )

      if ( !self.user_id.value ) {
        btn.ladda( 'stop' )
        toastr.warning('Enter Username','error')
        return
      }

      var userData = {
        Username : self.user_id.value,
        Pool : userPool
      }

      cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData)
      cognitoUser.forgotPassword({
        onSuccess: function (result) {
   	    },
   	    onFailure: function(err) {
       	  btn.ladda( 'stop' )
          toastr.warning('Invalid Username','error')
          return
   	    },
        inputVerificationCode: function() {
   	      btn.ladda( 'stop' )
   	      window.sessionStorage.setItem('shifter_user_id', self.user_id.value)
          toastr.success('An e-mail has been sent with further instructions.','success')
          return
   	    }
      })
    }.bind(this)
});
