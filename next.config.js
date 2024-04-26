/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // HTTPS: true,
    // SSL_CRT_FILE: "myserver.crt",
    // SSL_KEY_FILE: "myserver.key",
    PRODUCTION_SERVER_HOST: "http://127.0.0.1:8000",
  },
};

module.exports = nextConfig;
