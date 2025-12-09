import { useState } from 'react';
import { ethers } from 'ethers';
import DiamondTokenABI from '../contracts/DiamondToken.json';

function TokenTransfer({ signer, account }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const CONTRACT_ADDRESS = "0xaDae78B2bB2D693554802c4F718B304806514458";

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (!recipient || !amount) {
      setError('Please fill all fields');
      return;
    }

    if (!ethers.isAddress(recipient)) {
      setError('Invalid recipient address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setTxHash('');

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        DiamondTokenABI.abi,
        signer
      );

      const amountInWei = ethers.parseEther(amount);

      const tx = await contract.transfer(recipient, amountInWei);
      
      setTxHash(tx.hash);
      
      await tx.wait();
      
      alert('Transfer successful! 🎉');
      setRecipient('');
      setAmount('');
      
    } catch (error) {
      console.error("Transfer error:", error);
    
      if (error.code === 'ACTION_REJECTED') {
        setError('Transaction rejected by user');
      } else if (error.message.includes('insufficient funds')) {
        setError('Insufficient balance');
      } else {
        setError('Transaction failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!signer || !account) {
    return <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>Connect wallet to transfer tokens</div>;
  }

  return (
    <div>
      <div className="transfer-form">
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>Transfer Tokens</h2>

        <form onSubmit={handleTransfer}>
          <div>
            <label className="label">Recipient Address</label>
            <input
              className="form-input"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              disabled={loading}
            />
          </div>

          <div>
            <label className="label">Amount</label>
            <input
              className="form-input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.01"
              disabled={loading}
            />
          </div>

          <button type="submit" className="connect-button" disabled={loading} style={{ width: '100%', marginTop: 6 }}>
            {loading ? 'Transferring...' : 'Transfer'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: 14, color: '#c62828', textAlign: 'center' }}>❌ {error}</div>
        )}

        {txHash && (
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            ✅ Transaction Hash: 
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#111', marginLeft: 8 }}
            >
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default TokenTransfer;