riot.tag2('billingalert', '<div class="panel-body"> <p hide="{opts.account.cardLast4Digits}">Regist your credit card first.</p> <div class="col-lg-12" show="{opts.account.cardLast4Digits}"> <div class="panel-group coupon" id="accordion"> <div class="panel panel-default"> <div class="panel-heading"> <h5 class="panel-title"> <span>Billing Alert</span> </h5> </div> <div id="collapseTwo" class="panel-collapse collapse in"> <div class="panel-body"> <form role="form" id="payment-form"> <div class="row"> <div class="col-xs-12"> <div class="form-group"> <label>Monthly Cost</label> <div class="input-group"> <span class="input-group-addon">$</span> <input id="alert_price" type="text" class="form-control" name="Number" placeholder="100" riot-value="{billingalert.billingAlertPrice}" required> </div> </div> </div> </div> <div class="row"> <div class="col-xs-12"> <button id="btnRegistBillingAlert" class="ladda-button ladda-button-demo btn btn-primary" data-style="expand-right" type="submit" onclick="{regist_alert}">Register Cost Alert</button> </div> </div> </form> </div> </div> </div> </div> </div> </div>', '', '', function(opts) {
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
