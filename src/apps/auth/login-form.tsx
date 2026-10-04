import React, { type HTMLAttributes, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useLogin } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>;

// Shared look for the pill-shaped fields
const pillField =
  "h-12 rounded-full px-2 shadow-none focus-within:ring-2 focus-within:ring-[#ff3b30]/30 focus-within:border-[#ff3b30]/60";

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const { t } = useTranslation();
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = React.useState(false);

  const formSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, { message: t("please_enter_email") })
          .email({ message: t("invalid_email") }),
        password: z
          .string()
          .min(1, { message: t("please_enter_password") })
          .min(8, { message: t("password_min_8") }),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // TODO: remove dev credentials before shipping
    defaultValues: { email: "dev@asteroidea.co", password: "astro_4711" },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => login(data);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-5", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">{t("email")}</FormLabel>
              <FormControl>
                <InputGroup className={pillField}>
                  <InputGroupInput
                    autoComplete="email"
                    placeholder={t("enter_email")}
                    className="px-4"
                    {...field}
                  />
                </InputGroup>
              </FormControl>
              <FormMessage className="px-4" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">{t("password")}</FormLabel>
              <FormControl>
                <InputGroup className={pillField}>
                  <InputGroupInput
                    autoComplete="current-password"
                    placeholder={t("enter_password")}
                    className="px-4"
                    {...field}
                    type={showPassword ? "text" : "password"}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="mr-2 rounded-full"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? t("hide_password") : t("show_password")
                      }
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage className="px-4" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="mt-2 h-12 gap-2 rounded-full border-0 bg-gradient-to-b from-[#ff0a1f] to-[#e8004f] text-base font-medium text-white shadow-[0_6px_16px_-6px_rgba(255,10,60,0.6)] hover:brightness-110 disabled:opacity-70"
        >
          {isPending ? (
            <>
              <Spinner variant="circle" />
              {t("loading")}
            </>
          ) : (
            <>
              <LogIn className="size-4" />
              {t("login")}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

