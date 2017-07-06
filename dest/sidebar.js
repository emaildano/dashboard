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
