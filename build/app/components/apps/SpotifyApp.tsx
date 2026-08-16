import {
  spotifyEmbedUrl,
  spotifyPlaylist,
} from "../../content/spotify";

export default function SpotifyApp() {
  return (
    <div className="spotifyApp">
      <div className="spotifyPlayer">
        <iframe
          title={`${spotifyPlaylist.name} on Spotify`}
          src={spotifyEmbedUrl}
          width="100%"
          height="100%"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
