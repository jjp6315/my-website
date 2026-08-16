import Image from "next/image";
import type { GolfPlayer } from "../data";

export default function PlayerPortrait({ player }: { player: GolfPlayer }) {
  if (player.photo) {
    return <Image className="playerPortrait" src={player.photo} alt={`${player.name} at the tournament`} width={720} height={520} />;
  }

  return (
    <div className="playerPortrait playerPortraitPlaceholder" aria-label={`${player.name} photo placeholder`}>
      <span>{player.initials}</span>
    </div>
  );
}
