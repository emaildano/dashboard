<projects>
    <div id="wrapper">
      <sidebar></sidebar>
        <div id="page-wrapper" class="gray-bg">
          <commonheader></commonheader>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-sm-4">
                    <h2>Project</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li class="active">
                            <strong>Project List</strong>
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
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>All Projects</h5>
                            <div class="ibox-tools" if="{maintenance.status !== 'now_maintenance' || maintenance.target.indexOf('container') < 0}">
                                <a href="/#project_new" class="btn btn-primary btn-xs" if="{ !is_limit }">Create New Project</a>
                            </div>
                        </div>
                        <div if="{ items.length <= 0 }" class="ibox-content">
                          <div class="alert alert-success alert-dismissable">
                            No projects available, create new one.
                          </div>
                        </div>
                        <div if="{ items.length >= userStatus.upperLimitProjects }" class="ibox-content">
                          <div class="alert alert-success alert-dismissable">
                            The projects and archived projects are up to {userStatus.upperLimitProjects}, if you need more, <a href="https://getshifter.zendesk.com/hc/en-us/requests/new" target="_blank">submit a higher limit request</a>.
                          </div>
                        </div>
                        <div if="{ items.length > 0 }" class="ibox-content">
                            <div class="project-list">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Owner</th>
                                            <th>Published Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <tr each={ item, i in items }>
                                        <td>
                                            <a href="/#project_detail/{ item.site_id }">{ item.site_name }</a>
                                        </td>
                                        <td>
                                            { item.site_owner }
                                        </td>
                                        <td>
                                            { item.update_time }
                                        </td>
                                        <td>
                                          <div class="tooltip-demo">
                                          <a class="btn btn-white btn-xs delete_archive" data-index="{i}" data-site_id="{ item.site_id }" data-site_name="{ item.site_name }" onclick="{ delete_website }" if="{maintenance.status !== 'now_maintenance' || maintenance.target.indexOf('container') < 0}">
                                            <i class="fa fa-trash-o"data-index="{i}" data-site_id="{ item.site_id }" data-site_name="{ item.site_name }" onclick="{ delete_website }" data-toggle="tooltip" data-placement="bottom" title="Delete Project" data-original-title="Delete Files" ></i>
                                          </a>
                                          </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
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

    //website delete
    delete_website(e) {
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
    }

    this.on('mount', function() {
      $(document).ready(function(){
        loading()
      })
    })

    </script>
</projects>
