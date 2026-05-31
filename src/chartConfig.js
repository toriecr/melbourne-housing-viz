export const DATA_CONFIG = {
	housingCsvPath: '/data/melbourne-median-house.csv',
	earningsCsvPath: '/data/victoria-full-time-earnings.csv',  // NEW
	periodParseFormat: '%b-%Y',
	priceThousandsMultiplier: 1000, // ABS Table 2 publishes median prices in $'000
	weeksPerYear: 52,
}

export const METRICS = {
	yearsOfEarnings: {
		key: 'years_of_earnings',
		yAxisLabel: 'Years of full-time earnings',
		valueFormat: '.1f',
		summary: (point, fmt) =>
			`In ${fmt.quarter(point.date)}, a median Melbourne house cost ` +
			`${fmt.value(point.years_of_earnings)} years of full-time pay.`,
	},
}

export const FORMAT = {
	quarter: '%b %Y',
	price: '$,.0f',
	xAxisYear: '%Y',
}

export const CHART_LAYOUT = {
	maxWidth: 720,
	height: 360,
	margin: { top: 16, right: 24, bottom: 44, left: 72 },
	xAxisTitleGapBelowPlot: 36,
	yAxisTitleGapLeftOfPlot: 52,
}

export const CHART_SCALES = {
	yDomainHeadroomRatio: 1.05,
	xTickYearsInterval: 4,
	yTickCount: 6,
}

export const CHART_STYLE = {
	axisLabelFontSize: 13,
	lineStrokeWidth: 2.5,
	lineStrokeColor: 'var(--accent, #aa3bff)',
	focusLineOpacity: 0.35,
	focusDashPattern: '4 4',
	focusDotRadius: 5,
	focusDotStrokeWidth: 2,
	focusDotStrokeColor: 'var(--bg, #fff)',
}