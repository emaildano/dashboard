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
