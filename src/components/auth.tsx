import { getUserFromJWT, signInWithProvider } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Logout from "./Logout";

export default async function Auth({ app }: { app: string }) {
  const user: {
    user_metadata?: { avatar_url: string; name: string } | undefined;
  } | null = (await getUserFromJWT()) as {
    user_metadata?: { avatar_url: string; name: string } | undefined;
  } | null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="cursor-pointer">
      {user ? (
        <div className="h-10 w-10 cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-0">
              <Avatar className="cursor-pointer">
                <AvatarImage src={user?.user_metadata?.avatar_url as string} />
                <AvatarFallback>
                  {getInitials((user?.user_metadata?.name as string) || "U")}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem disabled>
                <p>{user?.user_metadata?.name}</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Logout redirect={app} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <form>
            <Button
              variant={"ghost"}
              className="flex cursor-pointer gap-2"
              formAction={signInWithProvider.bind(null, "github", app)}
            >
              <div className="h-8 w-8">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  color="#181717"
                >
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </div>
              GitHub
            </Button>
          </form>
          <form>
            <Button
              variant={"ghost"}
              className="flex cursor-pointer gap-2"
              formAction={signInWithProvider.bind(null, "google", app)}
            >
              <div className="h-8 w-8">
                <svg
                  width="32px"
                  height="32px"
                  viewBox="-3 0 262 262"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  preserveAspectRatio="xMidYMid"
                  fill="#000000"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <path
                        d="M255.878,133.451 C255.878,122.717 255.007,114.884 253.122,106.761 L130.55,106.761 L130.55,155.209 L202.497,155.209 C201.047,167.249 193.214,185.381 175.807,197.565 L175.563,199.187 L214.318,229.21 L217.003,229.478 C241.662,206.704 255.878,173.196 255.878,133.451"
                        fill="#4285F4"
                      ></path>
                      <path
                        d="M130.55,261.1 C165.798,261.1 195.389,249.495 217.003,229.478 L175.807,197.565 C164.783,205.253 149.987,210.62 130.55,210.62 C96.027,210.62 66.726,187.847 56.281,156.37 L54.75,156.5 L14.452,187.687 L13.925,189.152 C35.393,231.798 79.49,261.1 130.55,261.1"
                        fill="#34A853"
                      ></path>
                      <path
                        d="M56.281,156.37 C53.525,148.247 51.93,139.543 51.93,130.55 C51.93,121.556 53.525,112.853 56.136,104.73 L56.063,103 L15.26,71.312 L13.925,71.947 C5.077,89.644 0,109.517 0,130.55 C0,151.583 5.077,171.455 13.925,189.152 L56.281,156.37"
                        fill="#FBBC05"
                      ></path>
                      <path
                        d="M130.55,50.479 C155.064,50.479 171.6,61.068 181.029,69.917 L217.873,33.943 C195.245,12.91 165.798,0 130.55,0 C79.49,0 35.393,29.301 13.925,71.947 L56.136,104.73 C66.726,73.253 96.027,50.479 130.55,50.479"
                        fill="#EB4335"
                      ></path>
                    </g>
                  </g>
                </svg>
              </div>
              Google
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
