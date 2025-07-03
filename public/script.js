document.getElementById('weatherForm').addEventListener('submit', async(event)=>{
    event.preventDefault();
    const cityInput = document.getElementById('cityInput').value.trim();
    const resultDiv = document.getElementById('weatherResult');
    resultDiv.innerHTML = 'Loading....';
    try{
        const response = await fetch(`/weather/${cityInput}`);
        const data = await response.json();
        if(response.ok){
            resultDiv.innerHTML = `
            <p><strong>City:</strong>${data.city}</p>
            <p><strong>Temperature:</strong>${data.temperature}°C</p>
            <p><strong>Description:</strong>${data.description}</p>
            <p><strong>Humidity:</strong>${data.humidity}%</p>
            <p><strong>Pressure:</strong>${data.pressure}hPa</p>
            <p><strong>Windspeed:</strong>${data.windSpeed}m/s</p>
            `;
        }else{
            resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
        }
    }catch(error){
        resultDiv.innerHTML = `<p class="error">Error while fetching the data, Try again.</p>`;
    }
});