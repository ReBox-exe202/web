"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Lock } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectUrl: string;
}

export function AuthDialog({ open, onOpenChange, redirectUrl }: AuthDialogProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  const handleRegister = () => {
    router.push(`/register?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            Authentication Required
          </DialogTitle>
          <DialogDescription className="text-center">
            Please sign in or create an account to view package details
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={handleLogin}
            size="lg"
            className="w-full gap-2"
          >
            <LogIn className="h-5 w-5" />
            Sign In
          </Button>

          <Button
            onClick={handleRegister}
            variant="outline"
            size="lg"
            className="w-full gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Create Account
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          After signing in, you&apos;ll be redirected back to this package
        </p>
      </DialogContent>
    </Dialog>
  );
}