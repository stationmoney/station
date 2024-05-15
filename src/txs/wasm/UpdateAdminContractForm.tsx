import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { AccAddress, MsgUpdateContractAdmin } from "@terra-money/feather.js"
import { useNetwork } from "data/wallet"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { Form, FormItem } from "components/form"
import { Input } from "components/form"
import { getChainIDFromAddress } from "utils/bech32"
import validate from "../validate"
import Tx from "../Tx"

interface TxValues {
  new_admin?: string
}

// TODO: make this interchain
const UpdateAdminContractForm = ({ contract }: { contract: AccAddress }) => {
  const { t } = useTranslation()

  const networks = useNetwork()
  const addresses = useInterchainAddresses()
  const chainID = getChainIDFromAddress(contract, networks) ?? ""
  const address = addresses?.[chainID ?? ""]

  /* form */
  const form = useForm<TxValues>({ mode: "onChange" })
  const { register, watch, handleSubmit, formState } = form
  const { errors } = formState
  const values = watch()

  /* tx */
  const createTx = useCallback(
    ({ new_admin }: TxValues) => {
      if (!address || !new_admin) return
      const msgs = [new MsgUpdateContractAdmin(address, new_admin, contract)]
      return { msgs, chainID }
    },
    [address, chainID, contract]
  )

  /* fee */
  const estimationTxValues = useMemo(() => values, [values])

  const tx = {
    estimationTxValues,
    createTx,
    chain: chainID,
  }

  return (
    <Tx {...tx}>
      {({ fee, submit }) => (
        <Form onSubmit={handleSubmit(submit.fn)}>
          <FormItem label={t("New admin")} error={errors.new_admin?.message}>
            <Input
              {...register("new_admin", {
                required: "New admin is required",
                validate: validate.address(),
              })}
              autoFocus
            />
          </FormItem>

          {fee.render()}
          {submit.button}
        </Form>
      )}
    </Tx>
  )
}

export default UpdateAdminContractForm
