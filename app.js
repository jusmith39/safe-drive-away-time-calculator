<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Auto Glass Urethane Drive-Away Time Calculator</title>
  <link href="styles.css" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://cdn-icons-png.flaticon.com/512/744/744466.png" alt="Car icon" class="car-icon" />
      <div class="title">Safe Drive-Away Time Calculator</div>
    </div>

    <div id="location-weather">Fetching location and weather...</div>

    <label for="urethane">Urethane Product</label>
    <select id="urethane"></select>

    <input type="text" id="zip" placeholder="Enter ZIP code (optional)" />

    <div class="button-row">
      <button id="detect-location">📍 Detect My Location</button>
      <button id="manual-zip">✍️ Or Enter Manually</button>
    </div>

    <label for="temperature">Temperature (°F)</label>
    <input type="number" id="temperature" value="70" />

    <label for="humidity">Humidity (%)</label>
    <input type="number" id="humidity" value="50" />

    <button class="calculate" id="calculate">
      <span>Calculate Drive-Away Time</span>
      <span>🧮</span>
    </button>

    <div class="loading" id="loading">Fetching weather...</div>
    <div class="result" id="result"></div>
  </div>

  <script src="app.js"></script>
</body>
</html>
