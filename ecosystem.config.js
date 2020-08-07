module.exports = {
  apps: [
    {
      name: 'typewriter-server',
      exec_mode: 'cluster',
      instances: 'max',
      script: './dist/index.js',
      watch: true,
      env: {
        ENV: 'development',
      },
      env_production: {
        ENV: 'production',
      },
    },
  ],
};
