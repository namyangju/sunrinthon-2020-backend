module.exports = {
  apps: [
    {
      name: 'typewriter-server',
      exec_mode: 'cluster',
      instances: 'max',
      script: './dist/index.js',
      watch: false,
      env: {
        ENV: 'development',
      },
      env_production: {
        ENV: 'production',
      },
    },
  ],
};
