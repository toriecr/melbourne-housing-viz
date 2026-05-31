import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { FORMAT, METRICS } from '../chartConfig'
import { loadChartData } from '../data/loadChartData'
import renderLineChart from '../charts/renderLineChart'

export default function HousingChart() {
	const chartRef = useRef(null)
	const [summary, setSummary] = useState('')

	useEffect(() => {
		const chartContainer = chartRef.current
		if (!chartContainer) return undefined

		let isCancelled = false

		const metric = METRICS.yearsOfEarnings
		const fmt = {
			quarter: d3.timeFormat(FORMAT.quarter),
			value: d3.format(metric.valueFormat),
		}

		const draw = (chartData) => {
			if (isCancelled || !chartData.length) return
			renderLineChart(chartContainer, chartData, {
				yAccessor: (d) => d[metric.key],
				yAxisLabel: metric.yAxisLabel,
				valueFormat: metric.valueFormat,
				onFocus: (point) => setSummary(metric.summary(point, fmt)),
			})
		}

		loadChartData().then(draw)

		const handleWindowResize = () => {
			loadChartData().then(draw)
		}

		window.addEventListener('resize', handleWindowResize)

		return () => {
			isCancelled = true
			window.removeEventListener('resize', handleWindowResize)
		}
	}, [])

	return (
		<>
			<div className="the-chart">
				<div ref={chartRef} className="the-chart-mount" />
				<p className="chart-summary" aria-live="polite">
					{summary}
				</p>
			</div>
		</>
	)
}
