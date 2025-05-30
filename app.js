const urethaneData = [];

async function loadUrethanes() {
  try {
    const response = await fetch("urethanes.csv");
    const text = await response.text();
    const lines = text.split("\n").slice(1); // Skip header
    lines.forEach((line) => {
      const [id, name, brand, type, recommendedTime, notes, price] = line.split(",");
      if (name && recommendedTime) {
        urethaneData.push({
          name: name.trim(),
          brand: brand.trim(),
          type: type.trim(),
          recommendedTime: recommendedTime.trim(),
          note: notes?.trim() || "",
          price: price?.trim(),
        });
      }
    });
    const dropdown = document.getElementById("urethane");
    urethaneData.forEach((u) => {
      const option = document.createElement("option");
      option.value = u.name;
      option.textContent = `${u.name} (${u.recommendedTime})`;
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
  document.getElementById("loading").style.display = "block";
  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
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
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      document.getElementById("loading").style.display = "none";
    }
  });
}

async function manualZipFetch() {
  const zip = document.getElementById("zip").value.trim();
  if (!zip) return;
  document.getElementById("loading").style.display = "block";
  try {
    const apiKey = "07fe3e96b8e84a1d6aa20c002a2a3b3f";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${apiKey}&units=imperial`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (data?.main) {
      document.getElementById("temperature").value = data.main.temp;
      document.getElementById("humidity").value = data.main.humidity;
      showWeatherInfo(data.name, data.main.temp, data.main.humidity);
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}

function calculateSDAT() {
  const dropdown = document.getElementById("urethane");
  const selected = dropdown.value;
  const temperature = parseFloat(document.getElementById("temperature").value);
  const humidity = parseFloat(document.getElementById("humidity").value);
  const urethane = urethaneData.find((u) => u.name === selected);

  if (!urethane || isNaN(temperature) || isNaN(humidity)) {
    document.getElementById("result").textContent = "Please select a urethane and ensure weather data is available.";
    return;
  }

  let resultText = `🧪 ${urethane.name} (${urethane.type}) by ${urethane.brand}\nRecommended Drive-Away Time: ${urethane.recommendedTime}`;

  if (temperature < 40) {
    resultText += `\n⚠️ Cold weather detected. May require additional cure time.`;
  }

  if (humidity > 80) {
    resultText += `\n⚠️ High humidity may affect cure performance.`;
  }

  if (urethane.note) {
    resultText += `\n📌 Note: ${urethane.note}`;
  }

  document.getElementById("result").textContent = resultText;
}

window.onload = () => {
  loadUrethanes();
  getWeather();
  document.getElementById("detect-location").addEventListener("click", getWeather);
  document.getElementById("manual-zip").addEventListener("click", manualZipFetch);
  document.getElementById("calculate").addEventListener("click", calculateSDAT);
};
