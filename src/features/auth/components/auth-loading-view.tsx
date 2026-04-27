import { Spinner } from "@/components/ui/spinner";
import { Sparkles } from "lucide-react";

export const AuthLoadingView = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Sparkles className="h-6 w-6" />
        </div>
        <span className="text-3xl font-bold tracking-tight">Polaris</span>
      </div>

      {/* Loading Indicator */}
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8 text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Authenticating...
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-secondary">
        <div className="h-full animate-pulse bg-primary" />
      </div>
    </div>
  );
};
