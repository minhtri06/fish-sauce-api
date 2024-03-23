module.exports = {
  apps: [
    {
      name: 'fish-sauce-api',
      script: 'npm run start',
      env_prod: {
        NODE_ENV: 'prod',
      },
      // prevent pm2 to log file. we use winston for logging
      out_file: '/dev/null',
      error_file: '/dev/null',
    },
  ],
}
