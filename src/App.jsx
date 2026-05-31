import HousingChart from './components/HousingChart'

function App() {
	return (
		<>
			<header>
				<p>Melbourne Housing Viz - ABS Census</p>
				<h1 style={{ lineHeight: '90%' }}>Buying in Melbourne: how many years of full-time pay for a median house?</h1>
				<p style={{ textAlign: 'left', padding: '1%' }}>I built this to understand why buying in Melbourne feels out of reach. The median established house price has risen far faster than typical full-time wages. This chart shows that gap as “years of gross earnings” at the median. <i>It’s not a mortgage calculator; it doesn’t include deposits, interest rates, or the fact that many buyers are dual-income households.</i></p>
			</header>
			<main style={{ flex: 1, }}>
				<HousingChart />
			</main>
			<footer style={{ paddingBottom: '1%', fontSize: '13px' }}>
				<p style={{ fontStyle: 'italic', padding: '1%' }}>
					Data sources:{' '}
					<a
						href="https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation/residential-property-price-indexes-eight-capital-cities"
						target="_blank"
						rel="noreferrer"
					>
						ABS Residential Property Price Indexes: Eight Capital Cities (cat. 6416.0)
					</a>{' '}
					for median established house prices, and{' '}
					<a
						href="https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia/latest-release"
						target="_blank"
						rel="noreferrer"
					>
						ABS Average Weekly Earnings, Australia (cat. 6302.0)
					</a>{' '}
					for Victorian full-time adult earnings.
				</p>
				<p>Built with React and D3.js - Torie CR</p>
			</footer>
		</>
	)
}

export default App
