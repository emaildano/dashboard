riot.compile(function() {

  riot.mount('*');

  var
    Route = riot.router.Route,
    DefaultRoute = riot.router.DefaultRoute,
    NotFoundRoute = riot.router.NotFoundRoute,
    RedirectRoute = riot.router.RedirectRoute;

  riot.router.use(securityFilter);

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
  ]);

  riot.router.start();

});
