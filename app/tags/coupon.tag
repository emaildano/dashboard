<currentCoupon>
    <div class="col-lg-12">
        <div class="panel-group coupon" id="accordion">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h5 class="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Current Coupon</a>
                    </h5>
                </div>
                <div id="collapseTwo" class="panel-collapse collapse in">
                    <div class="panel-body">
                        <div class="form-horizontal">
                            <div class="form-group">
                                <label class="col-lg-2 controle-label">Coupon Code</label>
                                <div class="col-lg-10">
                                    <input type="text" class="form-control" value={opts.coupon.id} readonly="readonly"/>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-2 controle-label">Discount</label>
                                <div class="col-lg-10">
                                    <input type="text" class="form-control" value="{opts.coupon.amount_off}" readonly="readonly"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
    this.items = []
    var self  = this
    self.update()
    display()
    this.on('mount', function() {
      $(document).ready(function(){
        loading()
      })
    })
    </script>
</currentCoupon>

<coupon>
    <div class="row">
        <currentCoupon if={opts.coupon} coupon={ opts.coupon }></currentCoupon>
        <div class="col-lg-12">
            <div class="panel-group coupon" id="accordion">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h5 class="panel-title">
                            <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">
                                <span show={opts.coupon}>Replace</span>
                                <span hide={opts.coupon}>Add New</span>
                                <span> Coupon Code</span>
                            </a>
                        </h5>
                    </div>
                    <div id="collapseTwo" class="panel-collapse collapse in">
                        <div class="panel-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <p></p>
                                    <form role="form" id="payment-form">
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <div class="form-group">
                                                    <label>Coupon Code</label>
                                                    <div class="input-group">
                                                        <input id="coupon_code" type="text" class="form-control" name="Number" placeholder="Valid Coupon Code" required />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <button id="btnAddCoupon" class="ladda-button ladda-button-demo btn btn-primary" data-style="expand-right" type="submit" onclick="{ add_coupon }">Add Coupon</button>
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
    <script>
    this.items = []
    var self  = this

    init().then(function(){
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

    add_coupon(e) {
        if (self.coupon_code.value === ''){
            toastr.warning('Coupon Code is required.','')
            return
        }
        var btn = $( '#btnAddCoupon' ).ladda()
        btn.ladda( 'start' )
        var params = {
            is_test: true
        }
        if (location.hostname === 'go.getshifter.io') {
            params.is_test = false
        }
        put(endpoint.coupon + self.coupon_code.value, params).then(function(response){
            if ( response.body.errorMessage !== undefined ){
              return Promise.reject(response.body.errorMessage)
            }
            toastr.success('Regster Successed!')
            btn.ladda('stop')
            self.update()
            display()
            return
        }).catch(function(error){
            console.log(error)
            toastr.warning(error,'')
            btn.ladda('stop')
            display()
            return
        })
    }

    this.on('mount', function() {
      $(document).ready(function(){
        loading()
      })
    })
    </script>
</coupon>
