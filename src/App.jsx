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
			<footer style={{ paddingBottom: '1%', fontSize: '14px' }}>
				<p>Built with React and D3.js - Torie CR</p>
			</footer>
		</>
	)
}

export default App
