riot.tag2('not-found', '<div class="middle-box text-center animated fadeInDown"> <h1>404</h1> <h3 class="font-bold">Page Not Found</h3> <div class="error-desc"> That page you\'re looing for isn\'t here. Don\'t panic. It may have moved or never existed. <a href="https://getshifter.zendesk.com/hc/en-us">Maybe we can help?</a> <form class="form-inline m-t" role="form"> <a href="/" class="btn btn-primary">Back to dashbord</a> <form> </div> </div>', '', '', function(opts) {
    this.on('mount', function() {
      $('body').addClass('gray-bg')
    })
});

riot.tag2('account', '<div id="wrapper"> <sidebar></sidebar> <div id="page-wrapper" class="gray-bg"> <commonheader></commonheader> <div class="row wrapper border-bottom white-bg page-heading"> <div class="col-sm-4"> <h2>Account</h2> <ol class="breadcrumb"> <li> <a href="/">Home</a> </li> <li class="active"> <strong>Account</strong> </li> </ol> </div> </div> <div class="row"> <div class="spiner-example hidden" id="loading" style="height: 66px;"> <div class="sk-spinner sk-spinner-three-bounce"> <div class="sk-bounce1"></div> <div class="sk-bounce2"></div> <div class="sk-bounce3"></div> </div> </div> </div> <div class="row"> <div class="col-lg-12"> <div id="main_box" class="wrapper wrapper-content animated fadeInUp hidden"> <div class="tabs-container"> <ul class="nav nav-tabs"> <li class="active"><a data-toggle="tab" href="#account-infomation" aria-expanded="true"> Account Infomation</a></li> <li class=""><a data-toggle="tab" href="#change-password" aria-expanded="false"> Change Password</a></li> <li class=""><a data-toggle="tab" href="#withdrawal" aria-expanded="false"> Delete account</a></li> </ul> <div class="tab-content"> <div id="account-infomation" class="tab-pane active"> <div class="panel-body"> <form class="form-horizontal"> <div class="form-group"> <label class="col-lg-2 control-label">User ID</label> <div class="col-lg-10"> <input type="text" class="form-control" value="{username}" readonly="readonly"> </div> </div> <div class="form-group"> <label class="col-lg-2 control-label">Email</label> <div class="col-lg-10"> <input id="myemail" class="form-control" value="{email}" type="{\'email\'}"> </div> </div> <div class="form-group"> <label class="col-lg-2 control-label"></label> <div class="col-lg-10"> <button id="btnChangeAccountInfomation" class="ladda-button ladda-button-demo btn btn-sm btn-primary pull-left m-t-n-xs" type="button" data-style="expand-right" onclick="{changeAccountInfomation}"><strong>Submit</strong></button> <button id="btnResendActivationMail" class="ladda-button ladda-button-demo btn btn-sm btn-default pull-left m-t-n-xs" type="button" data-style="expand-right" onclick="{resendActivationMail}" style="margin-left:7px;"><strong>Resend Activation Mail</strong></button> </div> </div> </form> </div> </div> <div id="change-password" class="tab-pane"> <div class="panel-body"> <form class="form-horizontal"> <div class="form-group"> <label class="col-lg-2 control-label">Old Password</label> <div class="col-lg-10"> <input id="oldpassword" type="password" class="form-control"> </div> </div> <div class="form-group"> <label class="col-lg-2 control-label">New Password</label> <div class="col-lg-10"> <input id="newpassword" type="password" class="form-control"> </div> </div> <div class="form-group"> <label class="col-lg-2 control-label"></label> <div class="col-lg-10"> <button id="btnChangePassword" class="ladda-button ladda-button-demo btn btn-sm btn-primary pull-left m-t-n-xs" type="button" data-style="expand-right" onclick="{changePassword}"><strong>Submit</strong></button> </div> </div> </form> </div> </div> <div id="withdrawal" class="tab-pane"> <withdrawal> </div> </div> </div> </div> </div> </div> </div> </div> <init></init>', '', '', function(opts) {
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

    this.changePassword = function(e) {
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
    }.bind(this)

    this.changeAccountInfomation = function(e) {
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
    }.bind(this)

    this.resendActivationMail = function(e) {
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
    }.bind(this)

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

});

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

riot.tag2('archive-tool', '<div id="wrapper"> <sidebar></sidebar> <div id="page-wrapper" class="gray-bg"> <commonheader></commonheader> <div class="row wrapper border-bottom white-bg page-heading"> <div class="col-lg-10"> <h2>Import Tool</h2> <ol class="breadcrumb"> <li> <a href="/">Home</a> </li> <li class="active"> <strong>Archive Tool</strong> </li> </ol> </div> <div class="col-lg-2"> </div> </div> <div class="wrapper wrapper-content"> <div class="row animated fadeInRight"> <div class="col-lg-12"> <div class="ibox float-e-margins"> <div class="ibox-content" id="ibox-content"> <div id="vertical-timeline" class="vertical-container light-timeline"> <div class="vertical-timeline-block"> <div class="vertical-timeline-icon navy-bg"> <i class="fa fa-folder"></i> </div> <div class="vertical-timeline-content"> <h2>Step 1: Create a directory or a folder named <strong>wordpress</strong>.</h2> <p>For help, download our sample <a download href="https://github.com/getshifter/go-create-shifter-package/archive/master.zip" title="download and extract, then overwrite it with your files!">wordpress.zip file</a> to extract and replace with your files and folders. <br>It contains the required <strong>wordpress folder</strong>, <strong>wp.sql</strong> and <strong>latest WordPess Core files</strong>.</p> <span class="vertical-date"> <img src="img/howto/img-01.png" width="50%" height="50%"> </span> </div> </div> <div class="vertical-timeline-block"> <div class="vertical-timeline-icon navy-bg"> <i class="fa fa-cloud-download"></i> </div> <div class="vertical-timeline-content"> <h2>Step 2: Download <stong>Create Shifter Package</stong></h2> <ul> <li><a href="https://github.com/getshifter/go-create-shifter-package/releases/latest" target="_blank">Windows</a></li> <li><a href="https://github.com/getshifter/go-create-shifter-package/releases/latest" target="_blank">MacOSX</a></li> </ul> <span class="vertical-date"> <img src="img/howto/img-02.png" width="50%" height="50%"> <br> </span> </div> </div> <div class="vertical-timeline-block"> <div class="vertical-timeline-icon navy-bg"> <i class="fa fa-level-down"></i> </div> <div class="vertical-timeline-content"> <h2>Step 3: Put <strong>create-shifter-package</strong> into <strong>wordpress</strong> folder</h2> <p></p> <span class="vertical-date"> <img src="img/howto/img-03.png" width="50%" height="50%"> </span> </div> </div> <div class="vertical-timeline-block"> <div class="vertical-timeline-icon navy-bg"> <i class="fa fa-cloud-download"></i> </div> <div class="vertical-timeline-content"> <h2>Step 4: Get your WordPress Database file (SQL file)</h2> <p>Download database file (SQL file) through phpMyAdmin or wp-cli.<br> If you are not sure how to download SQL file from your server through phpMyAdmin or wp-cli, contact your hosting company&#8217;s support desk.</p> <p>Download file should be non-compressed text file. Simply download <strong>.sql</strong> file without compress it.</p> <span class="vertical-date"><img src="img/howto/img-04.png" width="50%" height="50% /"></span> </div> </div> <div class="vertical-timeline-block"> <div class="vertical-timeline-icon navy-bg"> <i class="fa fa-edit"></i> </div> <div class="vertical-timeline-content"> <h2>Step 5: Rename downloaded SQL file to <strong>wp.sql</strong></h2> <p><img src="img/howto/img-06.png" width="50%" height="50% /"></p> <span class="vertical-date"> <img src="img/howto/img-07.png" width="50%" height="50% /"></span> </div> </div> <div class="vertical-timeline-block"> <div class="vertical-timeline-icon navy-bg"> <i class="fa fa-level-down"></i> </div> <div class="vertical-timeline-content"> <h2>Step 6: Put renamed **wp.sql** file into **wordpress**;</h2> <span class="vertical-date"><img src="img/howto/img-09.png" width="50%" height="50% /"></span> </div> </div> <div class="vertical-timeline-block"> <div class="vertical-timeline-icon navy-bg"> <i class="fa fa-terminal"></i> </div> <div class="vertical-timeline-content"> <h2>Step 7: Get all of your WordPress&#8217; files</h2> <p>Connect to your server through FTP, SFTP, SSH or file browser on cPanel on your hosting.<br>Please contact your hosting company&#8217;s support desk, if you are not sure how to download files from your server through FTP/SFTP or SSH.</p> <p>You may required User ID, Password (or key file), FTP/SFTP/SSH server name, when you connect to the server.</p> <span class="vertical-date"></span> </div> </div> <div class="vertical-timeline-block"> <div class="vertical-timeline-icon navy-bg"> <i class="fa fa-cloud-download"></i> </div> <div class="vertical-timeline-content"> <h2>Step 8: Download your website folder</h2> <p>Your website contains wp-config.php file, wp-admin folder, wp-content folder and any other files or folders of WordPress core.</p> <p><img src="img/howto/img-10.png" width="50%" height="50% /"></p> <span class="vertical-date"><img src="img/howto/img-11.png" width="50%" height="50% /"></span> </div> </div> <div class="vertical-timeline-block"> <div class="vertical-timeline-icon navy-bg"> <i class="fa fa-edit"></i> </div> <div class="vertical-timeline-content"> <h2>Step 9: Rename downloaded WordPress folder to <strong>webroot</strong>.</h2> <p><img src="img/howto/img-13.png" width="50%" height="50% /"></p> <span class="vertical-date"><img src="img/howto/img-14.png" width="50%" height="50% /"></span> </div> </div> <div class="vertical-timeline-block"> <div class="vertical-timeline-icon navy-bg"> <i class="fa fa-level-down"></i> </div> <div class="vertical-timeline-content"> <h2>Step 10: Put renamed <strong>webroot</strong> folder into <strong>wordpress</strong> folder</h2> <p><img src="img/howto/img-15.png" width="50%" height="50% /"></p> <span class="vertical-date"><img src="img/howto/img-16.png" width="50%" height="50% /"></span> </div> </div> <div class="vertical-timeline-block"> <div class="vertical-timeline-icon navy-bg"> <i class="fa fa-check-square-o"></i> </div> <div class="vertical-timeline-content"> <h2>Step 11: Check files and folders</h2> <p>When you open <strong>wordpress</strong> folder, you will see downloaded and renamed folder and files in it. Like the following tree:</p> <pre><code>wordpress (created folder)\n   ├── create-shifter-package\n   ├── wp.sql (Downloaded and renamed WordPress&#8217; database file)\n   └── webroot (Downloaded and renamed WordPress&#8217; folder)\n           ├── index.php\n           ├── license.txt\n           ├── local-config.php\n           ├── local-salt.php\n           ├── readme.html\n           ├── wp-activate.php\n           ├── wp-admin\n           ├── wp-blog-header.php\n           ├── wp-comments-post.php\n           ├── wp-config-sample.php\n           ├── wp-config.php\n           ├── wp-content\n           ├── wp-cron.php\n           ├── wp-includes\n           ├── wp-links-opml.php\n           ├── wp-load.php\n           ├── wp-login.php\n           ├── wp-mail.php\n           ├── wp-settings.php\n           ├── wp-signup.php\n           ├── wp-trackback.php\n           └── xmlrpc.php</code></pre> <span class="vertical-date"><img src="img/howto/img-16-2.png" width="50%" height="50% /"></span> </div> </div> <div class="vertical-timeline-block"> <div class="vertical-timeline-icon navy-bg"> <i class="fa fa-terminal"></i> </div> <div class="vertical-timeline-content"> <h2>Step 12: Create Shifter Package</h2> <p>Double click the <strong>create-shifter-package</strong> to create the shifter package</p> <span class="vertical-date"><img src="img/howto/img-17.png" width="50%" height="50% /"></span> </div> </div> <div class="vertical-timeline-block"> <div class="vertical-timeline-icon navy-bg"> <i class="fa fa-check-square-o"></i> </div> <div class="vertical-timeline-content"> <h2>Step 13: Shifter Package: wordpress.zip is created</h2> <p><strong>create-shifter-package</strong> creates zip archive: <strong>wordpress.zip</strong> which contains <strong>wp.sql</strong> and <strong>webroot</strong>.</p> <span class="vertical-date"><img src="img/howto/img-21.png" width="50%" height="50% /"></span> </div> </div> <div class="vertical-timeline-block"> <div class="vertical-timeline-icon navy-bg"> <i class="fa fa-cloud-upload"></i> </div> <div class="vertical-timeline-content"> <h2>Upload <strong>wordpress.zip</strong> file to the Shifter from dashboard of the Shifter</h2> <span class="vertical-date"><img src="img/howto/img-22.png" width="50%" height="50% /"></span> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> <init></init>', '', '', function(opts) {
      this.on('mount', function(){
        $(document).ready(function(){

            $('#lightVersion').click(function(event) {
                event.preventDefault()
                $('#ibox-content').removeClass('ibox-content');
                $('#vertical-timeline').removeClass('dark-timeline');
                $('#vertical-timeline').addClass('light-timeline');
            });

            $('#darkVersion').click(function(event) {
                event.preventDefault()
                $('#ibox-content').addClass('ibox-content');
                $('#vertical-timeline').removeClass('light-timeline');
                $('#vertical-timeline').addClass('dark-timeline');
            });

            $('#leftVersion').click(function(event) {
                event.preventDefault()
                $('#vertical-timeline').toggleClass('center-orientation');
            });

        });
      })
});

riot.tag2('archive', '<div id="wrapper"> <sidebar></sidebar> <div id="page-wrapper" class="gray-bg"> <commonheader></commonheader> <div class="row wrapper border-bottom white-bg page-heading"> <div class="col-sm-4"> <h2>Archive</h2> <ol class="breadcrumb"> <li> <a href="/">Home</a> </li> <li class="active"> <strong>Archive List</strong> </li> </ol> </div> </div> <div class="row"> <div class="spiner-example hidden" id="loading" style="height: 66px;"> <div class="sk-spinner sk-spinner-three-bounce"> <div class="sk-bounce1"></div> <div class="sk-bounce2"></div> <div class="sk-bounce3"></div> </div> </div> </div> <div class="row"> <div class="col-lg-12"> <div id="main_box" class="wrapper wrapper-content animated fadeInUp hidden"> <div class="ibox"> <div class="ibox-title"> <h5>Archive List</h5> <div class="ibox-tools"> <a id="import_new_file_dummy" href="" class="btn btn-primary btn-xs" if="{items.length < userStatus.upperLimitArchives}" onclick="{notifyUnregistedCreditCard}" show="{creditCardStatus !== \'registered\'}">Upload New Archive</a> <a id="import_new_file" href="" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#media_uploader" if="{items.length < userStatus.upperLimitArchives}" show="{creditCardStatus === \'registered\'}">Upload New Archive</a> </div> </div> <div if="{items.length <= 0 && public_items.length <= 0}" class="ibox-content"> <div class="alert alert-danger alert-dismissable"> No file to archive. </div> </div> <div if="{items.length >= userStatus.upperLimitArchives}" class="ibox-content"> <div class="alert alert-success alert-dismissable"> The projects and archived projects are up to {userStatus.upperLimitArchives}, if you need more, <a href="https://getshifter.zendesk.com/hc/en-us/requests/new" target="_blank">submit a higher limit request</a>. </div> </div> <div if="{items.length > 0 || public_items.length > 0}" class="ibox-content col-lg-12"> <div class="project-list"> <div class="col-lg-2"> <strong>Public images</strong> </div> <div class="col-lg-10"> <table class="table table-hover"> <thead> <tr class="something"> <th class="col-md-6">Name</th> <th class="col-md-2">Owner</th> <th class="col-md-2"></th> <th class="col-md-5">Action</th> </tr> </thead> <tbody> <tr each="{public_item, i in public_items}"> <td> {public_item.archive_alias} </td> <td> {public_item.archive_owner} </td> <td></td> <td class="text-left"> <div class="tooltip-demo"> <a if="{maintenance.status !== \'now_maintenance\' || maintenance.target.indexOf(\'container\') < 0}" href="/#project_new/{public_item.archive_id}" class="btn btn-white btn-xs" data-toggle="tooltip" data-placement="bottom" title="Create New Project" data-original-title="Create New Project"> <i class="fa fa-plus-square"></i> </a> </div> </td> </tr> </tbody> </table> </div> <div class="col-lg-2"> <strong>User Archives</strong> </div> <div class="col-lg-10"> <table class="table table-hover"> <thead> <tr class="something"> <th class="col-md-6">Name</th> <th class="col-md-2">Owner</th> <th class="col-md-2">Uploaded Date</th> <th class="col-md-5">Action</th> </tr> </thead> <tbody> <tr each="{item, i in items}"> <td> <a href="#" class="archive_alias" data-type="text" data-pk="{item.archive_id}" data-url="{archive_endpoint +  item.archive_id}" data-title="Enter {item.archive_alias}">{item.archive_alias}</a> </td> <td> {item.archive_owner} </td> <td> {item.archive_create_date} </td> <td class="text-left"> <div class="tooltip-demo"> <a if="{maintenance.status !== \'now_maintenance\' || maintenance.target.indexOf(\'container\') < 0}" href="/#project_new/{item.archive_id}" class="btn btn-white btn-xs" data-toggle="tooltip" data-placement="bottom" title="Create New Project" data-original-title="Create New Project"> <i class="fa fa-plus-square"></i> </a> <a class="btn btn-white btn-xs " data-toggle="tooltip" data-placement="bottom" title="Download File" data-original-title="Download File" href="{downloads[item.archive_id]}"> <i class="fa fa-download"></i> <a class="btn btn-white btn-xs delete_archive" data-toggle="tooltip" data-placement="bottom" title="Delete Files" data-original-title="Delete Files" data-index="{i}" data-archive_id="{item.archive_id}" onclick="{delete_archive}"> <i class="fa fa-trash-o" data-index="{i}" data-archive_id="{item.archive_id}" onclick="{delete_archive}"></i> </a> </div> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> </div> </div> </div> <div class="modal inmodal fade" id="media_uploader" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> <h2>Upload your archive</h2> </div> <div class="modal-body"> <form id="my-awesome-dropzone" class="dropzone"> <div class="dropzone-previews"></div> </form> </div> </div> </div> </div> <init></init> <dropzone></dropzone>', '', '', function(opts) {
    this.items        = []
    this.downloads    = {}
    this.public_items = []
    this.preSignedUrl
    this.archive_endpoint = endpoint.archives
    var username
    var preSignedUrl
    var self = this

    toastr.options = {
      "closeButton": true,
      "debug": false,
      "progressBar": false,
      "preventDuplicates": false,
      "positionClass": "toast-bottom-right",
      "onclick": null,
      "showDuration": "400",
      "hideDuration": "1000",
      "timeOut": "7000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }

    var ajaxRequest = {
      getPublicArchive: function getPublicArchive() {
        return get(endpoint.archives + '?task=getPublicArchive').then(function(response) {
          response.body.forEach(function(item, i){
            if ( !Object.keys(response.body).length ) {
              return
            }

            var pub_data = {
              archive_id:item.archive_id,
              archive_alias:item.archive_alias,
              archive_owner:item.archive_owner,
              archive_create_date:moment(item.archive_create_date).format('MMM Do YYYY, h:mm:ss a')
            }
            self.public_items.push(pub_data)
          })
        })
      },
      getArchive: function getArchive() {
        return get(endpoint.archives).then(function(response) {
          if ( !Object.keys(response.body).length ) {
            return
          }

          response.body.forEach(function(item, i){
            var data = {
              archive_id:item.archive_id,
              archive_alias:item.archive_alias,
              archive_owner:item.archive_owner,
              archive_create_date:moment(item.archive_create_date).format('MMM Do YYYY, h:mm:ss a')
            }
            self.items.push(data)
          })
        })
      },
      getDownloadUrls: function getDownloadUrls() {
        return get(endpoint.archives + '?task=getDownloadUrl').then(function(response) {
          if ( !Object.keys(response.body).length ) {
            return
          }

          response.body.forEach(function(item, i){
            self.downloads[item.archive_id] = item.url
          })
        })
      }
    }

    function main() {
      return Promise.all([
        ajaxRequest.getPublicArchive(),
        ajaxRequest.getArchive(),
        ajaxRequest.getDownloadUrls()
      ])
    }

    init().then(function() {
      self.creditCardStatus = userStatus.creditCardStatus
      return main()
    }).then(function (value) {
      display()
      self.update()
      editable('.archive_alias')
    }).catch(function(error){
      switch(error.statusCode) {
        case 401:
          riot.route('/')
          break
      }
    })

    this.moveToBillingPage = function() {
        $('#media_uploader').modal('hide')
        riot.route('/billing')
    }.bind(this)

    this.delete_archive = function(e) {
      swal({
        title: "Would you like to proceed?",
        text: "Delete your archive. This operation cannot be undone.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2d69",
        confirmButtonText: "Yes, delete it",
        closeOnConfirm: true
      }, function () {
        toastr.options.positionClass = "toast-bottom-right"
        del(endpoint.archives + e.target.dataset.archive_id).then(function(response){
          self.items.splice(e.target.dataset.index, 1)
          self.update()
          toastr.success('Delete the archive file.','')
        }).catch(function(error){
          toastr.warning('Unknown error occurred.','')
          return
        })
      })
    }.bind(this)

    this.on('mount', function(){
      Dropzone.autoDiscover = false

      $(document).ready(function(){
        var uuid = createUUID()
        get(endpoint.archives + '?task=getPreSignedUrl&key='+uuid).then(function(response) {
          self.preSignedUrl = response.body.url
          $("#my-awesome-dropzone").dropzone({
            url: self.preSignedUrl,
            method: "put",
            autoProcessQueue: true,
            maxFiles: 1,
            maxFilesize: 102400,
            sending: function(file, xhr) {
              var _send = xhr.send;
              xhr.send = function() {
                _send.call(xhr, file);
              }
            },
            acceptedFiles: 'application/zip',
            headers: {
             "Content-Type": "application/zip",
            },
            success:function(_file, _return, _xml){
              var dropzone = this
              toastr.options.positionClass = "toast-bottom-right"
              post(endpoint.archives + uuid).then(function(response) {
                if (response.body.errorMessage) {
                  $('#media_uploader').modal('hide')
                  dropzone.removeFile(_file)
                  return Promise.reject(response.body)
                }
                var data = {
                  archive_id:response.body.archive_id,
                  archive_alias:response.body.archive_alias,
                  archive_owner:response.body.archive_owner,
                  archive_create_date:moment(response.body.archive_create_date).format('MMM Do YYYY, h:mm:ss a')
                }
                $('#media_uploader').modal('hide')
                dropzone.removeFile(_file)
                self.items.unshift(data)
                self.update()
                editable('.archive_alias')
                toastr.success('Select a file from Archive List to create new project.','Upload completed.')
                uuid = createUUID()

                return get(endpoint.archives + '?task=getPreSignedUrl&key='+uuid)
              }).then(function(response) {
                dropzone.options.url = response.body.url
                return ajaxRequest.getDownloadUrls()
              }).then(function() {
                self.update()
              }).catch(function(error){
                toastr.warning(error.errorMessage, 'unknown error occurred.')
                return
              })
            }
          })
        }).catch(function(error){
          toastr.warning('Unknown error occurred.','')
          return
        })

        loading()

      })
    })

    function createUUID() {
      var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      };
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4() +S4());
    }
});

riot.tag2('billingalert', '<div class="panel-body"> <p hide="{opts.account.cardLast4Digits}">Regist your credit card first.</p> <div class="col-lg-12" show="{opts.account.cardLast4Digits}"> <div class="panel-group coupon" id="accordion"> <div class="panel panel-default"> <div class="panel-heading"> <h5 class="panel-title"> <span>Billing Alert</span> </h5> </div> <div id="collapseTwo" class="panel-collapse collapse in"> <div class="panel-body"> <form role="form" id="payment-form"> <div class="row"> <div class="col-xs-12"> <div class="form-group"> <label>Monthly Cost</label> <div class="input-group"> <span class="input-group-addon">$</span> <input id="alert_price" type="text" class="form-control" name="Number" placeholder="100" value="{billingalert.billingAlertPrice}" required> </div> </div> </div> </div> <div class="row"> <div class="col-xs-12"> <button id="btnRegistBillingAlert" class="ladda-button ladda-button-demo btn btn-primary" data-style="expand-right" type="submit" onclick="{regist_alert}">Register Cost Alert</button> </div> </div> </form> </div> </div> </div> </div> </div> </div>', '', '', function(opts) {
    this.account = {}
    var self = this
    init().then(function() {
        return getBillingAlertData()
    }).then(function(data){
        self.billingalert = data
        self.update()
        display()
    }).catch(function(err){
        console.log(err)
        switch(err.statusCode) {
          case 401:
            riot.route('/')
            break
        }
    })

    function getBillingAlertData() {
      var billingalert = {}

      return new Promise(function(resolve, reject) {
        cognitoUser.getUserAttributes(function(err, result) {
          if (err) {
            reject(err)
          }

          for (i = 0; i < result.length; i++) {
            if (result[i].getName() === 'custom:billingAlertPrice') {
              billingalert.billingAlertPrice = result[i].getValue()
            }
          }
          resolve(billingalert)
        })
      })
    }

    this.regist_alert = function(e) {
        var btn = $( '#btnRegistBillingAlert' ).ladda()
        btn.ladda( 'start' )
        var attributeList = [];
        var attribute = {
          Name : 'custom:billingAlertPrice',
          Value : self.alert_price.value
        };

        var attribute = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(attribute);
        attributeList.push(attribute);

        cognitoUser.updateAttributes(attributeList, function(err, result) {
            btn.ladda( 'stop' )
            if (err) {
                toastr.warning(err.message)
                return
            }
            toastr.success('Billing Alert updated !')
            self.billingalert = self.alert_price.value
            self.update()
            display()
        })
    }.bind(this)

    this.on('mount', function() {
        $(document).ready(function(){
            loading()
        })
    })
});

riot.tag2('billing', '<div id="wrapper"> <sidebar></sidebar> <div id="page-wrapper" class="gray-bg"> <commonheader></commonheader> <div class="row wrapper border-bottom white-bg page-heading"> <div class="col-lg-10"> <h2>Billing</h2> <ol class="breadcrumb"> <li> <a href="/#console">Home</a> </li> <li class="active"> <strong>Billing</strong> </li> </ol> </div> <div class="col-lg-2"> </div> </div> <div class="row"> <div class="spiner-example hidden" id="loading" style="height: 66px;"> <div class="sk-spinner sk-spinner-three-bounce"> <div class="sk-bounce1"></div> <div class="sk-bounce2"></div> <div class="sk-bounce3"></div> </div> </div> </div> <div id="main_box" class="wrapper wrapper-content animated fadeInRight hidden"> <div class="tabs-container"> <ul class="nav nav-tabs"> <li class="{detaultTabInvoiceState}"><a data-toggle="tab" href="#invoice" aria-expanded="true" class="{defaultTabActivateState}"> Invoice</a></li> <li class="{detaultTabPaymentState}"><a data-toggle="tab" href="#payment-method" aria-expanded="false"> Payment method</a></li> <li class=""><a data-toggle="tab" href="#coupon" aria-expanded="false" class="{defaultTabActivateState}"> Coupon</a></li> <li class=""><a data-toggle="tab" href="#alert" aria-expanded="false" class="{defaultTabActivateState}"> Billing Alert</a></li> </ul> <div class="tab-content"> <div id="invoice" class="tab-pane {detaultTabInvoiceState}"> <div class="panel-body"> <invoice invoice="{billing.data.invoice}"></invoice> </div> </div> <div id="payment-method" class="tab-pane {detaultTabPaymentState}"> <div class="panel-body"> <div class="panel-group" show="{billing.data.card}"> <div class="panel panel-default"> <div class="panel-heading"> <h5 class="panel-title">Registed Card </h5> </div> <div class="panel-body"> <div class="row"> <div class="col-md-2"> <i class="fa fa-cc-visa payment-icon-big text-success" show="{billing.data.card.brand == \'Visa\'}"></i> <i class="fa fa-cc-mastercard payment-icon-big text-warning" show="{billing.data.card.brand == \'MasterCard\'}"></i> <i class="fa fa-cc-amex payment-icon-big text-success" show="{billing.data.card.brand == ⁗American Express⁗}"></i> </div> <div class="col-md-8"> <h2 style="margin-top:0">{account.cardLast4Digits}</h2> <p><small> <strong>Expiry date:</strong> {billing.data.card.exp} </small> </p> </div> </div> </div> </div> </div> <div class="row"> <div class="col-lg-12"> <div class="panel-group payments-method" id="accordion"> <div class="panel panel-default"> <div class="panel-heading"> <div class="pull-right"> <i class="fa fa-cc-visa text-danger"></i> <i class="fa fa-cc-mastercard text-warning"></i> <i class="fa fa-cc-amex text-success"></i> </div> <h5 class="panel-title"> <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Credit Card</a> </h5> </div> <div id="collapseTwo" class="panel-collapse collapse in"> <div class="panel-body"> <div class="row"> <div class="col-md-12"> <p>To update your billing information, please update your information below.</p> <form role="form" id="payment-form"> <div class="row"> <div class="col-xs-12"> <div class="form-group"> <label>CARD NUMBER</label> <div class="input-group"> <input id="number" type="text" class="form-control" name="Number" placeholder="{account.cardLast4Digits || \'Valid Card Number\'}" required> <span class="input-group-addon"><i class="fa fa-credit-card"></i></span> </div> </div> </div> </div> <div class="row"> <div class="col-xs-7 col-md-7"> <div class="form-group"> <label>EXPIRATION DATE</label> <div id="cvc-row"> <input type="text" class="form-control cvc-child" id="mm" name="ExpiryMM" placeholder="MM" required> <span class="cvc-child">/</span> <input type="text" class="form-control cvc-child" id="yy" name="ExpiryYY" placeholder="YY" required> </div> </div> </div> <div class="col-xs-5 col-md-5 pull-right"> <div class="form-group"> <label>Card security code</label> <input id="cvv" type="text" class="form-control" name="CVV" placeholder="CVC/CVV/CID" required> </div> </div> </div> <div class="row"> <div class="col-xs-12"> <div class="form-group"> <label>NAME ON CARD</label> <input id="name" type="text" class="form-control" name="nameCard" placeholder="NAME AND SURNAME" required> </div> </div> </div> <div class="row"> <div class="col-xs-12"> <button id="btnUpdateBilling" class="ladda-button ladda-button-demo btn btn-primary" data-style="expand-right" type="submit" onclick="{update_payment}">Add Payment Method</button> </div> </div> </form> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> <div id="coupon" class="tab-pane"> <div class="panel-body" hide="{account.cardLast4Digits}"> <p>Regist your credit card first.</p> </div> <div class="panel-body" show="{account.cardLast4Digits}"> <coupon coupon="{billing.data.coupon}"></coupon> </div> </div> <div id="alert" class="tab-pane"> <billingalert account="{account}"></billingalert> </div> </div> </div> </div> </div> </div> <init></init>', '.cvc-child { display: inline-block; width: auto; } .tab-disabled { pointer-events : none; }', '', function(opts) {
    this.account = {}
    var self = this
    init().then(function() {
        if ( userStatus.creditCardStatus === 'registered' ) {
            self.detaultTabInvoiceState = 'active'
            self.detaultTabPaymentState = ''
            self.defaultTabActivateState = ''
        } else {
            self.detaultTabInvoiceState = ''
            self.detaultTabPaymentState = 'active'
            self.defaultTabActivateState = "tab-disabled"
        }
        return getBillingData()
    }).then(function(data){
        self.billing = data
        return getAccountInfomation()
    }).then(function(data){
        self.account = data
        self.update()
        display()
    }).catch(function(err){
        console.log(err)
        switch(err.statusCode) {
          case 401:
            riot.route('/')
            break
        }
    })
    this.update_payment = function(e) {
        var btn = $( '#btnUpdateBilling' ).ladda()
        btn.ladda( 'start' )
        var params = {
            is_test: true,
            card_cvv: self.cvv.value,
            card_owner: self.name.value,
            card_exp_month: self.mm.value,
            card_exp_year: self.yy.value,
            card_number: self.number.value
        }
        if (location.hostname === 'go.getshifter.io') {
            params.is_test = false
        }
        post(endpoint.billing, params).then(function(response){
            if ( response.body.errorMessage !== undefined ){
              return Promise.reject(response.body.errorMessage)
            }
            return getBillingData()
        }).then( function(data){
            self.billing = data
            userStatus.creditCardStatus = 'registered';
            self.update()
            display()
            toastr.success('Regster Successed!')
            btn.ladda('stop')
            return
        }).catch(function(error){
            console.log(error)
            toastr.warning(error,'')
            btn.ladda('stop')
            display()
            return
        })
    }.bind(this)
    function getBillingData() {
        if (location.hostname !== 'go.getshifter.io') {
            endpoint.billing += "?test=false"
        }
        var billing = {}
        return new Promise(function(resolve, reject) {
            get(endpoint.billing).then(function(response){
                if ( response.body.statusCode > 399 ) {
                    reject('Error')
                }
                billing.data = response.body.body
                if ( billing.data == undefined ) {
                    resolve(billing)
                }
                billing.data.invoice.date = moment(billing.data.invoice.date).format('MMM Do YYYY, h:mm:ss a')
                if ( billing.data.coupon != undefined) {
                    billing.data.coupon.created = moment(billing.data.coupon.created).format('MMM Do YYYY, h:mm:ss a')
                }
                if ( billing.data.invoice.discount != undefined) {
                    billing.data.invoice.discount.created = moment(billing.data.invoice.discount.created).format('MMM Do YYYY, h:mm:ss a')
                }
                if ( billing.data.invoice.lines.length > 0 ) {
                    for (var i = 0; i < billing.data.invoice.lines.length; i++) {
                        billing.data.invoice.lines[i].period.start = moment(billing.data.invoice.lines[i].period.start).format('MMM Do YYYY, h:mm:ss a')
                        billing.data.invoice.lines[i].period.end = moment(billing.data.invoice.lines[i].period.end).format('MMM Do YYYY, h:mm:ss a')
                    }
                }
                resolve(billing)
            }).catch(function(err){
                reject(err)
            })
        })
    }
    function getAccountInfomation() {
      var account = {}

      return new Promise(function(resolve, reject) {
        cognitoUser.getUserAttributes(function(err, result) {
          if (err) {
            reject(err)
          }

          for (i = 0; i < result.length; i++) {
            if (result[i].getName() === 'custom:cardLast4Digits') {
              account.cardLast4Digits = "**** **** **** " + result[i].getValue()
            }
          }
          resolve(account)
        })
      })
    }
    this.on('mount', function() {
        $(document).ready(function(){
            loading()
        })
    })
});

riot.tag2('currentcoupon', '<div class="col-lg-12"> <div class="panel-group coupon" id="accordion"> <div class="panel panel-default"> <div class="panel-heading"> <h5 class="panel-title"> <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Current Coupon</a> </h5> </div> <div id="collapseTwo" class="panel-collapse collapse in"> <div class="panel-body"> <div class="form-horizontal"> <div class="form-group"> <label class="col-lg-2 controle-label">Coupon Code</label> <div class="col-lg-10"> <input type="text" class="form-control" value="{opts.coupon.id}" readonly="readonly"> </div> </div> <div class="form-group"> <label class="col-lg-2 controle-label">Discount</label> <div class="col-lg-10"> <input type="text" class="form-control" value="{opts.coupon.amount_off}" readonly="readonly"> </div> </div> </div> </div> </div> </div> </div> </div>', '', '', function(opts) {
    this.items = []
    var self  = this
    self.update()
    display()
    this.on('mount', function() {
      $(document).ready(function(){
        loading()
      })
    })
});

riot.tag2('coupon', '<div class="row"> <currentcoupon if="{opts.coupon}" coupon="{opts.coupon}"></currentCoupon> <div class="col-lg-12"> <div class="panel-group coupon" id="accordion"> <div class="panel panel-default"> <div class="panel-heading"> <h5 class="panel-title"> <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo"> <span show="{opts.coupon}">Replace</span> <span hide="{opts.coupon}">Add New</span> <span> Coupon Code</span> </a> </h5> </div> <div id="collapseTwo" class="panel-collapse collapse in"> <div class="panel-body"> <div class="row"> <div class="col-md-12"> <p></p> <form role="form" id="payment-form"> <div class="row"> <div class="col-xs-12"> <div class="form-group"> <label>Coupon Code</label> <div class="input-group"> <input id="coupon_code" type="text" class="form-control" name="Number" placeholder="Valid Coupon Code" required> </div> </div> </div> </div> <div class="row"> <div class="col-xs-12"> <button id="btnAddCoupon" class="ladda-button ladda-button-demo btn btn-primary" data-style="expand-right" type="submit" onclick="{add_coupon}">Add Coupon</button> </div> </div> </form> </div> </div> </div> </div> </div> </div> </div> </div>', '', '', function(opts) {
    this.items = []
    var self  = this

    init().then(function(){
        self.update()
        display()
    }).catch(function(err){
        console.log(err)
        switch(err.statusCode) {
          case 401:
            riot.route('/')
            break
        }
    })

    this.add_coupon = function(e) {
        if (self.coupon_code.value === ''){
            toastr.warning('Coupon Code is required.','')
            return
        }
        var btn = $( '#btnAddCoupon' ).ladda()
        btn.ladda( 'start' )
        var params = {
            is_test: true
        }
        if (location.hostname === 'go.getshifter.io') {
            params.is_test = false
        }
        put(endpoint.coupon + self.coupon_code.value, params).then(function(response){
            if ( response.body.errorMessage !== undefined ){
              return Promise.reject(response.body.errorMessage)
            }
            toastr.success('Regster Successed!')
            btn.ladda('stop')
            self.update()
            display()
            return
        }).catch(function(error){
            console.log(error)
            toastr.warning(error,'')
            btn.ladda('stop')
            display()
            return
        })
    }.bind(this)

    this.on('mount', function() {
      $(document).ready(function(){
        loading()
      })
    })
});

riot.tag2('domains', '<div id="wrapper"> <sidebar></sidebar> <div id="page-wrapper" class="gray-bg"> <commonheader></commonheader> <div class="row wrapper border-bottom white-bg page-heading"> <div class="col-sm-4"> <h2>Domain</h2> <ol class="breadcrumb"> <li> <a href="/">Home</a> </li> <li class="active"> <strong>Domains List</strong> </li> </ol> </div> </div> <div class="row"> <div class="spiner-example hidden" id="loading" style="height: 66px;"> <div class="sk-spinner sk-spinner-three-bounce"> <div class="sk-bounce1"></div> <div class="sk-bounce2"></div> <div class="sk-bounce3"></div> </div> </div> </div> <div class="row"> <div class="col-lg-12"> <div id="main_box" class="wrapper wrapper-content animated fadeInUp hidden"> <div class="ibox"> <div class="ibox-title"> <h5>All Domains</h5> <div class="ibox-tools" if="{items.length < userStatus.upperLimitDomains}"> <button class="btn btn-primary btn-xs" show="{creditCardStatus !== \'registered\'}" onclick="{notifyUnregistedCreditCard}">Add New Domain</button> <button class="btn btn-primary btn-xs" data-toggle="modal" data-target="#add-new-domain" show="{creditCardStatus === \'registered\'}">Add New Domain</button> </div> </div> <div class="ibox-content"> <div if="{items.length <= 0}"> <div class="alert alert-success alert-dismissable"> No domain. Please add your domain(s). </div> </div> <div if="{items.length >= userStatus.upperLimitDomains}"> <div class="alert alert-success alert-dismissable"> You can add {userStatus.upperLimitDomains} domains. </div> </div> <div if="{items.length > 0}" class="project-list"> <table class="table table-hover"> <thead> <tr> <th>Name</th> <th>Status</th> <th>Register Date</th> <th>Project</th> <th class="text-right">Action</th> </tr> </thead> <tbody> <tr each="{item, i in items}"> <td> {item.domain} </td> <td> <span if="{item.status === \'ISSUED\'}" class="label label-primary">Valid</span> <span if="{item.status !== \'ISSUED\'}" class="label label-default">Invalid</span> </td> <td> {item.createdAt} </td> <td> <span if="{item.isCloudfront}" class="label label-primary">Attached</span> </td> <td class="text-right"> <button if="{item.status !== \'ISSUED\'}" data-domain="{item.domain}" data-index="{i}" data-validationemails="{item.validationEmails}" class="btn-white btn btn-xs" onclick="{respondApprovalMail}">Resend approval mail</button> <button if="{!item.isCloudfront}" data-domain="{item.domain}" data-index="{i}" class="btn-white btn btn-xs" onclick="{deleteDomain}">Delete Domain</button> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> </div> </div> <div class="modal inmodal" id="add-new-domain" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content animated bounceInRight"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> <h4 class="modal-title">Add New Domain</h4> </div> <div class="modal-body"> <p>To verify and assign a custom domain name, we\'ll send a conformation email to the administration associated with the WHOIS record of the domain.</p> <p>For example: (e.g. webmaster@example.com, or admin@example.com)</p> <p>After domain verification, it will be available on Shifter.</p> <p>For more help, check our <a href="https://getshifter.zendesk.com/hc/en-us/articles/236048507-How-to-assign-your-domain-to-the-project" target="_blank">how to guide</a>.</p> <div class="form-group"><label>Domain Name</label> <input type="text" id="yourdomain" placeholder="Enter your domain" class="form-control"></div> </div> <div class="modal-footer"> <button type="button" class="btn btn-white" data-dismiss="modal">Close</button> <button id="addNewDomain" type="button" class="btn btn-primary ladda-button ladda-button-demo" data-style="expand-right" onclick="{addNewDomain}">Save changes</button> </div> </div> </div> </div> <init></init>', '', '', function(opts) {
    this.items = []
    var self  = this

    init().then(function() {
      self.creditCardStatus = userStatus.creditCardStatus
      return get(endpoint.domains)
    }).then(function (response) {
      if ( response.body.Count > 0 ) {
        self.items = response.body.Items
        var domains = []
        self.items.forEach(function(item, i){
          domains.push(item.domain)
        })
        return Promise.all(domains.map(getDomainDetail))
      }
    }).then(function (response) {
      self.update()
      display()
    }).catch(function(error){
      switch(error.statusCode) {
        case 401:
          riot.route('/')
          break
      }
    })

    this.addNewDomain = function(e) {
      if ( self.creditCardStatus !== 'registered') {
          notifyUnregistedCreditCard()
          return false
      }
      var btn = $('#addNewDomain').ladda()
      btn.ladda('start')
      if (self.yourdomain.value !== '') {
        put(endpoint.domains+self.yourdomain.value).then(function(response) {
          if(response.body.statusCode === 201) {
            self.items.push({
              domain: self.yourdomain.value,
              status: 'INVALID'
            })
            return getDomainDetail(self.yourdomain.value, (self.items.length - 1))
          } else {
            return Promise.reject('error occurs')
          }
        }).then(function(){
          $('#add-new-domain').modal('hide')
          btn.ladda('stop')
          self.update()
          toastr.success('Add your domain and approval mail sent to you successfully','')
          return
        }).catch(function(error){
          $('#add-new-domain').modal('hide')
          btn.ladda('stop')
          toastr.warning(error)
          return
        })
      } else {
        $('#add-new-domain').modal('hide')
        btn.ladda('stop')
        toastr.warning('Please input your domain name')
        return
      }
    }.bind(this)

    this.respondApprovalMail = function(e) {
      var mails = e.target.dataset.validationemails.split(',')
      var mailsHtml = '<ul>'
      mails.forEach(function(domain, i){
        mailsHtml += '<li>'+domain+'</li>'
      })
      mailsHtml += '<ul>'

      swal({
        title: "Would you like to proceed?",
        text: "Clicking Yes, we re-send verification email to the following email addresses: "+mailsHtml,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2d69",
        confirmButtonText: "Yes",
        closeOnConfirm: true,
        html: true
      }, function () {
        post(endpoint.domains+e.target.dataset.domain, {action:'resendValidationEmail'}).then(function(response) {
          if(response.body.statusCode === 201) {
            toastr.success('verification mail sent successfully. Please verify it.','')
            self.update()
            return
          } else {
            return Promise.reject('error occurs')
          }
        }).catch(function(error){
          toastr.warning(error,'')
          return
        })
      })
    }.bind(this)

    this.deleteDomain = function(e) {
      swal({
        title: "Would you like to proceed?",
        text: "Delete domain. This operation cannot be undone.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2d69",
        confirmButtonText: "Yes, delete it",
        closeOnConfirm: true
      }, function () {
        del(endpoint.domains+e.target.dataset.domain, {action: 'deleteDomain'}).then(function(response) {
          if(response.body.statusCode === 201) {
            self.items.splice(e.target.dataset.index, 1)
            toastr.success('deleted successfully','')
            self.update()
            return
          } else {
            return Promise.reject('error occurs')
          }
        }).catch(function(error){
          toastr.warning(error,'')
          return
        })
      })
    }.bind(this)

    this.on('mount', function() {
      $(document).ready(function(){
        loading()
      })
    })

    function getDomainDetail(domain, index) {
      return get(endpoint.domains+domain).then(function(response) {
        if (response.body.errorMessage === undefined){
          self.items[index].status = response.body.Certificate.Status
          self.items[index].createdAt = moment(response.body.Certificate.CreatedAt).format('MMM Do YYYY, h:mm:ss a')
          self.items[index].validationEmails = response.body.Certificate.DomainValidationOptions[0].ValidationEmails.join(',')
          self.items[index].isCloudfront = response.body.Certificate.InUseBy.length > 0 ? true : false;
          return Promise.resolve(response)
        } else {
          return Promise.reject('error occurs')
        }
      }).catch(function(error){
        toastr.warning(error,'')
        return
      })
    }
});

riot.tag2('dropzone', '', '', '', function(opts) {
(function(){

    function require(name) {
        var module = require.modules[name];
        if (!module) throw new Error('failed to require "' + name + '"');

        if (!('exports' in module) && typeof module.definition === 'function') {
            module.client = module.component = true;
            module.definition.call(this, module.exports = {}, module);
            delete module.definition;
        }

        return module.exports;
    }

    require.modules = {};

    require.register = function (name, definition) {
        require.modules[name] = {
            definition: definition
        };
    };

    require.define = function (name, exports) {
        require.modules[name] = {
            exports: exports
        };
    };
    require.register("component~emitter@1.1.2", function (exports, module) {

        module.exports = Emitter;

        function Emitter(obj) {
            if (obj) return mixin(obj);
        };

        function mixin(obj) {
            for (var key in Emitter.prototype) {
                obj[key] = Emitter.prototype[key];
            }
            return obj;
        }

        Emitter.prototype.on =
            Emitter.prototype.addEventListener = function(event, fn){
                this._callbacks = this._callbacks || {};
                (this._callbacks[event] = this._callbacks[event] || [])
                    .push(fn);
                return this;
            };

        Emitter.prototype.once = function(event, fn){
            var self = this;
            this._callbacks = this._callbacks || {};

            function on() {
                self.off(event, on);
                fn.apply(this, arguments);
            }

            on.fn = fn;
            this.on(event, on);
            return this;
        };

        Emitter.prototype.off =
            Emitter.prototype.removeListener =
                Emitter.prototype.removeAllListeners =
                    Emitter.prototype.removeEventListener = function(event, fn){
                        this._callbacks = this._callbacks || {};

                        if (0 == arguments.length) {
                            this._callbacks = {};
                            return this;
                        }

                        var callbacks = this._callbacks[event];
                        if (!callbacks) return this;

                        if (1 == arguments.length) {
                            delete this._callbacks[event];
                            return this;
                        }

                        var cb;
                        for (var i = 0; i < callbacks.length; i++) {
                            cb = callbacks[i];
                            if (cb === fn || cb.fn === fn) {
                                callbacks.splice(i, 1);
                                break;
                            }
                        }
                        return this;
                    };

        Emitter.prototype.emit = function(event){
            this._callbacks = this._callbacks || {};
            var args = [].slice.call(arguments, 1)
                , callbacks = this._callbacks[event];

            if (callbacks) {
                callbacks = callbacks.slice(0);
                for (var i = 0, len = callbacks.length; i < len; ++i) {
                    callbacks[i].apply(this, args);
                }
            }

            return this;
        };

        Emitter.prototype.listeners = function(event){
            this._callbacks = this._callbacks || {};
            return this._callbacks[event] || [];
        };

        Emitter.prototype.hasListeners = function(event){
            return !! this.listeners(event).length;
        };

    });

    require.register("dropzone", function (exports, module) {

        module.exports = require("dropzone/lib/dropzone.js");

    });

    require.register("dropzone/lib/dropzone.js", function (exports, module) {

        (function() {
            var Dropzone, Em, camelize, contentLoaded, detectVerticalSquash, drawImageIOSFix, noop, without,
                __hasProp = {}.hasOwnProperty,
                __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
                __slice = [].slice;

            Em = typeof Emitter !== "undefined" && Emitter !== null ? Emitter : require("component~emitter@1.1.2");

            noop = function() {};

            Dropzone = (function(_super) {
                var extend;

                __extends(Dropzone, _super);

                Dropzone.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached"];

                Dropzone.prototype.defaultOptions = {
                    url: null,
                    method: "post",
                    withCredentials: false,
                    parallelUploads: 2,
                    uploadMultiple: false,
                    maxFilesize: 256,
                    paramName: "file",
                    createImageThumbnails: true,
                    maxThumbnailFilesize: 10,
                    thumbnailWidth: 100,
                    thumbnailHeight: 100,
                    maxFiles: null,
                    params: {},
                    clickable: true,
                    ignoreHiddenFiles: true,
                    acceptedFiles: null,
                    acceptedMimeTypes: null,
                    autoProcessQueue: true,
                    autoQueue: true,
                    addRemoveLinks: false,
                    previewsContainer: null,
                    dictDefaultMessage: "Drop files here to upload",
                    dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
                    dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
                    dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
                    dictInvalidFileType: "You can't upload files of this type.",
                    dictResponseError: "Server responded with {{statusCode}} code.",
                    dictCancelUpload: "Cancel upload",
                    dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
                    dictRemoveFile: "Remove file",
                    dictRemoveFileConfirmation: null,
                    dictMaxFilesExceeded: "You can not upload any more files.",
                    accept: function(file, done) {
                        return done();
                    },
                    init: function() {
                        return noop;
                    },
                    forceFallback: false,
                    fallback: function() {
                        var child, messageElement, span, _i, _len, _ref;
                        this.element.className = "" + this.element.className + " dz-browser-not-supported";
                        _ref = this.element.getElementsByTagName("div");
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            child = _ref[_i];
                            if (/(^| )dz-message($| )/.test(child.className)) {
                                messageElement = child;
                                child.className = "dz-message";
                                continue;
                            }
                        }
                        if (!messageElement) {
                            messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
                            this.element.appendChild(messageElement);
                        }
                        span = messageElement.getElementsByTagName("span")[0];
                        if (span) {
                            span.textContent = this.options.dictFallbackMessage;
                        }
                        return this.element.appendChild(this.getFallbackForm());
                    },
                    resize: function(file) {
                        var info, srcRatio, trgRatio;
                        info = {
                            srcX: 0,
                            srcY: 0,
                            srcWidth: file.width,
                            srcHeight: file.height
                        };
                        srcRatio = file.width / file.height;
                        trgRatio = this.options.thumbnailWidth / this.options.thumbnailHeight;
                        if (file.height < this.options.thumbnailHeight || file.width < this.options.thumbnailWidth) {
                            info.trgHeight = info.srcHeight;
                            info.trgWidth = info.srcWidth;
                        } else {
                            if (srcRatio > trgRatio) {
                                info.srcHeight = file.height;
                                info.srcWidth = info.srcHeight * trgRatio;
                            } else {
                                info.srcWidth = file.width;
                                info.srcHeight = info.srcWidth / trgRatio;
                            }
                        }
                        info.srcX = (file.width - info.srcWidth) / 2;
                        info.srcY = (file.height - info.srcHeight) / 2;
                        return info;
                    },

                    drop: function(e) {
                        return this.element.classList.remove("dz-drag-hover");
                    },
                    dragstart: noop,
                    dragend: function(e) {
                        return this.element.classList.remove("dz-drag-hover");
                    },
                    dragenter: function(e) {
                        return this.element.classList.add("dz-drag-hover");
                    },
                    dragover: function(e) {
                        return this.element.classList.add("dz-drag-hover");
                    },
                    dragleave: function(e) {
                        return this.element.classList.remove("dz-drag-hover");
                    },
                    paste: noop,
                    reset: function() {
                        return this.element.classList.remove("dz-started");
                    },
                    addedfile: function(file) {
                        var node, removeFileEvent, removeLink, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
                        if (this.element === this.previewsContainer) {
                            this.element.classList.add("dz-started");
                        }
                        file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
                        file.previewTemplate = file.previewElement;
                        this.previewsContainer.appendChild(file.previewElement);
                        _ref = file.previewElement.querySelectorAll("[data-dz-name]");
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            node = _ref[_i];
                            node.textContent = file.name;
                        }
                        _ref1 = file.previewElement.querySelectorAll("[data-dz-size]");
                        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                            node = _ref1[_j];
                            node.innerHTML = this.filesize(file.size);
                        }
                        if (this.options.addRemoveLinks) {
                            file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>" + this.options.dictRemoveFile + "</a>");
                            file.previewElement.appendChild(file._removeLink);
                        }
                        removeFileEvent = (function(_this) {
                            return function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                if (file.status === Dropzone.UPLOADING) {
                                    return Dropzone.confirm(_this.options.dictCancelUploadConfirmation, function() {
                                        return _this.removeFile(file);
                                    });
                                } else {
                                    if (_this.options.dictRemoveFileConfirmation) {
                                        return Dropzone.confirm(_this.options.dictRemoveFileConfirmation, function() {
                                            return _this.removeFile(file);
                                        });
                                    } else {
                                        return _this.removeFile(file);
                                    }
                                }
                            };
                        })(this);
                        _ref2 = file.previewElement.querySelectorAll("[data-dz-remove]");
                        _results = [];
                        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                            removeLink = _ref2[_k];
                            _results.push(removeLink.addEventListener("click", removeFileEvent));
                        }
                        return _results;
                    },
                    removedfile: function(file) {
                        var _ref;
                        if ((_ref = file.previewElement) != null) {
                            _ref.parentNode.removeChild(file.previewElement);
                        }
                        return this._updateMaxFilesReachedClass();
                    },
                    thumbnail: function(file, dataUrl) {
                        var thumbnailElement, _i, _len, _ref, _results;
                        file.previewElement.classList.remove("dz-file-preview");
                        file.previewElement.classList.add("dz-image-preview");
                        _ref = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            thumbnailElement = _ref[_i];
                            thumbnailElement.alt = file.name;
                            _results.push(thumbnailElement.src = dataUrl);
                        }
                        return _results;
                    },
                    error: function(file, message) {
                        var node, _i, _len, _ref, _results;
                        file.previewElement.classList.add("dz-error");
                        if (typeof message !== "String" && message.error) {
                            message = message.error;
                        }
                        _ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            node = _ref[_i];
                            _results.push(node.textContent = message);
                        }
                        return _results;
                    },
                    errormultiple: noop,
                    processing: function(file) {
                        file.previewElement.classList.add("dz-processing");
                        if (file._removeLink) {
                            return file._removeLink.textContent = this.options.dictCancelUpload;
                        }
                    },
                    processingmultiple: noop,
                    uploadprogress: function(file, progress, bytesSent) {
                        var node, _i, _len, _ref, _results;
                        _ref = file.previewElement.querySelectorAll("[data-dz-uploadprogress]");
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            node = _ref[_i];
                            _results.push(node.style.width = "" + progress + "%");
                        }
                        return _results;
                    },
                    totaluploadprogress: noop,
                    sending: noop,
                    sendingmultiple: noop,
                    success: function(file) {
                        return file.previewElement.classList.add("dz-success");
                    },
                    successmultiple: noop,
                    canceled: function(file) {
                        return this.emit("error", file, "Upload canceled.");
                    },
                    canceledmultiple: noop,
                    complete: function(file) {
                        if (file._removeLink) {
                            return file._removeLink.textContent = this.options.dictRemoveFile;
                        }
                    },
                    completemultiple: noop,
                    maxfilesexceeded: noop,
                    maxfilesreached: noop,
                    previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-success-mark\"><span>✔</span></div>\n  <div class=\"dz-error-mark\"><span>✘</span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"
                };

                extend = function() {
                    var key, object, objects, target, val, _i, _len;
                    target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                    for (_i = 0, _len = objects.length; _i < _len; _i++) {
                        object = objects[_i];
                        for (key in object) {
                            val = object[key];
                            target[key] = val;
                        }
                    }
                    return target;
                };

                function Dropzone(element, options) {
                    var elementOptions, fallback, _ref;
                    this.element = element;
                    this.version = Dropzone.version;
                    this.defaultOptions.previewTemplate = this.defaultOptions.previewTemplate.replace(/\n*/g, "");
                    this.clickableElements = [];
                    this.listeners = [];
                    this.files = [];
                    if (typeof this.element === "string") {
                        this.element = document.querySelector(this.element);
                    }
                    if (!(this.element && (this.element.nodeType != null))) {
                        throw new Error("Invalid dropzone element.");
                    }
                    if (this.element.dropzone) {
                        throw new Error("Dropzone already attached.");
                    }
                    Dropzone.instances.push(this);
                    this.element.dropzone = this;
                    elementOptions = (_ref = Dropzone.optionsForElement(this.element)) != null ? _ref : {};
                    this.options = extend({}, this.defaultOptions, elementOptions, options != null ? options : {});
                    if (this.options.forceFallback || !Dropzone.isBrowserSupported()) {
                        return this.options.fallback.call(this);
                    }
                    if (this.options.url == null) {
                        this.options.url = this.element.getAttribute("action");
                    }
                    if (!this.options.url) {
                        throw new Error("No URL provided.");
                    }
                    if (this.options.acceptedFiles && this.options.acceptedMimeTypes) {
                        throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
                    }
                    if (this.options.acceptedMimeTypes) {
                        this.options.acceptedFiles = this.options.acceptedMimeTypes;
                        delete this.options.acceptedMimeTypes;
                    }
                    this.options.method = this.options.method.toUpperCase();
                    if ((fallback = this.getExistingFallback()) && fallback.parentNode) {
                        fallback.parentNode.removeChild(fallback);
                    }
                    if (this.options.previewsContainer) {
                        this.previewsContainer = Dropzone.getElement(this.options.previewsContainer, "previewsContainer");
                    } else {
                        this.previewsContainer = this.element;
                    }
                    if (this.options.clickable) {
                        if (this.options.clickable === true) {
                            this.clickableElements = [this.element];
                        } else {
                            this.clickableElements = Dropzone.getElements(this.options.clickable, "clickable");
                        }
                    }
                    this.init();
                }

                Dropzone.prototype.getAcceptedFiles = function() {
                    var file, _i, _len, _ref, _results;
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (file.accepted) {
                            _results.push(file);
                        }
                    }
                    return _results;
                };

                Dropzone.prototype.getRejectedFiles = function() {
                    var file, _i, _len, _ref, _results;
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (!file.accepted) {
                            _results.push(file);
                        }
                    }
                    return _results;
                };

                Dropzone.prototype.getFilesWithStatus = function(status) {
                    var file, _i, _len, _ref, _results;
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (file.status === status) {
                            _results.push(file);
                        }
                    }
                    return _results;
                };

                Dropzone.prototype.getQueuedFiles = function() {
                    return this.getFilesWithStatus(Dropzone.QUEUED);
                };

                Dropzone.prototype.getUploadingFiles = function() {
                    return this.getFilesWithStatus(Dropzone.UPLOADING);
                };

                Dropzone.prototype.getActiveFiles = function() {
                    var file, _i, _len, _ref, _results;
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED) {
                            _results.push(file);
                        }
                    }
                    return _results;
                };

                Dropzone.prototype.init = function() {
                    var eventName, noPropagation, setupHiddenFileInput, _i, _len, _ref, _ref1;
                    if (this.element.tagName === "form") {
                        this.element.setAttribute("enctype", "multipart/form-data");
                    }
                    if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
                        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
                    }
                    if (this.clickableElements.length) {
                        setupHiddenFileInput = (function(_this) {
                            return function() {
                                if (_this.hiddenFileInput) {
                                    document.body.removeChild(_this.hiddenFileInput);
                                }
                                _this.hiddenFileInput = document.createElement("input");
                                _this.hiddenFileInput.setAttribute("type", "file");
                                if ((_this.options.maxFiles == null) || _this.options.maxFiles > 1) {
                                    _this.hiddenFileInput.setAttribute("multiple", "multiple");
                                }
                                _this.hiddenFileInput.className = "dz-hidden-input";
                                if (_this.options.acceptedFiles != null) {
                                    _this.hiddenFileInput.setAttribute("accept", _this.options.acceptedFiles);
                                }
                                _this.hiddenFileInput.style.visibility = "hidden";
                                _this.hiddenFileInput.style.position = "absolute";
                                _this.hiddenFileInput.style.top = "0";
                                _this.hiddenFileInput.style.left = "0";
                                _this.hiddenFileInput.style.height = "0";
                                _this.hiddenFileInput.style.width = "0";
                                document.body.appendChild(_this.hiddenFileInput);
                                return _this.hiddenFileInput.addEventListener("change", function() {
                                    var file, files, _i, _len;
                                    files = _this.hiddenFileInput.files;
                                    if (files.length) {
                                        for (_i = 0, _len = files.length; _i < _len; _i++) {
                                            file = files[_i];
                                            _this.addFile(file);
                                        }
                                    }
                                    return setupHiddenFileInput();
                                });
                            };
                        })(this);
                        setupHiddenFileInput();
                    }
                    this.URL = (_ref = window.URL) != null ? _ref : window.webkitURL;
                    _ref1 = this.events;
                    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                        eventName = _ref1[_i];
                        this.on(eventName, this.options[eventName]);
                    }
                    this.on("uploadprogress", (function(_this) {
                        return function() {
                            return _this.updateTotalUploadProgress();
                        };
                    })(this));
                    this.on("removedfile", (function(_this) {
                        return function() {
                            return _this.updateTotalUploadProgress();
                        };
                    })(this));
                    this.on("canceled", (function(_this) {
                        return function(file) {
                            return _this.emit("complete", file);
                        };
                    })(this));
                    this.on("complete", (function(_this) {
                        return function(file) {
                            if (_this.getUploadingFiles().length === 0 && _this.getQueuedFiles().length === 0) {
                                return setTimeout((function() {
                                    return _this.emit("queuecomplete");
                                }), 0);
                            }
                        };
                    })(this));
                    noPropagation = function(e) {
                        e.stopPropagation();
                        if (e.preventDefault) {
                            return e.preventDefault();
                        } else {
                            return e.returnValue = false;
                        }
                    };
                    this.listeners = [
                        {
                            element: this.element,
                            events: {
                                "dragstart": (function(_this) {
                                    return function(e) {
                                        return _this.emit("dragstart", e);
                                    };
                                })(this),
                                "dragenter": (function(_this) {
                                    return function(e) {
                                        noPropagation(e);
                                        return _this.emit("dragenter", e);
                                    };
                                })(this),
                                "dragover": (function(_this) {
                                    return function(e) {
                                        var efct;
                                        try {
                                            efct = e.dataTransfer.effectAllowed;
                                        } catch (_error) {}
                                        e.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';
                                        noPropagation(e);
                                        return _this.emit("dragover", e);
                                    };
                                })(this),
                                "dragleave": (function(_this) {
                                    return function(e) {
                                        return _this.emit("dragleave", e);
                                    };
                                })(this),
                                "drop": (function(_this) {
                                    return function(e) {
                                        noPropagation(e);
                                        return _this.drop(e);
                                    };
                                })(this),
                                "dragend": (function(_this) {
                                    return function(e) {
                                        return _this.emit("dragend", e);
                                    };
                                })(this)
                            }
                        }
                    ];
                    this.clickableElements.forEach((function(_this) {
                        return function(clickableElement) {
                            return _this.listeners.push({
                                element: clickableElement,
                                events: {
                                    "click": function(evt) {
                                        if ((clickableElement !== _this.element) || (evt.target === _this.element || Dropzone.elementInside(evt.target, _this.element.querySelector(".dz-message")))) {
                                            return _this.hiddenFileInput.click();
                                        }
                                    }
                                }
                            });
                        };
                    })(this));
                    this.enable();
                    return this.options.init.call(this);
                };

                Dropzone.prototype.destroy = function() {
                    var _ref;
                    this.disable();
                    this.removeAllFiles(true);
                    if ((_ref = this.hiddenFileInput) != null ? _ref.parentNode : void 0) {
                        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
                        this.hiddenFileInput = null;
                    }
                    delete this.element.dropzone;
                    return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
                };

                Dropzone.prototype.updateTotalUploadProgress = function() {
                    var activeFiles, file, totalBytes, totalBytesSent, totalUploadProgress, _i, _len, _ref;
                    totalBytesSent = 0;
                    totalBytes = 0;
                    activeFiles = this.getActiveFiles();
                    if (activeFiles.length) {
                        _ref = this.getActiveFiles();
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            file = _ref[_i];
                            totalBytesSent += file.upload.bytesSent;
                            totalBytes += file.upload.total;
                        }
                        totalUploadProgress = 100 * totalBytesSent / totalBytes;
                    } else {
                        totalUploadProgress = 100;
                    }
                    return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
                };

                Dropzone.prototype.getFallbackForm = function() {
                    var existingFallback, fields, fieldsString, form;
                    if (existingFallback = this.getExistingFallback()) {
                        return existingFallback;
                    }
                    fieldsString = "<div class=\"dz-fallback\">";
                    if (this.options.dictFallbackText) {
                        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
                    }
                    fieldsString += "<input type=\"file\" name=\"" + this.options.paramName + (this.options.uploadMultiple ? "[]" : "") + "\" " + (this.options.uploadMultiple ? 'multiple="multiple"' : void 0) + " /><input type=\"submit\" value=\"Upload!\"></div>";
                    fields = Dropzone.createElement(fieldsString);
                    if (this.element.tagName !== "FORM") {
                        form = Dropzone.createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"" + this.options.method + "\"></form>");
                        form.appendChild(fields);
                    } else {
                        this.element.setAttribute("enctype", "multipart/form-data");
                        this.element.setAttribute("method", this.options.method);
                    }
                    return form != null ? form : fields;
                };

                Dropzone.prototype.getExistingFallback = function() {
                    var fallback, getFallback, tagName, _i, _len, _ref;
                    getFallback = function(elements) {
                        var el, _i, _len;
                        for (_i = 0, _len = elements.length; _i < _len; _i++) {
                            el = elements[_i];
                            if (/(^| )fallback($| )/.test(el.className)) {
                                return el;
                            }
                        }
                    };
                    _ref = ["div", "form"];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        tagName = _ref[_i];
                        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
                            return fallback;
                        }
                    }
                };

                Dropzone.prototype.setupEventListeners = function() {
                    var elementListeners, event, listener, _i, _len, _ref, _results;
                    _ref = this.listeners;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        elementListeners = _ref[_i];
                        _results.push((function() {
                            var _ref1, _results1;
                            _ref1 = elementListeners.events;
                            _results1 = [];
                            for (event in _ref1) {
                                listener = _ref1[event];
                                _results1.push(elementListeners.element.addEventListener(event, listener, false));
                            }
                            return _results1;
                        })());
                    }
                    return _results;
                };

                Dropzone.prototype.removeEventListeners = function() {
                    var elementListeners, event, listener, _i, _len, _ref, _results;
                    _ref = this.listeners;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        elementListeners = _ref[_i];
                        _results.push((function() {
                            var _ref1, _results1;
                            _ref1 = elementListeners.events;
                            _results1 = [];
                            for (event in _ref1) {
                                listener = _ref1[event];
                                _results1.push(elementListeners.element.removeEventListener(event, listener, false));
                            }
                            return _results1;
                        })());
                    }
                    return _results;
                };

                Dropzone.prototype.disable = function() {
                    var file, _i, _len, _ref, _results;
                    this.clickableElements.forEach(function(element) {
                        return element.classList.remove("dz-clickable");
                    });
                    this.removeEventListeners();
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        _results.push(this.cancelUpload(file));
                    }
                    return _results;
                };

                Dropzone.prototype.enable = function() {
                    this.clickableElements.forEach(function(element) {
                        return element.classList.add("dz-clickable");
                    });
                    return this.setupEventListeners();
                };

                Dropzone.prototype.filesize = function(size) {
                    var string;
                    if (size >= 1024 * 1024 * 1024 * 1024 / 10) {
                        size = size / (1024 * 1024 * 1024 * 1024 / 10);
                        string = "TiB";
                    } else if (size >= 1024 * 1024 * 1024 / 10) {
                        size = size / (1024 * 1024 * 1024 / 10);
                        string = "GiB";
                    } else if (size >= 1024 * 1024 / 10) {
                        size = size / (1024 * 1024 / 10);
                        string = "MiB";
                    } else if (size >= 1024 / 10) {
                        size = size / (1024 / 10);
                        string = "KiB";
                    } else {
                        size = size * 10;
                        string = "b";
                    }
                    return "<strong>" + (Math.round(size) / 10) + "</strong> " + string;
                };

                Dropzone.prototype._updateMaxFilesReachedClass = function() {
                    if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
                        if (this.getAcceptedFiles().length === this.options.maxFiles) {
                            this.emit('maxfilesreached', this.files);
                        }
                        return this.element.classList.add("dz-max-files-reached");
                    } else {
                        return this.element.classList.remove("dz-max-files-reached");
                    }
                };

                Dropzone.prototype.drop = function(e) {
                    var files, items;
                    if (!e.dataTransfer) {
                        return;
                    }
                    this.emit("drop", e);
                    files = e.dataTransfer.files;
                    if (files.length) {
                        items = e.dataTransfer.items;
                        if (items && items.length && (items[0].webkitGetAsEntry != null)) {
                            this._addFilesFromItems(items);
                        } else {
                            this.handleFiles(files);
                        }
                    }
                };

                Dropzone.prototype.paste = function(e) {
                    var items, _ref;
                    if ((e != null ? (_ref = e.clipboardData) != null ? _ref.items : void 0 : void 0) == null) {
                        return;
                    }
                    this.emit("paste", e);
                    items = e.clipboardData.items;
                    if (items.length) {
                        return this._addFilesFromItems(items);
                    }
                };

                Dropzone.prototype.handleFiles = function(files) {
                    var file, _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        _results.push(this.addFile(file));
                    }
                    return _results;
                };

                Dropzone.prototype._addFilesFromItems = function(items) {
                    var entry, item, _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = items.length; _i < _len; _i++) {
                        item = items[_i];
                        if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry())) {
                            if (entry.isFile) {
                                _results.push(this.addFile(item.getAsFile()));
                            } else if (entry.isDirectory) {
                                _results.push(this._addFilesFromDirectory(entry, entry.name));
                            } else {
                                _results.push(void 0);
                            }
                        } else if (item.getAsFile != null) {
                            if ((item.kind == null) || item.kind === "file") {
                                _results.push(this.addFile(item.getAsFile()));
                            } else {
                                _results.push(void 0);
                            }
                        } else {
                            _results.push(void 0);
                        }
                    }
                    return _results;
                };

                Dropzone.prototype._addFilesFromDirectory = function(directory, path) {
                    var dirReader, entriesReader;
                    dirReader = directory.createReader();
                    entriesReader = (function(_this) {
                        return function(entries) {
                            var entry, _i, _len;
                            for (_i = 0, _len = entries.length; _i < _len; _i++) {
                                entry = entries[_i];
                                if (entry.isFile) {
                                    entry.file(function(file) {
                                        if (_this.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                                            return;
                                        }
                                        file.fullPath = "" + path + "/" + file.name;
                                        return _this.addFile(file);
                                    });
                                } else if (entry.isDirectory) {
                                    _this._addFilesFromDirectory(entry, "" + path + "/" + entry.name);
                                }
                            }
                        };
                    })(this);
                    return dirReader.readEntries(entriesReader, function(error) {
                        return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(error) : void 0 : void 0;
                    });
                };

                Dropzone.prototype.accept = function(file, done) {
                    if (file.size > this.options.maxFilesize * 1024 * 1024) {
                        return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
                    } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
                        return done(this.options.dictInvalidFileType);
                    } else if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
                        done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
                        return this.emit("maxfilesexceeded", file);
                    } else {
                        return this.options.accept.call(this, file, done);
                    }
                };

                Dropzone.prototype.addFile = function(file) {
                    file.upload = {
                        progress: 0,
                        total: file.size,
                        bytesSent: 0
                    };
                    this.files.push(file);
                    file.status = Dropzone.ADDED;
                    this.emit("addedfile", file);
                    this._enqueueThumbnail(file);
                    return this.accept(file, (function(_this) {
                        return function(error) {
                            if (error) {
                                file.accepted = false;
                                _this._errorProcessing([file], error);
                            } else {
                                file.accepted = true;
                                if (_this.options.autoQueue) {
                                    _this.enqueueFile(file);
                                }
                            }
                            return _this._updateMaxFilesReachedClass();
                        };
                    })(this));
                };

                Dropzone.prototype.enqueueFiles = function(files) {
                    var file, _i, _len;
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        this.enqueueFile(file);
                    }
                    return null;
                };

                Dropzone.prototype.enqueueFile = function(file) {
                    if (file.status === Dropzone.ADDED && file.accepted === true) {
                        file.status = Dropzone.QUEUED;
                        if (this.options.autoProcessQueue) {
                            return setTimeout(((function(_this) {
                                return function() {
                                    return _this.processQueue();
                                };
                            })(this)), 0);
                        }
                    } else {
                        throw new Error("This file can't be queued because it has already been processed or was rejected.");
                    }
                };

                Dropzone.prototype._thumbnailQueue = [];

                Dropzone.prototype._processingThumbnail = false;

                Dropzone.prototype._enqueueThumbnail = function(file) {
                    if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
                        this._thumbnailQueue.push(file);
                        return setTimeout(((function(_this) {
                            return function() {
                                return _this._processThumbnailQueue();
                            };
                        })(this)), 0);
                    }
                };

                Dropzone.prototype._processThumbnailQueue = function() {
                    if (this._processingThumbnail || this._thumbnailQueue.length === 0) {
                        return;
                    }
                    this._processingThumbnail = true;
                    return this.createThumbnail(this._thumbnailQueue.shift(), (function(_this) {
                        return function() {
                            _this._processingThumbnail = false;
                            return _this._processThumbnailQueue();
                        };
                    })(this));
                };

                Dropzone.prototype.removeFile = function(file) {
                    if (file.status === Dropzone.UPLOADING) {
                        this.cancelUpload(file);
                    }
                    this.files = without(this.files, file);
                    this.emit("removedfile", file);
                    if (this.files.length === 0) {
                        return this.emit("reset");
                    }
                };

                Dropzone.prototype.removeAllFiles = function(cancelIfNecessary) {
                    var file, _i, _len, _ref;
                    if (cancelIfNecessary == null) {
                        cancelIfNecessary = false;
                    }
                    _ref = this.files.slice();
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
                            this.removeFile(file);
                        }
                    }
                    return null;
                };

                Dropzone.prototype.createThumbnail = function(file, callback) {
                    var fileReader;
                    fileReader = new FileReader;
                    fileReader.onload = (function(_this) {
                        return function() {
                            var img;
                            img = document.createElement("img");
                            img.onload = function() {
                                var canvas, ctx, resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3;
                                file.width = img.width;
                                file.height = img.height;
                                resizeInfo = _this.options.resize.call(_this, file);
                                if (resizeInfo.trgWidth == null) {
                                    resizeInfo.trgWidth = _this.options.thumbnailWidth;
                                }
                                if (resizeInfo.trgHeight == null) {
                                    resizeInfo.trgHeight = _this.options.thumbnailHeight;
                                }
                                canvas = document.createElement("canvas");
                                ctx = canvas.getContext("2d");
                                canvas.width = resizeInfo.trgWidth;
                                canvas.height = resizeInfo.trgHeight;
                                drawImageIOSFix(ctx, img, (_ref = resizeInfo.srcX) != null ? _ref : 0, (_ref1 = resizeInfo.srcY) != null ? _ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (_ref2 = resizeInfo.trgX) != null ? _ref2 : 0, (_ref3 = resizeInfo.trgY) != null ? _ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
                                thumbnail = canvas.toDataURL("image/png");
                                _this.emit("thumbnail", file, thumbnail);
                                if (callback != null) {
                                    return callback();
                                }
                            };
                            return img.src = fileReader.result;
                        };
                    })(this);
                    return fileReader.readAsDataURL(file);
                };

                Dropzone.prototype.processQueue = function() {
                    var i, parallelUploads, processingLength, queuedFiles;
                    parallelUploads = this.options.parallelUploads;
                    processingLength = this.getUploadingFiles().length;
                    i = processingLength;
                    if (processingLength >= parallelUploads) {
                        return;
                    }
                    queuedFiles = this.getQueuedFiles();
                    if (!(queuedFiles.length > 0)) {
                        return;
                    }
                    if (this.options.uploadMultiple) {
                        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
                    } else {
                        while (i < parallelUploads) {
                            if (!queuedFiles.length) {
                                return;
                            }
                            this.processFile(queuedFiles.shift());
                            i++;
                        }
                    }
                };

                Dropzone.prototype.processFile = function(file) {
                    return this.processFiles([file]);
                };

                Dropzone.prototype.processFiles = function(files) {
                    var file, _i, _len;
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        file.processing = true;
                        file.status = Dropzone.UPLOADING;
                        this.emit("processing", file);
                    }
                    if (this.options.uploadMultiple) {
                        this.emit("processingmultiple", files);
                    }
                    return this.uploadFiles(files);
                };

                Dropzone.prototype._getFilesWithXhr = function(xhr) {
                    var file, files;
                    return files = (function() {
                        var _i, _len, _ref, _results;
                        _ref = this.files;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            file = _ref[_i];
                            if (file.xhr === xhr) {
                                _results.push(file);
                            }
                        }
                        return _results;
                    }).call(this);
                };

                Dropzone.prototype.cancelUpload = function(file) {
                    var groupedFile, groupedFiles, _i, _j, _len, _len1, _ref;
                    if (file.status === Dropzone.UPLOADING) {
                        groupedFiles = this._getFilesWithXhr(file.xhr);
                        for (_i = 0, _len = groupedFiles.length; _i < _len; _i++) {
                            groupedFile = groupedFiles[_i];
                            groupedFile.status = Dropzone.CANCELED;
                        }
                        file.xhr.abort();
                        for (_j = 0, _len1 = groupedFiles.length; _j < _len1; _j++) {
                            groupedFile = groupedFiles[_j];
                            this.emit("canceled", groupedFile);
                        }
                        if (this.options.uploadMultiple) {
                            this.emit("canceledmultiple", groupedFiles);
                        }
                    } else if ((_ref = file.status) === Dropzone.ADDED || _ref === Dropzone.QUEUED) {
                        file.status = Dropzone.CANCELED;
                        this.emit("canceled", file);
                        if (this.options.uploadMultiple) {
                            this.emit("canceledmultiple", [file]);
                        }
                    }
                    if (this.options.autoProcessQueue) {
                        return this.processQueue();
                    }
                };

                Dropzone.prototype.uploadFile = function(file) {
                    return this.uploadFiles([file]);
                };

                Dropzone.prototype.uploadFiles = function(files) {
                    var file, formData, handleError, headerName, headerValue, headers, input, inputName, inputType, key, option, progressObj, response, updateProgress, value, xhr, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4;
                    xhr = new XMLHttpRequest();
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        file.xhr = xhr;
                    }
                    xhr.open(this.options.method, this.options.url, true);
                    xhr.withCredentials = !!this.options.withCredentials;
                    response = null;
                    handleError = (function(_this) {
                        return function() {
                            var _j, _len1, _results;
                            _results = [];
                            for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
                                file = files[_j];
                                _results.push(_this._errorProcessing(files, response || _this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr));
                            }
                            return _results;
                        };
                    })(this);
                    updateProgress = (function(_this) {
                        return function(e) {
                            var allFilesFinished, progress, _j, _k, _l, _len1, _len2, _len3, _results;
                            if (e != null) {
                                progress = 100 * e.loaded / e.total;
                                for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
                                    file = files[_j];
                                    file.upload = {
                                        progress: progress,
                                        total: e.total,
                                        bytesSent: e.loaded
                                    };
                                }
                            } else {
                                allFilesFinished = true;
                                progress = 100;
                                for (_k = 0, _len2 = files.length; _k < _len2; _k++) {
                                    file = files[_k];
                                    if (!(file.upload.progress === 100 && file.upload.bytesSent === file.upload.total)) {
                                        allFilesFinished = false;
                                    }
                                    file.upload.progress = progress;
                                    file.upload.bytesSent = file.upload.total;
                                }
                                if (allFilesFinished) {
                                    return;
                                }
                            }
                            _results = [];
                            for (_l = 0, _len3 = files.length; _l < _len3; _l++) {
                                file = files[_l];
                                _results.push(_this.emit("uploadprogress", file, progress, file.upload.bytesSent));
                            }
                            return _results;
                        };
                    })(this);
                    xhr.onload = (function(_this) {
                        return function(e) {
                            var _ref;
                            if (files[0].status === Dropzone.CANCELED) {
                                return;
                            }
                            if (xhr.readyState !== 4) {
                                return;
                            }
                            response = xhr.responseText;
                            if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
                                try {
                                    response = JSON.parse(response);
                                } catch (_error) {
                                    e = _error;
                                    response = "Invalid JSON response from server.";
                                }
                            }
                            updateProgress();
                            if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
                                return handleError();
                            } else {
                                return _this._finished(files, response, e);
                            }
                        };
                    })(this);
                    xhr.onerror = (function(_this) {
                        return function() {
                            if (files[0].status === Dropzone.CANCELED) {
                                return;
                            }
                            return handleError();
                        };
                    })(this);
                    progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
                    progressObj.onprogress = updateProgress;
                    headers = {
                        "Accept": "application/json",
                        "Cache-Control": "no-cache",
                        "X-Requested-With": "XMLHttpRequest"
                    };
                    if (this.options.headers) {
                        extend(headers, this.options.headers);
                    }
                    for (headerName in headers) {
                        headerValue = headers[headerName];
                        xhr.setRequestHeader(headerName, headerValue);
                    }
                    formData = new FormData();
                    if (this.options.params) {
                        _ref1 = this.options.params;
                        for (key in _ref1) {
                            value = _ref1[key];
                            formData.append(key, value);
                        }
                    }
                    for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
                        file = files[_j];
                        this.emit("sending", file, xhr, formData);
                    }
                    if (this.options.uploadMultiple) {
                        this.emit("sendingmultiple", files, xhr, formData);
                    }
                    if (this.element.tagName === "FORM") {
                        _ref2 = this.element.querySelectorAll("input, textarea, select, button");
                        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                            input = _ref2[_k];
                            inputName = input.getAttribute("name");
                            inputType = input.getAttribute("type");
                            if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
                                _ref3 = input.options;
                                for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
                                    option = _ref3[_l];
                                    if (option.selected) {
                                        formData.append(inputName, option.value);
                                    }
                                }
                            } else if (!inputType || ((_ref4 = inputType.toLowerCase()) !== "checkbox" && _ref4 !== "radio") || input.checked) {
                                formData.append(inputName, input.value);
                            }
                        }
                    }
                    for (_m = 0, _len4 = files.length; _m < _len4; _m++) {
                        file = files[_m];
                        formData.append("" + this.options.paramName + (this.options.uploadMultiple ? "[]" : ""), file, file.name);
                    }
                    return xhr.send(formData);
                };

                Dropzone.prototype._finished = function(files, responseText, e) {
                    var file, _i, _len;
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        file.status = Dropzone.SUCCESS;
                        this.emit("success", file, responseText, e);
                        this.emit("complete", file);
                    }
                    if (this.options.uploadMultiple) {
                        this.emit("successmultiple", files, responseText, e);
                        this.emit("completemultiple", files);
                    }
                    if (this.options.autoProcessQueue) {
                        return this.processQueue();
                    }
                };

                Dropzone.prototype._errorProcessing = function(files, message, xhr) {
                    var file, _i, _len;
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        file.status = Dropzone.ERROR;
                        this.emit("error", file, message, xhr);
                        this.emit("complete", file);
                    }
                    if (this.options.uploadMultiple) {
                        this.emit("errormultiple", files, message, xhr);
                        this.emit("completemultiple", files);
                    }
                    if (this.options.autoProcessQueue) {
                        return this.processQueue();
                    }
                };

                return Dropzone;

            })(Em);

            Dropzone.version = "3.8.7";

            Dropzone.options = {};

            Dropzone.optionsForElement = function(element) {
                if (element.getAttribute("id")) {
                    return Dropzone.options[camelize(element.getAttribute("id"))];
                } else {
                    return void 0;
                }
            };

            Dropzone.instances = [];

            Dropzone.forElement = function(element) {
                if (typeof element === "string") {
                    element = document.querySelector(element);
                }
                if ((element != null ? element.dropzone : void 0) == null) {
                    throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
                }
                return element.dropzone;
            };

            Dropzone.autoDiscover = true;

            Dropzone.discover = function() {
                var checkElements, dropzone, dropzones, _i, _len, _results;
                if (document.querySelectorAll) {
                    dropzones = document.querySelectorAll(".dropzone");
                } else {
                    dropzones = [];
                    checkElements = function(elements) {
                        var el, _i, _len, _results;
                        _results = [];
                        for (_i = 0, _len = elements.length; _i < _len; _i++) {
                            el = elements[_i];
                            if (/(^| )dropzone($| )/.test(el.className)) {
                                _results.push(dropzones.push(el));
                            } else {
                                _results.push(void 0);
                            }
                        }
                        return _results;
                    };
                    checkElements(document.getElementsByTagName("div"));
                    checkElements(document.getElementsByTagName("form"));
                }
                _results = [];
                for (_i = 0, _len = dropzones.length; _i < _len; _i++) {
                    dropzone = dropzones[_i];
                    if (Dropzone.optionsForElement(dropzone) !== false) {
                        _results.push(new Dropzone(dropzone));
                    } else {
                        _results.push(void 0);
                    }
                }
                return _results;
            };

            Dropzone.blacklistedBrowsers = [/opera.*Macintosh.*version\/12/i];

            Dropzone.isBrowserSupported = function() {
                var capableBrowser, regex, _i, _len, _ref;
                capableBrowser = true;
                if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
                    if (!("classList" in document.createElement("a"))) {
                        capableBrowser = false;
                    } else {
                        _ref = Dropzone.blacklistedBrowsers;
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            regex = _ref[_i];
                            if (regex.test(navigator.userAgent)) {
                                capableBrowser = false;
                                continue;
                            }
                        }
                    }
                } else {
                    capableBrowser = false;
                }
                return capableBrowser;
            };

            without = function(list, rejectedItem) {
                var item, _i, _len, _results;
                _results = [];
                for (_i = 0, _len = list.length; _i < _len; _i++) {
                    item = list[_i];
                    if (item !== rejectedItem) {
                        _results.push(item);
                    }
                }
                return _results;
            };

            camelize = function(str) {
                return str.replace(/[\-_](\w)/g, function(match) {
                    return match.charAt(1).toUpperCase();
                });
            };

            Dropzone.createElement = function(string) {
                var div;
                div = document.createElement("div");
                div.innerHTML = string;
                return div.childNodes[0];
            };

            Dropzone.elementInside = function(element, container) {
                if (element === container) {
                    return true;
                }
                while (element = element.parentNode) {
                    if (element === container) {
                        return true;
                    }
                }
                return false;
            };

            Dropzone.getElement = function(el, name) {
                var element;
                if (typeof el === "string") {
                    element = document.querySelector(el);
                } else if (el.nodeType != null) {
                    element = el;
                }
                if (element == null) {
                    throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
                }
                return element;
            };

            Dropzone.getElements = function(els, name) {
                var e, el, elements, _i, _j, _len, _len1, _ref;
                if (els instanceof Array) {
                    elements = [];
                    try {
                        for (_i = 0, _len = els.length; _i < _len; _i++) {
                            el = els[_i];
                            elements.push(this.getElement(el, name));
                        }
                    } catch (_error) {
                        e = _error;
                        elements = null;
                    }
                } else if (typeof els === "string") {
                    elements = [];
                    _ref = document.querySelectorAll(els);
                    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                        el = _ref[_j];
                        elements.push(el);
                    }
                } else if (els.nodeType != null) {
                    elements = [els];
                }
                if (!((elements != null) && elements.length)) {
                    throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
                }
                return elements;
            };

            Dropzone.confirm = function(question, accepted, rejected) {
                if (window.confirm(question)) {
                    return accepted();
                } else if (rejected != null) {
                    return rejected();
                }
            };

            Dropzone.isValidFile = function(file, acceptedFiles) {
                var baseMimeType, mimeType, validType, _i, _len;
                if (!acceptedFiles) {
                    return true;
                }
                acceptedFiles = acceptedFiles.split(",");
                mimeType = file.type;
                baseMimeType = mimeType.replace(/\/.*$/, "");
                for (_i = 0, _len = acceptedFiles.length; _i < _len; _i++) {
                    validType = acceptedFiles[_i];
                    validType = validType.trim();
                    if (validType.charAt(0) === ".") {
                        if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
                            return true;
                        }
                    } else if (/\/\*$/.test(validType)) {
                        if (baseMimeType === validType.replace(/\/.*$/, "")) {
                            return true;
                        }
                    } else {
                        if (mimeType === validType) {
                            return true;
                        }
                    }
                }
                return false;
            };

            if (typeof jQuery !== "undefined" && jQuery !== null) {
                jQuery.fn.dropzone = function(options) {
                    return this.each(function() {
                        return new Dropzone(this, options);
                    });
                };
            }

            if (typeof module !== "undefined" && module !== null) {
                module.exports = Dropzone;
            } else {
                window.Dropzone = Dropzone;
            }

            Dropzone.ADDED = "added";

            Dropzone.QUEUED = "queued";

            Dropzone.ACCEPTED = Dropzone.QUEUED;

            Dropzone.UPLOADING = "uploading";

            Dropzone.PROCESSING = Dropzone.UPLOADING;

            Dropzone.CANCELED = "canceled";

            Dropzone.ERROR = "error";

            Dropzone.SUCCESS = "success";

            detectVerticalSquash = function(img) {
                var alpha, canvas, ctx, data, ey, ih, iw, py, ratio, sy;
                iw = img.naturalWidth;
                ih = img.naturalHeight;
                canvas = document.createElement("canvas");
                canvas.width = 1;
                canvas.height = ih;
                ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                data = ctx.getImageData(0, 0, 1, ih).data;
                sy = 0;
                ey = ih;
                py = ih;
                while (py > sy) {
                    alpha = data[(py - 1) * 4 + 3];
                    if (alpha === 0) {
                        ey = py;
                    } else {
                        sy = py;
                    }
                    py = (ey + sy) >> 1;
                }
                ratio = py / ih;
                if (ratio === 0) {
                    return 1;
                } else {
                    return ratio;
                }
            };

            drawImageIOSFix = function(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
                var vertSquashRatio;
                vertSquashRatio = detectVerticalSquash(img);
                return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
            };

            contentLoaded = function(win, fn) {
                var add, doc, done, init, poll, pre, rem, root, top;
                done = false;
                top = true;
                doc = win.document;
                root = doc.documentElement;
                add = (doc.addEventListener ? "addEventListener" : "attachEvent");
                rem = (doc.addEventListener ? "removeEventListener" : "detachEvent");
                pre = (doc.addEventListener ? "" : "on");
                init = function(e) {
                    if (e.type === "readystatechange" && doc.readyState !== "complete") {
                        return;
                    }
                    (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
                    if (!done && (done = true)) {
                        return fn.call(win, e.type || e);
                    }
                };
                poll = function() {
                    var e;
                    try {
                        root.doScroll("left");
                    } catch (_error) {
                        e = _error;
                        setTimeout(poll, 50);
                        return;
                    }
                    return init("poll");
                };
                if (doc.readyState !== "complete") {
                    if (doc.createEventObject && root.doScroll) {
                        try {
                            top = !win.frameElement;
                        } catch (_error) {}
                        if (top) {
                            poll();
                        }
                    }
                    doc[add](pre + "DOMContentLoaded", init, false);
                    doc[add](pre + "readystatechange", init, false);
                    return win[add](pre + "load", init, false);
                }
            };

            Dropzone._autoDiscoverFunction = function() {
                if (Dropzone.autoDiscover) {
                    return Dropzone.discover();
                }
            };

            contentLoaded(window, Dropzone._autoDiscoverFunction);

        }).call(this);

    });

    if (typeof exports == "object") {
        module.exports = require("dropzone");
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return require("dropzone"); });
    } else {
        this["Dropzone"] = require("dropzone");
    }
})()
});

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

/*
 *
 *   INSPINIA - Responsive Admin Theme
 *   version 2.4
 *
 */
riot.tag2('init', '', '', '', function(opts) {
this.on('mount', function() {
  $(document).ready(function () {

    if ($(this).width() < 769) {
        $('body').addClass('body-small')
    } else {
        $('body').removeClass('body-small')
    }

    $('#side-menu').metisMenu();

    $('.collapse-link').click(function () {
        var ibox = $(this).closest('div.ibox');
        var button = $(this).find('i');
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    });

    $('.close-link').click(function () {
        var content = $(this).closest('div.ibox');
        content.remove();
    });

    $('.fullscreen-link').click(function () {
        var ibox = $(this).closest('div.ibox');
        var button = $(this).find('i');
        $('body').toggleClass('fullscreen-ibox-mode');
        button.toggleClass('fa-expand').toggleClass('fa-compress');
        ibox.toggleClass('fullscreen');
        setTimeout(function () {
            $(window).trigger('resize');
        }, 100);
    });

    $('.close-canvas-menu').click(function () {
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();
    });

    $('body.canvas-menu .sidebar-collapse').slimscroll({
        height: '100%',
        railOpacity: 0.9
    });

    $('.right-sidebar-toggle').click(function () {
        $('#right-sidebar').toggleClass('sidebar-open');
    });

    $('.sidebar-container').slimscroll({
        height: '100%',
        railOpacity: 0.4,
        wheelStep: 10
    });

    $('.open-small-chat').click(function () {
        $(this).children().toggleClass('fa-comments').toggleClass('fa-remove');
        $('.small-chat-box').toggleClass('active');
    });

    $('.small-chat-box .content').slimscroll({
        height: '234px',
        railOpacity: 0.4
    });

    $('.check-link').click(function () {
        var button = $(this).find('i');
        var label = $(this).next('span');
        button.toggleClass('fa-check-square').toggleClass('fa-square-o');
        label.toggleClass('todo-completed');
        return false;
    });

    $('.navbar-minimalize').click(function () {
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();

    });

    $('.tooltip-demo').tooltip({
        selector: "[data-toggle=tooltip]",
        container: "body"
    });

    $('.modal').appendTo("body");

    function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");

        var navbarHeigh = $('nav.navbar-default').height();
        var wrapperHeigh = $('#page-wrapper').height();

        if (navbarHeigh > wrapperHeigh) {
            $('#page-wrapper').css("min-height", navbarHeigh + "px");
        }

        if (navbarHeigh < wrapperHeigh) {
            $('#page-wrapper').css("min-height", $(window).height() + "px");
        }

        if ($('body').hasClass('fixed-nav')) {
            if (navbarHeigh > wrapperHeigh) {
                $('#page-wrapper').css("min-height", navbarHeigh - 60 + "px");
            } else {
                $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
            }
        }

    }

    fix_height();

    $(window).bind("load", function () {
        if ($("body").hasClass('fixed-sidebar')) {
            $('.sidebar-collapse').slimscroll({
                height: '100%',
                railOpacity: 0.9
            });
        }
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
            $('#right-sidebar').addClass('sidebar-top');
        } else {
            $('#right-sidebar').removeClass('sidebar-top');
        }
    });

    $(window).bind("load resize scroll", function () {
        if (!$("body").hasClass('body-small')) {
            fix_height();
        }
    });

    $("[data-toggle=popover]")
        .popover();

    $('.full-height-scroll').slimscroll({
        height: '100%'
    })
});

$(window).bind("resize", function () {
    if ($(this).width() < 769) {
        $('body').addClass('body-small')
    } else {
        $('body').removeClass('body-small')
    }
});

$(document).ready(function () {
    if (localStorageSupport) {

        var collapse = localStorage.getItem("collapse_menu");
        var fixedsidebar = localStorage.getItem("fixedsidebar");
        var fixednavbar = localStorage.getItem("fixednavbar");
        var boxedlayout = localStorage.getItem("boxedlayout");
        var fixedfooter = localStorage.getItem("fixedfooter");

        var body = $('body');

        if (fixedsidebar == 'on') {
            body.addClass('fixed-sidebar');
            $('.sidebar-collapse').slimscroll({
                height: '100%',
                railOpacity: 0.9
            });
        }

        if (collapse == 'on') {
            if (body.hasClass('fixed-sidebar')) {
                if (!body.hasClass('body-small')) {
                    body.addClass('mini-navbar');
                }
            } else {
                if (!body.hasClass('body-small')) {
                    body.addClass('mini-navbar');
                }

            }
        }

        if (fixednavbar == 'on') {
            $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
            body.addClass('fixed-nav');
        }

        if (boxedlayout == 'on') {
            body.addClass('boxed-layout');
        }

        if (fixedfooter == 'on') {
            $(".footer").addClass('fixed');
        }
    }
  });
})

function localStorageSupport() {
    return (('localStorage' in window) && window['localStorage'] !== null)
}

function animationHover(element, animation) {
    element = $(element);
    element.hover(
        function () {
            element.addClass('animated ' + animation);
        },
        function () {

            window.setTimeout(function () {
                element.removeClass('animated ' + animation);
            }, 2000);
        });
}

function SmoothlyMenu() {
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {

        $('#side-menu').hide();

        setTimeout(
            function () {
                $('#side-menu').fadeIn(400);
            }, 200);
    } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(400);
            }, 100);
    } else {

        $('#side-menu').removeAttr('style');
    }
}

function WinMove() {
    var element = "[class*=col]";
    var handle = ".ibox-title";
    var connect = "[class*=col]";
    $(element).sortable(
        {
            handle: handle,
            connectWith: connect,
            tolerance: 'pointer',
            forcePlaceholderSize: true,
            opacity: 0.8
        })
        .disableSelection();
}
});
riot.tag2('invoice', '<div class="col-lg-12"> <div class="panel-group invoice" id="accordion"> <div class="ibox"> <h5 class="ibox-title"> <span>Invoice Summary</span> </h5> <div class="ibox-content"> <div show="{opts.invoice.date}"> <table class="table table-hover"> <tr><th>Date</th><td>{opts.invoice.date}</td></tr> <tr><th>Subtotal</th><td>{opts.invoice.subtotal}</td></tr> <tr><th>Total</th><td>{opts.invoice.total}</td></tr> <tr><th>Amount paid</th><td>{opts.invoice.amount_due}</td></tr> </table> </div> </div> </div> <div class="ibox"> <div class="ibox-title"> <h5 class="panel-title"> <span>Invoice line items</span> </h5> </div> <div class="ibox-content"> <table class="table table-hover"> <thead> <tr><th>Amount</th><th>Description</th><th>Period</th></tr> </thead> <tbody show="{opts.invoice.date}"> <tr each="{invoice in opts.invoice.lines}"> <td>{invoice.amount}</td> <td>{invoice.description}</td> <td>{invoice.period.start} ~ {invoice.period.end}</td> </tr> </tbody> </table> </div> </div> <div class="ibox"> <div class="ibox-title"> <h5 class="panel-title"> <span>Coupon Discount</span> </h5> </div> <div class="ibox-content"> <table class="table table-hover"> <thead> <tr><th>ID</th><th>Amount Off</th><th>Date</th></tr> </thead> <tbody show="{opts.invoice.discount.coupon}"> <tr> <td>{opts.invoice.discount.coupon}</td> <td>{opts.invoice.discount.amount_off}</td> <td>{opts.invoice.discount.created}</td> </tr> </tbody> </table> </div> </div> </div> </div>', '', '', function(opts) {
    this.items = []
    var self  = this
    self.update()
    display()
    this.on('mount', function() {
      $(document).ready(function(){
        loading()
      })
    })
});

riot.tag2('login', '<div class="gray-bg" style="height:100%;"> <div class="middle-box text-center loginscreen animated fadeInDown"> <div> <div> <a href="/"> <img src="img/shifter_logo_login@2x.png" width="250px"> </a> <form class="m-t-xl" role="form" action="/"> <div class="alert alert-warning"> <p>Due to the system update, <a href="/#forgot_password">modifying password is required</a>. For more details: please check <a href="https://getshifter.zendesk.com/hc/en-us/articles/115001088568" target="__blank">our announcement</a>.</p> </div> <div class="form-group"> <input id="username" type="text" class="form-control" placeholder="Username or Email" required=""> </div> <div class="form-group"> <input id="password" type="password" class="form-control" placeholder="Password" required=""> </div> <button id="login" type="button" class="ladda-button ladda-button-demo btn btn-primary block full-width m-b" data-style="expand-right" onclick="{auth}">Login</button> <a href="/#forgot_password"><small>Forgot your password?</small></a> <p class="text-muted text-center"><small>New user?</small></p> <a class="btn btn-sm btn-white btn-block" href="/#register">Sign-up for Shifter</a> </form> </div> </div> </div>', '', '', function(opts) {
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

    this.auth = function(e) {
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
    }.bind(this)
});

riot.tag2('netlify', '<div class="panel-body"> <div class="row"> <div class="col-lg-12"> <p><a href="https://netlify.com" target="_blank">What is Netlify ?</a></p> <div class="ibox"> <h3 class="ibox-title">Connection Settings</h3> <div class="ibox-content"> <form role="form" id="register-form"> <input type="hidden" value="{opts.siteid}" id="site_id" name="site_id"> <dl class="dl-horizontal"> <dt><label for="pat">Personal Access Token</label></dt> <dd class="form-group"> <input id="pat" type="password" class="form-control" name="pat" placeholder="Netlify Personal Access Token" value="{netlifyToken || \'\'}"> </dd> </dl> <button id="btnConnectNetlify" class="btn btn-primary" data-style="expand-right" type="submit" onclick="{connect_netlify}">Connect to Netlify</button> <button id="btnDeletePat" class="btn btn-default" data-style="expand-right" type="submit" onclick="{delete_pat}" show="{netlifyToken}">Delete Personal Access Token</button> </form> </div> </div> <div class="ibox" show="{netlifyToken}"> <h3 class="ibox-title">Publish to Netlify</h3> <div class="ibox-content" hide="{(opts.histories.length > 0 || opts.status === \'generating\') && opts.last !== \'static_delete\'}"> <p>Please Generate at first</p> </div> <div class="ibox-content" show="{(opts.histories.length > 0 || opts.status === \'generating\') && opts.last !== \'static_delete\'}"> <form role="form" id="deploy-form"> <dl> <dt><label for="pat">Site Status</label></dt> <dd> <select id="nf_pj_state" class="form-control m-b" name="nf_pj_state"> <option value="draft">Draft</option> <option value="published">Publish</option> </select> </dd> </dl> <button id="btnDeployNetlify" class="ladda-button ladda-button-demo btn btn-primary" data-style="expand-right" type="submit" onclick="{deploy_netlify}">Deploy to Netlify</button> <a href="https://app.netlify.com/sites/shifter-{opts.siteid}" class="btn btn-primary" target="_blank">Open Netlify Dashboard</a> </form> </div> </div> </div> </div> </div>', '', '', function(opts) {
  var self  = this
  init().then(function(){
    self.apiPath = endpoint.netlify + 'auth/' + self.site_id.value
    return init_netlify()
  }).then(function(data){
    if (data === 'null') {
      self.netlifyToken = false
    } else {
      self.netlifyToken = data
    }
    self.update()
    display()
  }).catch(function(err){
    console.log(err)
    switch(err.statusCode) {
      case 401:
        riot.route('/')
        break
    }
  })

  this.on('mount', function() {
    $(document).ready(function(){
      loading()
    })
  })

  this.connect_netlify = function(e) {
    if (self.pat.value === ''){
      toastr.warning('Personal Access Tokens is required.','')
      return
    }
    var btn = $( '#btnConnectNetlify' ).ladda()
    btn.ladda( 'start' )
    var params = {
        pat: self.pat.value
    }
    post(self.apiPath, params).then(function(response){
        if ( response.body.errorMessage !== undefined ){
          return Promise.reject(response.body.errorMessage)
        }
        toastr.success('Regster Successed!')
        self.update()
        return
    }).catch(function(error){
        console.log(error)
        toastr.warning(error,'')
        return
    }).then(function(data){
        self.netlifyToken = self.pat.value
        self.update()
        btn.ladda('stop')
        display()
    })
  }.bind(this)

  this.deploy_netlify = function(e) {
    var path = endpoint.netlify + 'deploy/' + self.site_id.value
    var isDeploy = 'TRUE'
    if (self.nf_pj_state.value === 'published') {
        isDeploy = 'FALSE'
    }
    var params = {
        isDeploy: isDeploy
    }
    var btn = $( '#btnDeployNetlify' ).ladda()
    swal({
      title: "Deploy to Netlify",
      text: " After deploy to Netlify, please manage in <a href='https://app.netlify.com/' target='_blank'>your Netlify dashboard</a>.",
      type: "success",
      showCancelButton: true,
      confirmButtonColor: "#dc2d69",
      confirmButtonText: "Yes",
      closeOnConfirm: true,
      html: true
    }, function () {
      btn.ladda( 'start' )
      post(path, params).then(function(response){
        if ( response.body.errorMessage !== undefined ){
          return Promise.reject(response.body.errorMessage)
        }
        toastr.success('Deploy to Netlify started!')
        self.update()
        return
      }).catch(function(error){
        console.log(error)
        toastr.warning(error,'')
        return
      }).then(function(data){
        btn.ladda('stop')
        display()
      })
    })
  }.bind(this)
  this.delete_pat = function(e) {
    var btn = $( '#btnDeletePat' ).ladda()
    btn.ladda( 'start' )
    del(self.apiPath).then(function(response){
        if ( response.body.errorMessage !== undefined ){
          return Promise.reject(response.body.errorMessage)
        }
        toastr.success('Personal Access Tokens is deleted')
        self.update()
        return
    }).catch(function(error){
        console.log(error)
        toastr.warning(error,'')
        return
    }).then(function(data){
        $('#pat').val('')
        self.netlifyToken = false
        self.update()
        btn.ladda('stop')
        display()
    })
  }.bind(this)
  function init_netlify () {
    return new Promise(function(resolve, reject) {
      get(self.apiPath).then(function(response){
        var json = JSON.parse(response.text)
        resolve(json.token)
      }).catch(function(err){
        console.log(err)
        reject(err)
      })
    })
  }
});

riot.tag2('peity', '', '', '', function(opts) {
$(function() {
    $("span.pie").peity("pie", {
        fill: ['#1ab394', '#d7d7d7', '#ffffff']
    })

    $(".line").peity("line",{
        fill: '#1ab394',
        stroke:'#169c81',
    })

    $(".bar").peity("bar", {
        fill: ["#1ab394", "#d7d7d7"]
    })

    $(".bar_dashboard").peity("bar", {
        fill: ["#1ab394", "#d7d7d7"],
        width:100
    })

    var updatingChart = $(".updating-chart").peity("line", { fill: '#1ab394',stroke:'#169c81', width: 64 })

    setInterval(function() {
        var random = Math.round(Math.random() * 10)
        var values = updatingChart.text().split(",")
        values.shift()
        values.push(random)

        updatingChart
            .text(values.join(","))
            .change()
    }, 1000);

});
});

riot.tag2('project_detail', '<div id="wrapper"> <sidebar></sidebar> <div id="page-wrapper" class="gray-bg"> <commonheader></commonheader> <div class="row wrapper border-bottom white-bg page-heading"> <div class="col-sm-4"> <h2>Project Detail</h2> <ol class="breadcrumb"> <li> <a href="/">Home</a> </li> <li> <a href="/#projects">Project List</a> </li> <li class="active"> <strong>Project Detail</strong> </li> </ol> </div> </div> <div id="container_progress" if="{status !== \'error\' && status === \'inimport\'}" class="row hidden" style="margin-top: 20px;"> <div class="col-lg-12"> <div class="alert alert-success alert-dismissable"> <h4>{wp_status_msg[apps.step].title}</h4> <p>{wp_status_msg[apps.step].message}</p> <dl if="{status === \'inimport\'}" class="dl-horizontal" style="margin-top:30px;"> <dt>Progress:</dt> <dd> <div class="progress progress-striped active m-b-sm"> <div riot-style="width: {wp_status_msg[apps.step].progress}%;" class="progress-bar"></div> </div> </dd> </dl> </div> </div> </div> <div id="generate_progress" if="{status === \'generating\'}" class="row" style="margin-top: 20px;"> <div class="col-lg-2"> <div class="ibox"> <div class="ibox-content"> <h5>Generated pages</h5> <h1 class="text-center">{gen.created_url || \'-\'} / {gen.sum_url || \'-\'}</h1> </div> </div> </div> <div class="col-lg-10"> <div class="alert alert-success alert-dismissable"> <h4>{gen_status_msg[gen.step].title}</h4> <p>{gen_status_msg[gen.step].message}</p> <dl class="dl-horizontal" style="margin-top:30px;"> <dt>Progress:</dt> <dd> <div class="progress progress-striped active m-b-sm"> <div style="width: 0%;" class="progress-bar"></div> </div> </dd> </dl> </div> </div> </div> <div if="{status === \'error\'}" class="row" style="margin-top: 20px;"> <div class="col-lg-12"> <div class="alert alert-warning alert-dismissable"> <button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button> <h4>{wp_status_msg[apps.step].title}</h4> <p>{wp_status_msg[apps.step].message}</p> </div> </div> </div> <div class="row"> <div class="spiner-example hidden" id="loading" style="height: 66px;"> <div class="sk-spinner sk-spinner-three-bounce"> <div class="sk-bounce1"></div> <div class="sk-bounce2"></div> <div class="sk-bounce3"></div> </div> </div> </div> <div class="row"> <div class="col-lg-12"> <div id="main_box" class="wrapper wrapper-content animated fadeInUp hidden"> <div class="ibox"> <div class="ibox-content"> <div class="row"> <div class="col-lg-12"> <div class="m-b-md"> <a href="/#projects" class="btn btn-white btn-xs pull-right">Back to Project</a> </div> <dl class="dl-horizontal dl-top"> <dt>Name:</dt> <dd><a href="#" id="project_name" data-type="text" data-pk="{site_id}" data-url="{project_endpoint +  site_id}" data-title="Enter {project_name}">{project_name}</a></dd> <dt>ID:</dt> <dd>{site_id}</dd> <dt>Disk Usage:</dt> <dd>{disk_usage}</dd> <dt>Status:</dt> <dd> <span if="{status === \'generating\'}" id="site_processing" class="label label-info">Generating</span> <span if="{status === \'starting\' || status === \'start\'}" id="app_running" class="label label-info">running</span> <span if="{status === \'stop\'}" id="app_stopped" class="label label-warning">stopped</span> <span if="{status === \'inimport\'}" id="app_importing" class="label label-warning">importing</span> </dd> </dl> </div> </div> <div class="row" id="publishing"> <div class="col-lg-12"> <div class="m-b-md"> <h2>Publishing</h2> </div> <div class="tabs-container"> <ul class="nav nav-tabs"> <li class="active"><a data-toggle="tab" href="#general" aria-expanded="true"> General</a></li> <li class=""><a data-toggle="tab" href="#netlify" aria-expanded="false"> Netlify</a></li> </ul> <div class="tab-content"> <div id="general" class="tab-pane active"> <div class="panel-body"> <dl class="dl-horizontal"> <dt>Domain:</dt> <dd><a href="https://{domain_name}" target="_blank" class="{domain_name ? \'link-enabled\' : \'link-disabled\'} ">{domain_name}</a><button if="{!domain_name}" id="edit" class="btn btn-white btn-xs m-l-sm" type="button" data-toggle="modal" data-target="#attach-domain" __disabled="{disabled: validDomains.length <= 0}">Attach Domain</button><button if="{domain_name}" id="edit" class="btn btn-white btn-xs m-l-sm" type="button" onclick="{dettachDomain}">Dettach Domain</button></dd> <dt>Published URL:</dt> <dd if="{(histories.length > 0 || status === \'generating\') && latest_gen_history !== \'static_delete\'}"><a href="https://{access_url}" target="__blank">{access_url}</a></dd><dd if="{histories.length <= 0 && status !== \'generating\' || latest_gen_history === \'static_delete\'}">-</dd> <dt>Published Date:</dt> <dd>{update_time}</dd> </dl> <div class="row"> <div class="col-lg-12"> <dl class="dl-horizontal" if="{status !== \'generating\'}"> <dt></dt> <dd> <span if="{maintenance.status === \'now_maintenance\' && ( maintenance.target.indexOf(\'generator\') >= 0 || maintenance.target.indexOf(\'container\') >= 0 )}">Sorry. Now maintenance. Generate can&apos;t be used</span><br> <button id="generate_publish_site" class="ladda-button ladda-button-demo btn btn-success " type="button" data-style="expand-right" onclick="{create_staticsite}" __disabled="{disabled: status === \'starting\' || status === \'intasks\' || status === \'inimport\' || status === \'start\' || (maintenance.status === \'now_maintenance\' && ( maintenance.target.indexOf(\'generator\') >= 0 || maintenance.target.indexOf(\'container\') >= 0))}"> <i class="fa fa-cloud-upload"></i>&nbsp;&nbsp; <span class="bold">Generate Now</span> </button> <button id="delete_publish_site" class="ladda-button ladda-button-demo btn btn-warning pull-right" type="button" data-style="expand-right" onclick="{delete_staticsite}" __disabled="{disabled: maintenance.status === \'now_maintenance\' && maintenance.target.indexOf(\'container\') >= 0}"> <i class="fa fa-trash"></i>&nbsp;&nbsp; <span class="bold">Delete All Files from Your Published Site</span> </button> </dd> </dl> </div> </div> </div> </div> <div id="netlify" class="tab-pane"> <netlify siteid="{site_id}" status="{status}" last="{latest_gen_history}" histories="{histories}"></netlify> </div> </div> </div> </div> </div> <div class="row"> <div class="col-lg-12"> <div class="m-b-md"> <h2>App</h2> </div> <dl class="dl-horizontal"> <dt class="apps_url">App URL:</dt> <dd if="{status !== \'stop\' && status !== \'generating\' && status !== \'intasks\' && maintenance.status !== \'now_maintenance\'}" class="apps_url"> <a href="{docker_url}" target="_blank">{docker_url}</a> </dd> <dd if="{status === \'stop\' || status === \'generating\' || status === \'intasks\' || maintenance.status === \'now_maintenance\'}" class="apps_url"> - </dd> <dt>PHP Version:</dt> <dd> <div class="col-lg-2"> <select id="php_version" class="form-control m-b" name="php_version"> <option value="5.5" __selected="{selected: php_version == 5.5}">5.5</option> <option value="5.6" __selected="{selected: php_version == 5.6}">5.6</option> <option value="7.0" __selected="{selected: php_version == 7.0}">7.0</option> </select> </div> </dd> </dl> </div> </div> <div class="row"> <div class="col-lg-12"> <dl class="dl-horizontal" if="{status !== \'generating\'}"> <dt></dt> <dd> <span if="{maintenance.status === \'now_maintenance\' && maintenance.target.indexOf(\'container\') >= 0}">Sorry. Now maintenance. App can&apos;t be used</span><br> <button if="{status === \'stop\' || status === \'starting\' || status === \'intasks\'}" id="start_app" class="ladda-button ladda-button-demo btn btn-success" type="button" data-style="expand-right" onclick="{create_container}" __disabled="{disabled: maintenance.status === \'now_maintenance\' && maintenance.target.indexOf(\'container\') >= 0 || status === \'intasks\'}"> <i class="fa fa-play-circle"></i>&nbsp;&nbsp; <span class="bold">Start App</span> </button> <button if="{status === \'start\' || status === \'error\'}" id="stop_app" class="ladda-button ladda-button-demo btn btn-warning" type="button" data-style="expand-right" onclick="{delete_container}" __disabled="{disabled: maintenance.status === \'now_maintenance\' && maintenance.target.indexOf(\'container\') >= 0}"> <i class="fa fa-stop"></i>&nbsp;&nbsp; <span class="bold">Stop App</span> </button> <button if="{status !== \'inimport\'}" id="createArchive" class="ladda-button ladda-button-demo btn btn-warning" type="button" data-style="expand-right" onclick="{createArchive}" __disabled="{disabled: maintenance.status === \'now_maintenance\' && maintenance.target.indexOf(\'container\') >= 0 || status === \'start\' || status === \'starting\'}"> <i class="fa fa-file-zip-o"></i>&nbsp;&nbsp; <span class="bold">Export as a new archive</span> </button> </dd> </dl> </div> <div class="row m-t-sm"> <div class="col-lg-12"> <resource-monitor></resource-monitor> </div> </div> <div class="row m-t-sm"> <div class="col-lg-12"> <div class="panel blank-panel"> <div class="panel-heading"> <div class="panel-options"> <ul class="nav nav-tabs"> <li class="active"><a href="#tab-1" data-toggle="tab">Generate History</a></li> </ul> </div> </div> <div class="panel-body"> <div class="tab-content"> <div class="tab-pane active" id="tab-1"> <table class="table table-striped"> <thead> <tr> <th>Owner</th> <th>Published Date</th> <th>Status</th> <th>Message</th> </tr> </thead> <tbody> <tr each="{h, i in histories}"> <td> {username} </td> <td> {moment(h.update_time).format(⁗MMM Do YYYY, h:mm:ss a⁗)} </td> <td> {h.progress} </td> <td> {h.progress === \'fail\' ? h.message : \'\'} </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> <div class="modal inmodal" id="attach-domain" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content animated bounceInRight"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> <h4 class="modal-title">Attach Domain</h4> </div> <div class="modal-body"> <p>Choose the domain to attach your published site on the project. <br>After assigning domain, you should configure your DNS server to access published site with your domain.<br>e.g. Set Published URL to the CNAME record for your domain;<br>Set Published URL to the CNAME record of your domain with www prefix (www.example.com); <br>Set Published URL to the A record (or alias record) of your domain.<br>Attaching domain takes 10-15 minutes to complete.</p> <h3>Notice!</h3> <p>Assigning Zone Apex to Shifter, you should use DNS service who supports it. <br> <a href="https://getshifter.zendesk.com/hc/en-us/articles/115001014908" target="_blank">See more detail</a> </p> <div class="form-group"> <label>Domain Name</label> <select class="form-control m-b" id="attachedDomains"> <option each="{h, i in validDomains}" value="{h}">{h}</option> </select> </div> </div> <div class="modal-footer"> <button type="button" class="btn btn-white" data-dismiss="modal">Close</button> <button id="attachDomain" type="button" class="btn btn-primary ladda-button ladda-button-demo" data-style="expand-right" onclick="{attachDomain}">Attach</button> </div> </div> </div> </div> <init></init>', 'project_detail .link-disabled,[riot-tag="project_detail"] .link-disabled,[data-is="project_detail"] .link-disabled{ pointer-events: none; cursor: default; text-decoration: none; } #publishing { margin-bottom: 20px; }', '', function(opts) {
        this.site_id   = this.opts.project_id
        this.items     = []
        this.histories = []
        this.username  = cognitoUser.username
        this.project_endpoint = endpoint.projects
        this.latest_gen_history
        this.notificationId
        this.status
        this.validDomains = []

        this.apps = {
            step: ''
        }

        this.gen = {
            step: '',
            progress: 0
        }

        var self = this
        self.update()

        self.notificationId = window.sessionStorage.getItem(this.site_id+'_notificationId')
        self.status = window.sessionStorage.getItem(this.site_id+'_status')

        var data = window.sessionStorage.getItem(this.site_id+'_apps')
        if ( data && typeof data === 'string' ) {
            self.apps = JSON.parse(window.sessionStorage.getItem(this.site_id+'_apps'))
        }

        var data = window.sessionStorage.getItem(this.site_id+'_gen')
        if ( data && typeof data === 'string' ) {
            self.gen = JSON.parse(window.sessionStorage.getItem(this.site_id+'_gen'))
        }

        self.wp_status_msg = {
            BOOTING: {
                title: 'Now start to import app.',
                message: 'Successfully creating the project! Now importing from archive.',
                progress: 0
            },
            INITIALIZING: {
                title: 'Initializing',
                message: '',
                progress: 10
            },
            DOWNLOADING_ARCHIVE: {
                title: 'Importing Archive',
                message: '',
                progress: 20
            },
            EXTRACTING_ARCHIVE: {
                title: 'Extracting Archive',
                message: '',
                progress: 30
            },
            REPLACEING_URLS: {
                title: 'Configuring Database',
                message: '',
                progress: 80
            },
            COMPLETE: {
                title: 'Running',
                message: 'The app wiil be terminated after 60 mins. Enjoy!',
                progress: 100
            },
            ERROR_EXIT: {
                title: 'Fail to launch app. (Code: ERROR_EXIT)',
                message: 'Error occurred. Contact support desk with Published Site ID.',
                progress: 0
            },
            ERROR_WAIT: {
                title: 'Fail to launch app. (Code: ERROR_EXIT)',
                message: 'Error occurred. Contact support desk with Published Site ID.',
                progress: 0
            },
            ERROR_INVALID_ARCHIVE: {
                title: 'Invalid Archive format.(Code: ERROR_INVALID_ARCHIVE)',
                message: '',
                progress: 0
            },
            ERROR_WORDPRESS_NOT_FOUND_IN_ARCHIVE: {
                title: 'WordPress not found in your Archive.(Code: ERROR_WORDPRESS_NOT_FOUND_IN_ARCHIVE)',
                message: '',
                progress: 0
            }
        }

        self.gen_status_msg = {
            initial: {
                title: 'Start to Generate',
                message: ''
            },
            queuing: {
                title: 'Initializing',
                message: ''
            },
            recieve_url: {
                title: 'Now Generating',
                message: ''
            },
            injection: {
                title: 'Now Generating',
                message: ''
            },
            generate_url: {
                title: 'Now Generating',
                message: ''
            },
            finished: {
                title: 'Generation has completed',
                message: ''
            },
            fail: {
                title: 'Fail to generate',
                message: 'Error occurred. Contact support desk with Published Site ID.'
            }
        }

        toastr.options = {
            "closeButton": true,
            "debug": false,
            "progressBar": false,
            "preventDuplicates": false,
            "positionClass": "toast-bottom-right",
            "onclick": null,
            "showDuration": "400",
            "hideDuration": "1000",
            "timeOut": "7000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        var ajaxRequestProjectDetail = {
            getGenerateHistory: function getGenerateHistory() {
                return get(endpoint.genhistory + self.site_id ).then(function(response) {
                    if ( response.body.Items.length !== 0 ) {
                        self.latest_gen_history = response.body.Items[0].progress
                        var max = response.body.Items.length
                        for (var i=0; i < max; i++) {
                          if (response.body.Items[i].progress !== 'finished' && response.body.Items[i].progress !== 'fail') {
                            continue
                          }
                          self.histories.push(response.body.Items[i])
                        }
                        self.update()
                    }
                })
            },
            getProject: function getProject() {
                return get(endpoint.projects + self.site_id).then(function(response) {
                    self.project_name = response.body.Item.site_name
                    self.site_name    = response.body.Item.site_name
                    self.access_url   = response.body.Item.access_url
                    self.domain_name  = response.body.Item.domain === 'null' ? '' : response.body.Item.domain
                    self.stock_state  = response.body.Item.stock_state
                    self.php_version  = response.body.Item.php_version
                    self.update_time  = response.body.Item.update_time ? moment(response.body.Item.update_time).format("MMM Do YYYY, h:mm:ss a") : '-';
                    self.disk_usage = getDiskUsage(response.body.Item.disk_usage)
                    if (self.stock_state === 'inimport') {
                      self.status = 'inimport'
                      window.sessionStorage.setItem(self.site_id+'_status', self.status)
                    }
                    if (self.status !== 'inimport') {
                      if (self.status !== 'starting') {
                        self.docker_url = response.body.Item.docker_url
                      } else {
                        setTimeout(function() {
                          self.docker_url = response.body.Item.docker_url
                          self.update()
                        },5000)
                      }
                    }
                    self.update()
                })
            },
            getResources: function getProject() {
                return get( endpoint.transactions + self.site_id ).then( function ( response ) {
                    riot.mount( 'resource-monitor', {
                        "resource" : response.body
                    } );
                } );
            },
            getValidDomains: function getValidDomains() {
                return get( endpoint.domains+'?filter=acmValid' ).then( function ( response ) {
                    if (response.body.statusCode === 201) {
                      self.validDomains = response.body.items
                    }
                } );
            }
        }

      function main() {
        return Promise.all([
          ajaxRequestProjectDetail.getGenerateHistory(),
          ajaxRequestProjectDetail.getProject(),
          ajaxRequestProjectDetail.getResources(),
          ajaxRequestProjectDetail.getValidDomains()
        ])
      }

      init().then(function() {
        self.creditCardStatus = userStatus.creditCardStatus
        return main()
      }).then(function (value) {
        editable('#project_name')

        if ( self.status === 'inimport' && self.notificationId) {
          $('#container_progress').removeClass('hidden')
          display()
          processAppStart(self.notificationId, 'create')

        } else if ( self.stock_state === 'inservice' && self.status === 'starting' && self.notificationId ) {
          display()
          processAppStart(self.notificationId, 'start')

        } else if (self.stock_state === 'ingenerate') {
          self.status = 'generating'
          display()
          self.update()
          processGenerate()

        } else if (self.stock_state === 'intasks' && self.notificationId) {
          self.status = 'intasks'
          display()
          self.update()
          processCreateArchive(self.notificationId)
        } else {
          switch(self.stock_state) {
            case 'inservice':
              self.status = 'start'
              break;
            case 'inuse':
              self.status = 'stop'
              break;
          }
          window.sessionStorage.setItem(self.site_id+'_status', self.status)
          self.update()
          display()
        }

      }).catch(function(error){
        switch(error.statusCode) {
          case 401:
            riot.route('/')
            break;
          default:
            toastr.warning(error.message,'Error occurred.')
            break;
        }
      })

      this.checkIsCardResigtered = function() {
        if ( self.creditCardStatus !== 'registered') {
            notifyUnregistedCreditCard()
            return false
        }
        return true
      }.bind(this)

      this.create_staticsite = function(e) {
        if ( ! self.checkIsCardResigtered()) {
            return
        }
        swal({
          title: "Are your sure?",
          text: " Any unsaved changes will be discarded if you generate and publish.",
          type: "success",
          showCancelButton: true,
          confirmButtonColor: "#dc2d69",
          confirmButtonText: "Yes",
          closeOnConfirm: true
        }, function () {
          if (maintenance.status === 'now_maintenance'
            && (maintenance.target.indexOf('generator') >= 0 || maintenance.target.indexOf('container')) >= 0) {
            toastr.warning('', 'Now maintenance. Generate can&apos;t be used.')
            return
          }

          self.status = 'generating'
          self.gen.step   = 'initial'
          window.sessionStorage.setItem(self.site_id+'_gen', JSON.stringify(self.gen))
          self.update()

          post(endpoint.staticsites + self.site_id).then(function(response){
            if ( response.body.errorMessage !== undefined && response.body.errorMessage.indexOf('Task timed out after') !== -1 ) {
              location.reload( true )
              return
            }

            if ( JSON.parse(response.body.Payload).status !== 200 ) {
              btn.ladda( 'stop' )
              toastr.warning('','Error occurred.')
              return
            }

            processGenerate()
          }).catch(function(error){
            btn.ladda( 'stop' )
            toastr.warning(error.message, 'Error occurred.')
            self.update()
            return
          })
        })
      }.bind(this)

      this.create_container = function(e) {
        if ( ! self.checkIsCardResigtered()) {
            return
        }
        if (maintenance.status === 'now_maintenance' && maintenance.target.indexOf('container') >= 0) {
          toastr.warning('', 'Now maintenance. App can&apos;t be used.')
          return
        }

        self.docker_url  = ''
        self.status = 'starting'
        window.sessionStorage.setItem(self.site_id+'_status', self.status)

        var btn = $( '#start_app' ).ladda()
        btn.ladda( 'start' )

        var putEndpoint = endpoint.containers+self.site_id
        var putParams   = {
          php_version:$('select[name=php_version]').children('option:selected').val()
        }
        put(putEndpoint, putParams).then(function(response) {
          var wpres = JSON.parse(response.body.Payload)
          if ( wpres.status === 201 ) {
            setTimeout(function() {
              self.docker_url = wpres.docker_url
              self.update()
            },5000)

            window.sessionStorage.setItem(self.site_id+'_notificationId', wpres.notificationId)
            processAppStart(wpres.notificationId, 'start')
          }
        }).catch(function(error){
          btn.ladda( 'stop' )
          toastr.warning(error.message, 'Error occurred.')
          self.update()
          return
        })
      }.bind(this)

      this.delete_container = function(e) {
        if (maintenance.status === 'now_maintenance' && maintenance.target.indexOf('container') >= 0) {
          toastr.warning('', 'Now maintenance. App can&apos;t be used.')
          return
        }

        var btn = $( '#stop_app' ).ladda()
        btn.ladda( 'start' )
        self.update()

        del(endpoint.containers+self.site_id).then(function(response){
          btn.ladda('stop');
          self.status = 'stop'
          self.update()
          toastr.success('','App has been stopped.')
        }).catch(function(error){
          btn.ladda('stop')
          toastr.warning(error.message, 'Error occurred.')
          return
        })
      }.bind(this)

      this.delete_staticsite = function(e) {
        if (maintenance.status === 'now_maintenance' && maintenance.target.indexOf('container') >= 0) {
          toastr.warning('', 'Now maintenance. Delete your site can&apos;t be used.')
          return
        }

        var btn = $( '#delete_publish_site' ).ladda()
        swal({
          title: "Would you like to proceed?",
          text: "Delete your publish site. This operation cannot be undone.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc2d69",
          confirmButtonText: "Yes, delete it",
          closeOnConfirm: true
        }, function () {
          btn.ladda('start')
          del(endpoint.staticsites + self.site_id).then(function(response){
            btn.ladda('stop')
            toastr.success('','publish site deleted.')
            self.latest_gen_history = 'static_delete'
            self.update()
          }).catch(function(error){
            btn.ladda('stop')
            toastr.warning(error.message,'Error occurred.')
            return
          })
        })
      }.bind(this)

      this.attachDomain = function(e) {
        if ( ! self.checkIsCardResigtered()) {
            $('#attach-domain').modal('hide')
            return
        }
        swal({
          title: "Is your domain Zone Apex?",
          text: "Assigning Zone Apex to Shifter, you should use DNS service who supports it.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc2d69",
          confirmButtonText: "I agree",
          closeOnConfirm: true
        }, function () {
            var btn = $('#attachDomain').ladda()
            btn.ladda('start')
            post(endpoint.domains+self.attachedDomains.value, {action:'addToCloudFront',site_id:self.site_id}).then(function(response) {
              if(response.body.statusCode === 201) {
                btn.ladda('stop')
                $('#attach-domain').modal('hide')
                self.domain_name = self.attachedDomains.value
                self.update()
                toastr.success('', 'Attached domain Successfuly')
                return
              } else {
                btn.ladda('stop')
                return Promise.reject('error occurs')
              }
            }).catch(function(error){
              btn.ladda('stop')
              toastr.warning(error,'')
              return
            })
        })
      }.bind(this)

      this.dettachDomain = function(e) {
        swal({
          title: "Would you like to proceed?",
          text: "To remove the domain from the published site, click Yes. Detaching domain takes 10-15 minutes to complete.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc2d69",
          confirmButtonText: "Yes",
          closeOnConfirm: true
        }, function () {
          del(endpoint.domains+self.domain_name, {action: 'removeDomain'}).then(function(response) {
            if (response.body.statusCode === 201) {
              toastr.success('','Dettach domain successfully')
              self.domain_name = ''
              self.update()
              return
            } else {
              return Promise.reject('error occurs')
            }
          }).catch(function(error){
            toastr.warning(error.message,'Error occurs')
            return
          })
        })
      }.bind(this)

      this.createArchive = function(e) {
        if ( ! self.checkIsCardResigtered()) {
            return
        }
        var btn = $( '#createArchive' ).ladda()
        btn.ladda('start')
        self.status = 'intasks'
        window.sessionStorage.setItem(self.site_id+'_status', self.status)
        post(endpoint.archives + '?task=createArchive', {site_id:self.site_id,accessToken:session_id}).then(function(response){
          if (response.body.errorMessage !== undefined) {
            return Promise.reject(response.body.errorMessage)
          }

          if (response.body.statusCode === 201) {
            window.sessionStorage.setItem(self.site_id+'_notificationId', response.body.notificationId)
            processCreateArchive(response.body.notificationId)
          } else {
            return Promise.reject('Unknown error')
          }
        }).catch(function(error){
          self.status = 'stop'
          btn.ladda('stop')
          toastr.warning(error.message, 'Error occurred.')
          self.update()
          return
        })
      }.bind(this)

      this.on('mount', function() {
        $(document).ready(function(){
          loading()
        })
      })

      function processCreateArchive(notificationId) {
        var btn = $( '#createArchive' ).ladda()
        btn.ladda( 'start' )

        var intervalID = setInterval(function() {
          get(endpoint.containers + self.site_id + '?notification_id='+notificationId).then(function(response) {
            if ( response.body.errorMessage !== undefined && response.body.errorMessag ) {
              if (response.body.errorMessage === 'Access Denied') {
                return
              }
            }

            self.apps.step = response.body
            window.sessionStorage.setItem(self.site_id+'_apps', JSON.stringify(self.apps))
            self.update()
            if (self.apps.step === 'ERROR_EXIT') {
              clearInterval(intervalID)
              toastr.warning('Error occurred.')
              self.status = 'stop'
              self.update()
              btn.ladda( 'stop' )
              return
            } else if ( self.apps.step === 'COMPLETE' ) {
              clearInterval(intervalID)
              toastr.success('Archive created. Please check Archive List.')
              self.status = 'stop'
              window.sessionStorage.setItem(self.site_id+'_status', self.status)
              self.update()
              btn.ladda( 'stop' )
              return
            }
          }).catch(function(error){
            self.status = 'stop'
            btn.ladda( 'stop' )
            toastr.warning(error.message, 'Error occurred.')
            self.update()
            return
          })
        },3000)
      }

      function processGenerate() {
        var intervalID = setInterval(function() {
          get(endpoint.staticsites + self.site_id).then(function(response){
            self.gen.progress    = response.body.percent
            self.gen.step        = response.body.step
            self.gen.sum_url     = response.body.sum_url
            self.gen.created_url = response.body.created_url
            self.update_time     = response.body.update_time
            self.message         = response.body.message
            self.disk_usage      = getDiskUsage(response.body.disk_usage)
            window.sessionStorage.setItem(self.site_id+'_gen', JSON.stringify(self.gen))
            self.update()
            $( '#generate_progress .progress-bar' ).attr("style", "width:"+self.gen.progress+"%;")
            if ( self.gen.step === 'finished' || self.gen.step === 'fail' ) {
              clearInterval(intervalID)
              $( '#generate_progress .progress-bar' ).attr("style", "width:0%;")
              window.sessionStorage.removeItem(self.site_id+'_gen')
              self.histories.unshift({
                update_time:self.update_time,
                progress: self.gen.step,
                message:  self.message
              })
              if ( self.gen.step === 'finished' ) {
                toastr.success('Successfuly generated and published your site. To visit your site, click Published Site URL','Site generation completed')
              } else if ( self.gen.step === 'fail' ) {
                toastr.warning(self.message, 'Site generation failed')
              }
              self.status = 'stop'
              self.gen.sum_url = 0
              self.gen.created_url = 0
              self.update()
            }
          }).catch(function(error){
            toastr.warning(error.message, 'Error occurred.')
            self.update()
            return
          })
        }, 10000)
      }

      function processAppStart(notificationId, mode) {
        var btn = $( '#start_app' ).ladda()
        btn.ladda( 'start' )
        var intervalID = setInterval(function() {
          get(endpoint.containers + self.site_id + '?notification_id='+notificationId).then(function(response) {
            if ( response.body.errorMessage !== undefined && response.body.errorMessag ) {
              if (response.body.errorMessage === 'Access Denied') {
                return
              }
            }

            self.apps.step = response.body
            window.sessionStorage.setItem(self.site_id+'_apps', JSON.stringify(self.apps))
            self.update()
            if ( self.apps.step === 'ERROR_EXIT' || self.apps.step === 'ERROR_WORDPRESS_NOT_FOUND_IN_ARCHIVE'
              || self.apps.step === 'ERROR_WAIT' || self.apps.step === 'ERROR_INVALID_ARCHIVE' ) {
              clearInterval(intervalID)
              toastr.warning('Error occurred.')
              self.status = 'error'
              self.update()
              btn.ladda( 'stop' )
              return
            } else if ( self.apps.step === 'COMPLETE' ) {
              clearInterval(intervalID)
              if (mode === 'create') {
                toastr.success('Importing to app from archive successfully. Enjoy!')
                self.status = 'stop'
              } else {
                toastr.success('The app wiil be terminated after 60 mins. Enjoy!','App is running.')
                self.status = 'start'
              }
              window.sessionStorage.setItem(self.site_id+'_status', self.status)
              self.update()
              btn.ladda( 'stop' )
              return
            }
          }).catch(function(error){
            self.status = 'stop'
            btn.ladda( 'stop' )
            toastr.warning(error.message, 'Error occurred.')
            self.update()
            return
          })
        },3000)
      }

      function getDiskUsage(byte) {
        if (byte < 1024) {
          return byte + ' KB'
        }

        var _pow = Math.pow(10, 2)
        byte = Math.round( (byte / 1024) * _pow ) / _pow
        if (byte < 1024) {
          return byte + ' MB'
        }

        byte = Math.round( (byte / 1024) * _pow ) / _pow
        if (byte < 1024) {
          return byte + ' GB'
        }
      }
});

riot.tag2('project_new', '<div id="wrapper"> <sidebar></sidebar> <div id="page-wrapper" class="gray-bg"> <commonheader></commonheader> <div class="row wrapper border-bottom white-bg page-heading"> <div class="col-lg-10"> <h2>Create New Project</h2> <ol class="breadcrumb"> <li> <a href="/#console">Home</a> </li> <li> <a href="/#projects">Project List</a> </li> <li class="active"> <strong>Create New Project</strong> </li> </ol> </div> </div> <div class="row"> <div class="spiner-example hidden" id="loading" style="height: 66px;"> <div class="sk-spinner sk-spinner-three-bounce"> <div class="sk-bounce1"></div> <div class="sk-bounce2"></div> <div class="sk-bounce3"></div> </div> </div> </div> <div id="main_box" class="wrapper wrapper-content animated fadeInRight hidden"> <div class="row"> <div class="col-lg-12"> <div class="ibox float-e-margins"> <div class="ibox-title"> <h5>Create New Project</h5> </div> <div if="{is_limit}" class="ibox-content"> <div class="alert alert-success alert-dismissable"> You can create {userStatus.upperLimitProjects} projects. </div> </div> <div if="{maintenance.status === \'now_maintenance\' && maintenance.target.indexOf(\'container\') >= 0}" class="ibox-content"> <div class="alert alert-success alert-dismissable"> Sorry. Now maintenance. you can&apos;t create new project. </div> </div> <div if="{!is_limit && items.length <= 0 && public_items.length <= 0 && (maintenance.status !== \'now_maintenance\' || maintenance.target.indexOf(\'container\') < 0 )}" class="ibox-content"> <div class="alert alert-success alert-dismissable"> No Archive. Go to <a href="/#archive">Archive page</a>, then upload new archive. </div> </div> <div if="{!is_limit && ( items.length > 0 || public_items.length > 0 ) && (maintenance.status !== \'now_maintenance\' || maintenance.target.indexOf(\'container\') < 0 )}" class="ibox-content"> <form method="get" class="form-horizontal" action="/#project_detail"> <div class="form-group"><label class="col-sm-2 control-label">Project Name</label> <div class="col-sm-10"><input id="website_name" type="text" class="form-control" required=""></div> </div> <div class="form-group"><label class="col-sm-2 control-label">PHP Version</label> <div class="col-sm-10"> <select id="php_version" class="form-control m-b" name="php_version" required=""> <option value="">Select</option> <option value="5.5">5.5</option> <option value="5.6">5.6</option> <option value="7.0">7.0</option> </select> </div> </div> <div if="{!opts.archive_id}" class="form-group"><label class="col-sm-2 control-label">Public Images</label> <div class="col-sm-10"> <table class="table table-hover"> <thead> <tr class="something"> <th class="col-md-1"></th> <th class="col-md-2">Name</th> <th class="col-md-2">Owner</th> <th class="col-md-5"></th> </tr> </thead> <tbody> <tr each="{public_item, i in public_items}"> <td> <input class="archive_id" type="radio" name="archive_id" value="{public_item.archive_id}"> </td> <td class="issue-info"> <label for="aichive1"> {public_item.archive_alias} </label> </td> <td> <label for="aichive1"> {public_item.archive_owner} </label> </td> <td> </td> </tr> </tbody> </table> </div> </div> <div if="{!opts.archive_id}" class="form-group"><label class="col-sm-2 control-label">User Archives</label> <div class="col-sm-10"> <table class="table table-hover"> <thead> <tr class="something"> <th class="col-md-1"></th> <th class="col-md-2">Name</th> <th class="col-md-2">Owner</th> <th class="col-md-5">Uploaded Date</th> </tr> </thead> <tbody> <tr each="{item, i in items}"> <td> <input class="archive_id" type="radio" name="archive_id" value="{item.archive_id}" __checked="{archive_checked}"> </td> <td class="issue-info"> <label for="aichive1"> {item.archive_alias} </label> </td> <td> <label for="aichive1"> {item.archive_owner} </label> </td> <td> <label for="aichive1"> {item.archive_create_date} </label> </td> </tr> </tbody> </table> </div> </div> <div if="{opts.archive_id}" class="form-group"><label class="col-sm-2 control-label">User Archives</label> <div class="col-sm-10"> <table class="table table-hover"> <thead> <tr class="something"> <th class="col-md-1"></th> <th class="col-md-2">Name</th> <th class="col-md-2">Owner</th> </tr> </thead> <tbody> <tr each="{item, i in items}"> <td> <input class="archive_id" type="radio" name="archive_id" value="{item.archive_id}" __checked="{archive_checked}"> </td> <td class="issue-info"> <label for="aichive1"> {item.archive_alias} </label> </td> <td> <label for="aichive1"> {item.archive_owner} </label> </td> </tr> </tbody> </table> </div> </div> <div class="hr-line-dashed"></div> <div class="form-group"> <div class="col-sm-4 col-sm-offset-2"> <button id="btn_project_new" class="ladda-button ladda-button-demo btn btn-primary" type="button" onclick="{createProject}" data-style="expand-right">Create New Project</button> </div> </div> </form> </div> </div> </div> </div> </div> </div> </div> <init></init>', '', '', function(opts) {
    if (this.opts.archive_id && this.opts.archive_id !== undefined) {
      this.archive_id = this.opts.archive_id
      this.archive_checked = true
    } else {
      this.archive_checked = false
    }
    this.items = []
    this.public_items = []
    var site_id
    var self = this

    toastr.options = {
      "closeButton": true,
      "debug": false,
      "progressBar": false,
      "preventDuplicates": false,
      "positionClass": "toast-bottom-right",
      "onclick": null,
      "showDuration": "400",
      "hideDuration": "1000",
      "timeOut": "7000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }

    var requestProjectNew = {
      getPublicArchive: function getPublicArchive() {
        return get(endpoint.archives + '?task=getPublicArchive').then(function(response) {
          if ( Object.keys(response.body).length ) {
            response.body.forEach(function(item, i){
              var pub_data = {
                archive_id:item.archive_id,
                archive_alias:item.archive_alias,
                archive_owner:item.archive_owner,
                archive_create_date:moment(item.archive_create_date).format('MMM Do YYYY, h:mm:ss a')
              }
              self.public_items.push(pub_data)
            })
          }
        })
      },
      getArchive: function getArchive() {
        return get(endpoint.archives).then(function(response) {
          if ( Object.keys(response.body).length ) {
            response.body.forEach(function(item, i){
              var data = {
                archive_id:item.archive_id,
                archive_alias:item.archive_alias,
                archive_owner:item.archive_owner,
                archive_create_date:moment(item.archive_create_date).format('MMM Do YYYY, h:mm:ss a')
              }
              self.items.push(data)
            })
          }
        })
      }
    }

    function getArchiveAll() {
      return Promise.all([
        requestProjectNew.getPublicArchive(),
        requestProjectNew.getArchive()
      ])
    }

    init().then(function() {
      self.creditCardStatus = userStatus.creditCardStatus
      return get(endpoint.projects)
    }).then(function (response) {
      if ( response.body.errorMessage !== undefined ){
        return Promise.reject(response.body.errorMessage)
      }

      if (response.body.length >= userStatus.upperLimitProjects) {
        self.is_limit = true
        self.update()
        display()
        return Promise.resolve()
      }

      if (self.archive_id && self.archive_id !== undefined) {
        return get(endpoint.archives + self.archive_id).then(function(response) {
          var data = {
            archive_id:response.body.Item.archive_id,
            archive_alias:response.body.Item.archive_alias,
            archive_owner:response.body.Item.archive_owner,
            archive_create_date:moment(response.body.Item.archive_create_date).format('MMM Do YYYY, h:mm:ss a')
          }

          self.items.push(data)
          self.update()
          display()
        })
      } else {
        return getArchiveAll().then(function(response) {
          self.update()
          display()
        })
      }
    }).catch(function(error){
      toastr.warning(error,'')
      return
    })

    this.createProject = function(e) {
      if ( self.creditCardStatus !== 'registered') {
          notifyUnregistedCreditCard()
          return
      }

      function createProjectErrorLabels() {
        btn.ladda( 'stop' );

        if (!self.website_name.value || self.website_name.value === 'null') {
          toastr.warning('Project / Site Name', 'Required');
          self.website_name.focus();
        } else if ( !self.php_version.value ) {
          toastr.warning('Assign PHP version', 'Required');
          self.php_version.focus();
        }
      }

      if (maintenance.status === 'now_maintenance' && maintenance.target.indexOf('container') >= 0) {
        toastr.warning('', "We're currently preforming maintence and new projects can't be created. Check back soon.")
        return
      }

      var btn = $( '#btn_project_new' ).ladda()
      btn.ladda( 'start' )

      if ($("input[name='archive_id']:checked").val() === undefined) {
        createProjectErrorLabels();
        return
      }

      var postData = {
        projectName:self.website_name.value,
        phpVersion:$('select[name=php_version]').children('option:selected').val()
      }
      var postEndpoint = endpoint.projects + '?archive_id='+$("input[name='archive_id']:checked").val()
      post(postEndpoint, postData).then(function(response) {
        if ( response.body.errorMessage !== undefined ){
          btn.ladda( 'stop' )
          return Promise.reject(response.body.errorMessage)
        } else {
          site_id = response.body.site_id

          var postData = {
            archive_id:$("input[name='archive_id']:checked").val()
          }
          var postEndpoint = endpoint.containers + site_id
          return post(postEndpoint, postData)
        }
      }).then(function(response) {
        if ( response.body.errorMessage !== undefined && response.body.errorMessage.indexOf('Task timed out after') !== -1 ) {
          location.reload( true )
          return
        }

        var wpres = JSON.parse(response.body.Payload)
        if ( wpres.status === 201 ) {
          var apps = {
            step: 'BOOTING'
          }
          window.sessionStorage.setItem(site_id+'_notificationId', wpres.notificationId)
          window.sessionStorage.setItem(site_id+'_status', 'inimport')
          window.sessionStorage.setItem(site_id+'_apps', JSON.stringify(apps))
          riot.route('/project_detail/'+site_id)
        } else {
          return Promise.reject('Internal Server Error')
        }
      }).catch(function(error) {
        createProjectErrorLabels();
        return
      })
    }.bind(this)

    this.on('mount', function() {
      $(document).ready(function(){
        loading()
      })
    })
});

riot.tag2('projects', '<div id="wrapper"> <sidebar></sidebar> <div id="page-wrapper" class="gray-bg"> <commonheader></commonheader> <div class="row wrapper border-bottom white-bg page-heading"> <div class="col-sm-4"> <h2>Project</h2> <ol class="breadcrumb"> <li> <a href="/">Home</a> </li> <li class="active"> <strong>Project List</strong> </li> </ol> </div> </div> <div class="row"> <div class="spiner-example hidden" id="loading" style="height: 66px;"> <div class="sk-spinner sk-spinner-three-bounce"> <div class="sk-bounce1"></div> <div class="sk-bounce2"></div> <div class="sk-bounce3"></div> </div> </div> </div> <div class="row"> <div class="col-lg-12"> <div id="main_box" class="wrapper wrapper-content animated fadeInUp hidden"> <div class="ibox"> <div class="ibox-title"> <h5>All Projects</h5> <div class="ibox-tools" if="{maintenance.status !== \'now_maintenance\' || maintenance.target.indexOf(\'container\') < 0}"> <a href="/#project_new" class="btn btn-primary btn-xs" if="{!is_limit}">Create New Project</a> </div> </div> <div if="{items.length <= 0}" class="ibox-content"> <div class="alert alert-success alert-dismissable"> No projects available, create new one. </div> </div> <div if="{items.length >= userStatus.upperLimitProjects}" class="ibox-content"> <div class="alert alert-success alert-dismissable"> The projects and archived projects are up to {userStatus.upperLimitProjects}, if you need more, <a href="https://getshifter.zendesk.com/hc/en-us/requests/new" target="_blank">submit a higher limit request</a>. </div> </div> <div if="{items.length > 0}" class="ibox-content"> <div class="project-list"> <table class="table table-hover"> <thead> <tr> <th>Name</th> <th>Owner</th> <th>Published Date</th> <th>Action</th> </tr> </thead> <tbody> <tr each="{item, i in items}"> <td> <a href="/#project_detail/{item.site_id}">{item.site_name}</a> </td> <td> {item.site_owner} </td> <td> {item.update_time} </td> <td> <div class="tooltip-demo"> <a class="btn btn-white btn-xs delete_archive" data-index="{i}" data-site_id="{item.site_id}" data-site_name="{item.site_name}" onclick="{delete_website}" if="{maintenance.status !== \'now_maintenance\' || maintenance.target.indexOf(\'container\') < 0}"> <i class="fa fa-trash-o" data-index="{i}" data-site_id="{item.site_id}" data-site_name="{item.site_name}" onclick="{delete_website}" data-toggle="tooltip" data-placement="bottom" title="Delete Project" data-original-title="Delete Files"></i> </a> </div> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> </div> </div> <init></init>', '', '', function(opts) {
    this.items = []
    var self  = this

    init().then(function() {
      return get(endpoint.projects)
    }).then(function (response) {
      if ( !Object.keys(response.body).length ) {
        self.update()
        display()
        return
      }

      if (response.body.length >= userStatus.upperLimitProjects) {
        self.is_limit = true
      }

      response.body.forEach(function(item, i){
        var data = {
          site_id:item.site_id,
          site_name:item.site_name,
          site_owner:item.site_owner,
          update_time:!item.update_time ? '-' : moment(item.update_time).format("MMM Do YYYY, h:mm:ss a"),
          cf_url:item.cf_url,
          docker_url:item.docker_url
        }
        self.items.push(data)
      })
      self.update()
      display()
    }).catch(function(error){
      switch(error.statusCode) {
        case 401:
          riot.route('/')
          break
      }
    })

    this.delete_website = function(e) {
      if (maintenance.status === 'now_maintenance' && maintenance.target.indexOf('container') >= 0) {
        toastr.warning('', 'Sorry. Now maintenance. Delete project can&apos;t be used.')
        return
      }

      swal({
        title: "Would you like to proceed?",
        text: "Delete your ["+e.target.dataset.site_name+"] project. This operation cannot be undone.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2d69",
        confirmButtonText: "Yes, delete it",
        closeOnConfirm: true
      }, function () {
        del(endpoint.projects + e.target.dataset.site_id).then(function(response){
          if ( response.body.errorMessage !== undefined ){
            return Promise.reject(response.body.errorMessage)
          }

          self.items.splice(e.target.dataset.index, 1)
          if (self.items.length < userStatus.upperLimitProjects) {
            self.is_limit = false
          }
          self.update()
          toastr.success('deleted','')
        }).catch(function(error){
          toastr.warning(error,'')
          return
        })
      })
    }.bind(this)

    this.on('mount', function() {
      $(document).ready(function(){
        loading()
      })
    })

});

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

riot.tag2('releasenote', '<div id="wrapper"> <sidebar></sidebar> <div id="page-wrapper" class="gray-bg"> <commonheader></commonheader> <div class="wrapper wrapper-content animated fadeInRight article"> <div class="row"> <div class="col-lg-10 col-lg-offset-1"> <div class="ibox"> <div class="ibox-content"> <div class="text-center article-title"> <h1> Release notes </h1> </div> <div class="text-center "> <h2> 2016/10/20 </h2> </div> <ul> <li>Add release note section.</li> <li>Modify and update UI. <ul> <li>Fixed a few minor bugs.</li> </ul></li> <li>Changes on published site. <ul> <li>Add Expires header each MIME Type. <ul> <li><code>css</code>, <code>Javascript</code> =&gt; 1 month</li> <li><code>image</code> =&gt; 1 year</li> <li><code>application/*</code> =&gt; 1 week</li> <li>others =&gt; 1 day</li> </ul></li> </ul></li> <li>Fixed &#8220;404 Not Found&#8221; bugs for some posts.</li> <li>Speed up WordPress <ul> <li>Modifying some server parameter gives WordPress to accelerate.</li> </ul></li> </ul> </div> </div> </div> </div> </div> </div> </div>', '', '', function(opts) {
});

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

riot.tag2('resource-monitor', '<section if="{!! opts.resource}"> <h1>Monthly Data Transfer Rate (GB)</h1> <table class="table table-bordered"> <thead> <tr> <th each="{months}" style="text-align: center;">{month}</th> </tr> </thead> <tbody> <tr> <td each="{months}" style="text-align: right;">{transfered} GB</td> </tr> </tbody> </table> </section>', '', '', function(opts) {
        var now = new Date();

        this.months = [];
        for ( var i = 0; i < 12; i++ ) {
            var current = new Date( now.getFullYear(), now.getMonth() - i, 1 );
            var yyyy = ( current.getFullYear() ).toString();
            var mm = ( "0" + ( current.getMonth() + 1 ).toString() ).slice( -2 );

            var transfered = "";
            if ( opts.resource && opts.resource[ yyyy + mm ] ) {
                transfered = opts.resource[ yyyy + mm ].transferGb
            } else {
                transfered = "0";
            }

            this.months[ this.months.length ] = {
                "month": moment( current ).format( "MMM. YYYY" ),
                "transfered": transfered
            };
        }
});

riot.tag2('roadmap', '<div id="wrapper"> <sidebar></sidebar> <div id="page-wrapper" class="gray-bg"> <commonheader></commonheader> <div class="wrapper wrapper-content animated fadeInRight article"> <div class="row"> <div class="col-lg-10 col-lg-offset-1"> <div class="ibox"> <div class="ibox-content"> <div class="text-center article-title"> <h1> Development Roadmap </h1> </div> <article class="ibox-content"> <h2>Visualizing Usage</h2> <div class=""> <p>Transfer Usage</p> </div> <div class=""> <p>Storage Usage</p> </div> </article> <article class="ibox-content"> <div> <h2>Custom Domain Support</h2> <div class=""> <p>Supports mapping your own domain name to your shifter site(s).</p> </div> </div> </article> <article class="ibox-content"> <div class=""> <h2>Multi factor authentication (MFA) *</h2> <p>Shifter will supports Multi factor authentication (MFA) for adding more security.</p> </div> </article> <article class="ibox-content"> <div class=""> <h2>Export the Project as new archive *</h2> <p>Generate specify page you want.</p> </div> </article> <article class="ibox-content"> <div class=""> <h2>Generate it the day</h2> <p>You can schedule the date and time to generate your site.</p> </div> </article> <article class="ibox-content"> <div class=""> <h2>Import Archive from external URL</h2> <p>Import archive files from the other website</p> <p>e.g. Dropbox, Google Drive.</p> </div> </article> <article class="ibox-content"> <div class=""> <h2>Delete Storage files *</h2> <p>Selective delete storage files. </p> </div> </article> <article class="ibox-content"> <div class=""> <h2>Adding sub users</h2> <p>Of course, you can grant role to sub users</p> </div> </article> <article class="ibox-content"> <div class=""> <h2>Operation logs in user console *</h2> <p>Check your operation logs what the Shifter, sub users and you have done.</p> </div> </article> <article class="ibox-content"> <div class=""> <h2>Manage WordPress files through SFTP</h2> <p>You can upload WordPress file your favourite SFTP client (Cyberduc, ForkLIFT or other SFTP clients)</p> </div> </article> <article class="ibox-content"> <div class=""> <h2>Command line inter face for Shifter a.k.a "WP-CLI for shifter"</h2> <p>Control the Shifter by your typing. Publishing the site through your Terminal.app on your PC or Mac.</p> </div> </article> <article class="ibox-content"> <div class=""> <h2>Notify results of the generation *</h2> <p>Shifter notifies you the result of the site generation.</p> </div> </article> <article class="ibox-content"> <div class=""> <h2>Go hand-in-hand with our help desk<h2> <h3>FAQ</h3> <h3>Chat support</h3> <h3>Ticket support</h3> <p></p> </div> </article> </div> </div> </div> </div> </div> </div> </div>', '', '', function(opts) {
});

riot.tag2('sidebar', '<nav class="navbar-default navbar-static-side" role="navigation"> <div class="sidebar-collapse"> <ul class="nav metismenu" id="side-menu"> <li class="nav-header" style="padding:17px;"> <div class="profile-element text-center"> <img src="img/shifter_logo_ds@2x.png" width="140px"> </div> <div class="logo-element"> <img src="img/shifter_logo_ds_close@2x.png" width="30px"> </div> </li> <li class="{active:is_projects}"> <a href="#"><i class="fa fa-cloud"></i> <span class="nav-label">Project </span><span class="fa arrow"></span></a> <ul class="nav nav-second-level collapse"> <li><a href="/#projects">Project List</a></li> <li><a href="/#project_new">Create New Project</a></li> </ul> </li> <li class="{active:is_archive}"> <a href="/#archive"> <i class="fa fa-file-zip-o"></i> <span class="nav-label">Archive </span> </a> </li> <li class="{active:is_domains}"> <a href="/#domains"> <i class="fa fa-flash"></i> <span class="nav-label">Domain</span> </a> </li> <li class="{active:is_billing}"> <a href="/#billing"> <i class="fa fa-credit-card"></i> <span class="nav-label">Billing</span> </a> </li> <li class="{active:is_account}"> <a href="/#account"> <i class="fa fa-user"></i> <span class="nav-label">Account </span> </a> </li> <li> <a href="#"><i class="fa fa-question-circle"></i> <span class="nav-label">Support </span><span class="fa arrow"></span></a> <ul class="nav nav-second-level collapse"> <li><a href="#" data-href="https://getshifter.zendesk.com/hc/en-us/" onclick="{support}">Help Center</a></li> <li><a href="#" data-href="https://getshifter.zendesk.com/hc/en-us/requests/new" onclick="{support}">Bug Report</a></li> </ul> </li> <li> <a href="#"><i class="fa fa-bullhorn"></i> <span class="nav-label">Announcements </span><span class="fa arrow"></span></a> <ul class="nav nav-second-level collapse"> <li><a href="https://getshifter.zendesk.com/hc/en-us/sections/206966628-Announcements" target="_blank">Release Note</a></li> <li><a href="https://getshifter.io/blog/" target="_blank">Blog</a></li> </ul> </li> </ul> </div> </nav>', '', '', function(opts) {


        switch (riot.router.current.uri){
          case '/account':
            this.is_account = true
            break
          case '/billing':
            this.is_billing = true
            break
          case '/console':
            this.is_console = true
            break
          case '/projects':
            this.is_projects = true
            break
          case '/project_new':
            this.is_projects = true
            break
          case '/project_detail':
            this.is_projects = true
            break
          case '/archive':
            this.is_archive = true
            break
          case '/domains':
            this.is_domains = true
            break
        }

        this.support = function(e) {
          var childWindow = window.open('about:blank')
          post(endpoint.support, {pathto: e.target.dataset.href}).then(function(response){
            childWindow.location.href = response.body.ssoEndpoint
            childWindow = null
            return
          }).catch(function(error){
            toastr.warning(error.message, 'Error occurred.')
            return
          })
        }.bind(this)

});

riot.tag2('sparkline', '', '', '', function(opts) {
this.on('mount', function() {
  $(function () {
    $("#sparkline1").sparkline([34, 43, 43, 35, 44, 32, 44, 52, 25], {
        type: 'line',
        lineColor: '#17997f',
        fillColor: '#1ab394',
    });
    $("#sparkline2").sparkline([5, 6, 7, 2, 0, -4, -2, 4], {
        type: 'bar',
        barColor: '#1ab394',
        negBarColor: '#c6c6c6'});

    $("#sparkline3").sparkline([1, 1, 2], {
        type: 'pie',
        sliceColors: ['#1ab394', '#b3b3b3', '#e4f0fb']});

    $("#sparkline4").sparkline([34, 43, 43, 35, 44, 32, 15, 22, 46, 33, 86, 54, 73, 53, 12, 53, 23, 65, 23, 63, 53, 42, 34, 56, 76, 15, 54, 23, 44], {
        type: 'line',
        lineColor: '#17997f',
        fillColor: '#ffffff',
    });

    $("#sparkline5").sparkline([1, 1, 0, 1, -1, -1, 1, -1, 0, 0, 1, 1], {
        type: 'tristate',
        posBarColor: '#1ab394',
        negBarColor: '#bfbfbf'});

    $("#sparkline6").sparkline([4, 6, 7, 7, 4, 3, 2, 1, 4, 4, 5, 6, 3, 4, 5, 8, 7, 6, 9, 3, 2, 4, 1, 5, 6, 4, 3, 7, ], {
        type: 'discrete',
        lineColor: '#1ab394'});

    $("#sparkline7").sparkline([52, 12, 44], {
        type: 'pie',
        height: '150px',
        sliceColors: ['#1ab394', '#b3b3b3', '#e4f0fb']});

    $("#sparkline8").sparkline([5, 6, 7, 2, 0, 4, 2, 4, 5, 7, 2, 4, 12, 14, 4, 2, 14, 12, 7], {
        type: 'bar',
        barWidth: 8,
        height: '150px',
        barColor: '#1ab394',
        negBarColor: '#c6c6c6'});

    $("#sparkline9").sparkline([34, 43, 43, 35, 44, 32, 15, 22, 46, 33, 86, 54, 73, 53, 12, 53, 23, 65, 23, 63, 53, 42, 34, 56, 76, 15, 54, 23, 44], {
        type: 'line',
        lineWidth: 1,
        height: '150px',
        lineColor: '#17997f',
        fillColor: '#ffffff',
    });
  });
})
});

riot.tag2('userinfo-activation', '<div class="middle-box text-center animated fadeInDown"> <p><img src="img/shifter_logo_login@2x.png" width="250px"></p> <h3 class="font-bold" style="margin-top:30px;">Now Activating...</h3> </div>', '', '', function(opts) {

    cognitoUser.verifyAttribute('email', this.opts.code, {
      onSuccess: function (result) {
        $('body').removeClass('gray-bg')
        window.localStorage.setItem('userinfo_activation', '{ "status":"success" }')
        riot.route('/account');
        return;
      },
      onFailure: function(error) {
        $('body').removeClass('gray-bg')
        window.localStorage.setItem('userinfo_activation', '{ "status":"fail", "message": "'+error.message+'"}')
        riot.route('/account');
        return;
      }
    });

    this.on('mount', function() {
      $('body').addClass('gray-bg')
    });
});

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
