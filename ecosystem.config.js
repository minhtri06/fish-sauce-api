module.exports = {
  apps: [
    {
      name: "test",
      script: "npm",
      args: "run start",
      env_prod: {
        APP_ENV: "production", // APP_ENV=prod
      },
    },
  ],
};
