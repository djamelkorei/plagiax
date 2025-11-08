module.exports = {
  apps: [
    {
      name: 'plagiax',
      script: 'npm',
      args: 'start',
      cwd: './',
      exec_mode: 'cluster',
      instances: 1,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '3G',
    },
  ],
};
