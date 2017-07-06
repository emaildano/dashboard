riot.tag2('invoice', '<div class="col-lg-12"> <div class="panel-group invoice" id="accordion"> <div class="ibox"> <h5 class="ibox-title"> <span>Invoice Summary</span> </h5> <div class="ibox-content"> <div show="{opts.invoice.date}"> <table class="table table-hover"> <tr><th>Date</th><td>{opts.invoice.date}</td></tr> <tr><th>Subtotal</th><td>{opts.invoice.subtotal}</td></tr> <tr><th>Total</th><td>{opts.invoice.total}</td></tr> <tr><th>Amount paid</th><td>{opts.invoice.amount_due}</td></tr> </table> </div> </div> </div> <div class="ibox"> <div class="ibox-title"> <h5 class="panel-title"> <span>Invoice line items</span> </h5> </div> <div class="ibox-content"> <table class="table table-hover"> <thead> <tr><th>Amount</th><th>Description</th><th>Period</th></tr> </thead> <tbody show="{opts.invoice.date}"> <tr each="{invoice in opts.invoice.lines}"> <td>{invoice.amount}</td> <td>{invoice.description}</td> <td>{invoice.period.start} ~ {invoice.period.end}</td> </tr> </tbody> </table> </div> </div> <div class="ibox"> <div class="ibox-title"> <h5 class="panel-title"> <span>Coupon Discount</span> </h5> </div> <div class="ibox-content"> <table class="table table-hover"> <thead> <tr><th>ID</th><th>Amount Off</th><th>Date</th></tr> </thead> <tbody show="{opts.invoice.discount.coupon}"> <tr> <td>{opts.invoice.discount.coupon}</td> <td>{opts.invoice.discount.amount_off}</td> <td>{opts.invoice.discount.created}</td> </tr> </tbody> </table> </div> </div> </div> </div>', '', '', function(opts) {
    this.items = []
    var self  = this
    self.update()
    display()
    this.on('mount', function() {
      $(document).ready(function(){
        loading()
      })
    })
});
