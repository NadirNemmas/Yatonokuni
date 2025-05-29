const express = require("express");
const app = express();

// Middleware ou routes ici...

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
