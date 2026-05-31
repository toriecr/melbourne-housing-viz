import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { FORMAT, METRICS } from '../chartConfig'
import { loadChartData } from '../data/loadChartData'
import renderLineChart from '../charts/renderLineChart'

export default function HousingChart() {
	const chartRef = useRef(null)
	const [summary, setSummary] = useState('')
	const [metricKey, setMetricKey] = useState('yearsOfEarnings')
	const dataRef = useRef([])

	useEffect(() => {
		const chartContainer = chartRef.current
		if (!chartContainer) return undefined

		let isCancelled = false

		const metric = METRICS[metricKey]
		const fmt = {
			quarter: d3.timeFormat(FORMAT.quarter),
			value: d3.format(metric.valueFormat),
		}

		const draw = () => {
			const chartData = dataRef.current
			if (isCancelled || !chartData.length) return
			renderLineChart(chartContainer, chartData, {
				yAccessor: (d) => d[metric.key],
				yAxisLabel: metric.yAxisLabel,
				axisFormat: metric.axisFormat,
				onFocus: (point) => setSummary(metric.summary(point, fmt)),
			})
		}

		if (dataRef.current.length) {
			draw()
		} else {
			loadChartData().then((chartData) => {
				if (isCancelled) return
				dataRef.current = chartData
				draw()
			})
		}

		window.addEventListener('resize', draw)

		return () => {
			isCancelled = true
			window.removeEventListener('resize', draw)
		}
	}, [metricKey])

	return (
		<>
			<fieldset className="metric-toggle">
				<legend className="visually-hidden">Choose metric</legend>
				{Object.entries(METRICS).map(([key, metric]) => (
					<label key={key} className="metric-toggle-button">
						<input
							type="radio"
							name="metric"
							value={key}
							className="visually-hidden"
							checked={key === metricKey}
							onChange={() => setMetricKey(key)}
						/>
						{metric.label}
					</label>
				))}
			</fieldset>
			<div className="the-chart">
				<div ref={chartRef} className="the-chart-mount" />
				<p className="chart-summary" aria-live="polite">
					{summary}
				</p>
			</div>
		</>
	)
}
