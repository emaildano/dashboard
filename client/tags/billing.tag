<billing>
<div id="wrapper">
    <sidebar></sidebar>
    <div id="page-wrapper" class="gray-bg">
        <commonheader></commonheader>
        <div class="row wrapper border-bottom white-bg page-heading">
            <div class="col-lg-10">
                <h2>Billing</h2>
                <ol class="breadcrumb">
                    <li>
                        <a href="/#console">Home</a>
                    </li>
                    <li class="active">
                        <strong>Billing</strong>
                    </li>
                </ol>
            </div>
            <div class="col-lg-2">
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
            <div class="tabs-container">
                <ul class="nav nav-tabs">
                    <li class="{detaultTabInvoiceState}"><a data-toggle="tab" href="#invoice" aria-expanded="true" class="{defaultTabActivateState}"> Invoice</a></li>
                    <li class="{detaultTabPaymentState}"><a data-toggle="tab" href="#payment-method" aria-expanded="false"> Payment method</a></li>
                    <li class=""><a data-toggle="tab" href="#coupon" aria-expanded="false" class="{defaultTabActivateState}"> Coupon</a></li>
                    <li class="" ><a data-toggle="tab" href="#alert" aria-expanded="false" class="{defaultTabActivateState}"> Billing Alert</a></li>
                </ul>
                <div class="tab-content">
                    <div id="invoice" class="tab-pane {detaultTabInvoiceState}">
                        <div class="panel-body">
                            <invoice invoice={ billing.data.invoice }></invoice>
                        </div>
                    </div>
                    <div id="payment-method" class="tab-pane {detaultTabPaymentState}">
                        <div class="panel-body">
                            <div class="panel-group" show={billing.data.card}>
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <h5 class="panel-title">Registed Card </h5>
                                    </div>
                                    <div class="panel-body">
                                        <div class="row">
                                            <div class="col-md-2">
                                                <i class="fa fa-cc-visa payment-icon-big text-success" show={billing.data.card.brand == 'Visa'}></i>
                                                <i class="fa fa-cc-mastercard payment-icon-big text-warning" show={billing.data.card.brand == 'MasterCard'}></i>
                                                <i class="fa fa-cc-amex payment-icon-big text-success" show={billing.data.card.brand == "American Express"}></i>
                                            </div>
                                            <div class="col-md-8">
                                                <h2 style="margin-top:0">{account.cardLast4Digits}</h2>
                                                <p><small>
                                                        <strong>Expiry date:</strong> {billing.data.card.exp}
                                                    </small>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="panel-group payments-method" id="accordion">
                                        <div class="panel panel-default">
                                            <div class="panel-heading">
                                                <div class="pull-right">
                                                	<i class="fa fa-cc-visa text-danger"></i>
                                                    <i class="fa fa-cc-mastercard text-warning"></i>
                                                    <i class="fa fa-cc-amex text-success"></i>
                                                </div>
                                                <h5 class="panel-title">
                                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Credit Card</a>
                                                </h5>
                                            </div>
                                            <div id="collapseTwo" class="panel-collapse collapse in">
                                                <div class="panel-body">
                                                    <div class="row">
                                                       <!-- <div class="col-md-4">
                                                            <h2>Summary</h2>
                                                            <strong>Plan:</strong>: Name of plan <br/>
                                                            <strong>Price:</strong>: <span class="text-navy">$</span>
                                                            <p class="m-t">
                                                                &nbsp;

                                                            </p>
                                                            <p>
                                                                &nbsp;
                                                            </p>
                                                        </div>-->
                                                        <div class="col-md-12">
                                                            <p>To update your billing information, please update your information below.</p>
                                                            <form role="form" id="payment-form">
                                                                <div class="row">
                                                                    <div class="col-xs-12">
                                                                        <div class="form-group">
                                                                            <label>CARD NUMBER</label>
                                                                            <div class="input-group">
                                                                                <input id="number" type="text" class="form-control" name="Number" placeholder="{ account.cardLast4Digits || 'Valid Card Number' }" required />
                                                                                <span class="input-group-addon"><i class="fa fa-credit-card"></i></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-xs-7 col-md-7">
                                                                        <div class="form-group">
                                                                            <label>EXPIRATION DATE</label>
                                                                            <div id="cvc-row">
                                                                                <input type="text" class="form-control cvc-child" id="mm" name="ExpiryMM" placeholder="MM" required/>
                                                                                <span class="cvc-child">/</span>
                                                                                <input type="text" class="form-control cvc-child" id="yy" name="ExpiryYY" placeholder="YY" required/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-xs-5 col-md-5 pull-right">
                                                                        <div class="form-group">
                                                                            <label>Card security code</label>
                                                                            <input id="cvv" type="text" class="form-control" name="CVV" placeholder="CVC/CVV/CID" required/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-xs-12">
                                                                        <div class="form-group">
                                                                            <label>NAME ON CARD</label>
                                                                            <input id="name" type="text" class="form-control" name="nameCard" placeholder="NAME AND SURNAME" required/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-xs-12">
                                                                        <button id="btnUpdateBilling" class="ladda-button ladda-button-demo btn btn-primary" data-style="expand-right" type="submit" onclick="{ update_payment }">Add Payment Method</button>
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
                            </div>
                        </div>
                    </div>
                    <div id="coupon" class="tab-pane">
                        <div class="panel-body" hide="{account.cardLast4Digits}">
                            <p>Regist your credit card first.</p>
                        </div>
                        <div class="panel-body" show="{account.cardLast4Digits}">
                            <coupon coupon={ billing.data.coupon }></coupon>
                        </div>
                    </div>
                    <div id="alert" class="tab-pane">
                        <billingAlert account={ account } />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<init></init>
<script>
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
    update_payment(e) {
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
    }
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
</script>
<style>
.cvc-child {
    display: inline-block;
    width: auto;
}
.tab-disabled {
    pointer-events : none;
}
</style>
</billing>
