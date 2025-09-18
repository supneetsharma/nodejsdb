const express = require("express");
const sql = require("mssql");

const app = express();
const port = process.env.PORT || 3000;

// Get DB connection string from environment variable (Key Vault injects it)
const connectionString = process.env.DB_CONNECTION;

app.get("/", async (req, res) => {
  if (!connectionString) {
    return res.status(500).send("❌ DB_CONNECTION not set");
  }

  try {
    let pool = await sql.connect(connectionString);
    let result = await pool.request().query("SELECT GETDATE() as CurrentTime");

    res.send(`
      <h1>Azure Web App Connected to SQL Database ✅</h1>
      <p>Database Time: ${result.recordset[0].CurrentTime}</p>
      <p>Web App: ${process.env.WEBSITE_SITE_NAME || "local"}</p>
    `);
  } catch (err) {
    res.status(500).send("❌ DB Connection Failed: " + err.message);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}`));
