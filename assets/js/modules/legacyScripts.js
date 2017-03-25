/**
 * Legacy Scripts
 */

module.exports = function() {

  /**
   * AWS Cognito Scripts
   */

  AWSCognito.config.region = 'us-east-1';

  if (location.hostname === 'go.getshifter.io') {
    var poolData = {
      UserPoolId: 'us-east-1_OqeySRZoo',
      ClientId: '5mn2si2f0onlo063so26gk77j2'
    };
  } else {
    var poolData = {
      UserPoolId: 'us-east-1_Hq3FXXyA0',
      ClientId: '47fobgjl229cqj13cmhj18dajs'
    };
  }

  
  var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
  var cognitoUser = userPool.getCurrentUser();
  var request = window.superagent;
  var session_id;
  var sessionRefrashProvider;
  var maintenance;
  var userStatus;

  if (location.hostname === 'go.getshifter.io') {
    var apigwId = 'hz0wknz3a2';
    var stage = 'production';
  } else if (location.pathname.indexOf('stg-shifter-userconsole') > 0) {
    var apigwId = '49pfwvlis2';
    var stage = 'staging';
  } else {
    var apigwId = 'mr2jj0imn9';
    var stage = 'development';
  }

  var endpoint = {
    projects: 'https://' + apigwId + '.execute-api.us-east-1.amazonaws.com/' + stage + '/projects/',
    containers: 'https://' + apigwId + '.execute-api.us-east-1.amazonaws.com/' + stage + '/containers/',
    staticsites: 'https://' + apigwId + '.execute-api.us-east-1.amazonaws.com/' + stage + '/staticsites/',
    archives: 'https://' + apigwId + '.execute-api.us-east-1.amazonaws.com/' + stage + '/archives/',
    genhistory: 'https://' + apigwId + '.execute-api.us-east-1.amazonaws.com/' + stage + '/generatehistory/',
    status: 'https://' + apigwId + '.execute-api.us-east-1.amazonaws.com/' + stage + '/status/',
    transactions: 'https://' + apigwId + '.execute-api.us-east-1.amazonaws.com/' + stage + '/transactions/',
    domains: 'https://' + apigwId + '.execute-api.us-east-1.amazonaws.com/' + stage + '/domains/',
    billing: 'https://' + apigwId + '.execute-api.us-east-1.amazonaws.com/' + stage + '/billings',
    coupon: 'https://' + apigwId + '.execute-api.us-east-1.amazonaws.com/' + stage + '/coupons/',
    netlify: 'https://' + apigwId + '.execute-api.us-east-1.amazonaws.com/' + stage + '/netlify/',
    accounts: 'https://' + apigwId + '.execute-api.us-east-1.amazonaws.com/' + stage + '/accounts/',
    support: 'https://' + apigwId + '.execute-api.us-east-1.amazonaws.com/' + stage + '/support/'
  };

  var noLoginPages = [
    'login',
    'not-found',
    'activation',
    'forgot_password',
    'register',
    'reset_password'
  ];

  /**
   * Security Filter
   */

  function securityFilter(request, response, next) {
    try {
      return next();
    } finally {
      if (cognitoUser !== null) {
        cognitoUser.getSession(function(err, session) {
          if (err) {
            return;
          }

          if (session.isValid() && noLoginPages.indexOf(response.matches[1].tag) >= 0) {
            response.redirectTo = '/projects';
          } else if (!session.isValid() && noLoginPages.indexOf(response.matches[1].tag) < 0) {
            response.redirectTo = '/';
          }
        });
      } else if (noLoginPages.indexOf(response.matches[1].tag) < 0) {
        response.redirectTo = '/';
      }
    }
  }


  /**
   * Riot
   */

  riot.compile(function() {
    riot.mount('*')
    var
      Route = riot.router.Route,
      DefaultRoute = riot.router.DefaultRoute,
      NotFoundRoute = riot.router.NotFoundRoute,
      RedirectRoute = riot.router.RedirectRoute

    riot.router.use(securityFilter)
    riot.router.routes([
      new DefaultRoute({
        tag: 'login'
      }),
      new Route({
        tag: 'projects'
      }),
      new Route({
        path: '/project_new/:archive_id',
        tag: 'project_new'
      }),
      new Route({
        path: '/project_new',
        tag: 'project_new'
      }),
      new Route({
        path: '/project_detail/:project_id',
        tag: 'project_detail'
      }),
      new Route({
        tag: 'archive'
      }),
      new Route({
        tag: 'billing'
      }),
      new Route({
        path: '/activation/:username/:code',
        tag: 'activation'
      }),
      new Route({
        tag: 'domains'
      }),
      new Route({
        tag: 'archive-tool'
      }),
      new Route({
        path: '/userinfo-activation/:code',
        tag: 'userinfo-activation'
      }),
      new Route({
        tag: 'register'
      }),
      new Route({
        tag: 'forgot_password'
      }),
      new Route({
        path: '/reset_password/:username/:code',
        tag: 'reset_password'
      }),
      new Route({
        tag: 'account'
      }),
      new NotFoundRoute({
        tag: 'not-found'
      }),
    ])
    riot.router.start()
  })


  /**
   * TK
   */

  function init() {
    return getCognitoUserSession().then(function() {
      return getStatus();
    });
  }

  function getCognitoUserSession() {
    return new Promise(function(resolve, reject) {
      var cognitoUser = userPool.getCurrentUser();
      if (!cognitoUser) {
        location.reload();
      }
      cognitoUser.getSession(function(err, session) {
        if (err) {
          reject({
            statusCode: 401,
            message: 'Unauthorized'
          });
          return;
        }
        session_id = session.getAccessToken().getJwtToken();
        resolve(session_id);
      });
    });
  }

  function getStatus() {
    return get(endpoint.status).then(function(response) {
      maintenance = response.body.maintenance;
      userStatus = response.body.user;
      return Promise.resolve();
    });
  }

  function get(endpoint) {
    return new Promise(function(resolve, reject) {
      request.get(endpoint)
        .set('Authorization', session_id)
        .end(function(err, response) {
          if (err) {
            reject(err);
          }
          resolve(response);
        });
    });
  }

  function post(endpoint, body) {
    var body = body === undefined ? {} : body;

    return new Promise(function(resolve, reject) {
      request.post(endpoint)
        .set('Authorization', session_id)
        .send(body)
        .end(function(err, response) {
          if (err) {
            reject(err);
          }
          resolve(response);
        });
    });
  }

  function put(endpoint, body) {
    var body = body === undefined ? {} : body;
    return new Promise(function(resolve, reject) {
      request.put(endpoint)
        .set('Authorization', session_id)
        .send(body)
        .end(function(err, response) {
          if (err) {
            reject(err);
          }
          resolve(response);
        });
    });
  }

  function del(endpoint, body) {
    var body = body === undefined ? {} : body;

    return new Promise(function(resolve, reject) {
      request.del(endpoint)
        .set('Authorization', session_id)
        .send(body)
        .end(function(err, response) {
          if (err) {
            reject(err);
          }
          resolve(response);
        });
    });
  }

  function display() {
    $('#loading').addClass('hidden');
    $('#main_box').removeClass('hidden');
  }

  function loading() {
    $('#loading').removeClass('hidden');

    function loadHeightfunc() {
      var windowH = $(window).height();
      var loadOff = $('#loading').offset();
      var loadTop = loadOff.top;
      var loadHeight = windowH - loadTop;
      $('#loading').height(loadHeight);
    }

    loadHeightfunc();

    $(window).resize(function() {
      loadHeightfunc();
    });
  }

  function notifyUnregistedCreditCard() {
    swal({
      title: "Required",
      text: " Please register billing information to begin using Shifter.",
      confirmButtonColor: "#dc2d69",
      confirmButtonText: "Regist Credit Cards",
      showCancelButton: true,
      closeOnConfirm: true
    }, function(isConfirm) {
      if (isConfirm) {
        riot.route('/billing');
      }
      swal.close();
    });
  }

  function editable(target) {
    $.fn.editable.defaults.mode = 'inline';
    $.fn.editable.defaults.ajaxOptions = {
      type: "PUT",
      headers: {
        'Authorization': session_id
      },
      dataType: 'json'
    };
    $(target).editable();
  }

  if (cognitoUser !== null) {
    sessionRefrashProvider = setInterval(function() {　　　
      cognitoUser.getSession(function(err, session) {
        if (err) {
          return;
        }
        session_id = session.getAccessToken().getJwtToken();
      });
    }, 900000);
  }

};
