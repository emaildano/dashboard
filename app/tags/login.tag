<login>
  <div class="gray-bg" style="height:100%;">
    <div class="middle-box text-center loginscreen animated fadeInDown">
        <div>
            <div>
              <a href="/" >
                <img src="img/shifter_logo_login@2x.png" width="250px">
              </a>
            <form class="m-t-xl" role="form" action="/">
                <div class="alert alert-warning" >
                  <p>Due to the system update, <a href="/#forgot_password">modifying password is required</a>. For more details: please check <a href="https://getshifter.zendesk.com/hc/en-us/articles/115001088568" target="__blank">our announcement</a>.</p>
                </div>
                <div class="form-group">
                    <input id="username" type="text" class="form-control" placeholder="Username or Email" required="">
                </div>
                <div class="form-group">
                    <input id="password" type="password" class="form-control" placeholder="Password" required="">
                </div>
                <button id="login" type="button" class="ladda-button ladda-button-demo btn btn-primary block full-width m-b" data-style="expand-right" onclick="{ auth }" >Login</button>

                <a href="/#forgot_password"><small>Forgot your password?</small></a>
                <p class="text-muted text-center"><small>New user?</small></p>
                <a class="btn btn-sm btn-white btn-block" href="/#register">Sign-up for Shifter</a>
            </form>
        </div>
    </div>
  </div>
    this.error = ''
	var self = this

    function submit(event) {
      if (event.keyCode == 13) {
        document.getElementById('login').click()
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
    
    var userinfo_activation = window.localStorage.getItem('userinfo_activation');
    if ( userinfo_activation ) {
      userinfo_activation = JSON.parse(userinfo_activation);
      if (userinfo_activation.status === 'notlogin') {
        toastr.warning('メールアドレスのアクティベーションはコンソールにログインした状態でのブラウザで行ってください');
      }
      window.localStorage.removeItem('userinfo_activation');
    }

    if ( window.sessionStorage.getItem('shifter_passwordreset') === 'true' ) {
      window.sessionStorage.removeItem('shifter_passwordreset')
      toastr.success('You can login with registered password.','success')
    }
    
    if ( window.sessionStorage.getItem('shifter_activation') === 'true' ) {
      window.sessionStorage.removeItem('shifter_activation')
      toastr.success('You can login with registered account. Enjoy Shifter!','Activation Success. ')
    }

    var user_id = window.sessionStorage.getItem('shifter_user_id')
    if (user_id) {
      self.username.value = user_id
      self.update()
    }

    auth(e) {
        var login_btn = $( '#login' ).ladda()
        login_btn.ladda( 'start' )
        if ( !self.username.value || !self.password.value ) {
          login_btn.ladda( 'stop' )
          toastr.warning('Enter username and password.','error')
          return
        }

        var authenticationData = {
          Username : self.username.value,
          Password : self.password.value
        }

        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

        var userData = {
          Username : self.username.value,
          Pool : userPool
        }

        cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: function (result) {
            sessionRefrashProvider = setInterval(function(){　
              cognitoUser.getSession(function(err, session) {
                if (err) {
                  return
                }
                session_id = session.getAccessToken().getJwtToken()
              })
             }, 900000)
            riot.route('/projects')
            return
          },
          onFailure: function(err) {
            login_btn.ladda( 'stop' )
            toastr.warning('Invalid Username or Password','error')
          },
        });
    }
</login>
