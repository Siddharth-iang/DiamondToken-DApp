import { useState } from 'react';
import { ethers } from 'ethers';

function WalletConnect({ onConnect }) {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const balance = await provider.getBalance(accounts[0]);
      const balanceInEth = ethers.formatEther(balance);

      setAccount(accounts[0]);
      setBalance(balanceInEth);

      onConnect(provider, signer, accounts[0]);

    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    onConnect(null, null, null);
  };

  return (
    <div className="card" style={{ maxWidth: 520, margin: '0 auto 24px' }}>
      {!account ? (
        <div style={{ textAlign: 'center', padding: 12 }}>
          <button onClick={connectWallet} className="connect-button">
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="connected-box" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 12 }}>
            <p className="label">Connected Account:</p>
            <p style={{ fontWeight: 700, fontSize: 16 }}>{account.slice(0, 6)}...{account.slice(-4)}</p>
          </div>
          <div style={{ marginBottom: 12 }}>
            <p className="label">ETH Balance:</p>
            <p style={{ fontWeight: 700, color: '#111' }}>{parseFloat(balance).toFixed(4)} ETH</p>
          </div>
          <button onClick={disconnectWallet} className="button-primary" style={{ background: 'transparent', border: '1px solid rgba(11,11,11,0.06)' }}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
export default WalletConnect;