<resource-monitor>

    <section if={ !! opts.resource }>
        <h1>Monthly Data Transfer Rate (GB)</h1>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th each={ months } style="text-align: center;">{ month }</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td each={ months } style="text-align: right;">{ transfered } GB</td>
                </tr>
            </tbody>
        </table>
    </section>

    <script>
        var now = new Date(); // 現在

        // 過去1年の年月を取得して `opts.resource` の値を各月に格納
        this.months = [];
        for ( var i = 0; i < 12; i++ ) {
            var current = new Date( now.getFullYear(), now.getMonth() - i, 1 );
            var yyyy = ( current.getFullYear() ).toString();
            var mm = ( "0" + ( current.getMonth() + 1 ).toString() ).slice( -2 );

            var transfered = "";
            if ( opts.resource && opts.resource[ yyyy + mm ] ) {
                transfered = opts.resource[ yyyy + mm ].transferGb
            } else {
                transfered = "0"; // stringであるべき
            }

            this.months[ this.months.length ] = {
                "month": moment( current ).format( "MMM. YYYY" ),
                "transfered": transfered
            };
        }
    </script>

</resource-monitor>
