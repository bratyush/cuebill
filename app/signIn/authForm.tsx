
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function UserLoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { isLoaded, signIn, setActive } = useSignIn();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const router = useRouter();
  // start the sign In process.
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!isLoaded) {
      setIsLoading(true);
      return;
    }

    setError("");

    try {
      setIsLoading(true);
      const result = await signIn.create({
        identifier: username,
        password,
      });

      if (result.status === "complete") {
        console.log(result);
        await setActive({ session: result.createdSessionId });
        router.push("/")
      }
      else {
        /*Investigate why the sign-in hasn't completed */
        console.log(result);
      }

    } catch (err: any) {
      setIsLoading(false);
      console.error("error", err)
      console.log("error+++", err.errors[0].code)
      const errorCode = err.errors[0].code;
      if (errorCode === "form_password_incorrect") {
        console.log("form_password_incorrect")
        setError("Wrong password!")
      } else if (errorCode === "form_identifier_not_found"){
        console.log("form_identifier_not_found")
        setError("Wrong username!")
      }
    }
  };

  return (
    <div>
      <form>
        <div className="grid gap-2">
          <div className="grid gap-4">

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input onChange={(e) => setUsername(e.target.value)} type="username" id="username" placeholder="username" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                onChange={(e) => setPassword(e.target.value)} 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="password" 
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          { error && <div><span className="text-red-500">{error}</span></div>}
          <Button disabled={isLoading} onClick={handleSubmit}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
              Log In
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
