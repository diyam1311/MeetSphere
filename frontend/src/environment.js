let IS_PROD = true;

const server = IS_PROD
  ? "https://meetspherebackend-u4fc.onrender.com"
  : "http://localhost:8000";

export default server;
