import { useEffect, useState, createContext, useContext } from 'react'
import { createContractObject } from '../utils/contract'
const appContext = createContext()
import { STOCKDATA } from '../data/asset.seed'
import { toEth, toWei } from '../utils/ether-utils'
import truncateEthAddress from 'truncate-eth-address'
import { useAccount } from 'wagmi'

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(STOCKDATA[0])
  const [currentCoinPrice, setCurrentCoinPrice] = useState('237.23')
  const [trend, setTrend] = useState('')
  const [mu, setMu] = useState(0.1)
  const [sigma, setSigma] = useState(0.2)
  const [time, setTime] = useState(0)
  const [change, setChange] = useState(0)
  const [percentChange, setPercentChange] = useState(0)
  const [isBettingActive, setIsBettingActive] = useState(false)
  const [bets, setBets] = useState([])
  const [pool, setPool] = useState(0)
  const [lastWinner, setLastWinner] = useState('')
  const [contractOwner, setContractOwner] = useState('')

  const account = useAccount().address
  useEffect(() => {}, [isBettingActive])

  useEffect(() => {}, [isBettingActive])

  const fetchBets = async () => {
    try {
    } catch (error) {
      console.log(error)
    }
  }

  const fetchPool = async () => {
    try {
    } catch (error) {
      console.log(error)
    }
  }

  const finalizeBetting = async currentCoinPrice => {
    try {
    } catch (error) {
      console.log(error)
    }
  }

  const getLatestWinner = async () => {
    try {
    } catch (error) {
      console.log(error)
    }
  }

  const startPrediction = async () => {
    try {
    } catch (error) {
      console.log(error)
    }
  }

  const getOwner = async () => {
    try {
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // Set up an interval to update the price every 5 seconds
    const interval = setInterval(() => {
      // Set the time step (dt) and the daily volatility
      const dt = 1 / 365
      const dailyVolatility = sigma * Math.sqrt(dt)

      // Generate 5 previous prices using the Ornstein-Uhlenbeck process
      const prevPrices = [currentCoinPrice]
      for (let i = 0; i < 4; i++) {
        // Calculate the drift and diffusion terms
        const drift = (mu - 0.5 * sigma * sigma) * dt
        const diffusion = dailyVolatility * (Math.random() - 0.5)

        // Get the previous price and calculate the new price
        const prevPrice = prevPrices[prevPrices.length - 1]
        const newPrice = prevPrice * Math.exp(drift + diffusion)

        // Add the new price to the list of previous prices
        prevPrices.push(newPrice)
      }

      // Calculate the weighted average of the previous prices to get the new price
      const weights = [0.1, 0.15, 0.2, 0.25, 0.3]
      const newPrice = prevPrices
        .slice(-5)
        .reduce((sum, price, index) => sum + price * weights[index], 0)

      // Calculate the current change and percentage change
      const prevPrice = currentCoinPrice
      const priceChange = newPrice - prevPrice
      const pricePercentChange = (priceChange / prevPrice) * 100

      // Update the state with the new price, trend, change, and percentage change
      const price = newPrice.toFixed(2)
      setCurrentCoinPrice(price.toString())
      setTrend(newPrice > prevPrice ? 'up' : 'down')
      setChange(priceChange.toFixed(2))
      setPercentChange(pricePercentChange.toFixed(2))
      setTime(time + dt)
    }, 5000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval)
  }, [currentCoinPrice, time])

  return (
    <appContext.Provider
      value={{
        data,
        setData,
        setCurrentCoinPrice,
        currentCoinPrice,
        percentChange,
        change,
        startPrediction,
        bets,
        lastWinner,
        pool,
        contractOwner,
      }}
    >
      {children}
    </appContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(appContext)
}
