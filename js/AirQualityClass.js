class AirQuality {
    constructor(apiResult){
        this.description = apiResult.current.indexes[0].description;
        this.caqi = Math.round(apiResult.current.indexes[0].value);
        this.advice = apiResult.current.indexes[0].advice;
        this.pm25 = Math.round(apiResult.current.standards[0].percent);
        this.pm10 = Math.round(apiResult.current.standards[1].percent);
        this.caqiColor = apiResult.current.indexes[0].color;
    };

    saveGeoCordsFromLastSearchedLocation(airQualityData){
        try{
            localStorage.setItem("airQualityGeoCords", JSON.stringify(airQualityData));
        }catch(error){
            Error(error);
        }
    };

    showAirQuality(){
        const airQualityDescription = document.querySelector(".air-describe-value");
        const airQualityCaqiValue = document.querySelector(".caqi-value");
        const airQualityAdvice =  document.querySelector(".air-quality-description-tooltip");
        const airQualityPm25 = document.querySelector(".pm25-value");
        const airQualityPm10 = document.querySelector(".pm10-value");
        const airQualityCaqi = document.querySelector(".caqi-cnt");
        
        airQualityDescription.textContent = this.description;
        airQualityCaqiValue.textContent = this.caqi;
        airQualityAdvice.textContent = this.advice;
        airQualityPm25.textContent = this.pm25 + "% normy";
        airQualityPm10.textContent = this.pm10 + "% normy";
        airQualityCaqi.setAttribute("style", "background: " + this.caqiColor);
    };
    
    static async downloadAirQualityData(lat, lng){
        console.log(`lat=${lat} lng=${lng}`);
        const apiURL = "https://airapi.airly.eu/v2/measurements/nearest?indexType=AIRLY_CAQI&maxDistanceKM=10"
        return await axios({method:"get", url: apiURL, params:{
            "lat": lat,
            "lng": lng
        },
            headers:{
                'Accept' : 'application/json',
                'Accept-Language': 'pl',
                'apikey': 'VaBZUc4Y74pgY9TL817Dghw2YflPWrxk' 
            }});
    }; 
}

export default AirQuality