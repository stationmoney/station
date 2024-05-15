import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { AccAddress, MsgMigrateContract } from "@terra-money/feather.js"
import { parseJSON, validateMsg } from "utils/data"
import { useNetwork } from "data/wallet"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { getChainIDFromAddress } from "utils/bech32"
import { Form, FormItem } from "components/form"
import { Input, EditorInput } from "components/form"
import validate from "../validate"
import Tx from "../Tx"

interface TxValues {
  id?: number
  msg?: string
}

// TODO: make this interchain
const MigrateContractForm = ({ contract }: { contract: AccAddress }) => {
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
    ({ id, msg }: TxValues) => {
      if (!address || !(id && msg)) return
      if (!validateMsg(msg)) return

      const code_id = Number(id)
      const migrate_msg = parseJSON(msg)
      const msgs = [
        new MsgMigrateContract(address, contract, code_id, migrate_msg),
      ]

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
          <FormItem label={t("Code ID")} error={errors.id?.message}>
            <Input
              {...register("id", {
                valueAsNumber: true,
                required: "Code ID is required",
                min: {
                  value: 0,
                  message: "Code ID must be a positive integer",
                },
                validate: {
                  integer: (value) =>
                    Number.isInteger(value) || "Code ID must be an integer",
                },
              })}
              inputMode="decimal"
              type="number"
              placeholder="1"
              autoFocus
            />
          </FormItem>

          <FormItem
            label="Migrate msg" // do not translate this
            error={errors.msg?.message}
          >
            <EditorInput {...register("msg", { validate: validate.msg() })} />
          </FormItem>

          {fee.render()}
          {submit.button}
        </Form>
      )}
    </Tx>
  )
}

export default MigrateContractForm
