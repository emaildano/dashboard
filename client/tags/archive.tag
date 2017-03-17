<archive>
    <div id="wrapper">
      <sidebar></sidebar>
        <div id="page-wrapper" class="gray-bg">
          <commonheader></commonheader>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-sm-4">
                    <h2>Archive</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li class="active">
                            <strong>Archive List</strong>
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
        <div class="row">
            <div class="col-lg-12">
                <div id="main_box" class="wrapper wrapper-content animated fadeInUp hidden">
                    <div class="ibox">
                        <div class="ibox-title">
                            <h5>Archive List</h5>
                            <div class="ibox-tools">
                                <a id="import_new_file_dummy" href="" class="btn btn-primary btn-xs" if="{ items.length < userStatus.upperLimitArchives}" onclick="{ notifyUnregistedCreditCard }" show="{creditCardStatus !== 'registered'}">Upload New Archive</a>
                                <a id="import_new_file" href="" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#media_uploader" if="{ items.length < userStatus.upperLimitArchives}" show="{creditCardStatus === 'registered'}">Upload New Archive</a>
                            </div>
                        </div>
                        <div if="{ items.length <= 0 && public_items.length <= 0 }" class="ibox-content">
                          <div class="alert alert-danger alert-dismissable">
                            No file to archive.
                          </div>
                        </div>
                        <div if="{ items.length >= userStatus.upperLimitArchives}" class="ibox-content">
                          <div class="alert alert-success alert-dismissable">
                            The projects and archived projects are up to {userStatus.upperLimitArchives}, if you need more, <a href="https://getshifter.zendesk.com/hc/en-us/requests/new" target="_blank">submit a higher limit request</a>.
                          </div>
                        </div>
                        <div if="{ items.length > 0 || public_items.length > 0 }" class="ibox-content  col-lg-12">
                            <div class="project-list">
                                <div class="col-lg-2">
                                  <strong>Public images</strong>
                                </div>
                                <div class="col-lg-10">
                                  <table class="table table-hover">
                                    <thead>
                                        <tr class="something">
                                            <th class="col-md-6">Name</th>
                                            <th class="col-md-2">Owner</th>
                                            <th class="col-md-2"></th>
                                            <th class="col-md-5">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                      <tr each={ public_item, i in public_items }>
                                      <td>
                                         { public_item.archive_alias }
                                      </td>
                                      <td>
                                        { public_item.archive_owner }
                                      </td>
                                      <td></td>
                                      <td class="text-left">
                                        <div class="tooltip-demo">
                                          <a if="{maintenance.status !== 'now_maintenance' || maintenance.target.indexOf('container') < 0 }" href="/#project_new/{ public_item.archive_id }" class="btn btn-white btn-xs" data-toggle="tooltip" data-placement="bottom" title="Create New Project" data-original-title="Create New Project">
                                            <i class="fa fa-plus-square"></i>
                                          </a>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div class="col-lg-2">
                                <strong>User Archives</strong>
                              </div>
                              <div class="col-lg-10">
                                <table class="table table-hover">
                                  <thead>
                                      <tr class="something">
                                          <th class="col-md-6">Name</th>
                                          <th class="col-md-2">Owner</th>
                                          <th class="col-md-2">Uploaded Date</th>
                                          <th class="col-md-5">Action</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                    <tr each={ item, i in items }>
                                    <td>
                                       <a href="#" class="archive_alias" data-type="text" data-pk="{ item.archive_id }" data-url="{archive_endpoint +  item.archive_id }" data-title="Enter { item.archive_alias }">{ item.archive_alias }</a>
                                    </td>
                                    <td>
                                       { item.archive_owner }
                                    </td>
                                    <td>
                                       { item.archive_create_date }
                                    </td>
                                    <td class="text-left">
                                      <div class="tooltip-demo">
                                        <a if="{maintenance.status !== 'now_maintenance' || maintenance.target.indexOf('container') < 0 }" href="/#project_new/{ item.archive_id }" class="btn btn-white btn-xs" data-toggle="tooltip" data-placement="bottom" title="Create New Project" data-original-title="Create New Project">
                                          <i class="fa fa-plus-square"></i>
                                        </a>
                                        <a class="btn btn-white btn-xs " data-toggle="tooltip" data-placement="bottom" title="Download File" data-original-title="Download File" href="{ downloads[item.archive_id] }">
                                          <i class="fa fa-download"></i>
                                        <a class="btn btn-white btn-xs delete_archive" data-toggle="tooltip" data-placement="bottom" title="Delete Files" data-original-title="Delete Files" data-index="{i}" data-archive_id="{ item.archive_id }" onclick="{ delete_archive }">
                                          <i class="fa fa-trash-o"data-index="{i}" data-archive_id="{ item.archive_id }" onclick="{ delete_archive }"></i>
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
        </div>
        <!-- modal -->
        <div class="modal inmodal fade" id="media_uploader" tabindex="-1" role="dialog"  aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h2>Upload your archive</h2>
              </div>
              <div class="modal-body">
                <form id="my-awesome-dropzone" class="dropzone">
                  <div class="dropzone-previews"></div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <!-- modal -->
    <init></init>
    <dropzone></dropzone>
    <script>
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

    moveToBillingPage() {
        $('#media_uploader').modal('hide')
        riot.route('/billing')
    }

    //archive delete
    delete_archive(e) {
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
    }

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
    </script>
</archive>
