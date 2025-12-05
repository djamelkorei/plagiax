module.exports = {
  apps: [
    {
      name: "plagiax",
      script: "npm",
      args: "start",
      instances: 2,
      exec_mode: "cluster",
      max_memory_restart: "1G",
      restart_delay: 5000,
      env: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
    },
  ],
};
