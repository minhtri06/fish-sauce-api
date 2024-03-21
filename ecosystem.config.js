module.exports = {
  apps: [
    {
      name: "test api",
      script: "npm",
      args: "run start",
      env_prod: {
        APP_ENV: "production", // APP_ENV=prod
      },
    },
  ],
};
