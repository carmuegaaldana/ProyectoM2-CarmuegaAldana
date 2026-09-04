const pool = require("./db/pool");

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");
    console.log("Conexión exitosa:", result.rows[0]);
  } catch (error) {
    console.error("Error de conexión:", error.message);
  } finally {
    await pool.end();
  }
}

testConnection();