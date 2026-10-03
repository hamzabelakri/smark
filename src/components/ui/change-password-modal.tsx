import { useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { IconEdit } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/password-input";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useChangePassword } from "@/hooks/use-users";

// ── Schema Factory ───────────────────────────────────────────────

const getSchema = (t: any) =>
  z.object({
    old_password: z
      .string()
      .nonempty({ message: t("old_password_req") })
      .min(6, { message: t("old_password_min") }),
    new_password: z
      .string()
      .nonempty({ message: t("new_password_req") })
      .min(6, { message: t("new_password_min") }),
  });

type ChangePasswordForm = z.infer<ReturnType<typeof getSchema>>;

// ── Props ────────────────────────────────────────────────────────

interface Props {
  user: any;
  open: boolean;
  onClose: () => void;
}

// ── Component ────────────────────────────────────────────────────

export function ChangePasswordModal({ open, onClose, user }: Props) {
  const { t } = useTranslation();
  const { mutate: changePassword, isPending } = useChangePassword();

  const schema = useMemo(() => getSchema(t), [t]);

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(schema),
    defaultValues: { old_password: "", new_password: "" },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (values: ChangePasswordForm) => {
    if (!user?.user_id) return;

    changePassword(
      { id: user.user_id, payload: values },
      { onSuccess: handleClose }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(state) => { if (!state) handleClose() }}>
      <DialogContent className="">
        
        {/* ── Header ── */}
        <DialogHeader className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <IconEdit className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{t("change_password")}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* ── Body ── */}
        <DialogBody>
          <Form {...form}>
            <form
              id="change-password-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="old_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">
                      {t("old_password")}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput 
                        placeholder="••••••••"
                        autoComplete="current-password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">
                      {t("new_password")}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput 
                        placeholder="••••••••"
                        autoComplete="new-password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogBody>

        {/* ── Footer ── */}
        <DialogFooter>
          <Button 
            variant="ghost" 
            type="button" 
            onClick={handleClose}
            className="text-muted-foreground"
          >
            {t("cancel")}
          </Button>

          <Button
            type="submit"
            form="change-password-form"
            disabled={isPending}
            className="min-w-24"
          >
            {isPending ? (
              <>
                <Spinner variant="circle" className="mr-2" />
                {t("submitting")}
              </>
            ) : (
              t("submit")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}