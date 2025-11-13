export interface Location {
  name: string
  region: string
  country: string
  lat: number
  lon: number
  tz_id: string
  localtime: string
}

export interface ConditionData {
  text: string
  icon: string
}

export interface Current {
  temp_c: number
  last_updated: string
  feelslike_c: number
  humidity: number
  wind_kph: number
  gust_kph: number
  pressure_mb: number
  precip_mm: number
  vis_km: number
  condition: ConditionData
  dewpoint_c: number
}

export interface Forecast {
  forecastday: ForecastDay[]
}

export interface ForecastDay {
  date: string
  hour: HourData[]
  day: DayData
}

export interface DayData {
  maxtemp_c: number //макс темп
  mintemp_c: number //мин темп
  maxwind_kph: number // макс ветер, км/ч
  totalprecip_mm: number // общее кол-во осадков, мм
  avgvis_km: number // средн видимость, км
  daily_chance_of_rain: number // вероятность осадков, %
  condition: ConditionData
}

export interface HourData {
  time: string
  temp_c: number
  humidity: number
  wind_kph: number
  pressure_mb: number
}

export interface CityOptions {
  id: number
  name: string
  country: string
  region: string
  lat: number
  lon: number
}

export interface FavoriteCity {
  id: string
  name: string
  country: string
  lat: number
  lon: number
  temp_c: number
  condition: {
    text: string
    icon: string
  }
}
