import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useFormState } from "react-dom";
import { ValidateTokenToResetPassword } from "@/actions/validate-token-to-reset-password";
import { toast } from "react-toastify";

type ValidateTokenFormProps = {
 setIsValidToken: Dispatch<SetStateAction<boolean>>
 token: string
 setToken: Dispatch<SetStateAction<string>>
}

const initialState = {
  success: '',
  errors: [],
  serverError: ''
};


export default function ValidateTokenForm({setIsValidToken, token, setToken}: ValidateTokenFormProps) {
  const [isComplete, setIsComplete] = useState(false);
  const validateTokenInput = ValidateTokenToResetPassword.bind(null, token);
  const [state, dispatch] = useFormState(validateTokenInput, initialState);

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach((error) => {
        toast.error(error);
      });
    }
    if (state.success) {
      toast.success(state.success);
      setIsValidToken(true)
    }
    if (state.serverError) {
      toast.error(state.serverError);
    }
  }, [state]);
  


  useEffect(() => {
    if(isComplete){
        dispatch()
    }
  }, [isComplete])

  const handleChange = (token: string) => {
    setIsComplete(false);
    setToken(token);
  };

  const handleComplete = () => {
    setIsComplete(true);
  };

  return (
    <div className="flex justify-center gap-5 my-10">
      <PinInput
        value={token}
        onChange={handleChange}
        onComplete={handleComplete}
      >
        <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
        <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
        <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
        <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
        <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
        <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
      </PinInput>
    </div>
  );
}
