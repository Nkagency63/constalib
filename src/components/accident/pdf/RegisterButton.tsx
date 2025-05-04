
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface RegisterButtonProps {
  onClick?: () => void;
  isRegistering: boolean;
  disabled: boolean;
}

const RegisterButton = ({ onClick, isRegistering, disabled }: RegisterButtonProps) => {
  return (
    <Button
      className="flex items-center gap-2 flex-grow"
      disabled={disabled || isRegistering}
      onClick={onClick}
    >
      {isRegistering ? (
        <>
          <div className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full" />
          <span>Enregistrement...</span>
        </>
      ) : (
        <>
          <Upload className="w-4 h-4" />
          <span>Enregistrer Officiellement</span>
        </>
      )}
    </Button>
  );
};

export default RegisterButton;
