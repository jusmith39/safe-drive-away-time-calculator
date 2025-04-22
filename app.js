const urethaneData = [];

async function loadUrethanes() {
  try {
    const response = await fetch("urethanes.csv");
    const text = await response.text();
    const lines = text.split("\n").slice(1); // Skip header
    lines.forEach((line) => {
      const [name, baseTime, conditionNote] = line.split(",");
      if (name) {
        urethaneData.push({
          name: name.trim(),
          baseTime: parseFloat(baseTime),
          note: conditionNote?.trim() || "",
        });
      }
    });
    const dropdown = document.getElementById("urethane");
    urethaneData.forEach((u) => {
      const option = document.createElement("option");
      option.value = u.name;
      option.textContent = u.name;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Failed to load urethanes:", error);
  }
}

function showWeatherInfo(location, temp, humidity) {
  const display = document.getElementById("location-weather");
  display.textContent = `Today's conditions in ${location}: ${temp}°F, ${humidity}% humidity.`;
}

async function getWeather() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const apiKey = "07fe3e96b8e84a1d6aa20c002a2a3b3f";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (data?.main) {
      document.getElementById("temperature").value = data.main.temp;
      document.getElementById("humidity").value = data.main.humidity;
      showWeatherInfo(data.name, data.main.temp, data.main.humidity);
    }
  });
}

async function manualZipFetch() {
  const zip = document.getElementById("zip").value.trim();
  if (!zip) return;
  const apiKey = "07fe3e96b8e84a1d6aa20c002a2a3b3f";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${apiKey}&units=imperial`;
  const res = await fetch(apiUrl);
  const data = await res.json();
  if (data?.main) {
    document.getElementById("temperature").value = data.main.temp;
    document.getElementById("humidity").value = data.main.humidity;
    showWeatherInfo(data.name, data.main.temp, data.main.humidity);
  }
}

function calculateSDAT() {
  const dropdown = document.getElementById("urethane");
  const selected = dropdown.value;
  const temperature = parseFloat(document.getElementById("temperature").value);
  const humidity = parseFloat(document.getElementById("humidity").value);
  const urethane = urethaneData.find((u) => u.name === selected);

  if (!urethane || isNaN(temperature)) {
    document.getElementById("result").textContent = "Please select a urethane and ensure weather data is available.";
    return;
  }

  let adjusted = urethane.baseTime;

  // Sample condition logic, can be extended by urethane type
  if (temperature < 40) adjusted += 30;
  if (humidity > 80) adjusted += 15;

  document.getElementById("result").textContent = `Adjusted Safe Drive-Away Time for ${urethane.name}: ${adjusted} minutes\n${urethane.note}`;
}

window.onload = loadUrethanes;
