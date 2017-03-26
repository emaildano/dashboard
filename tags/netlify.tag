<netlify>
  <div class="panel-body">
    <div class="row">
      <div class="col-lg-12">
        <p><a href="https://netlify.com" target="_blank">What is Netlify ?</a></p>
        <div class="ibox">
          <h3 class="ibox-title">Connection Settings</h3>
          <div class="ibox-content">
            <form role="form" id="register-form">
              <input type="hidden" value={opts.siteid} id="site_id" name="site_id"/>
              <dl class="dl-horizontal">
                <dt><label for="pat">Personal Access Token</label></dt>
                <dd class="form-group">
                  <input id="pat" type="password" class="form-control" name="pat" placeholder='Netlify Personal Access Token' value={ netlifyToken || '' } />
                </dd>
              </dl>
              <button id="btnConnectNetlify" class="btn btn-primary" data-style="expand-right" type="submit" onclick="{ connect_netlify }">Connect to Netlify</button>
              <button id="btnDeletePat" class="btn btn-default" data-style="expand-right" type="submit" onclick="{ delete_pat }" show={ netlifyToken }>Delete Personal Access Token</button>
            </form>
          </div>
        </div>
        <div class="ibox" show={ netlifyToken }>
          <h3 class="ibox-title">Publish to Netlify</h3>
          <div class="ibox-content"  hide="{ (opts.histories.length > 0 || opts.status === 'generating') && opts.last !== 'static_delete'  }">
            <p>Please Generate at first</p>
          </div>
          <div class="ibox-content"  show="{ (opts.histories.length > 0 || opts.status === 'generating') && opts.last !== 'static_delete'  }">
            <form role="form" id="deploy-form">
              <dl>
                <dt><label for="pat">Site Status</label></dt>
                <dd>
                  <select id="nf_pj_state" class="form-control m-b" name="nf_pj_state" >
                    <option value="draft">Draft</option>
                    <option value="published">Publish</option>
                  </select>
                </dd>
              </dl>
              <button id="btnDeployNetlify" class="ladda-button ladda-button-demo btn btn-primary" data-style="expand-right" type="submit" onclick="{ deploy_netlify }">Deploy to Netlify</button>
              <a href="https://app.netlify.com/sites/shifter-{opts.siteid}" class="btn btn-primary" target="_blank">Open Netlify Dashboard</a>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script>
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

  connect_netlify(e) {
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
  }

  deploy_netlify(e) {
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
  }
  delete_pat(e) {
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
  }
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
  </script>
</netlify>
