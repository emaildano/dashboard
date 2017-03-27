<account>
    <div id="wrapper">
      <sidebar></sidebar>
        <div id="page-wrapper" class="gray-bg">
          <commonheader></commonheader>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-sm-4">
                    <h2>Account</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li class="active">
                            <strong>Account</strong>
                        </li>
                    </ol>
                </div>
            </div>
        <div class="row">
          <div class="spiner-example hidden" id="loading" style="height: 66px;">
            <div class="sk-spinner sk-spinner-three-bounce">
              <div class="sk-bounce1"></div>
              <div class="sk-bounce2"></div>
              <div class="sk-bounce3"></div>
            </div>
          </div>
        </div>
        <div  class="row">
            <div class="col-lg-12">
                <div id="main_box" class="wrapper wrapper-content animated fadeInUp hidden">
                    <div class="tabs-container">
                        <ul class="nav nav-tabs">
                            <li class="active"><a data-toggle="tab" href="#account-infomation" aria-expanded="true"> Account Infomation</a></li>
                            <li class=""><a data-toggle="tab" href="#change-password" aria-expanded="false"> Change Password</a></li>
                            <li class=""><a data-toggle="tab" href="#withdrawal" aria-expanded="false"> Delete account</a></li>
                        </ul>
                        <div class="tab-content">
                            <div id="account-infomation" class="tab-pane active">
                                <div class="panel-body">
                                    <form class="form-horizontal">
                                    	<div class="form-group">
                                			<label class="col-lg-2 control-label">User ID</label>
                                    		<div class="col-lg-10">
                                    			<input type="text" class="form-control" value="{ username }" readonly="readonly">
                                    		</div>
                                		</div>
                                		<div class="form-group">
                                			<label class="col-lg-2 control-label">Email</label>
                                    		<div class="col-lg-10">
                                    			<input id="myemail" type="email" class="form-control" value="{ email }">
                                    		</div>
                                		</div>
			                            <div class="form-group">
			                            	<label class="col-lg-2 control-label"></label>
			                            	<div class="col-lg-10">
            			                		<button id="btnChangeAccountInfomation" class="ladda-button ladda-button-demo btn btn-sm btn-primary pull-left m-t-n-xs" type="button" data-style="expand-right" onclick="{ changeAccountInfomation }"><strong>Submit</strong></button>
            			                		<button id="btnResendActivationMail" class="ladda-button ladda-button-demo btn btn-sm btn-default pull-left m-t-n-xs" type="button" data-style="expand-right" onclick="{ resendActivationMail }" style="margin-left:7px;"><strong>Resend Activation Mail</strong></button>
            			                	</div>
                    			        </div>
                            		</form>
                                </div>
                            </div>
                            <div id="change-password" class="tab-pane">
                                <div class="panel-body">
                                    <form class="form-horizontal">
                                    	<div class="form-group">
                                			<label class="col-lg-2 control-label">Old Password</label>
                                    		<div class="col-lg-10">
                                    			<input id="oldpassword" type="password" class="form-control" >
                                    		</div>
                                		</div>
                                		<div class="form-group">
                                			<label class="col-lg-2 control-label">New Password</label>
                                    		<div class="col-lg-10">
                                    			<input id="newpassword" type="password" class="form-control">
                                    		</div>
                                		</div>
			                            <div class="form-group">
			                            	<label class="col-lg-2 control-label"></label>
			                            	<div class="col-lg-10">
            			                		<button id="btnChangePassword" class="ladda-button ladda-button-demo btn btn-sm btn-primary pull-left m-t-n-xs" type="button" data-style="expand-right" onclick="{ changePassword }"><strong>Submit</strong></button>
            			                	</div>
                    			        </div>
                            		</form>
                                </div>
                            </div>
                            <div id="withdrawal" class="tab-pane">
                                <withdrawal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
    <init></init>
    <script>
    this.items = []
    var self  = this
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

    init().then(function() {
      return getAccountInfomation()
    }).then(function(data){
      self.email = data.email
      self.username = data.username
      self.update()
    }).then(function(){
      display()
      var userinfo_activation = window.localStorage.getItem('userinfo_activation');

      if (userinfo_activation) {
        userinfo_activation = JSON.parse(userinfo_activation)
        if (userinfo_activation.status === 'success') {
          toastr.success('Email activation successfully')
        } else if (userinfo_activation.status === 'fail') {
          toastr.warning('We could not verify your activation. Try again later or click Resend Activation Mail button to receive another activation mail.', userinfo_activation.message)
        }
        window.localStorage.removeItem('userinfo_activation');
      }

    }).catch(function(error){
      console.log(error)
      switch(error.statusCode) {
        case 401:
          riot.route('/')
          break
      }
    })

    changePassword(e) {
      var btn = $( '#btnChangePassword' ).ladda()
      btn.ladda( 'start' )

      cognitoUser.changePassword(self.oldpassword.value, self.newpassword.value, function(err, result) {
        btn.ladda( 'stop' )
        if (err) {
            toastr.warning(err.message)
            return
        }
        toastr.success('Change Password successfully')
      });
    }

    changeAccountInfomation(e) {
      var btn = $( '#btnChangeAccountInfomation' ).ladda()
      btn.ladda( 'start' )

      var attributeList = [];
      var attribute = {
        Name : 'email',
        Value : self.myemail.value
      };

      var attribute = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(attribute);
      attributeList.push(attribute);

      cognitoUser.updateAttributes(attributeList, function(err, result) {
        btn.ladda( 'stop' )
        if (err) {
          toastr.warning(err.message)
          return
        }
        toastr.success('Locate the confirmation email (subject: "Activation mail for Shifter") to verify.', 'Activation Email Sent')
      });
    }

    resendActivationMail(e) {
      swal({
        title: "Resent Activation?",
        text: 'We will send an activation email to (' + self.email + ').<br/> Please, follow the instruciton within to verify.',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2d69",
        confirmButtonText: "Send",
        closeOnConfirm: true,
        html: true
      }, function () {
        cognitoUser.getAttributeVerificationCode('email', {
          onSuccess: function (result) {},
          onFailure: function(err) {},
          inputVerificationCode: function() {}
        });
      })
    }

    this.on('mount', function() {
      $(document).ready(function(){
        loading()
      })
    })

    function getAccountInfomation() {
      var account = {
        email: '',
        username: ''
      }

      return new Promise(function(resolve, reject) {
        cognitoUser.getUserAttributes(function(err, result) {
          if (err) {
            reject(err)
          }

          for (i = 0; i < result.length; i++) {
            if (result[i].getName() === 'email') {
              account.email = result[i].getValue()
            }
          }

          account.username = cognitoUser.username
          resolve(account)
        })
      })
    }

    </script>
</account>
