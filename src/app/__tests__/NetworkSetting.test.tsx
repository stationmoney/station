import React from "react"
import NetworkSetting from "../sections/NetworkSetting"
import { render } from "@testing-library/react"
import { useNetworkState } from "../../auth/hooks/useNetwork"
import { NetworksProvider } from "../InitNetworks"

function renderComponent() {
  type TokenFilter = <T>(network: Record<string, T>) => Record<string, T>
  const networks = {} as jest.Mocked<InterchainNetworks>
  const mockedTokenFilter = {} as jest.Mocked<TokenFilter>

  return render(
    <NetworksProvider
      value={{
        networks: networks,
        filterEnabledNetworks: mockedTokenFilter,
        filterDisabledNetworks: mockedTokenFilter,
      }}
    >
      <NetworkSetting />
    </NetworksProvider>
  )
}

const mockSetRecoilState = jest.fn()
const mockSetNetwork = jest.fn()

jest.mock("recoil", () => ({
  useRecoilState: (network: string) => [network, mockSetRecoilState],
  atom: () => {},
}))

jest.mock("../../data/wallet", () => ({
  useNetworkState: () => ["testnet", mockSetNetwork],
  useNetworkOptions: () => [
    {
      value: "mainnet",
      label: "Mainnets",
    },
    {
      value: "testnet",
      label: "Testnets",
    },
    {
      value: "classic",
      label: "Terra Classic",
    },
    {
      value: "localterra",
      label: "LocalTerra",
    },
  ],
}))

describe("NetworkSetting component matches snapshots", () => {
  it("matches original component", () => {
    const [_, changeNetwork] = useNetworkState()
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })
})
