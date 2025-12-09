import { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import TokenBalance from './components/TokenBalance';
import TokenTransfer from './components/TokenTransfer';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);

  const handleWalletConnect = (provider, signer, account) => {
    setProvider(provider);
    setSigner(signer);
    setAccount(account);
  };

  return (
    <div className="App">
      <header className="header">
        <h1><span className="diamond-accent">💎</span> Diamond Token DApp</h1>
        <p>Manage your Diamond Tokens</p>
      </header>

      <main className="main">
        <WalletConnect onConnect={handleWalletConnect} />
        
        {account && (
          <>
            <TokenBalance provider={provider} account={account} />
            <TokenTransfer signer={signer} account={account} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;