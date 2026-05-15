const app = require("./app");
const os = require("os");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();

  let fallbackIp = "localhost";

  for (const name of Object.keys(interfaces)) {
    for (const network of interfaces[name]) {
      if (network.family === "IPv4" && !network.internal) {
        // Prefer Wi-Fi / normal LAN IPs like 192.168.1.x
        if (
          network.address.startsWith("192.168.1.") ||
          network.address.startsWith("192.168.0.") ||
          network.address.startsWith("10.") ||
          network.address.startsWith("172.")
        ) {
          return network.address;
        }

        fallbackIp = network.address;
      }
    }
  }

  return fallbackIp;
}

const localIP = getLocalIpAddress();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Mobile: http://${localIP}:${PORT}`);
});