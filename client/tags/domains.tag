<domains>
    <div id="wrapper">
      <sidebar></sidebar>
        <div id="page-wrapper" class="gray-bg">
          <commonheader></commonheader>
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-sm-4">
                    <h2>Domain</h2>
                    <ol class="breadcrumb">
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li class="active">
                            <strong>Domains List</strong>
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
                            <h5>All Domains</h5>
                            <div class="ibox-tools" if="{ items.length < userStatus.upperLimitDomains }">
                                <button class="btn btn-primary btn-xs"  show="{creditCardStatus !== 'registered'}" onclick="{ notifyUnregistedCreditCard }">Add New Domain</button>
                                <button class="btn btn-primary btn-xs"  data-toggle="modal" data-target="#add-new-domain" show="{creditCardStatus === 'registered'}">Add New Domain</button>
                            </div>
                        </div>
                        <div class="ibox-content">
                            <div if="{ items.length <= 0 }">
                              <div class="alert alert-success alert-dismissable">
                                No domain. Please add your domain(s).
                              </div>
                            </div>
                            <div if="{ items.length >= userStatus.upperLimitDomains }">
                              <div class="alert alert-success alert-dismissable">
                                You can add {userStatus.upperLimitDomains} domains.
                              </div>
                            </div>
                            <div if="{ items.length > 0 }" class="project-list">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Status</th>
                                            <th>Register Date</th>
                                            <th>Project</th>
                                            <th class="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <tr each={ item, i in items }>
                                        <td>
                                            { item.domain }
                                        </td>
                                        <td>
                                            <span if="{item.status === 'ISSUED'}" class="label label-primary">Valid</span>
                                            <span if="{item.status !== 'ISSUED'}" class="label label-default">Invalid</span>
                                        </td>
                                        <td>
                                            { item.createdAt }
                                        </td>
                                        <td>
                                            <span if="{item.isCloudfront}" class="label label-primary">Attached</span>
                                        </td>
                                        <td class="text-right">
                                            <button if="{item.status !== 'ISSUED'}" data-domain="{ item.domain }" data-index="{ i }"  data-validationemails="{ item.validationEmails }" class="btn-white btn btn-xs" onclick="{ respondApprovalMail }">Resend approval mail</button>
                                            <button if="{!item.isCloudfront}" data-domain="{ item.domain }" data-index="{ i }" class="btn-white btn btn-xs" onclick="{ deleteDomain }">Delete Domain</button>
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
   <div class="modal inmodal" id="add-new-domain" tabindex="-1" role="dialog" aria-hidden="true">
     <div class="modal-dialog">
       <div class="modal-content animated bounceInRight">
         <div class="modal-header">
           <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
           <h4 class="modal-title">Add New Domain</h4>
         </div>
         <div class="modal-body">
            <p>To verify and assign a custom domain name, we'll send a conformation email to the administration associated with the WHOIS record of the domain.</p>
            <p>For example: (e.g. webmaster@example.com, or admin@example.com)</p>
            <p>After domain verification, it will be available on Shifter.</p>
            <p>For more help, check our <a href="https://getshifter.zendesk.com/hc/en-us/articles/236048507-How-to-assign-your-domain-to-the-project" target="_blank">how to guide</a>.</p>
           <div class="form-group"><label>Domain Name</label> <input type="text" id="yourdomain" placeholder="Enter your domain" class="form-control"></div>
         </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-white" data-dismiss="modal">Close</button>
           <button id="addNewDomain" type="button" class="btn btn-primary ladda-button ladda-button-demo" data-style="expand-right" onclick="{ addNewDomain }">Save changes</button>
         </div>
       </div>
      </div>
    </div>
    <init></init>
    <script>
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

    addNewDomain(e) {
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
    }

    respondApprovalMail(e) {
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
    }

    deleteDomain(e) {
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
    }

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
    </script>
</domains>
