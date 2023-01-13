import { PropsWithChildren, useEffect, useState } from "react"
import axios from "axios"
import { STATION_ASSETS } from "config/constants"
import createContext from "utils/createContext"
import NetworkLoading from "./NetworkLoading"

export const [useNetworks, NetworksProvider] = createContext<{
  networks: InterchainNetworks
  filterEnabledNetworks: <T>(network: Record<string, T>) => Record<string, T>
}>("useNetworks")

const InitNetworks = ({ children }: PropsWithChildren<{}>) => {
  const [networks, setNetworks] = useState<InterchainNetworks>()
  const [enabledNetworks, setEnabledNetworks] = useState<string[]>([])

  useEffect(() => {
    const fetchChains = async () => {
      const { data: chains } = await axios.get<InterchainNetworks>(
        "/chains.json",
        {
          baseURL: STATION_ASSETS,
        }
      )
      setNetworks(chains)
    }

    fetchChains()
  }, [])

  useEffect(() => {
    const testChains = async () => {
      if (!networks) return
      const testBase = {
        ...networks.mainnet,
        ...networks.testnet,
        ...networks.classic,
        //...networks.localterra,
      }

      const result = await Promise.all(
        Object.values(testBase).map(async (network) => {
          try {
            const { data } = await axios.get(
              "cosmos/base/tendermint/v1beta1/node_info",
              {
                baseURL: network.lcd,
                timeout: 5_000,
              }
            )
            return "default_node_info" in data
              ? (data.default_node_info.network as string)
              : (data.node_info.network as string)
          } catch (e) {
            return null
          }
        })
      )

      setEnabledNetworks(
        result.filter((r) => typeof r === "string") as string[]
      )
    }

    testChains()
  }, [networks])

  if (!networks || !enabledNetworks.length)
    return <NetworkLoading title="Connecting to available networks..." />

  return (
    <NetworksProvider
      value={{
        networks,
        filterEnabledNetworks: (networks) =>
          Object.fromEntries(
            Object.entries(networks).filter(
              ([chainID]) =>
                chainID === "localterra" || enabledNetworks.includes(chainID)
            )
          ),
      }}
    >
      {children}
    </NetworksProvider>
  )
}

export default InitNetworks
