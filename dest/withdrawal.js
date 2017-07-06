riot.tag2('withdrawal', '<div class="panel-body"> <form class="form-horizontal"> <div> <h2 class="page-header">Delete your account</h2> <p>I understand that by clicking this delete account button, I am willing to close my Shifter account.</p> <p>Monthly fee of Shifter services is calculated and billed at the beginning of the following month.</p> <p>If you have used the services this month, then at the beginning of next month you will receive a bill for usage that occurred prior to termination of your account. </p> </div> <div class="form-group"> <label class="col-lg-2 control-label"></label> <div class="col-lg-10"> <button id="btnDeleteAccount" class="btn btn-large btn-danger pull-left m-t-n-xs" type="button" data-style="expand-right" onclick="{deleteAccount}"><strong>Delete account</strong></button> </div> </div> </form> </div>', '', '', function(opts) {
    var self  = this

    init().then(function() {
      return getAccountInfomation()
    }).then(function(data){
      self.username = data.username
      self.update()
    }).then(function(){
      display()
    }).catch(function(error){
      console.log(error)
      switch(error.statusCode) {
        case 401:
          riot.route('/')
          break
      }
    })
    this.deleteAccount = function(e) {
      var btn = $( '#btnDeleteAccount' ).ladda()
      btn.ladda( 'start' )
      swal({
        title: "Are you sure?",
        text: "This action cannot be undone. ",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2d69",
        confirmButtonText: "Delete My Account",
        closeOnConfirm: true
      }, function () {
        del(endpoint.accounts+self.username).then(function(response){
          self.update()
          cognitoUser.signOut()
          if (sessionRefrashProvider !== undefined) {
            clearInterval(sessionRefrashProvider)
          }
          btn.ladda('stop')
          riot.route('/')
          swal({
            title: "Your account deleted",
            text: "Thank you for using our service.<br/>Your public site will be deleted whithin 60 minutes completely.",
            html: true
          })
        })
      })
    }.bind(this)
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
});
