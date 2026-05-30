import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { DATA_CONFIG, FORMAT } from '../chartConfig'
import renderLineChart from '../charts/renderLineChart'

export default function HousingChart() {
	const chartRef = useRef(null)
	const [summary, setSummary] = useState('')

	useEffect(() => {
		const chartContainer = chartRef.current
		if (!chartContainer) return undefined

		let isCancelled = false

		const parsePeriodToDate = d3.timeParse(DATA_CONFIG.periodParseFormat)
		const quarterFormatter = d3.timeFormat(FORMAT.quarter)
		const priceFormatter = d3.format(FORMAT.price)

		const handleDataPointFocus = (dataPoint) => {
			setSummary(
				`In ${quarterFormatter(dataPoint.date)}, the median established house in Melbourne was ${priceFormatter(dataPoint.median_price_aud)}.`
			)
		}

		const renderChartFromCsvRows = (csvRows) => {
			const chartData = csvRows
				.map((row) => ({
					date: parsePeriodToDate(row.period),
					median_price_aud: +row.median_price_aud * DATA_CONFIG.priceThousandsMultiplier,
				}))
				.filter((row) => row.date && !Number.isNaN(row.median_price_aud))
				.sort((a, b) => a.date - b.date)

			if (!chartData.length) return
			renderLineChart(chartContainer, chartData, { onFocus: handleDataPointFocus })
		}

		d3.csv(DATA_CONFIG.csvPath).then((csvRows) => {
			if (!isCancelled) renderChartFromCsvRows(csvRows)
		})

		const handleWindowResize = () => {
			d3.csv(DATA_CONFIG.csvPath).then((csvRows) => {
				if (!isCancelled) renderChartFromCsvRows(csvRows)
			})
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
