<userinfo-activation>
    <div class="middle-box text-center animated fadeInDown">
      <p><img src="img/shifter_logo_login@2x.png" width="250px"></p>
      <h3 class="font-bold" style="margin-top:30px;">Now Activating...</h3>
    </div>

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
</userinfo-activation>
