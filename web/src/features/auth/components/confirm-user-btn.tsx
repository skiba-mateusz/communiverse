import { Button } from "@/components/ui/button";
import { useConfirmUser } from "../api/confirm-user";

export const ConfirmUserBtn = () => {
  const { confirmUser, isPending } = useConfirmUser();

  return (
    <Button $full onClick={confirmUser} isLoading={isPending}>
      Activate Account
    </Button>
  );
};
