import { useCommunityMemebership } from "../api/community-membership";
import { useDeleteCommunity } from "../api/delete-community";
import { Roles } from "@/features/auth/constants";
import { Role } from "@/types/api";
import { Button } from "@/components/ui/button";

export const CommunityButton = ({ role }: { role: Role }) => {
  const { joinCommunity, isJoining, leaveCommunity, isLeaving } =
    useCommunityMemebership();
  const { deleteCommunity, isDeleting } = useDeleteCommunity();

  const isMember = role.name === Roles.MEMBER;
  const isCreator = role.name === Roles.ADMIN;

  if (isCreator)
    return (
      <Button
        onClick={deleteCommunity}
        isLoading={isDeleting}
        disabled={isDeleting}
        $full
      >
        Delete Community
      </Button>
    );

  return isMember ? (
    <Button
      onClick={leaveCommunity}
      isLoading={isLeaving}
      disabled={isLeaving}
      $full
    >
      Leave Community
    </Button>
  ) : (
    <Button
      onClick={joinCommunity}
      isLoading={isJoining}
      disabled={isJoining}
      $full
    >
      Join Community
    </Button>
  );
};
