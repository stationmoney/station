import { useState } from "react"
import { useTranslation } from "react-i18next"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import GroupsIcon from "@mui/icons-material/Groups"
import UsbIcon from "@mui/icons-material/Usb"
import BluetoothIcon from "@mui/icons-material/Bluetooth"
import { truncate } from "@terra.kitchen/utils"
import { useAddress } from "data/wallet"
import { useTnsName } from "data/external/tns"
import { Button } from "components/general"
import CopyStyles from "components/general/Copy.module.scss"
import { Flex, Grid } from "components/layout"
import { Tooltip, Popover } from "components/display"
import { isWallet, useAuth } from "auth"
import SwitchWallet from "auth/modules/select/SwitchWallet"
import PopoverNone from "../components/PopoverNone"
import styles from "./Connected.module.scss"
import { useWalletRoute, Path, isWalletBarOpen } from "pages/wallet/Wallet"
import { useRecoilState } from "recoil"

const Connected = () => {
  const { t } = useTranslation()
  const address = useAddress()
  const { wallet, getLedgerKey } = useAuth()
  const { data: name } = useTnsName(address ?? "")
  const { setRoute, route } = useWalletRoute()
  const [, setIsOpen] = useRecoilState(isWalletBarOpen)

  /* hack to close popover */
  const [key, setKey] = useState(0)
  const closePopover = () => setKey((key) => key + 1)

  const handleReceivePageRoute = () => {
    setIsOpen(true)
    setRoute({ path: Path.receive, previusPage: route })
  }

  if (!address) return null

  const footer = {
    to: "/auth",
    onClick: closePopover,
    children: t("Manage wallets"),
  }

  return (
    <Popover
      key={key}
      content={
        <PopoverNone className={styles.popover} footer={footer}>
          <Grid gap={16}>
            <Grid gap={4}>
              <Flex gap={4} start>
                <Button
                  outline
                  className={styles.button}
                  onClick={handleReceivePageRoute}
                >
                  View addresses
                </Button>
                {isWallet.ledger(wallet) && (
                  <Tooltip content={t("Show address in Ledger device")}>
                    <button
                      className={CopyStyles.button}
                      onClick={async () => {
                        const lk = await getLedgerKey("330")
                        lk.showAddressAndPubKey("terra")
                      }}
                    >
                      <UsbIcon fontSize="inherit" />
                    </button>
                  </Tooltip>
                )}
              </Flex>
            </Grid>
            <SwitchWallet />
          </Grid>
        </PopoverNone>
      }
      placement="bottom-end"
      theme="none"
    >
      <Button
        icon={
          isWallet.ledger(wallet) ? (
            wallet.bluetooth ? (
              <BluetoothIcon style={{ fontSize: 16 }} />
            ) : (
              <UsbIcon style={{ fontSize: 16 }} />
            )
          ) : isWallet.multisig(wallet) ? (
            <GroupsIcon style={{ fontSize: 16 }} />
          ) : (
            <AccountBalanceWalletIcon style={{ fontSize: 16 }} />
          )
        }
        size="small"
        outline
        className={styles.button}
      >
        <span className={styles.button__text}>
          {isWallet.local(wallet) ? wallet.name : truncate(name ?? address)}
        </span>
      </Button>
    </Popover>
  )
}

export default Connected
