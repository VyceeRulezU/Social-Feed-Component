import SocialFeed from './components/SocialFeed'
import './App.css'
import './index.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Social Feed</h1>
        <p>Posts from the community</p>
      </header>
      <main>
        <SocialFeed />
      </main>
    </div>
  )
}

export default App
