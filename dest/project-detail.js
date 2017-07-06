riot.tag2('project_detail', '<div id="wrapper"> <sidebar></sidebar> <div id="page-wrapper" class="gray-bg"> <commonheader></commonheader> <div class="row wrapper border-bottom white-bg page-heading"> <div class="col-sm-4"> <h2>Project Detail</h2> <ol class="breadcrumb"> <li> <a href="/">Home</a> </li> <li> <a href="/#projects">Project List</a> </li> <li class="active"> <strong>Project Detail</strong> </li> </ol> </div> </div> <div id="container_progress" if="{status !== \'error\' && status === \'inimport\'}" class="row hidden" style="margin-top: 20px;"> <div class="col-lg-12"> <div class="alert alert-success alert-dismissable"> <h4>{wp_status_msg[apps.step].title}</h4> <p>{wp_status_msg[apps.step].message}</p> <dl if="{status === \'inimport\'}" class="dl-horizontal" style="margin-top:30px;"> <dt>Progress:</dt> <dd> <div class="progress progress-striped active m-b-sm"> <div riot-style="width: {wp_status_msg[apps.step].progress}%;" class="progress-bar"></div> </div> </dd> </dl> </div> </div> </div> <div id="generate_progress" if="{status === \'generating\'}" class="row" style="margin-top: 20px;"> <div class="col-lg-2"> <div class="ibox"> <div class="ibox-content"> <h5>Generated pages</h5> <h1 class="text-center">{gen.created_url || \'-\'} / {gen.sum_url || \'-\'}</h1> </div> </div> </div> <div class="col-lg-10"> <div class="alert alert-success alert-dismissable"> <h4>{gen_status_msg[gen.step].title}</h4> <p>{gen_status_msg[gen.step].message}</p> <dl class="dl-horizontal" style="margin-top:30px;"> <dt>Progress:</dt> <dd> <div class="progress progress-striped active m-b-sm"> <div style="width: 0%;" class="progress-bar"></div> </div> </dd> </dl> </div> </div> </div> <div if="{status === \'error\'}" class="row" style="margin-top: 20px;"> <div class="col-lg-12"> <div class="alert alert-warning alert-dismissable"> <button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button> <h4>{wp_status_msg[apps.step].title}</h4> <p>{wp_status_msg[apps.step].message}</p> </div> </div> </div> <div class="row"> <div class="spiner-example hidden" id="loading" style="height: 66px;"> <div class="sk-spinner sk-spinner-three-bounce"> <div class="sk-bounce1"></div> <div class="sk-bounce2"></div> <div class="sk-bounce3"></div> </div> </div> </div> <div class="row"> <div class="col-lg-12"> <div id="main_box" class="wrapper wrapper-content animated fadeInUp hidden"> <div class="ibox"> <div class="ibox-content"> <div class="row"> <div class="col-lg-12"> <div class="m-b-md"> <a href="/#projects" class="btn btn-white btn-xs pull-right">Back to Project</a> </div> <dl class="dl-horizontal dl-top"> <dt>Name:</dt> <dd><a href="#" id="project_name" data-type="text" data-pk="{site_id}" data-url="{project_endpoint +  site_id}" data-title="Enter {project_name}">{project_name}</a></dd> <dt>ID:</dt> <dd>{site_id}</dd> <dt>Disk Usage:</dt> <dd>{disk_usage}</dd> <dt>Status:</dt> <dd> <span if="{status === \'generating\'}" id="site_processing" class="label label-info">Generating</span> <span if="{status === \'starting\' || status === \'start\'}" id="app_running" class="label label-info">running</span> <span if="{status === \'stop\'}" id="app_stopped" class="label label-warning">stopped</span> <span if="{status === \'inimport\'}" id="app_importing" class="label label-warning">importing</span> </dd> </dl> </div> </div> <div class="row" id="publishing"> <div class="col-lg-12"> <div class="m-b-md"> <h2>Publishing</h2> </div> <div class="tabs-container"> <ul class="nav nav-tabs"> <li class="active"><a data-toggle="tab" href="#general" aria-expanded="true"> General</a></li> <li class=""><a data-toggle="tab" href="#netlify" aria-expanded="false"> Netlify</a></li> </ul> <div class="tab-content"> <div id="general" class="tab-pane active"> <div class="panel-body"> <dl class="dl-horizontal"> <dt>Domain:</dt> <dd><a href="https://{domain_name}" target="_blank" class="{domain_name ? \'link-enabled\' : \'link-disabled\'} ">{domain_name}</a><button if="{!domain_name}" id="edit" class="btn btn-white btn-xs m-l-sm" type="button" data-toggle="modal" data-target="#attach-domain" disabled="{disabled: validDomains.length <= 0}">Attach Domain</button><button if="{domain_name}" id="edit" class="btn btn-white btn-xs m-l-sm" type="button" onclick="{dettachDomain}">Dettach Domain</button></dd> <dt>Published URL:</dt> <dd if="{(histories.length > 0 || status === \'generating\') && latest_gen_history !== \'static_delete\'}"><a href="https://{access_url}" target="__blank">{access_url}</a></dd><dd if="{histories.length <= 0 && status !== \'generating\' || latest_gen_history === \'static_delete\'}">-</dd> <dt>Published Date:</dt> <dd>{update_time}</dd> </dl> <div class="row"> <div class="col-lg-12"> <dl class="dl-horizontal" if="{status !== \'generating\'}"> <dt></dt> <dd> <span if="{maintenance.status === \'now_maintenance\' && ( maintenance.target.indexOf(\'generator\') >= 0 || maintenance.target.indexOf(\'container\') >= 0 )}">Sorry. Now maintenance. Generate can&apos;t be used</span><br> <button id="generate_publish_site" class="ladda-button ladda-button-demo btn btn-success " type="button" data-style="expand-right" onclick="{create_staticsite}" disabled="{disabled: status === \'starting\' || status === \'intasks\' || status === \'inimport\' || status === \'start\' || (maintenance.status === \'now_maintenance\' && ( maintenance.target.indexOf(\'generator\') >= 0 || maintenance.target.indexOf(\'container\') >= 0))}"> <i class="fa fa-cloud-upload"></i>&nbsp;&nbsp; <span class="bold">Generate Now</span> </button> <button id="delete_publish_site" class="ladda-button ladda-button-demo btn btn-warning pull-right" type="button" data-style="expand-right" onclick="{delete_staticsite}" disabled="{disabled: maintenance.status === \'now_maintenance\' && maintenance.target.indexOf(\'container\') >= 0}"> <i class="fa fa-trash"></i>&nbsp;&nbsp; <span class="bold">Delete All Files from Your Published Site</span> </button> </dd> </dl> </div> </div> </div> </div> <div id="netlify" class="tab-pane"> <netlify siteid="{site_id}" status="{status}" last="{latest_gen_history}" histories="{histories}"></netlify> </div> </div> </div> </div> </div> <div class="row"> <div class="col-lg-12"> <div class="m-b-md"> <h2>App</h2> </div> <dl class="dl-horizontal"> <dt class="apps_url">App URL:</dt> <dd if="{status !== \'stop\' && status !== \'generating\' && status !== \'intasks\' && maintenance.status !== \'now_maintenance\'}" class="apps_url"> <a href="{docker_url}" target="_blank">{docker_url}</a> </dd> <dd if="{status === \'stop\' || status === \'generating\' || status === \'intasks\' || maintenance.status === \'now_maintenance\'}" class="apps_url"> - </dd> <dt>PHP Version:</dt> <dd> <div class="col-lg-2"> <select id="php_version" class="form-control m-b" name="php_version"> <option value="5.5" selected="{selected: php_version == 5.5}">5.5</option> <option value="5.6" selected="{selected: php_version == 5.6}">5.6</option> <option value="7.0" selected="{selected: php_version == 7.0}">7.0</option> </select> </div> </dd> </dl> </div> </div> <div class="row"> <div class="col-lg-12"> <dl class="dl-horizontal" if="{status !== \'generating\'}"> <dt></dt> <dd> <span if="{maintenance.status === \'now_maintenance\' && maintenance.target.indexOf(\'container\') >= 0}">Sorry. Now maintenance. App can&apos;t be used</span><br> <button if="{status === \'stop\' || status === \'starting\' || status === \'intasks\'}" id="start_app" class="ladda-button ladda-button-demo btn btn-success" type="button" data-style="expand-right" onclick="{create_container}" disabled="{disabled: maintenance.status === \'now_maintenance\' && maintenance.target.indexOf(\'container\') >= 0 || status === \'intasks\'}"> <i class="fa fa-play-circle"></i>&nbsp;&nbsp; <span class="bold">Start App</span> </button> <button if="{status === \'start\' || status === \'error\'}" id="stop_app" class="ladda-button ladda-button-demo btn btn-warning" type="button" data-style="expand-right" onclick="{delete_container}" disabled="{disabled: maintenance.status === \'now_maintenance\' && maintenance.target.indexOf(\'container\') >= 0}"> <i class="fa fa-stop"></i>&nbsp;&nbsp; <span class="bold">Stop App</span> </button> <button if="{status !== \'inimport\'}" id="createArchive" class="ladda-button ladda-button-demo btn btn-warning" type="button" data-style="expand-right" onclick="{createArchive}" disabled="{disabled: maintenance.status === \'now_maintenance\' && maintenance.target.indexOf(\'container\') >= 0 || status === \'start\' || status === \'starting\'}"> <i class="fa fa-file-zip-o"></i>&nbsp;&nbsp; <span class="bold">Export as a new archive</span> </button> </dd> </dl> </div> <div class="row m-t-sm"> <div class="col-lg-12"> <resource-monitor></resource-monitor> </div> </div> <div class="row m-t-sm"> <div class="col-lg-12"> <div class="panel blank-panel"> <div class="panel-heading"> <div class="panel-options"> <ul class="nav nav-tabs"> <li class="active"><a href="#tab-1" data-toggle="tab">Generate History</a></li> </ul> </div> </div> <div class="panel-body"> <div class="tab-content"> <div class="tab-pane active" id="tab-1"> <table class="table table-striped"> <thead> <tr> <th>Owner</th> <th>Published Date</th> <th>Status</th> <th>Message</th> </tr> </thead> <tbody> <tr each="{h, i in histories}"> <td> {username} </td> <td> {moment(h.update_time).format(⁗MMM Do YYYY, h:mm:ss a⁗)} </td> <td> {h.progress} </td> <td> {h.progress === \'fail\' ? h.message : \'\'} </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> <div class="modal inmodal" id="attach-domain" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content animated bounceInRight"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> <h4 class="modal-title">Attach Domain</h4> </div> <div class="modal-body"> <p>Choose the domain to attach your published site on the project. <br>After assigning domain, you should configure your DNS server to access published site with your domain.<br>e.g. Set Published URL to the CNAME record for your domain;<br>Set Published URL to the CNAME record of your domain with www prefix (www.example.com); <br>Set Published URL to the A record (or alias record) of your domain.<br>Attaching domain takes 10-15 minutes to complete.</p> <h3>Notice!</h3> <p>Assigning Zone Apex to Shifter, you should use DNS service who supports it. <br> <a href="https://getshifter.zendesk.com/hc/en-us/articles/115001014908" target="_blank">See more detail</a> </p> <div class="form-group"> <label>Domain Name</label> <select class="form-control m-b" id="attachedDomains"> <option each="{h, i in validDomains}" riot-value="{h}">{h}</option> </select> </div> </div> <div class="modal-footer"> <button type="button" class="btn btn-white" data-dismiss="modal">Close</button> <button id="attachDomain" type="button" class="btn btn-primary ladda-button ladda-button-demo" data-style="expand-right" onclick="{attachDomain}">Attach</button> </div> </div> </div> </div> <init></init>', 'project_detail .link-disabled,[data-is="project_detail"] .link-disabled{ pointer-events: none; cursor: default; text-decoration: none; } project_detail #publishing,[data-is="project_detail"] #publishing{ margin-bottom: 20px; }', '', function(opts) {
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
