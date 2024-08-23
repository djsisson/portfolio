import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { tilez } from "@/lib/imgMeta";

export default function Help() {
  return (
    <Dialog>
      <DialogTrigger>?</DialogTrigger>
      <DialogContent className="w-svw">
        <DialogHeader>
          <DialogTitle className="text-center underline">
            Rules of the game:
          </DialogTitle>
          <DialogDescription className="text-center"></DialogDescription>
        </DialogHeader>

        <div className="flex flex-row gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <Image
              src={tilez["a.webp"].relativePath}
              alt={"tilez blue"}
              width={300}
              height={100}
              placeholder="blur"
              blurDataURL={tilez["a.webp"].imgBase64}
            />
            <div className="text-center">
              Align tiles to spell a word. Selected tiles are blue.
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <Image
              src={tilez["b.webp"].relativePath}
              alt={"tilez green"}
              width={300}
              height={100}
              placeholder="blur"
              blurDataURL={tilez["b.webp"].imgBase64}
            />
            <div className="text-center">
              Tiles where you have found a word turn green.
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <Image
              src={tilez["c.webp"].relativePath}
              alt={"completed"}
              width={300}
              height={100}
              placeholder="blur"
              blurDataURL={tilez["c.webp"].imgBase64}
            />
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
