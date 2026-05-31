import * as d3 from 'd3'
import { FORMAT, CHART_LAYOUT, CHART_SCALES, CHART_STYLE } from '../chartConfig'


export default function renderLineChart(
	container,
	data,
	{ yAccessor, yAxisLabel, valueFormat, onFocus } = {}
) {
	const { margin, maxWidth, height } = CHART_LAYOUT
	const chartWidth = Math.min(maxWidth, container.clientWidth || maxWidth)
	const plotWidth = chartWidth - margin.left - margin.right
	const plotHeight = height - margin.top - margin.bottom

	container.replaceChildren('')

	const svg = d3
		.select(container)
		.append('svg')
		.attr('viewBox', `0 0 ${chartWidth} ${height}`)
		.attr('width', '100%')
		.attr('role', 'presentation')

	const plotGroup = svg
		.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`)

	const xScale = d3
		.scaleTime()
		.domain(d3.extent(data, (d) => d.date))
		.range([0, plotWidth])

	const yScale = d3
		.scaleLinear()
		.domain([
			0,
			d3.max(data, yAccessor) * CHART_SCALES.yDomainHeadroomRatio,
		])
		.nice()
		.range([plotHeight, 0])

	const lineGenerator = d3
		.line()
		.x((d) => xScale(d.date))
		.y((d) => yScale(yAccessor(d)))

	const valueFormatter = d3.format(valueFormat)
	const xAxisTickInterval = d3.timeYear.every(CHART_SCALES.xTickYearsInterval)

	plotGroup
		.append('g')
		.attr('class', 'grid')
		.attr('transform', `translate(0,${plotHeight})`)
		.call(
			d3.axisBottom(xScale).ticks(xAxisTickInterval).tickSize(-plotHeight).tickFormat('')
		)

	plotGroup
		.append('g')
		.attr('class', 'grid')
		.call(
			d3.axisLeft(yScale).ticks(CHART_SCALES.yTickCount).tickSize(-plotWidth).tickFormat('')
		)

	plotGroup
		.append('g')
		.attr('class', 'axis')
		.attr('transform', `translate(0,${plotHeight})`)
		.call(
			d3
				.axisBottom(xScale)
				.ticks(xAxisTickInterval)
				.tickFormat(d3.timeFormat(FORMAT.xAxisYear))
		)

	plotGroup
		.append('g')
		.attr('class', 'axis')
		.call(d3.axisLeft(yScale).ticks(CHART_SCALES.yTickCount).tickFormat(valueFormatter))

	plotGroup
		.append('text')
		.attr('x', plotWidth / 2)
		.attr('y', plotHeight + CHART_LAYOUT.xAxisTitleGapBelowPlot)
		.attr('text-anchor', 'middle')
		.attr('fill', 'currentColor')
		.attr('font-size', CHART_STYLE.axisLabelFontSize)
		.text('Quarter')

	plotGroup
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('x', -plotHeight / 2)
		.attr('y', -CHART_LAYOUT.yAxisTitleGapLeftOfPlot)
		.attr('text-anchor', 'middle')
		.attr('fill', 'currentColor')
		.attr('font-size', CHART_STYLE.axisLabelFontSize)
		.text(yAxisLabel)

	plotGroup
		.append('path')
		.attr('class', 'line')
		.attr('fill', 'none')
		.attr('stroke', CHART_STYLE.lineStrokeColor)
		.attr('stroke-width', CHART_STYLE.lineStrokeWidth)
		.attr('d', lineGenerator(data))

	const focusGroup = plotGroup.append('g').attr('display', 'none')

	focusGroup
		.append('line')
		.attr('class', 'focus-line')
		.attr('y1', 0)
		.attr('y2', plotHeight)
		.attr('stroke', 'currentColor')
		.attr('stroke-opacity', CHART_STYLE.focusLineOpacity)
		.attr('stroke-dasharray', CHART_STYLE.focusDashPattern)

	focusGroup
		.append('circle')
		.attr('r', CHART_STYLE.focusDotRadius)
		.attr('fill', CHART_STYLE.lineStrokeColor)
		.attr('stroke', CHART_STYLE.focusDotStrokeColor)
		.attr('stroke-width', CHART_STYLE.focusDotStrokeWidth)

	const hoverOverlay = plotGroup
		.append('rect')
		.attr('class', 'chart-interactive-area')
		.attr('width', plotWidth)
		.attr('height', plotHeight)
		.attr('fill', 'transparent')
		.attr('pointer-events', 'all')
		.attr('tabindex', 0)
		.attr('role', 'img')
		.attr(
			'aria-label',
			'Housing affordability line chart. Use left and right arrow keys to move between data points.'
		)

	const dateBisector = d3.bisector((d) => d.date).left
	let activeIndex = data.length ? data.length - 1 : 0

	function showPointAtIndex(index) {
		if (!data.length) return

		activeIndex = Math.max(0, Math.min(data.length - 1, index))
		const point = data[activeIndex]

		focusGroup.attr('display', null)
		focusGroup
			.select('line')
			.attr('x1', xScale(point.date))
			.attr('x2', xScale(point.date))
		focusGroup
			.select('circle')
			.attr('cx', xScale(point.date))
			.attr('cy', yScale(yAccessor(point)))

		if (onFocus) {
			onFocus(point)
		}
	}

	function showHoveredPoint(event) {
		const [mouseX] = d3.pointer(event, hoverOverlay.node())
		const hoveredDate = xScale.invert(mouseX)
		const insertIndex = dateBisector(data, hoveredDate, 1)
		const earlierPoint = data[insertIndex - 1]
		const laterPoint = data[insertIndex]
		if (!earlierPoint || !laterPoint) return

		const nearestPoint =
			hoveredDate - earlierPoint.date > laterPoint.date - hoveredDate
				? laterPoint
				: earlierPoint

		showPointAtIndex(data.indexOf(nearestPoint))
	}

	function hideFocus() {
		focusGroup.attr('display', 'none')
		activeIndex = data.length ? data.length - 1 : 0
		if (onFocus && data.length) {
			onFocus(data[data.length - 1])
		}
	}

	function handleKeydown(event) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault()
			showPointAtIndex(activeIndex - 1)
		} else if (event.key === 'ArrowRight') {
			event.preventDefault()
			showPointAtIndex(activeIndex + 1)
		}
	}

	hoverOverlay
		.on('mousemove', showHoveredPoint)
		.on('focusin', () => showPointAtIndex(activeIndex))
		.on('keydown', handleKeydown)
		.on('mouseleave focusout', hideFocus)

	if (onFocus && data.length) {
		onFocus(data[data.length - 1])
	}
}