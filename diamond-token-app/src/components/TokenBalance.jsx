import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DiamondTokenABI from '../contracts/DiamondToken.json';

function TokenBalance({ provider, account }) {
  const [balance, setBalance] = useState('0');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [loading, setLoading] = useState(false);

  const CONTRACT_ADDRESS = "0xaDae78B2bB2D693554802c4F718B304806514458"; 

  useEffect(() => {
    if (provider && account) {
      fetchTokenInfo();
    }
  }, [provider, account]);

  const fetchTokenInfo = async () => {
    try {
      setLoading(true);

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        DiamondTokenABI.abi,
        provider
      );

      const name = await contract.name();
      const symbol = await contract.symbol();
      const balance = await contract.balanceOf(account);

      setTokenName(name);
      setTokenSymbol(symbol);
      setBalance(ethers.formatEther(balance));
      
    } catch (error) {
      console.error("Error fetching token info:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!provider || !account) {
    return <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>Connect wallet to see balance</div>;
  }

  return (
    <div>
      <div className="balance-box">
        <h2 style={{ margin: 0 }}>💎 {tokenName || 'DiamondToken'}</h2>
        {loading ? (
          <p style={{ marginTop: 18 }}>Loading...</p>
        ) : (
          <>
            <p className="label" style={{ marginTop: 18 }}>Your Balance</p>
            <div className="balance-amount">{parseFloat(balance).toLocaleString()} {tokenSymbol}</div>
            <div style={{ marginTop: 18 }}>
              <button onClick={fetchTokenInfo} className="button-primary">🔄 Refresh</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TokenBalance;