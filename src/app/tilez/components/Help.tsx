import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import imgA from "@/../public/assets/tilez/a.webp";
import imgB from "@/../public/assets/tilez/b.webp";
import imgC from "@/../public/assets/tilez/c.webp";
import { Badge } from "@/components/ui/badge";

export default function Help() {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex h-full items-center">
          <Badge
            variant={"outline"}
            className="border-muted-foreground h-max cursor-pointer border border-solid text-base"
          >
            <div className="cursor-pointer">?</div>
          </Badge>
        </div>
      </DialogTrigger>
      <DialogContent className="w-svw">
        <DialogHeader>
          <DialogTitle className="text-center underline">
            Rules of the game:
          </DialogTitle>
          <DialogDescription className="text-center"></DialogDescription>
        </DialogHeader>

        <div className="flex flex-row gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <Image src={imgA} alt={"tilez blue"}  />
            <div className="text-center">
              Align tiles to spell a word. Selected tiles are blue.
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <Image src={imgB} alt={"tilez green"}  />
            <div className="text-center">
              Tiles where you have found a word turn green.
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <Image src={imgC} alt={"completed"}  />
            <div className="text-center">
              Turn all the tiles green, to complete the game, can you do it in
              the least number of moves?
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
