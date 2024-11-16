import { Button } from "@/components/ui/button";
import { useConfirmUser } from "../api/confirm-user";

export const ConfirmUserBtn = () => {
  const { confirmUser, isPending } = useConfirmUser();

  return (
    <Button onClick={confirmUser} isLoading={isPending} full>
      Activate Account
    </Button>
  );
};
