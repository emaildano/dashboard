<project_new>
    <div id="wrapper">
      <sidebar></sidebar>
        <div id="page-wrapper" class="gray-bg">
          <commonheader></commonheader>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>Create New Project</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="/#console">Home</a>
                        </li>
                        <li>
                            <a href="/#projects">Project List</a>
                        </li>
                        <li class="active">
                            <strong>Create New Project</strong>
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
        <div id="main_box" class="wrapper wrapper-content animated fadeInRight hidden">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>Create New Project</h5>
                        </div>
                        <div if="{is_limit}" class="ibox-content">
                          <div class="alert alert-success alert-dismissable">
                            You can create {userStatus.upperLimitProjects} projects.
                          </div>
                        </div>
                        <div if="{maintenance.status === 'now_maintenance' && maintenance.target.indexOf('container') >= 0}" class="ibox-content">
                          <div class="alert alert-success alert-dismissable">
                            Sorry. Now maintenance. you can&apos;t create new project.
                          </div>
                        </div>
                        <div if="{!is_limit && items.length <= 0 && public_items.length <= 0 && (maintenance.status !== 'now_maintenance' || maintenance.target.indexOf('container') < 0 ) }" class="ibox-content">
                          <div class="alert alert-success alert-dismissable">
                            No Archive. Go to <a href="/#archive" >Archive page</a>, then upload new archive.
                          </div>
                        </div>
                        <div if="{!is_limit && ( items.length > 0 || public_items.length > 0 ) && (maintenance.status !== 'now_maintenance' || maintenance.target.indexOf('container') < 0 )}" class="ibox-content">
                            <form method="get" class="form-horizontal" action="/#project_detail">
                                <div class="form-group"><label class="col-sm-2 control-label">Project Name</label>
                                    <div class="col-sm-10"><input id="website_name" type="text" class="form-control" required=""></div>
                                </div>
                                <div class="form-group"><label class="col-sm-2 control-label">PHP Version</label>
                                  <div class="col-sm-10">
                                  <select id="php_version" class="form-control m-b" name="php_version" required="">
                                    <option value="">Select</option>
                                    <option value="5.5">5.5</option>
                                    <option value="5.6">5.6</option>
                                    <option value="7.0">7.0</option>
                                  </select>
                                  </div>
                                </div>
                                <div if="{!opts.archive_id}" class="form-group"><label class="col-sm-2 control-label">Public Images</label>
                                    <div class="col-sm-10">
                                      <table class="table table-hover">
                                        <thead>
                                          <tr class="something">
                                            <th class="col-md-1"></th>
                                            <th class="col-md-2">Name</th>
                                            <th class="col-md-2">Owner</th>
                                            <th class="col-md-5"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr each={ public_item, i in public_items }>
                                            <td>
                                              <input class="archive_id" type="radio" name="archive_id" value="{ public_item.archive_id }" >
                                            </td>
                                            <td class="issue-info">
                                              <label for="aichive1">
                                              { public_item.archive_alias }
                                              </label>
                                            </td>
                                            <td>
                                              <label for="aichive1">
                                                { public_item.archive_owner }
                                              </label>
                                            </td>
                                            <td>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                  <div if="{!opts.archive_id}" class="form-group"><label class="col-sm-2 control-label">User Archives</label>
                                    <div class="col-sm-10">
                                      <table class="table table-hover">
                                        <thead>
                                          <tr class="something">
                                            <th class="col-md-1"></th>
                                            <th class="col-md-2">Name</th>
                                            <th class="col-md-2">Owner</th>
                                            <th class="col-md-5">Uploaded Date</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr each={ item, i in items }>
                                            <td>
                                              <input class="archive_id" type="radio" name="archive_id" value="{ item.archive_id }" checked={ archive_checked }>
                                            </td>
                                            <td class="issue-info">
                                              <label for="aichive1">
                                              { item.archive_alias }
                                              </label>
                                            </td>
                                            <td>
                                              <label for="aichive1">
                                                { item.archive_owner }
                                              </label>
                                            </td>
                                            <td>
                                              <label for="aichive1">
                                                { item.archive_create_date }
                                              </label>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                </div>
                                <div if="{opts.archive_id}" class="form-group"><label class="col-sm-2 control-label">User Archives</label>
                                  <div class="col-sm-10">
                                    <table class="table table-hover">
                                      <thead>
                                        <tr class="something">
                                          <th class="col-md-1"></th>
                                          <th class="col-md-2">Name</th>
                                          <th class="col-md-2">Owner</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr each={ item, i in items }>
                                          <td>
                                            <input class="archive_id" type="radio" name="archive_id" value="{ item.archive_id }" checked={ archive_checked }>
                                          </td>
                                          <td class="issue-info">
                                            <label for="aichive1">
                                            { item.archive_alias }
                                            </label>
                                          </td>
                                          <td>
                                            <label for="aichive1">
                                              { item.archive_owner }
                                            </label>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <div class="hr-line-dashed"></div>
                                <div class="form-group">
                                    <div class="col-sm-4 col-sm-offset-2">
                                        <button id="btn_project_new" class="ladda-button ladda-button-demo btn btn-primary" type="button" onclick="{ createProject }" data-style="expand-right" >Create New Project</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
    <init></init>
  <script>
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

    createProject(e) {
      if ( self.creditCardStatus !== 'registered') {
          notifyUnregistedCreditCard()
          return
      }

      // Commonly Used Project Labels
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
    }

    this.on('mount', function() {
      $(document).ready(function(){
        loading()
      })
    })
  </script>
</project_new>
