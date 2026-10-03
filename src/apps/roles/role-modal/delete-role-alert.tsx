import { Role } from "@/models/role-model";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buttonVariants } from "@/components/ui/button";
import { OctagonAlert, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
  roleToDelete: Role;
  availableRoles: Role[];
  onConfirm: (newRoleId?: number) => void; 
  isLoading?: boolean;
}

export function DeleteRoleAlert({
  open,
  onClose,
  roleToDelete,
  availableRoles,
  onConfirm,
  isLoading,
}: Props) {
  const { t } = useTranslation();
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  const reassignableRoles = availableRoles.filter(
    (role) => role.role_id !== roleToDelete.role_id
  );

  // Check if users exist in this role
  const hasUsers = (roleToDelete?.user_count || 0) > 0;

  const handleConfirm = () => {
    if (hasUsers && selectedRoleId) {
      onConfirm(Number(selectedRoleId));
    } else if (!hasUsers) {
      onConfirm(); // Send without newRoleId if no users
    }
  };

  const handleClose = () => {
    setSelectedRoleId("");
    onClose();
  };

  // Helper function to replace {{count}} dynamically in translations
  const formatDescription = (count: number) => {
    const template = t('role_has_users_message');
    return template.replace('{{count}}', String(count));
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle>
            <div className="mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <OctagonAlert className="h-7 w-7 text-destructive animate-pulse" />
            </div>
            {t('delete_role_confirmation')}
          </AlertDialogTitle>
          
          {hasUsers && (
            <>
              <AlertDialogDescription className="text-center">
                {formatDescription(roleToDelete.user_count || 0)}
              </AlertDialogDescription>

              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger id="role-select" className="mt-4">
                  <SelectValue placeholder={t('select_target_role')} />
                </SelectTrigger>
                <SelectContent>
                  {reassignableRoles.map((role) => (
                    <SelectItem key={role.role_id} value={String(role.role_id)}>
                      {role.role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2 sm:justify-center">
          <AlertDialogCancel onClick={handleClose} disabled={isLoading}>
            {t('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive2" })}
            onClick={handleConfirm}
            // Disable button if loading, OR if users exist but no target role is selected
            disabled={isLoading || (hasUsers && !selectedRoleId)}
          >
            {isLoading ? (
              <>
                <Spinner variant="circle" />
                {t('deleting')}
              </>
            ) : (
              <>
                <TrashIcon />
                {t('delete')}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}