module.exports = {
  apps: [
    {
      name: 'test api',
      script: 'npm',
      args: 'run start',
      time: false,
      env_prod: {
        NODE_ENV: 'prod',
      },
    },
  ],
}
