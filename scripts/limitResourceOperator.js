'use strict';
// npm run limit-projects development horike37 10
// npm run limit-projects development horike37 delete
// npm run limit-archives development horike37 10
// npm run limit-archives development horike37 delete
// npm run limit-domains development horike37 10
// npm run limit-domains development horike37 delete
// npm run limit-all development horike37 10
// npm run limit-all development horike37 delete
const aws = require('aws-sdk');
aws.config.update({region:'us-east-1'});
const cognito = new aws.CognitoIdentityServiceProvider();
const target = process.argv[2];
const stage = process.argv[3];
const userName = process.argv[4];
const count = process.argv[5];

if (target == null || stage == null || userName == null || count == null) {
  throw new Error('The input value is wrong');
}

const userPoolId = stage === 'production' ? 'us-east-1_OqeySRZoo' : 'us-east-1_Hq3FXXyA0';
let customAttribute;
if (target === 'projects') {
  customAttribute = 'custom:upperLimitProjects';
} else if (target === 'archives') {
  customAttribute = 'custom:upperLimitArchives';
} else if (target === 'domains') {
  customAttribute = 'custom:upperLimitDomains';
} else if (target === 'all') {
  // Project
  let params = {
    UserAttributes: [
      {
        Name: 'custom:upperLimitProjects',
        Value: count
      },
    ],
    UserPoolId: userPoolId,
    Username: userName
  };
  cognito.adminUpdateUserAttributes(params, function(err, data) {
    if (err) throw err;
    else     console.log('Projects of upper limit is updated successfuly!');
  });

  // Archive
  params = {
    UserAttributes: [
      {
        Name: 'custom:upperLimitArchives',
        Value: count
      },
    ],
    UserPoolId: userPoolId,
    Username: userName
  };
  cognito.adminUpdateUserAttributes(params, function(err, data) {
    if (err) throw err;
    else     console.log('Archives of upper limit is updated successfuly!');
  });

  // Domain
  params = {
    UserAttributes: [
      {
        Name: 'custom:upperLimitDomains',
        Value: count
      },
    ],
    UserPoolId: userPoolId,
    Username: userName
  };
  cognito.adminUpdateUserAttributes(params, function(err, data) {
    if (err) throw err;
    else     console.log('Domains of upper limit is updated successfuly!');
  });
  return;
} else {
  throw new Error('The input value is wrong');
}

if (count === 'delete') {
  //todo: adminDeleteUserAttributesを使っても属性削除できないので調査
  const params = {
    UserAttributeNames: [customAttribute],
    UserPoolId: userPoolId,
    Username: userName
  };
  cognito.adminDeleteUserAttributes(params, function(err, data) {
    if (err) throw err;
    else     console.log('Delete successfully!');
  });
} else {
  const params = {
    UserAttributes: [
      {
        Name: customAttribute,
        Value: count
      },
    ],
    UserPoolId: userPoolId,
    Username: userName
  };
  cognito.adminUpdateUserAttributes(params, function(err, data) {
    if (err) throw err;
    else     console.log('Run successfully!');
  });
}