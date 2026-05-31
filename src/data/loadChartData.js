import * as d3 from 'd3'
import { DATA_CONFIG } from '../chartConfig'

export async function loadChartData() {
	const parsePeriod = d3.timeParse(DATA_CONFIG.periodParseFormat)

	const [houseRows, earningsRows] = await Promise.all([
		d3.csv(DATA_CONFIG.housingCsvPath),
		d3.csv(DATA_CONFIG.earningsCsvPath),
	])

	// earnings are weekly and published twice a year (May/Nov).
	// convert each reading to annual, then average the readings within a year.
	const annualByYear = d3.rollup(
		earningsRows
			.map((r) => ({
				date: parsePeriod(r.period),
				annual: +r.weekly_earnings_aud * DATA_CONFIG.weeksPerYear,
			}))
			.filter((r) => r.date && Number.isFinite(r.annual)),
		(group) => d3.mean(group, (d) => d.annual),
		(d) => d.date.getFullYear()
	)

	// return structure:
	// [{ date, median_price_aud, annual_earnings_aud, years_of_earnings }, ...]
	return houseRows
		.map((row) => {
			const date = parsePeriod(row.period)
			const price = +row.median_price_aud * DATA_CONFIG.priceThousandsMultiplier
			const earnings = date ? annualByYear.get(date.getFullYear()) : undefined
			return {
				date,
				median_price_aud: price,
				annual_earnings_aud: earnings,
				years_of_earnings: earnings ? price / earnings : NaN,
			}
		})
		.filter((d) => d.date && Number.isFinite(d.years_of_earnings))
		.sort((a, b) => a.date - b.date)
}