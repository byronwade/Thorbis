type WeatherData = {
  location: string;
  temperature: number;
  conditions: string;
  humidity: number;
};

type WeatherProps = {
  data: WeatherData;
};

export function Weather({ data }: WeatherProps) {
  return (
    <div className="not-prose rounded-xl border bg-zinc-50 p-4 dark:bg-zinc-900">
      <div className="mb-2 font-medium">Weather in {data.location}</div>
      <div className="grid gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-500">Temperature:</span>
          <span className="font-medium">{data.temperature}°F</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Conditions:</span>
          <span className="font-medium">{data.conditions}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Humidity:</span>
          <span className="font-medium">{data.humidity}%</span>
        </div>
      </div>
    </div>
  );
}
