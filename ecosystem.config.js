module.exports = {
  apps: [
    {
      name: 'test api',
      script: 'npm',
      args: 'run start',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env_prod: {
        NODE_ENV: 'prod',
      },
    },
  ],
}
