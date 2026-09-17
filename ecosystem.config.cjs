module.exports = {
  apps: [
    {
      name: "liquiswap-backend-monerium",
      script: "./src/webhookMonerium.js",
      instances: 1,
      autorestart: true, // Riavvia automaticamente il backend in caso di crash dello script
      watch: false,      // Non riavviare se cambiano file a caso a meno che non sia necessario
      max_memory_restart: "1G", // Riavvia se consuma più di 1GB di RAM per prevenire memory leak
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
