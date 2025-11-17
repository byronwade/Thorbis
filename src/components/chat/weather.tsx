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
		<div className="not-prose bg-secondary dark:bg-foreground rounded-xl border p-4">
			<div className="mb-2 font-medium">Weather in {data.location}</div>
			<div className="grid gap-2 text-sm">
				<div className="flex justify-between">
					<span className="text-muted-foreground">Temperature:</span>
					<span className="font-medium">{data.temperature}°F</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Conditions:</span>
					<span className="font-medium">{data.conditions}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Humidity:</span>
					<span className="font-medium">{data.humidity}%</span>
				</div>
			</div>
		</div>
	);
}
