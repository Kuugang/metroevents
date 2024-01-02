let ioInstance; 

function initSocket(server) {
  ioInstance = require("socket.io")(server, {
    pingTimeout: 600000,
    cors: {
      origin: ["http://localhost:3000", "https://kuugang-metroe.vercel.app"],
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    // console.log(`User Connected: ${socket.id}`);
    socket.on("disconnect", () => {
      // console.log("User Disconnected", socket.id);
    });
  });
}

function getIoInstance() {
  if (!ioInstance) {
    throw new Error("Socket.IO has not been initialized yet!");
  }
  return ioInstance;
}

module.exports = { initSocket, getIoInstance };
