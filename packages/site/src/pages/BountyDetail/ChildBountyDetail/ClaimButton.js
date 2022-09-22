import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useApi from "../../../hooks/useApi";
import { accountSelector } from "../../../store/reducers/accountSlice";
import { newErrorToast } from "../../../store/reducers/toastSlice";
import { useIsMounted } from "../../../utils/hooks";
import { sendTx } from "../../../utils/sendTx";
import { isSameAddress } from "../../../utils";
import OnChainActionButton from "../../../components/OnChainActionButton";
import { scanHeightSelector } from "../../../store/reducers/chainSlice";
import Popper from "../../../components/Popper";
import { TooltipInfoText } from "../../../components/Popper/styled";

export default function ClaimButton({ childBounty, onFinalized }) {
  const api = useApi();
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const [isLoading, setIsLoading] = useState(false);
  const scanHeight = useSelector(scanHeightSelector);
  const isMounted = useIsMounted();

  const isBeneficiary = isSameAddress(account?.address, childBounty?.beneficiary);
  const isPendingPayout = childBounty?.state?.state === "PendingPayout";
  const isUnlocked = childBounty?.unlockAt <= scanHeight;
  const disabled = !isBeneficiary || !isPendingPayout || !isUnlocked || isLoading;

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doClaim = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!childBounty) {
      return;
    }

    setIsLoading(true);

    try {
      web3Enable("doTreasury");
      const injector = await web3FromSource(account.extension);

      const tx = api.tx.childBounties.claimChildBounty(childBounty.parentBountyId, childBounty.index);

      await sendTx({
        txName: "Claim Rewards",
        tx,
        signer: injector.signer,
        dispatch,
        signerAddress: account.address,
        isMounted,
        onFinalized,
      });
    } finally {
      setIsLoading(false);
    }
  };

  let tooltipContent = "";
  if (!isPendingPayout) {
    tooltipContent = "Only pending payout bounty is claimable";
  } else if (!isBeneficiary) {
    tooltipContent = "Only the beneficiary can claim this bounty";
  } else if (!isUnlocked) {
    tooltipContent = "Can only be claimed when chain height reach unlock height";
  }

  return (
    <Popper showTooltip={!!tooltipContent} tooltipContent={<TooltipInfoText>{tooltipContent}</TooltipInfoText>}>
      <OnChainActionButton
        onClick={doClaim}
        disabled={disabled}
      >
        Claim Rewards
      </OnChainActionButton>
    </Popper>

  )
}