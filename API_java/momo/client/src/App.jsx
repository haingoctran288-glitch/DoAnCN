import Banner from './components/Banner';
import Header from './components/Header';
import HomePage from './components/HomePage';

function App() {
    return (
        <div>
            <header>
                <Header />
            </header>

            <main>
                <Banner />
                <HomePage />
            </main>
        </div>
    );
}

export default App;
