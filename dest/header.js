riot.tag2('commonheader', '<div class="row border-bottom"> <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0"> <div class="navbar-header"> <a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="javascript:void(0);"><i class="fa fa-bars"></i> </a> </div> <ul class="nav navbar-top-links navbar-right"> <li> <span class="m-r-sm text-muted welcome-message">Hello, {username}</span> </li> <li> <a onclick="{logout}" href="javascript:void(0);"> <i class="fa fa-sign-out"></i> Logout </a> </li> </ul> </nav> <div if="{maintenance.status !== \'not_maintenance\'}" class="row"> <div class="col-lg-12"> <div class="alert alert-warning"> <p>{maintenance.message}</p> </div> </div> </div> <div if="{userStatus.creditCardStatus !== \'registered\'}" class="row"> <div class="col-lg-12"> <div class="alert alert-warning"> <p>Please add your credit card information. Before creating your project, we need to verify credit card information. This ensures that you&apos;re a real person and helps prevent fraud and abuse.</p> </div> </div> </div> </div>', '', '', function(opts) {
  if ( cognitoUser ) {
    this.username = cognitoUser.username
  }

  this.logout = function(e) {
    cognitoUser.signOut()
    if (sessionRefrashProvider !== undefined) {
      clearInterval(sessionRefrashProvider)
    }
    riot.route('/')
  }.bind(this)
});
