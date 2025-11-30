import { useState, useEffect } from 'react'

import './App.css'

function App() {
    const [account, setAccount] = useState('')
    const [name, setName] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [savedAccount, setSavedAccount] = useState(null)
    const [accounts, setAccounts] = useState([])
    const [loadingAccounts, setLoadingAccounts] = useState(true)

    // Fetch all accounts on component mount
    useEffect(() => {
        fetchAccounts()
    }, [])

    const fetchAccounts = async () => {
        setLoadingAccounts(true)
        try {
            const response = await fetch('/api/accounts')
            if (!response.ok) {
                throw new Error('ไม่สามารถดึงข้อมูลได้')
            }
            const data = await response.json()
            setAccounts(data)
        } catch (err) {
            console.error('Error fetching accounts:', err)
        } finally {
            setLoadingAccounts(false)
        }
    }

    const handleChange = (e) => {
        setAccount(e.target.value)
        if (error) setError('')
    }

    const handleNameChange = (e) => {
        setName(e.target.value)
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const trimmed = account.trim()
        const trimmedName = name.trim()
        
        if (!trimmedName) {
            setError('โปรดกรอกชื่อ')
            setSubmitted(false)
            return
        }
        
        if (!trimmed) {
            setError('โปรดกรอกหมายเลขบัญชีธนาคาร')
            setSubmitted(false)
            return
        }

        // Simple normalization: remove spaces and dashes
        const normalized = trimmed.replace(/[\s-]/g, '')

        // Basic validation: only digits, length between 6 and 20
        if (!/^\d{6,20}$/.test(normalized)) {
            setError('หมายเลขบัญชีต้องเป็นตัวเลข 6-20 หลัก (เว้นวรรค/ขีดได้)')
            setSubmitted(false)
            return
        }

        // Send to backend
        setLoading(true)
        setError('')
        
        try {
            const response = await fetch('/api/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    accountNumber: normalized,
                    name: trimmedName 
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
            }

            const data = await response.json()
            setSavedAccount(data)
            setSubmitted(true)
            setAccount('') // Clear input after success
            setName('') // Clear name input
            
            // Refresh accounts list
            fetchAccounts()
        } catch (err) {
            setError(err.message || 'ไม่สามารถเชื่อมต่อกับ server ได้')
            setSubmitted(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="App">
            <h1>Enter Your Bank Account</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="ชื่อ-นามสกุล"
                    value={name}
                    onChange={handleNameChange}
                    aria-label="Name"
                    disabled={loading}
                />
                <input
                    type="text"
                    placeholder="Bank Account"
                    value={account}
                    onChange={handleChange}
                    aria-label="Bank Account"
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'กำลังบันทึก...' : 'Submit'}
                </button>
            </form>

            {error && <p className="error" role="alert">{error}</p>}

            {submitted && savedAccount && (
                <div className="success">
                    <p>✅ บันทึกสำเร็จ!</p>
                    <p>ชื่อ: <strong>{savedAccount.name}</strong></p>
                    <p>หมายเลขบัญชี: <strong>{savedAccount.accountNumber}</strong></p>
                    <p>ID: {savedAccount._id}</p>
                </div>
            )}

            <div className="accounts-list">
                <h2>รายการบัญชีในระบบ ({accounts.length})</h2>
                
                {loadingAccounts ? (
                    <p className="loading">กำลังโหลดข้อมูล...</p>
                ) : accounts.length === 0 ? (
                    <p className="empty">ยังไม่มีบัญชีในระบบ</p>
                ) : (
                    <div className="account-cards">
                        {accounts.map((acc, index) => (
                            <div key={acc._id} className="account-card">
                                <div className="account-number">#{index + 1}</div>
                                <div className="account-details">
                                    <p className="name">{acc.name}</p>
                                    <p className="number">{acc.accountNumber}</p>
                                    <p className="id">ID: {acc._id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

export default App
